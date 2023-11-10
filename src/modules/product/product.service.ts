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

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly uomService: UomService,
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

  // relations: ['uoms', 'uoms.barcode', 'uoms.image', 'uoms.addons', 'uoms.addons.addonItems'],

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

  updateAddon(addons, productUom) {
    addons.forEach(async (addon) => {
      const { addonId, addonItems } = addon;
      delete addon.addonId;
      delete addon.addonItems;
      const productAddon = productUom.addons.find((a) => a.id === addonId);

      addonItems.forEach(async (addonItem) => {
        const { addonItemId } = addonItem;

        delete addonItem.addonItemId;

        const productAddonItem = productAddon.addonItems.find(
          (ai) => ai.id === addonItemId,
        );
        Object.assign(productAddonItem, addonItem);
      });
      Object.assign(productAddon, addon);
    });
  }


  UpdateProductUOMS(uoms, updatedProduct) {
    // loop over the uoms that are required to update
    uoms.forEach(async (uom) => {
      // this is the uomId of the uom that we want to update
      const { uomId, addons } = uom;

      // delete the uomId and addons from the uom object
      delete uom.uomId;
      delete uom.addons;

      // this is the ProductUOM that we want to update
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
    });

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

  async remove(id: number) {
    const DeletedProduct = await this.findOne(id);
    if (!DeletedProduct) {
      throw new NotFoundException('Product not found');
    }

    await this.productRepository.delete(id);
    return DeletedProduct;
  }
}
