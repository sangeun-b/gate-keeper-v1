import { Test, TestingModule } from '@nestjs/testing';
import { CamService } from './cam.service';

describe('CamService', () => {
  let service: CamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CamService],
    }).compile();

    service = module.get<CamService>(CamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
