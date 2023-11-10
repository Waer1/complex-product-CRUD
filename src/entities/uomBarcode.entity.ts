import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UOM } from './uom.entity';

@Entity()
export class UOMBarcode {
  constructor(barcode: string) {
    this.barcode = barcode;
  }
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  barcode: string;
}
