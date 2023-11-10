import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/proudct.entity';
import { Repository } from 'typeorm';
import { UomService } from '../uom/uom.service';
import { UOM } from 'src/entities/uom.entity';
import { UpdateUOMDto } from '../uom/dto/update-uom.dto';
import {
  UpdateAddonDto,
  UpdateAddonItemDto,
} from '../addon/dto/update-addon.dto';
import { CreateUOMDto } from '../uom/dto/create-uom.dto';
import { AddonService } from '../addon/AddonService';
import { CreateAddonDto } from '../addon/dto/create-addon.dto';
import { Addon } from 'src/entities/addon.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly uomService: UomService,
    private readonly addonService: AddonService,
  ) {}

  /**
   * Creates a new product along with its associated UOMs, Barcodes, Images, Addons, and Addon Items.
   *
   * @param {CreateProductDto} createProductDto The data transfer object containing the data for the new product.
   *
   * @return {Promise<Product>} The created product.
   */
  async create(createProductDto: CreateProductDto) {
    const foundedProduct = await this.checkIfProductExistsByName(
      createProductDto.name,
    );
    if (foundedProduct) {
      throw new NotFoundException('Product With That Name already exists');
    }

    const newProduct = this.productRepository.create(createProductDto);
    return await this.productRepository.save(newProduct);
  }

  /**
   * Retrieves all products along with their associated UOMs, Barcodes, Images, Addons, and Addon Items.
   *
   * @return {Promise<Product[]>} The list of products.
   */
  async findAll() {
    return await this.productRepository.find({
      relations: {
        uoms: {
          uomBarcode: true,
          uomImage: true,
          addons: {
            addonItems: true,
          },
        },
      },
    });
  }

  /**
   * Retrieves a product by its ID along with its associated UOMs, Barcodes, Images, Addons, and Addon Items.
   *
   * @param {number} id The ID of the product.
   *
   * @return {Promise<Product>} The product.
   */
  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: {
        uoms: {
          uomBarcode: true,
          uomImage: true,
          addons: {
            addonItems: true,
          },
        },
      },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  /**
   * Checks if a product exists by its name.
   *
   * @param {string} name The name of the product.
   *
   * @return {Promise<boolean>} Whether the product exists.
   */
  async checkIfProductExistsByName(name: string): Promise<boolean> {
    return await this.productRepository.exist({ where: { name } });
  }

  /**
   * Checks if a product exists by its ID.
   *
   * @param {number} id The ID of the product.
   *
   * @return {Promise<boolean>} Whether the product exists.
   */
  async checkIfProductExists(id: number): Promise<boolean> {
    return await this.productRepository.exist({ where: { id } });
  }

  /**
   * Validates the updated product data.
   *
   * @param {Product} updatedProduct The updated product data.
   * @param {UpdateUOMDto[]} uoms The updated UOMs of the product.
   * @param {number} ProductID The ID of the product.
   *
   * This function checks if all UOMs and their addons in the updated product data exist in the original product.
   * If a UOM or an addon does not exist, it throws a NotFoundException.
   */
  isValidUpdateProductDto(
    updatedProduct: Product,
    uoms: UpdateUOMDto[],
    ProductID: number,
  ) {
    const productUoms = updatedProduct.uoms;

    // Check if all uomId's exist
    for (const uom of uoms) {
      const { uomId } = uom;

      // Find the UOM in the product's UOMs
      const foundUOM = productUoms.find((uom) => uom.id === uomId);

      // If the UOM is not found, throw a NotFoundException
      if (!foundUOM) {
        throw new NotFoundException(
          `UOM With ID ${uomId} not found For Product With ID ${ProductID} `,
        );
      }

      const { addons } = uom;
      if (addons) {
        for (const addon of addons) {
          const { addonId } = addon;

          // Find the addon in the UOM's addons
          const foundAddon = foundUOM.addons.find(
            (addon) => addon.id === addonId,
          );

          // If the addon is not found, throw a NotFoundException
          if (!foundAddon) {
            throw new NotFoundException(
              `Addon With ID ${addonId} not found For Product With ID ${ProductID} and UOM With ID ${uomId} `,
            );
          }
        }
      }
    }
  }

  /**
   * Updates the addons of a product's UOM.
   *
   * @param {UpdateAddonDto[]} addons The updated addons.
   * @param {UOM} productUom The UOM of the product.
   *
   * This function goes through each addon in the updated addons, finds the corresponding addon in the product's UOM,
   * and updates it with the new data. If the addon has items, it also updates them.
   */
  updateAddon(addons: UpdateAddonDto[], productUom: UOM) {
    for (const addon of addons) {
      const { addonId, addonItems } = addon;
      delete addon.addonId;
      delete addon.addonItems;
      const productAddon = productUom.addons.find((a) => a.id === addonId);

      if (addonItems) {
        this.updateAddonItem(addonItems, productAddon);
      }

      Object.assign(productAddon, addon);
    }
  }

  /**
   * Updates the items of a product's addon.
   *
   * @param {UpdateAddonItemDto[]} addonItems The updated addon items.
   * @param {Addon} productAddon The addon of the product.
   *
   * This function goes through each item in the updated addon items, finds the corresponding item in the product's addon,
   * and updates it with the new data.
   */
  updateAddonItem(addonItems: UpdateAddonItemDto[], productAddon: Addon) {
    for (const addonItem of addonItems) {
      const { addonItemId } = addonItem;

      delete addonItem.addonItemId;

      const productAddonItem = productAddon.addonItems.find(
        (ai) => ai.id === addonItemId,
      );
      Object.assign(productAddonItem, addonItem);
    }
  }

  /**
   * Updates the UOMs of a product.
   *
   * @param {UpdateUOMDto[]} uoms The updated UOMs.
   * @param {Product} updatedProduct The product to update.
   *
   * This function goes through each UOM in the updated UOMs, finds the corresponding UOM in the product,
   * and updates it with the new data. If the UOM has an image or a barcode, it also updates them.
   * If the UOM has addons, it updates them by calling the `updateAddon` function.
   */
  UpdateProductUOMS(uoms: UpdateUOMDto[], updatedProduct: Product) {
    // loop over the uoms that are required to update
    for (const uom of uoms) {
      // this is the uomId of the uom that we want to update
      const { uomId, addons } = uom;

      // delete the uomId and addons from the uom object
      delete uom.uomId;
      delete uom.addons;

      // this is the ProductUOM that we want to update it
      const productUom = updatedProduct.uoms.find((u) => u.id === uomId);

      // if there update for the UMOImage
      if (uom.uomImage) {
        Object.assign(productUom.uomImage, uom.uomImage);
      }
      // if there is update for the umo BarCode
      if (uom.uomBarcode) {
        Object.assign(productUom.uomBarcode, uom.uomBarcode);
      }

      // update the addons
      if (addons) {
        this.updateAddon(addons, productUom);
      }
    }
  }

  /**
   * Updates a product.
   *
   * @param {number} id The ID of the product to update.
   * @param {UpdateProductDto} updateProductDto The new data for the product.
   *
   * This function first checks if there is any data to update. If not, it throws a BadRequestException.
   * Then it checks if the product exists. If not, it throws a NotFoundException.
   * It then retrieves the product from the database and separates the UOMs from the rest of the data.
   * If there are UOMs to update, it validates them and updates them.
   * Finally, it updates the rest of the product data and saves the updated product to the database.
   *
   * @return {Promise<Product>} The updated product.
   */
  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    // throw error if no data to update
    if (Object.keys(updateProductDto).length === 0) {
      throw new BadRequestException('No data to update');
    }

    // check if product exists
    const isExist = await this.checkIfProductExists(id);
    if (!isExist) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // get the target product to update it
    const updatedProduct = await this.findOne(id);

    // split the uoms from the updateProductDto
    const { uoms } = updateProductDto;
    delete updateProductDto.uoms;

    if (uoms) {
      const productUoms = updatedProduct.uoms;

      // Check if all uomId's exist
      this.isValidUpdateProductDto(updatedProduct, uoms, id);

      // update the uoms
      this.UpdateProductUOMS(uoms, updatedProduct);
    }

    // update the first level of the product with the date
    if (updateProductDto && Object.keys(updateProductDto).length > 0) {
      Object.assign(updatedProduct, updateProductDto);
    }

    // save the updated product
    await this.productRepository.save(updatedProduct);

    return updatedProduct;
  }

  /**
   * Adds a UOM to a product.
   *
   * @param {number} productId The ID of the product to add the UOM to.
   * @param {CreateUOMDto} uom The UOM to add to the product.
   *
   * This function first retrieves the product from the database. Then it creates a new UOM using the provided data
   * and adds it to the product's UOMs. Finally, it saves the updated product to the database.
   *
   * @return {Promise<Product>} The updated product.
   */
  async addUomToProduct(
    productId: number,
    uom: CreateUOMDto,
  ): Promise<Product> {
    const product = await this.findOne(productId);
    const newUom: UOM = await this.uomService.create(uom);

    product.uoms.push(newUom);
    await this.productRepository.save(product);
    return product;
  }

  /**
   * Removes a UOM from a product.
   *
   * @param {number} productId The ID of the product to remove the UOM from.
   * @param {number} uomId The ID of the UOM to remove.
   *
   * This function first retrieves the product from the database. Then it finds the UOM in the product's UOMs.
   * If the UOM is not found, it throws a NotFoundException. Then it removes the UOM and returns the updated product.
   *
   * @return {Promise<Product>} The updated product.
   */
  async removeUomFromProduct(productId: number, uomId: number) {
    const product = await this.findOne(productId);
    const uom = product.uoms.find((uom) => {
      return uom.id == uomId;
    });

    if (!uom) {
      throw new NotFoundException(`UOM with ID ${uomId} not found at product`);
    }

    await this.uomService.remove(uomId);
    return product;
  }

  /**
   * Adds an addon to a product's UOM.
   *
   * @param {number} productId The ID of the product to add the addon to.
   * @param {number} uomId The ID of the UOM to add the addon to.
   * @param {CreateAddonDto} addon The addon to add.
   *
   * This function first retrieves the product from the database. Then it finds the UOM in the product's UOMs.
   * If the UOM is not found, it throws a NotFoundException. Then it creates a new addon using the provided data
   * and adds it to the UOM's addons. Finally, it saves the updated product to the database.
   *
   * @return {Promise<Product>} The updated product.
   */
  async addAddonToProduct(
    productId: number,
    uomId: number,
    addon: CreateAddonDto,
  ) {
    const product = await this.findOne(productId);

    const uom = product.uoms.find((uom) => uom.id == uomId);
    if (!uom) {
      throw new NotFoundException(`UOM with ID ${uomId} not found at product`);
    }

    const newAddon = await this.addonService.create(addon);

    uom.addons.push(newAddon);
    return this.productRepository.save(product);
  }

  /**
   * Removes an addon from a product's UOM.
   *
   * @param {number} productId The ID of the product to remove the addon from.
   * @param {number} uomId The ID of the UOM to remove the addon from.
   * @param {number} addonId The ID of the addon to remove.
   *
   * This function first retrieves the product from the database. Then it finds the UOM in the product's UOMs.
   * If the UOM is not found, it throws a NotFoundException. Then it finds the addon in the UOM's addons.
   * If the addon is not found, it throws a NotFoundException. Then it removes the addon and returns the updated product.
   *
   * @return {Promise<Product>} The updated product.
   */
  async removeAddonFromProduct(
    productId: number,
    uomId: number,
    addonId: number,
  ) {
    const product = await this.findOne(productId);

    const uom = product.uoms.find((uom) => uom.id == uomId);

    if (!uom) {
      throw new NotFoundException(`UOM with ID ${uomId} not found at product`);
    }

    const addon = uom.addons.find((addon) => addon.id == addonId);
    if (!addon) {
      throw new NotFoundException(`Addon with ID ${addonId} not found in UOM`);
    }

    uom.addons = uom.addons.filter((addon) => addon.id != addonId);

    this.addonService.remove(addonId);
    return this.productRepository.save(product);
  }

  /**
   * Removes a product.
   *
   * @param {number} id The ID of the product to remove.
   *
   * This function first checks if the product exists. If not, it throws a NotFoundException.
   * Then it removes the product from the database and returns the removed product.
   *
   * @return {Promise<Product>} The removed product.
   */
  async remove(id: number) {
    const DeletedProduct = await this.findOne(id);
    if (!DeletedProduct) {
      throw new NotFoundException('Product not found');
    }
    await this.productRepository.delete(id);
    return DeletedProduct;
  }
}
