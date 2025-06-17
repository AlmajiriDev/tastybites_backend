import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CustomersModule } from './customers/customers.module';
import { PrismaService } from './prisma/prisma.service';
import { CustomersService } from './customers/customers.service';
import { CustomersController } from './customers/customers.controller';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [PrismaModule, CustomersModule, CustomersModule, OrdersModule],
  controllers: [AppController, CustomersController],
  providers: [AppService, PrismaService, CustomersService],
})
export class AppModule {}
