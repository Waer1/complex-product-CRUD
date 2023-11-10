import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsString, ValidateNested } from "class-validator";

export class CreateAddonItemDto {
    @IsString()
    @ApiProperty({ example: 'AddonItem1' })
    name: string;
  }

  export class CreateAddonDto {
    @IsString()
    @ApiProperty({ example: 'Addon1' })
    name: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateAddonItemDto)
    @ApiProperty({
      type: [CreateAddonItemDto],
      example: [{ name: 'AddonItem1' }, { name: 'AddonItem2' }],
    })
    addonItems: CreateAddonItemDto[];
  }
