// src/customers/customers.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from '@prisma/client'; // Import Prisma's generated Customer type

@Controller('customers') // Base route for this controller: /customers
// Apply ValidationPipe globally or at controller level for DTO validation
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED) // Respond with 201 Created
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<Customer> {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  async findAll(): Promise<Customer[]> {
    return this.customersService.findAll();
  }

  @Get(':id') // Route: /customers/:id
  async findOne(@Param('id') id: string): Promise<Customer> {
    return this.customersService.findOne(id); // Service handles NotFoundException
  }

  @Patch(':id') // Use Patch for partial updates
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.customersService.update(id, updateCustomerDto); // Service handles NotFoundException
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Respond with 204 No Content for successful deletion
  async remove(@Param('id') id: string): Promise<Customer> {
    return this.customersService.remove(id); // Service handles NotFoundException
  }
}
