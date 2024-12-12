import { Module } from '@nestjs/common';
import { FurgonetkaService } from './furgonetka.service';
import { FurgonetkaController } from './furgonetka.controller';

@Module({
  controllers: [FurgonetkaController],
  providers: [FurgonetkaService],
  exports: [FurgonetkaService],
})
export class FurgonetkaModule {}
