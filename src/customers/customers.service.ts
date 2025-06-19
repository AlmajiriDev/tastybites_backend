import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from '@prisma/client';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.prisma.customer.create({ data: createCustomerDto });
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
    const data = {
      ...updateCustomerDto,
      dateOfBirth: updateCustomerDto.dateOfBirth
        ? new Date(updateCustomerDto.dateOfBirth).toISOString()
        : undefined,
    };
    try {
      return await this.prisma.customer.update({
        where: { id },
        data,
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
          `Customer with ID "${id}" not found for update.`,
        );
      }
      throw error;
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
      throw error;
    }
  }
}
