import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CamController } from './cam.controller';
import { CamRepository } from './cam.repository';
import { CamService } from './cam.service';

@Module({
  imports: [TypeOrmModule.forFeature([CamRepository])],
  exports: [TypeOrmModule],
  controllers: [CamController],
  providers: [CamService],
})
export class CamModule {}
