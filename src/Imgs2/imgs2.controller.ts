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
import { join } from 'path';
import { MyNewFileInterceptor } from 'src/member/fileInterceptor';
import { MemberService } from 'src/member/member.service';
import { fileURLToPath } from 'url';
import { Imgs2 } from './entity/imgs2.entity';
import { ImgsService } from './imgs2.service';

@Controller('member')
export class ImgsController {
  constructor(
    private imgsService: ImgsService,
    private memberService: MemberService,
  ) {}

  @Get(':mid/imgs')
  async findAll(@Param('mid') mid: number): Promise<Imgs2[]> {
    const findMem = await this.memberService.findOne(mid);
    const mlist = await this.imgsService.findAll(mid);
    console.log(mlist);
    for (let i = 0; i < mlist.length; i++) {
      mlist[
        i
      ].url = `http://localhost:3000/member/img/${findMem.acctId}/${mlist[i].url}`;
      console.log(mlist[i]);
    }
    return mlist;
  }

  @Get('img/:id/:name')
  async getFile(
    @Param('name') name: string,
    @Param('id') id: number,
    @Response({ passthrough: true }) res,
  ): Promise<StreamableFile> {
    process.chdir(
      `D:\\AI_web_developer\\ai_mentoring\\Nodejs\\final-proj2\\uploads\\${id}`,
    );
    const file = createReadStream(join(process.cwd(), name));
    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Disposition': 'filename=' + name,
    });
    return new StreamableFile(file);
  }
  @Post(':aid/:mid/img')
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
  async save(@UploadedFile() file, @Param('mid') mid: number) {
    const mem = await this.memberService.findOne(mid);
    console.log(mem);
    console.log(file);
    const mimg = new Imgs2();
    mimg.url = file.filename;
    return await this.imgsService.save(mimg, mem);
  }

  @Delete(':aid/img/:id')
  async remove(@Param('id') id: number, @Param('aid') aid: number) {
    const imgFind = await this.imgsService.findOne(id);
    console.log(imgFind);
    if (imgFind) {
      try {
        unlinkSync(`./uploads/${aid}/${imgFind.url}`);
        return this.imgsService.remove(id);
      } catch (err) {
        console.error(err);
        return 'Delete fail';
      }
    }
    return 'Delete failed!';
  }

  @Put(':aid/:id')
  @UseInterceptors(
    MyNewFileInterceptor('file', (ctx) => {
      // const req = ctx.switchToHttp().getRequest() as Request;
      // console.log(`.upload/${req.params.id}`);
      return {
        storage: diskStorage({
          destination: (req, file, cb) => {
            // const { id } = req.body;
            const path = `./uploads/${req.params.aid}/`;
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
            const ext = file.originalname.split('.').pop();
            console.log(ext);
            // console.log(req);
            // return cb(null, `${randomName}-${_req.params.id}.${ext}`); // member id?
            return cb(null, `${randomName}-${_req.params.aid}.${ext}`); //acct id
          },
        }),
      };
    }),
  )
  async update(
    @UploadedFile() file,
    @Param('aid') aid: number,
    @Param('id') id: number,
  ) {
    const imgFind = await this.imgsService.findOne(id);
    if (imgFind) {
      try {
        unlinkSync(`./uploads/${aid}/${imgFind.url}`);
        const filename = file.filename;
        return this.imgsService.update(id, filename);
      } catch (err) {
        console.error(err);
        return 'update failed!';
      }
    }
    return;
  }
}
