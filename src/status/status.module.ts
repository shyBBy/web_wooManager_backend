import { Module } from '@nestjs/common';
import { StatusService } from './status.service';
import { StatusController } from './status.controller';
import { FurgonetkaModule } from 'src/furgonetka/furgonetka.module';

@Module({
  imports: [FurgonetkaModule],
  controllers: [StatusController],
  providers: [StatusService],
})
export class StatusModule {
}
