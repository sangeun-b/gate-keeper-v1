import { Test, TestingModule } from '@nestjs/testing';
import { ApplService } from './appl.service';

describe('ApplService', () => {
  let service: ApplService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplService],
    }).compile();

    service = module.get<ApplService>(ApplService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
