// src/orders/orders.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from '@prisma/client'; // Import Prisma's generated Order type

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Ensure orderDate and nextReservationDate are converted to Date objects
    const data = {
      ...createOrderDto,
      orderDate: createOrderDto.orderDate
        ? new Date(createOrderDto.orderDate)
        : undefined,
      nextReservationDate: createOrderDto.nextReservationDate
        ? new Date(createOrderDto.nextReservationDate)
        : undefined,
    };

    // Ensure the customer exists before creating the order
    const customerExists = await this.prisma.customer.findUnique({
      where: { id: createOrderDto.customerId },
    });

    if (!customerExists) {
      throw new NotFoundException(
        `Customer with ID "${createOrderDto.customerId}" not found. Cannot create order.`,
      );
    }

    return this.prisma.order.create({ data });
  }

  async findAll(): Promise<Order[]> {
    return this.prisma.order.findMany({
      include: { customer: true }, // Include customer details with the order
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { customer: true }, // Include customer details
    });
    if (!order) {
      throw new NotFoundException(`Order with ID "${id}" not found.`);
    }
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    // Ensure date fields are converted to Date objects if present in DTO
    const data: UpdateOrderDto = { ...updateOrderDto };
    if (updateOrderDto.orderDate) {
      data.orderDate = new Date(updateOrderDto.orderDate).toISOString();
    }
    if (updateOrderDto.nextReservationDate) {
      data.nextReservationDate = new Date(
        updateOrderDto.nextReservationDate,
      ).toISOString();
    }

    // If customerId is being updated, ensure the new customer exists
    if (updateOrderDto.customerId) {
      const newCustomerExists = await this.prisma.customer.findUnique({
        where: { id: updateOrderDto.customerId },
      });
      if (!newCustomerExists) {
        throw new NotFoundException(
          `Customer with ID "${updateOrderDto.customerId}" not found. Cannot update order.`,
        );
      }
    }

    try {
      return await this.prisma.order.update({
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
          `Order with ID "${id}" not found for update.`,
        );
      }
      throw error;
    }
  }

  async remove(id: number): Promise<Order> {
    try {
      return await this.prisma.order.delete({
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
          `Order with ID "${id}" not found for deletion.`,
        );
      }
      throw error;
    }
  }
}
