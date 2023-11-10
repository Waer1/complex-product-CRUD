import { Module } from '@nestjs/common';
import { EnvConfigModule } from './modules/env/env-config.module';
import { DatabaseModule } from './modules/database/database.module';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [EnvConfigModule, DatabaseModule, ProductModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
