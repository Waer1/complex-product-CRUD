import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class UOMImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;
}
