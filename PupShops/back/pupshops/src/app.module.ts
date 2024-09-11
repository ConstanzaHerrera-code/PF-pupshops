import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { CredentialsModule } from './credentials/credentials.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { ProductsModule } from './modules/products/products.module';
import { OrderModule } from './modules/order/order.module';



@Module({
  imports: [UsersModule, CredentialsModule, AppointmentsModule, ProductsModule, OrderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
