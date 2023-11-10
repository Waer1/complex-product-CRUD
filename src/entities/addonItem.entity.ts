import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Addon } from './addon.entity';

@Entity()
export class AddonItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Addon, (addon) => addon.addonItems, { onDelete: 'CASCADE' })
  addon: Addon;
}
