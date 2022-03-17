import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Acct } from './acct/entity/acct.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ApplModule } from './appl/appl.module';
import { VisitorModule } from './visitor/visitor.module';
import { Visitor } from './visitor/entity/visitor.entity';
import { MemberModule } from './member/member.module';
import { Member } from './member/entity/member.entity';
import { CamModule } from './cam/cam.module';
import { Cam } from './cam/entity/cam.entity';
import { Imgs2 } from './Imgs2/entity/imgs2.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'rootsystem7',
      database: 'test',
      entities: [Acct, Visitor, Member, Cam, Imgs2],
      synchronize: true, //entity만들고 자동 save. 개발모드에서만 사용
      timezone: 'Z',
    }),
    AuthModule,
    ApplModule,
    VisitorModule,
    MemberModule,
    CamModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
