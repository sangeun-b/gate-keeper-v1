import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcctRepository } from 'src/acct/acct.repository';
import { AcctService } from 'src/acct/acct.service';
import { GImgsController } from 'src/g-imgs/g-imgs.controller';
import { GImgsRepository } from 'src/g-imgs/g-imgs.repository';
import { GImgsService } from 'src/g-imgs/g-imgs.service';
import { GuestController } from './guest.controller';
import { GuestRepository } from './guest.repository';
import { GuestService } from './guest.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([GuestRepository]),
    TypeOrmModule.forFeature([AcctRepository]),
    TypeOrmModule.forFeature([GImgsRepository]),
  ],
  exports: [TypeOrmModule],
  controllers: [GuestController, GImgsController],
  providers: [GuestService, AcctService, GImgsService],
})
export class GuestModule {}
