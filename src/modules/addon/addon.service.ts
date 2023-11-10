import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAddonDto } from './dto/create-addon.dto';
import { UpdateAddonDto } from './dto/update-addon.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Addon } from 'src/entities/addon.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AddonService {
  constructor(
    @InjectRepository(Addon)
    private readonly addonRepository: Repository<Addon>,
  ) {}

  async create(createAddonDto: CreateAddonDto) {
    const newAddon = this.addonRepository.create(createAddonDto);
    return await this.addonRepository.save(newAddon);
  }

  async findAll() {
    return await this.addonRepository.find({});
  }

  async CheckIfAddonExistsById(id: number) {
    return await this.addonRepository.exist({ where: { id } });
  }

  async findOne(id: number) {
    const addon = await this.addonRepository.findOne({ where: { id } });
    if (!addon) {
      throw new NotFoundException('Addon not found');
    }
    return addon;
  }

  async update(id: number, updateAddonDto: UpdateAddonDto) {
    const updatedAddon = await this.findOne(id);

    if (!updatedAddon) {
      throw new NotFoundException('Addon not found');
    }

    Object.assign(updatedAddon, updateAddonDto);
    await this.addonRepository.save(updatedAddon);

    return updatedAddon;
  }

  async remove(id: number) {
    const deleteAddon = await this.CheckIfAddonExistsById(id);
    if (!deleteAddon) {
      throw new NotFoundException('Addon not found');
    }
    await this.addonRepository.delete(id);
    return deleteAddon;
  }
}
