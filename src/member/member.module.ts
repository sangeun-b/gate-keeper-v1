import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcctRepository } from 'src/acct/acct.repository';
import { AcctService } from 'src/acct/acct.service';
import { ImgsController } from 'src/Imgs2/imgs2.controller';
import { ImgsRepository } from 'src/Imgs2/imgs2.repository';
import { ImgsService } from 'src/Imgs2/imgs2.service';
import { MemberController } from './member.controller';
import { MemberRepository } from './member.repository';
import { MemberService } from './member.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MemberRepository]),
    TypeOrmModule.forFeature([AcctRepository]),
    TypeOrmModule.forFeature([ImgsRepository]),
  ],
  exports: [TypeOrmModule],
  controllers: [MemberController, ImgsController],
  providers: [MemberService, AcctService, ImgsService],
})
export class MemberModule {}
