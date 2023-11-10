import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { UOM } from './uom.entity';
import { AddonItem } from './addonItem.entity';

@Entity()
export class Addon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => UOM, (uom) => uom.addons, { onDelete: 'CASCADE' })
  uom: UOM;

  @OneToMany(() => AddonItem, (addonItem) => addonItem.addon, { cascade: true })
  addonItems: AddonItem[];
}
