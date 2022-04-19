import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Response,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { GImgsService } from 'src/g-imgs/g-imgs.service';
import { Guest } from 'src/guest/entity/guest.entity';
import { GuestService } from 'src/guest/guest.service';
import { Imgs2 } from 'src/Imgs2/entity/imgs2.entity';
import { MyNewFileInterceptor } from 'src/member/fileInterceptor';
import { GImgs } from './entity/g-imgs.entity';
import { v4 as uuid } from 'uuid';

@Controller('guest')
export class GImgsController {
  memberService: any;
  constructor(
    private gImgsService: GImgsService,
    private guestService: GuestService,
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
  ) {}

  @Get(':gid/imgs')
  async findAll(@Param('gid') gid: number): Promise<GImgs[]> {
    const findGuest = await this.guestService.findOne(gid);
    const glist = await this.gImgsService.findAll(gid);
    console.log(glist);
    for (let i = 0; i < glist.length; i++) {
      // mlist[
      //   i
      // ].url = `http://localhost:3000/member/img/${findMem.acctId}/${mlist[i].url}`;
      glist[
        i
      ].url = `https://gate-keeper-v1.herokuapp.com/guest/img/${findGuest.acctId}/${glist[i].url}`;
      console.log(glist[i]);
    }
    return glist;
  }

  @Get('img/:aid/:name')
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
    const file = bucket.file(`guests/${id}/${name}`).createReadStream();
    // const file = createReadStream(join(process.cwd(), name)); //firebase endpoint로 접근, readstream내용이 firbase 내용으로 or firbase에서 readstream
    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Disposition': 'filename=' + name,
    });
    return new StreamableFile(file);
  }

  @Post(':aid/:gid/img')
  @UseInterceptors(
    MyNewFileInterceptor('file', (ctx) => {
      // const req = ctx.switchToHttp().getRequest() as Request;
      // console.log(`.upload/${req.params.id}`);
      return {
        storage: diskStorage({
          destination: (req, file, cb) => {
            // const { id } = req.body;
            const path = `./guests/${req.params.aid}`;
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
    @Param('gid') gid: number,
  ) {
    const guest2 = await this.guestService.findOne(gid);
    console.log(guest2);
    console.log(file);
    const gimg = new GImgs();
    const bucket = this.firebase.storage.bucket(
      process.env.NEXT_PUBLIC_FIRBASE_STORAGE_BUCKET,
    );
    console.log(file.path);
    const uploadedLink = await bucket.upload(file.path, {
      public: true,
      destination: `guests/${aid}/${file.filename}`,
      metadata: {
        firebaseStorageDownloadTokens: uuid(),
      },
    });
    gimg.url = file.filename;
    console.log(uploadedLink);
    const saveImg = await this.gImgsService.save(gimg, guest2);
    saveImg.url = `https://gate-keeper-v1.herokuapp.com/guest/img/${aid}/${saveImg.url}`;
    return saveImg;
  }

  @Delete(':aid/gimg/:id')
  async remove(@Param('id') id: number, @Param('aid') aid: number) {
    const imgFind = await this.gImgsService.findOne(id);
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
    this.gImgsService.remove(id);
    return `img #${id} Deleted!`;
  }
}
