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

  async create(createUomDto: CreateUOMDto) {
    const newUom = this.uomRepository.create(createUomDto);

    return await this.uomRepository.save(newUom);
  }

  async findAll() {
    return await this.uomRepository.find({});
  }

  async CheckIfUomExistsById(id: number) {
    return await this.uomRepository.exist({ where: { id } });
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

  async remove(id: number) {
    const deleteUom = await this.CheckIfUomExistsById(id);
    if (!deleteUom) {
      throw new NotFoundException('UOM not found');
    }
    await this.uomRepository.delete(id);
    return deleteUom;
  }
}
