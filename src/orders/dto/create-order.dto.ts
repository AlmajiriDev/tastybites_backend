import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  @IsNotEmpty()
  customerId!: string;

  @IsString()
  orderDate!: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  menuItems!: string[];

  @IsString()
  @IsOptional()
  specialInstructions?: string;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  nextReservationDate?: string;
}
