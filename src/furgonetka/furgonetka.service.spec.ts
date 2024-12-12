import { Test, TestingModule } from '@nestjs/testing';
import { FurgonetkaService } from './furgonetka.service';

describe('FurgonetkaService', () => {
  let service: FurgonetkaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FurgonetkaService],
    }).compile();

    service = module.get<FurgonetkaService>(FurgonetkaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
