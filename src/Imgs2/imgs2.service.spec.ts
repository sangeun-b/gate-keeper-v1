import { Test, TestingModule } from '@nestjs/testing';
import { ImgsService } from './imgs2.service';

describe('ImgsService', () => {
  let service: ImgsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImgsService],
    }).compile();

    service = module.get<ImgsService>(ImgsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
