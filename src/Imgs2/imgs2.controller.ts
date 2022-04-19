import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Response,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { createReadStream, mkdirSync, unlinkSync } from 'fs';
import { diskStorage } from 'multer';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { join } from 'path';
import { MyNewFileInterceptor } from 'src/member/fileInterceptor';
import { MemberService } from 'src/member/member.service';
import { fileURLToPath } from 'url';
import { Imgs2 } from './entity/imgs2.entity';
import { ImgsService } from './imgs2.service';
import { v4 as uuid } from 'uuid';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('member')
@ApiTags('Imgs API')
export class ImgsController {
  constructor(
    private imgsService: ImgsService,
    private memberService: MemberService,
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
  ) {}

  @Get(':mid/imgs')
  @ApiOperation({
    summary: '모든 Img 정보 조회',
    description: 'Member id 이용하여 그 Member가 가지고 있는 모든 img 조회',
  })
  @ApiCreatedResponse({
    description: '조회된 Member가 가지고 있는 모든 img',
    type: Imgs2,
  })
  async findAll(@Param('mid') mid: number): Promise<Imgs2[]> {
    const findMem = await this.memberService.findOne(mid);
    const mlist = await this.imgsService.findAll(mid);
    console.log(mlist);
    for (let i = 0; i < mlist.length; i++) {
      // mlist[
      //   i
      // ].url = `http://localhost:3000/member/img/${findMem.acctId}/${mlist[i].url}`;
      mlist[
        i
      ].url = `https://gate-keeper-v1.herokuapp.com/member/img/${findMem.acctId}/${mlist[i].url}`;
      console.log(mlist[i]);
    }
    return mlist;
  }

  @Get('img/:aid/:name')
  @ApiOperation({
    summary: 'Img 불러오기',
    description:
      'Acct id 이용하여 Img가 저장된 Acct 폴더를 찾고, Img name으로 img 찾아서 불러옴',
  })
  @ApiCreatedResponse({
    description: 'Acct id와 img name으로 path를 만들어서 image 파일을 불러옴',
    type: StreamableFile,
  })
  async getFile(
    @Param('name') name: string,
    @Param('aid') id: number,
    @Response({ passthrough: true }) res,
  ): Promise<StreamableFile> {
    // process.chdir(
    //   `D:\\AI_web_developer\\ai_mentoring\\Nodejs\\final-proj2\\uploads\\${id}`,
    // );
    const bucket = this.firebase.storage.bucket(
      process.env.NEXT_PUBLIC_FIRBASE_STORAGE_BUCKET,
    );
    const file = bucket.file(`uploads/${id}/${name}`).createReadStream();
    // const file = createReadStream(join(process.cwd(), name)); //firebase endpoint로 접근, readstream내용이 firbase 내용으로 or firbase에서 readstream
    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Disposition': 'filename=' + name,
    });
    return new StreamableFile(file);
  }

  @Post(':aid/:mid/img')
  @ApiOperation({
    summary: 'Img 저장',
    description:
      'Acct id로 Img가 저장될 폴더를 만들고, member id를 이용해서 img에 member id를 지정해서 img 저장',
  })
  @ApiCreatedResponse({
    description:
      'Acct id로 만들어진 폴더에 Img를 저장하고 member id를 fk로 저장',
    type: Imgs2,
  })
  @UseInterceptors(
    MyNewFileInterceptor('file', (ctx) => {
      // const req = ctx.switchToHttp().getRequest() as Request;
      // console.log(`.upload/${req.params.id}`);
      return {
        storage: diskStorage({
          destination: (req, file, cb) => {
            // const { id } = req.body;
            const path = `./uploads/${req.params.aid}`;
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
            const ext = file.originalname.split('.').pop();
            console.log(ext);
            return cb(null, `${randomName}-${_req.params.aid}.${ext}`);
          },
        }),
      };
    }),
  )
  async save(
    @UploadedFile() file,
    @Param('aid') aid: number,
    @Param('mid') mid: number,
  ) {
    const mem = await this.memberService.findOne(mid);
    console.log(mem);
    console.log(file);
    const mimg = new Imgs2();
    const bucket = this.firebase.storage.bucket(
      process.env.NEXT_PUBLIC_FIRBASE_STORAGE_BUCKET,
    );
    console.log(file.path);
    const uploadedLink = await bucket.upload(file.path, {
      public: true,
      destination: `uploads/${aid}/${file.filename}`,
      metadata: {
        firebaseStorageDownloadTokens: uuid(),
      },
    });
    // mimg.url = uploadedLink[0].metadata.mediaLink;
    mimg.url = file.filename;
    console.log(uploadedLink);
    const saveImg = await this.imgsService.save(mimg, mem);
    saveImg.url = `https://gate-keeper-v1.herokuapp.com/member/img/${aid}/${saveImg.url}`;
    return saveImg;
  }

  @Delete(':aid/img/:id')
  @ApiOperation({
    summary: 'Img 삭제',
    description: 'Acct id로 Img가 저장될 폴더를 찾아서, Img id로 Img 삭제',
  })
  async remove(@Param('id') id: number, @Param('aid') aid: number) {
    const imgFind = await this.imgsService.findOne(id);
    // const bucket = this.firebase.storage.bucket(
    //   process.env.NEXT_PUBLIC_FIRBASE_STORAGE_BUCKET,
    // );
    //firebase 삭제 확인 필요!
    // console.log(imgFind);
    // if (imgFind) {
    //   try {
    //     await bucket.file(`uploads/${aid}/${imgFind.url}`).delete();
    //     this.imgsService.remove(id);
    //     return `img #${id} Deleted!`;
    //   } catch (err) {
    //     console.error(err);
    //     return 'Delete fail';
    //   }
    // }
    // return 'Delete failed!';

    // 로컬에서 삭제
    // console.log(imgFind);
    // if (imgFind) {
    //   try {
    //     unlinkSync(`./uploads/${aid}/${imgFind.url}`);
    //     this.imgsService.remove(id);
    //     return `img #${id} Deleted!`;
    //   } catch (err) {
    //     console.error(err);
    //     return 'Delete fail';
    //   }
    // }
    // return 'Delete failed!';
    this.imgsService.remove(id);
    return `img #${id} Deleted!`;
  }
}
