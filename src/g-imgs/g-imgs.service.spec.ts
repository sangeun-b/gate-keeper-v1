import { Test, TestingModule } from '@nestjs/testing';
import { GImgsService } from './g-imgs.service';

describe('GImgsService', () => {
  let service: GImgsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GImgsService],
    }).compile();

    service = module.get<GImgsService>(GImgsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
