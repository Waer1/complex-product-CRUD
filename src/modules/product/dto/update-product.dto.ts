import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateUOMDto } from 'src/modules/uom/dto/update-uom.dto';


export class UpdateProductDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Product1Update' })
  name?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateUOMDto)
  @IsOptional()
  uoms?: UpdateUOMDto[];
}
