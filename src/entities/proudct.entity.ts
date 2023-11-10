import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UOM } from './uom.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true})
  name: string;

  @OneToMany(() => UOM, (uom) => uom.product, { cascade: true })
  uoms: UOM[];
}
