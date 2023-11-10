import { Module } from '@nestjs/common';
import { UomService } from './uom.service';
import { UomController } from './uom.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UOM } from 'src/entities/uom.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UOM])],
  controllers: [],
  providers: [UomService],
  exports: [UomService]
})
export class UomModule {}
