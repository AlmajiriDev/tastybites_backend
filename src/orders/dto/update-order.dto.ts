// src/orders/dto/update-order.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';

// PartialType makes all fields of CreateOrderDto optional for updates
export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
