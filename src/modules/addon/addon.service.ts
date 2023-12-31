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

  /**
   * Creates a new addon.
   *
   * @param {CreateAddonDto} createAddonDto The data to create the addon with.
   *
   * @return {Promise<Addon>} The created addon.
   */
  async create(createAddonDto: CreateAddonDto): Promise<Addon> {
    const newAddon = this.addonRepository.create(createAddonDto);
    return await this.addonRepository.save(newAddon);
  }

  /**
   * Retrieves all addons.
   *
   * @return {Promise<Addon[]>} The addons.
   */
  async findAll(): Promise<Addon[]> {
    return await this.addonRepository.find({});
  }

  /**
   * Checks if an addon exists by its ID.
   *
   * @param {number} id The ID of the addon.
   *
   * @return {Promise<boolean>} Whether the addon exists.
   */
  async CheckIfAddonExistsById(id: number): Promise<boolean> {
    return await this.addonRepository.exist({ where: { id } });
  }

  /**
   * Retrieves an addon by its ID.
   *
   * @param {number} id The ID of the addon.
   *
   * @return {Promise<Addon>} The addon.
   */
  async findOne(id: number): Promise<Addon> {
    const addon = await this.addonRepository.findOne({ where: { id } });
    if (!addon) {
      throw new NotFoundException('Addon not found');
    }
    return addon;
  }

  /**
   * Updates an addon by its ID.
   *
   * @param {number} id The ID of the addon.
   * @param {UpdateAddonDto} updateAddonDto The data to update the addon with.
   *
   * @return {Promise<Addon>} The updated addon.
   */
  async update(id: number, updateAddonDto: UpdateAddonDto): Promise<Addon> {
    const updatedAddon = await this.findOne(id);

    if (!updatedAddon) {
      throw new NotFoundException('Addon not found');
    }

    Object.assign(updatedAddon, updateAddonDto);
    await this.addonRepository.save(updatedAddon);

    return updatedAddon;
  }

  /**
   * Removes an addon by its ID.
   *
   * @param {number} id The ID of the addon.
   *
   * @return {Promise<Addon>} The removed addon.
   */
  async remove(id: number): Promise<Addon> {
    const deleteAddon = await this.findOne(id);
    if (!deleteAddon) {
      throw new NotFoundException('Addon not found');
    }
    await this.addonRepository.delete(id);
    return deleteAddon;
  }
}
