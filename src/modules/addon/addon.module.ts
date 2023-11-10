import { Module } from '@nestjs/common';
import { AddonService } from './addon.service';
import { AddonController } from './addon.controller';

@Module({
  controllers: [AddonController],
  providers: [AddonService],
})
export class AddonModule {}
