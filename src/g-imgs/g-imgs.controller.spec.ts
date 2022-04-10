import { Test, TestingModule } from '@nestjs/testing';
import { GImgsController } from './g-imgs.controller';

describe('GImgsController', () => {
  let controller: GImgsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GImgsController],
    }).compile();

    controller = module.get<GImgsController>(GImgsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
