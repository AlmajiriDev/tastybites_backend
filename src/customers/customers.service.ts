// src/customers/customers.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Import PrismaService
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from '@prisma/client'; // Import Prisma's generated Customer type

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {} // Inject PrismaService

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    // Ensure dateOfBirth is converted to a Date object if it's a string from DTO
    const data = {
      ...createCustomerDto,
      dateOfBirth: createCustomerDto.dateOfBirth
        ? new Date(createCustomerDto.dateOfBirth)
        : undefined,
    };
    return this.prisma.customer.create({ data });
  }

  async findAll(): Promise<Customer[]> {
    return this.prisma.customer.findMany();
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });
    if (!customer) {
      throw new NotFoundException(`Customer with ID "${id}" not found.`);
    }
    return customer;
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    // Ensure dateOfBirth is converted to a Date object if it's a string from DTO
    const data = {
      ...updateCustomerDto,
      dateOfBirth: updateCustomerDto.dateOfBirth
        ? new Date(updateCustomerDto.dateOfBirth)
        : undefined,
    };
    try {
      return await this.prisma.customer.update({
        where: { id },
        data,
      });
    } catch (error) {
      // Handle cases where customer might not exist for update (e.g., P2025)
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        typeof (error as { code?: unknown }).code === 'string' &&
        (error as { code: string }).code === 'P2025'
      ) {
        throw new NotFoundException(
          `Customer with ID "${id}" not found for update.`,
        );
      }
      throw error; // Re-throw other errors
    }
  }

  async remove(id: string): Promise<Customer> {
    try {
      return await this.prisma.customer.delete({
        where: { id },
      });
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        typeof (error as { code?: unknown }).code === 'string' &&
        (error as { code: string }).code === 'P2025'
      ) {
        throw new NotFoundException(
          `Customer with ID "${id}" not found for deletion.`,
        );
      }
      throw error; // Re-throw other errors
    }
  }
}
