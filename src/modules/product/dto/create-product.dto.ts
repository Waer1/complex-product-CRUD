import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { CreateUOMDto } from 'src/modules/uom/dto/create-uom.dto';

export class CreateProductDto {
  @IsString()
  @ApiProperty({ example: 'Product1' })
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateUOMDto)
  @ApiProperty({
    type: [CreateUOMDto],
    example: [
      {
        name: 'UOM1',
        uomBarcode: {
          barcode: '123456789',
        },
        uomImage: {
          url: 'http://example.com/image.jpg',
        },
        addons: [
          {
            name: 'Addon1',
            addonItems: [{ name: 'AddonItem1' }, { name: 'AddonItem2' }],
          },
        ],
      },
    ],
  })
  uoms: CreateUOMDto[];
}
