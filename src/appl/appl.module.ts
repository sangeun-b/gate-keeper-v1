import { Module } from '@nestjs/common';
import { ApplController } from './appl.controller';
import { ApplService } from './appl.service';

@Module({
  controllers: [ApplController],
  providers: [ApplService],
})
export class ApplModule {}
