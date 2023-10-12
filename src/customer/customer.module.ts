import { forwardRef, Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { StoreModule } from '../store/store.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [forwardRef(() => StoreModule), UserModule],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
