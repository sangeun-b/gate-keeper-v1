import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcctRepository } from 'src/acct/acct.repository';
import { AcctService } from 'src/acct/acct.service';
import { CamRepository } from 'src/cam/cam.repository';
import { CamService } from 'src/cam/cam.service';
import { ImgsRepository } from 'src/Imgs2/imgs2.repository';
import { ImgsService } from 'src/Imgs2/imgs2.service';
import { MemberRepository } from 'src/member/member.repository';
import { MemberService } from 'src/member/member.service';
import { VisitorController } from './visitor.controller';
import { VisitorRepository } from './visitor.repository';
import { VisitorService } from './visitor.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VisitorRepository,
      CamRepository,
      ImgsRepository,
      MemberRepository,
      AcctRepository,
    ]),
  ],
  exports: [TypeOrmModule],
  controllers: [VisitorController],
  providers: [
    VisitorService,
    CamService,
    ImgsService,
    MemberService,
    AcctService,
  ],
})
export class VisitorModule {}
