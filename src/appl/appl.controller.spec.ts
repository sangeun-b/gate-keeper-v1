import { Test, TestingModule } from '@nestjs/testing';
import { ApplController } from './appl.controller';

describe('ApplController', () => {
  let controller: ApplController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplController],
    }).compile();

    controller = module.get<ApplController>(ApplController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
