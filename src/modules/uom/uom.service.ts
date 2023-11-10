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

  /**
   * Creates a new UOM.
   *
   * @param {CreateUOMDto} createUomDto The data to create the UOM with.
   *
   * @return {Promise<UOM>} The created UOM.
   */
  async create(createUomDto: CreateUOMDto): Promise<UOM> {
    const newUom = this.uomRepository.create(createUomDto);
    return await this.uomRepository.save(newUom);
  }

  /**
   * Retrieves all UOMs.
   *
   * @return {Promise<UOM[]>} The UOMs.
   */
  async findAll(): Promise<UOM[]> {
    return await this.uomRepository.find({});
  }

  /**
   * Checks if a UOM exists by its ID.
   *
   * @param {number} id The ID of the UOM.
   *
   * @return {Promise<boolean>} Whether the UOM exists.
   */
  async CheckIfUomExistsById(id: number): Promise<boolean> {
    return await this.uomRepository.exist({ where: { id } });
  }

  /**
   * Retrieves a UOM by its ID.
   *
   * @param {number} id The ID of the UOM.
   *
   * @return {Promise<UOM>} The UOM.
   */
  async findOne(id: number): Promise<UOM> {
    const Uom = await this.uomRepository.findOne({ where: { id } });
    if (!Uom) {
      throw new NotFoundException('UOM not found');
    }
    return Uom;
  }

  /**
   * Updates a UOM by its ID.
   *
   * @param {number} id The ID of the UOM.
   * @param {UpdateUOMDto} updateUomDto The data to update the UOM with.
   *
   * @return {Promise<UOM>} The updated UOM.
   */
  async update(id: number, updateUomDto: UpdateUOMDto): Promise<UOM> {
    const updatedUom = await this.findOne(id);

    if (!updatedUom) {
      throw new NotFoundException('UOM not found');
    }

    Object.assign(updatedUom, updateUomDto);
    await this.uomRepository.save(updatedUom);

    return updatedUom;
  }

  /**
   * Removes a UOM by its ID.
   *
   * @param {number} id The ID of the UOM.
   *
   * @return {Promise<UOM>} The removed UOM.
   */
  async remove(id: number): Promise<UOM> {
    const deleteUom = await this.findOne(id);
    if (!deleteUom) {
      throw new NotFoundException('UOM not found');
    }
    await this.uomRepository.delete(id);
    return deleteUom;
  }
}
