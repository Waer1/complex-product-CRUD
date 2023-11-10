import { Module } from '@nestjs/common';
import { AddonService } from './AddonService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Addon } from 'src/entities/addon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Addon])],
  controllers: [],
  providers: [AddonService],
  exports: [AddonService],
})
export class AddonModule {}
