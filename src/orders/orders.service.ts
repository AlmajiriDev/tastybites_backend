import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const customerExists = await this.prisma.customer.findUnique({
      where: { id: createOrderDto.customerId },
    });

    if (!customerExists) {
      throw new NotFoundException(
        `Customer with ID "${createOrderDto.customerId}" not found. Cannot create order.`,
      );
    }

    return this.prisma.order.create({ data: createOrderDto });
  }

  async findAll(): Promise<Order[]> {
    return this.prisma.order.findMany({
      include: { customer: true },
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { customer: true },
    });
    if (!order) {
      throw new NotFoundException(`Order with ID "${id}" not found.`);
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const data: UpdateOrderDto = { ...updateOrderDto };
    if (updateOrderDto.orderDate) {
      data.orderDate = new Date(updateOrderDto.orderDate).toISOString();
    }
    if (updateOrderDto.nextReservationDate) {
      data.nextReservationDate = new Date(
        updateOrderDto.nextReservationDate,
      ).toISOString();
    }

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

  async remove(id: string): Promise<Order> {
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
