import { Test, TestingModule } from '@nestjs/testing';
import { FurgonetkaController } from './furgonetka.controller';
import { FurgonetkaService } from './furgonetka.service';

describe('FurgonetkaController', () => {
  let controller: FurgonetkaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FurgonetkaController],
      providers: [FurgonetkaService],
    }).compile();

    controller = module.get<FurgonetkaController>(FurgonetkaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
