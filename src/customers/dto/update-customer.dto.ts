// src/customers/dto/update-customer.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer.dto';

// PartialType makes all fields of CreateCustomerDto optional for updates
export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}
