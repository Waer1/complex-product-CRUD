import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/proudct.entity';
import { UOM } from 'src/entities/uom.entity';
import { UOMBarcode } from 'src/entities/uomBarcode.entity';
import { UOMImage } from 'src/entities/uomImage.entity';
import { Addon } from 'src/entities/addon.entity';
import { AddonItem } from 'src/entities/addonItem.entity';
import { UomModule } from '../uom/uom.module';
import { AddonModule } from '../addon/addon.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
    ]),
    UomModule,
    AddonModule
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
