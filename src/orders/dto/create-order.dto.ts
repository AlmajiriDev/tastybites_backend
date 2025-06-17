// src/orders/dto/create-order.dto.ts
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateOrderDto {
  @IsUUID() // Ensure customerId is a valid UUID
  @IsNotEmpty()
  customerId!: string;

  // orderDate is @default(now()) in Prisma, so typically not required in DTO,
  // but if you want to allow setting it manually:
  @IsString()
  orderDate!: string; // Expecting YYYY-MM-DD format string

  @IsArray()
  @IsString({ each: true }) // Ensure each element in the array is a string
  @IsNotEmpty({ each: true }) // Ensure each string in the array is not empty
  menuItems!: string[]; // List of menu item names (e.g., ["Burger", "Coke"])

  @IsString()
  @IsOptional()
  specialInstructions?: string;

  @IsString()
  @IsOptional()
  paymentMethod?: string; // e.g., "Cash", "Card", "Mobile Payment"

  @IsString()
  @IsOptional()
  nextReservationDate?: string; // Optional, YYYY-MM-DD format string
}
