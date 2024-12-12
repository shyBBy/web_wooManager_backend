import {forwardRef, Module} from '@nestjs/common';
import {OrderService} from './order.service';
import {OrderController} from './order.controller';
import {StoreModule} from '../store/store.module';
import {FurgonetkaModule} from '../furgonetka/furgonetka.module';

@Module({
  imports: [forwardRef(() => StoreModule), FurgonetkaModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {
}

