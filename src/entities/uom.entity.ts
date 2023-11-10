import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Product } from './proudct.entity';
import { UOMBarcode } from './uomBarcode.entity';
import { UOMImage } from './uomImage.entity';
import { Addon } from './addon.entity';

@Entity()
export class UOM {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Product, (product) => product.uoms, { onDelete: 'CASCADE' })
  product: Product;

  @OneToOne(() => UOMBarcode, { onDelete: 'CASCADE', cascade: true })
  @JoinColumn()
  uomBarcode: UOMBarcode;

  @OneToOne(() => UOMImage, { onDelete: 'CASCADE', cascade: true })
  @JoinColumn()
  uomImage: UOMImage;

  @OneToMany(() => Addon, (addon) => addon.uom, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  addons: Addon[];
}
