import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { CreateAddonDto } from 'src/modules/addon/dto/create-addon.dto';



export class CreateUOMBarcodeDto {
  @IsString()
  @ApiProperty({ example: '123456789' })
  barcode: string;
}

export class CreateUOMImageDto {
  @IsString()
  @ApiProperty({ example: 'http://example.com/image.jpg' })
  url: string;
}

export class CreateUOMDto {
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
  @Type(() => CreateAddonDto)
  @ApiProperty({
    type: [CreateAddonDto],
    example: [
      {
        name: 'Addon1',
        addonItems: [{ name: 'AddonItem1' }, { name: 'AddonItem2' }],
      },
    ],
  })
  addons: CreateAddonDto[];
}
