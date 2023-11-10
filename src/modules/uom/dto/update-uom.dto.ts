import { PartialType } from '@nestjs/mapped-types';
import {
  CreateUOMBarcodeDto,
  CreateUOMDto,
  CreateUOMImageDto,
} from './create-uom.dto';
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
import { UpdateAddonDto } from 'src/modules/addon/dto/update-addon.dto';

class UpdateUOMDtoData {
  @IsString()
  @ApiProperty({ example: 'UOM1' })
  name: string;

  @ValidateNested({ each: true })
  @ApiProperty({ type: CreateUOMBarcodeDto, example: '123456789' })
  @Type(() => CreateUOMBarcodeDto)
  uomBarcode: CreateUOMBarcodeDto;

  @ValidateNested({ each: true })
  @ApiProperty({
    type: CreateUOMImageDto,
    example: 'http://example.com/image.jpg',
  })
  @Type(() => CreateUOMImageDto)
  uomImage: CreateUOMImageDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateAddonDto)
  @ApiProperty({
    type: [UpdateAddonDto],
    example: [
      {
        name: 'Addon1',
        addonItems: [{ name: 'AddonItem1' }, { name: 'AddonItem2' }],
      },
    ],
  })
  addons: UpdateAddonDto[];
}

export class UpdateUOMDto extends PartialType(UpdateUOMDtoData) {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  uomId: number;
}
