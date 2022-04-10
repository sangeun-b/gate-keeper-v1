import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Acct } from './acct/entity/acct.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { VisitorModule } from './visitor/visitor.module';
import { Visitor } from './visitor/entity/visitor.entity';
import { MemberModule } from './member/member.module';
import { Member } from './member/entity/member.entity';
import { CamModule } from './cam/cam.module';
import { Cam } from './cam/entity/cam.entity';
import { Imgs2 } from './Imgs2/entity/imgs2.entity';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from 'nestjs-firebase';
import { GuestModule } from './guest/guest.module';
import { Guest } from './guest/entity/guest.entity';
import { GImgs } from './g-imgs/entity/g-imgs.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FirebaseModule.forRoot({
      googleApplicationCredential: {
        projectId: process.env.NEXT_PUBLIC_FIRBASE_PROJECT_ID,
        privateKey: process.env.FIRBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIRBASE_CLIENT_EMAIL,
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Acct, Visitor, Member, Cam, Imgs2, Guest, GImgs],
      // synchronize: true, //entity만들고 자동 save. 개발모드에서만 사용
    }),
    AuthModule,
    VisitorModule,
    MemberModule,
    CamModule,
    GuestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
