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
import { UpdateAddonDto } from '../addon/dto/update-addon.dto';
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
    console.log(foundedProduct);
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

  async checkIfProductExistsByName(name: string) {
    return await this.productRepository.exist({ where: { name } });
  }

  async checkIfProductExists(id: number) {
    return await this.productRepository.exist({ where: { id } });
  }

  isValidUpdateProductDto(
    updatedProduct: Product,
    uoms: UpdateUOMDto[],
    ProductID: number,
  ) {
    const productUoms = updatedProduct.uoms;

    // Check if all uomId's exist
    for (const uom of uoms) {
      const { uomId } = uom;
      const foundUOM = productUoms.find((uom) => uom.id === uomId);
      if (!foundUOM) {
        throw new NotFoundException(
          `UOM With ID ${uomId} not found For Product With ID ${ProductID} `,
        );
      }

      const { addons } = uom;
      if (addons) {
        for (const addon of addons) {
          const { addonId } = addon;
          const foundAddon = foundUOM.addons.find(
            (addon) => addon.id === addonId,
          );
          if (!foundAddon) {
            throw new NotFoundException(
              `Addon With ID ${addonId} not found For Product With ID ${ProductID} and UOM With ID ${uomId} `,
            );
          }
        }
      }
    }
  }

  updateAddon(addons: UpdateAddonDto[], productUom) {
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

  updateAddonItem(addonItems, productAddon) {
    for (const addonItem of addonItems) {
      const { addonItemId } = addonItem;

      delete addonItem.addonItemId;

      const productAddonItem = productAddon.addonItems.find(
        (ai) => ai.id === addonItemId,
      );
      Object.assign(productAddonItem, addonItem);
    }
  }

  UpdateProductUOMS(uoms, updatedProduct) {
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
        console.log('waer', typeof addons, addons);
        this.updateAddon(addons, productUom);
      }
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
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
      console.log('updateProductDto', updateProductDto);
      Object.assign(updatedProduct, updateProductDto);
    }

    // save the updated product
    await this.productRepository.save(updatedProduct);

    return updatedProduct;
  }

  async addUomToProduct(productId: number, uom: CreateUOMDto) {
    const product = await this.findOne(productId);
    const newUom: UOM = await this.uomService.create(uom);

    product.uoms.push(newUom);
    await this.productRepository.save(product);
    return product;
  }

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

  async remove(id: number) {
    const DeletedProduct = await this.findOne(id);
    if (!DeletedProduct) {
      throw new NotFoundException('Product not found');
    }
    await this.productRepository.delete(id);
    return DeletedProduct;
  }
}
