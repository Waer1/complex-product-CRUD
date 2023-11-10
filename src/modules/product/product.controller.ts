import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from 'src/entities/proudct.entity';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create product' })
  @ApiBody({ type: CreateProductDto, description: 'Product data' })
  @ApiResponse({
    status: 201,
    type: Product,
    description: 'The created product',
  })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'The list of products',
    type: [Product],
  })
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the product' })
  @ApiResponse({
    status: 200,
    description: 'The product with the given ID',
    type: Product,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }
  @ApiBody({
    description: 'Update Product',
    type: UpdateProductDto,
    examples: {
      'Update Product Name': {
        summary: 'Update Product Name',
        value: {
          name: 'Product 1',
        },
      },
      'update product uom Image': {
        summary: 'Update Image URL for product one of uom',
        value: {
          uoms: [
            {
              uomId: 1,
              uomImage: {
                url: 'https://waer.com/image.jpg',
              },
            },
          ],
        },
      },
      'Update UOM Barcode': {
        summary: 'Update Barcode for one of the product UOMs',
        value: {
          uoms: [
            {
              uomId: 1,
              uomBarcode: {
                barcode: 'new updated code',
              },
            },
          ],
        },
      },
      'Update UOM Image and Barcode': {
        summary: 'Update Image URL and Barcode for one of the product UOMs',
        value: {
          uoms: [
            {
              uomId: 1,
              uomImage: {
                url: 'https://upatetogther.com/image.jpg',
              },
              uomBarcode: {
                barcode: 'together',
              },
            },
          ],
        },
      },
      'Update UOM Addon': {
        summary: 'Update UOM Addon for one of the product UOMs',
        value: {
          uoms: [
            {
              uomId: 1,
              addons: [
                {
                 addonId: 1,
                  addonItems: [
                    {
                      addonItemId: 1,
                      name: 'new addon item name',
                    },
                  ],
                }
              ]
            },
          ],
        },
      },

    },
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', description: 'The ID of the product to delete' })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.productService.remove(+id);
  }
}
