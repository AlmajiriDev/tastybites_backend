import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsString()
  @IsOptional()
  middleName?: string;

  // Use IsDateString for string inputs, or @Type(() => Date) with a date picker for Date objects
  @IsDateString()
  @IsOptional()
  // If you want to accept JS Date objects directly, you might use:
  // @Type(() => Date)
  // dateOfBirth?: Date;
  dateOfBirth?: string; // Expecting YYYY-MM-DD format string

  @IsString()
  @IsOptional()
  homeAddress?: string;

  @IsBoolean()
  isMatricNo_23120112027!: boolean;
}
