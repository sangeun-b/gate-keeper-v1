import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Response,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { extname } from 'path';
import { CamService } from 'src/cam/cam.service';
import { ImgsService } from 'src/Imgs2/imgs2.service';
import { MyNewFileInterceptor } from 'src/member/fileInterceptor';
import { MemberService } from 'src/member/member.service';
import { Visitor } from './entity/visitor.entity';
import { VisitorService } from './visitor.service';
import { v4 as uuid } from 'uuid';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('cam')
@ApiTags('Visitor API')
export class VisitorController {
  constructor(
    private visitorService: VisitorService,
    private camService: CamService,
    private imgService: ImgsService,
    private memService: MemberService,
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
  ) {}

  // @Post(':id/visitor')
  // async saveVisitor(
  //   @Param('id') id: number,
  //   @Body() visitor: Visitor,
  // ): Promise<Visitor | undefined> {
  //   console.log(visitor);
  //   const cam = await this.camService.findOne(id);
  //   visitor.cam = cam;
  //   if ((visitor.img = 'Unknown')) {
  //     visitor.name = visitor.img;
  //   } else {
  //     const findImg = await this.imgService.findByPath(visitor.img);
  //     const findMem = await this.memService.findOne(findImg.memberId);
  //     visitor.name = findMem.name;
  //   }
  //   return await this.visitorService.save(visitor);
  // }

  @Post(':id/visitor')
  @ApiOperation({
    summary: 'Visitor 등록 ',
    description: 'Cam id(pk)에 감지된 vistior 자동 등록',
  })
  @ApiCreatedResponse({
    description: 'Cam id(pk)에 감지된 vistior 자동 등록',
    type: Visitor,
  })
  @UseInterceptors(
    MyNewFileInterceptor('file', (ctx) => {
      // const req = ctx.switchToHttp().getRequest() as Request;
      // console.log(`.upload/${req.params.id}`);
      return {
        storage: diskStorage({
          destination: (req, file, cb) => {
            // const { id } = req.body;
            const path = `./visitors/${req.params.id}`;
            mkdirSync(path, { recursive: true });
            return cb(null, path);
          },
          //destination: `.upload/${req.params.id}`,
          // tslint:disable-next-line: variable-name
          filename: (_req, file, cb) => {
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            // console.log(req);
            console.log(extname);
            const ext = file.originalname.split('.').pop();
            return cb(null, `${randomName}.${ext}`);
          },
        }),
      };
    }),
  )
  async saveVisitor(
    @UploadedFile() file,
    @Param('id') id: number,
    @Body() visitor: Visitor,
  ): Promise<Visitor | undefined> {
    console.log(visitor);

    const bucket = this.firebase.storage.bucket(
      process.env.NEXT_PUBLIC_FIRBASE_STORAGE_BUCKET,
    );
    console.log(file.path);
    const uploadedLink = await bucket.upload(file.path, {
      public: true,
      destination: `visitors/${id}/${file.filename}`,
      metadata: {
        firebaseStorageDownloadTokens: uuid(),
      },
    });
    console.log(uploadedLink);
    const cam = await this.camService.findOne(id);
    visitor.cam = cam;
    if (visitor.img == 'Unknown') {
      console.log(file);
      visitor.name = visitor.img;
      visitor.img = file.filename;
    } else {
      const findImg = await this.imgService.findByPath(visitor.img);
      const findMem = await this.memService.findOne(findImg.memberId);
      visitor.name = findMem.name;
      visitor.img = file.filename;
    }
    return await this.visitorService.save(visitor);
  }

  // @Get(':id/visitor')
  // @ApiOperation({
  //   summary: 'Visitor 날짜로 조회',
  //   description: 'Cam id(pk)에 등록된 vistior의 저장날짜로 조회',
  // })
  // @ApiCreatedResponse({
  //   description: 'Cam id(pk)에 등록된 vistior의 저장날짜로 조회',
  //   type: Visitor,
  // })
  // async findByDate(
  //   @Param('id') id: number,
  //   @Body() visitor: Visitor,
  // ): Promise<Visitor[] | undefined> {
  //   return await this.visitorService.findByDate(visitor, id);
  // }
  @Get(':id/visitor/date/:date')
  @ApiOperation({
    summary: 'Visitor 날짜로 조회',
    description: 'Cam id(pk)에 등록된 vistior의 저장날짜로 조회',
  })
  @ApiCreatedResponse({
    description: 'Cam id(pk)에 등록된 vistior의 저장날짜로 조회',
    type: Visitor,
  })
  async findByDate(
    @Param('id') id: number,
    @Param('date') date: string,
  ): Promise<Visitor[] | undefined> {
    return await this.visitorService.findByDate(date, id);
  }

  @Get(':id/visitors')
  @ApiOperation({
    summary: '모든 Visitor 조회',
    description: 'Cam id(pk)에 등록된 모든 vistior 조회',
  })
  @ApiCreatedResponse({
    description: 'Cam id(pk)에 등록된 모든 vistior 조회',
    type: Visitor,
  })
  async findAll(@Param('id') id: number): Promise<Visitor[] | undefined> {
    const vlist = await this.visitorService.findAllVisitor(id);
    for (let i = 0; i < vlist.length; i++) {
      vlist[
        i
      ].img = `https://gate-keeper-v1.herokuapp.com/cam/${id}/visitor/${vlist[i].img}`;
      console.log(vlist[i]);
    }
    return vlist;
  }

  @Get(':id/visitor/:name')
  @ApiOperation({
    summary: 'Visitor 저장된 img 이름으로 조회',
    description: 'Cam id(pk)에 등록된 vistior의 img이름으로 img불러오기',
  })
  @ApiCreatedResponse({
    description: 'Cam id(pk)에 등록된 vistior의 img이름으로 img불러오기',
    type: StreamableFile,
  })
  async getFile(
    @Param('name') name: string,
    @Param('id') id: number,
    @Response({ passthrough: true }) res,
  ): Promise<StreamableFile> {
    // process.chdir(
    //   `D:\\AI_web_developer\\ai_mentoring\\Nodejs\\final-proj2\\uploads\\${id}`,
    // );
    const bucket = this.firebase.storage.bucket(
      process.env.NEXT_PUBLIC_FIRBASE_STORAGE_BUCKET,
    );
    const file = bucket.file(`visitors/${id}/${name}`).createReadStream();
    // const file = createReadStream(join(process.cwd(), name)); //firebase endpoint로 접근, readstream내용이 firbase 내용으로 or firbase에서 readstream
    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Disposition': 'filename=' + name,
    });
    return new StreamableFile(file);
  }
}
