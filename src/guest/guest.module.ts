import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcctRepository } from 'src/acct/acct.repository';
import { AcctService } from 'src/acct/acct.service';
import { GuestController } from './guest.controller';
import { GuestRepository } from './guest.repository';
import { GuestService } from './guest.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([GuestRepository]),
    TypeOrmModule.forFeature([AcctRepository]),
  ],
  controllers: [GuestController],
  providers: [GuestService, AcctService],
})
export class GuestModule {}
