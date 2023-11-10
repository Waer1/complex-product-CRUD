import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

const {
  NODE_ENV,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_NAME,
} = process.env;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: DATABASE_HOST,
      port: parseInt(DATABASE_PORT),
      username: DATABASE_USER,
      password: DATABASE_PASSWORD,
      database: DATABASE_NAME,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: NODE_ENV !== 'production',
    }),
  ],
})
export class DatabaseModule {}
