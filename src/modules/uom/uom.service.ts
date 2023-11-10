import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUOMDto } from './dto/create-uom.dto';
import { UpdateUOMDto } from './dto/update-uom.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UOM } from 'src/entities/uom.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UomService {
  constructor(
    @InjectRepository(UOM) private readonly uomRepository: Repository<UOM>,
  ) {}

  create(createUomDto: CreateUOMDto) {
    return 'This action adds a new uom';
  }

  findAll() {
    return `This action returns all uom`;
  }

  async findOne(id: number) {
    const Uom = await this.uomRepository.findOne({ where: { id } });
    if (!Uom) {
      throw new NotFoundException('UOM not found');
    }
    return Uom;
  }

  async update(id: number, updateUomDto: UpdateUOMDto) {
    const updatedUom = await this.findOne(id);

    if (!updatedUom) {
      throw new NotFoundException('UOM not found');
    }

    Object.assign(updatedUom, updateUomDto);
    await this.uomRepository.save(updatedUom);

    return updatedUom;
  }

  remove(id: number) {
    return `This action removes a #${id} uom`;
  }
}
