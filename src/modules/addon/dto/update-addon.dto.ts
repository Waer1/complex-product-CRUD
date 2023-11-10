import { PartialType } from '@nestjs/mapped-types';
import { CreateAddonDto, CreateAddonItemDto } from './create-addon.dto';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateAddonItemDto extends PartialType(CreateAddonItemDto) {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  addonItemId: number;
}

export class UpdateAddonDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  addonId: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Addon1' })
  name?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateAddonItemDto)
  @ApiProperty({
    type: [UpdateAddonItemDto],
    example: [{ name: 'AddonItem1' }, { name: 'AddonItem2' }],
  })
  addonItems: UpdateAddonItemDto[];
}
