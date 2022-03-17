import { Test, TestingModule } from '@nestjs/testing';
import { AcctController } from './acct.controller';

describe('AcctController', () => {
  let controller: AcctController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AcctController],
    }).compile();

    controller = module.get<AcctController>(AcctController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
