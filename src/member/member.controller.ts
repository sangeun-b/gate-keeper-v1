import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Member } from './entity/member.entity';
import { MemberService } from './member.service';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { identity, Observable, of } from 'rxjs';
import { AcctService } from 'src/acct/acct.service';
import { Acct } from 'src/acct/entity/acct.entity';
import { MyNewFileInterceptor } from './fileInterceptor';
import { ImgsService } from 'src/Imgs2/imgs2.service';
import { Imgs2 } from 'src/Imgs2/entity/imgs2.entity';
import { Request } from 'express';
import { fsync, mkdirSync, unlinkSync } from 'fs';
import { imgsDTO } from 'src/Imgs2/dto/imgs.dto';
import { unlink } from 'fs/promises';

@Controller('acct')
export class MemberController {
  constructor(
    private memberService: MemberService,
    private acctService: AcctService,
    private imgsService: ImgsService,
  ) {
    //console.log(memberService, acctService, imgsService);
  }

  // @Post('/add')
  // create(@Body() member: Member) {
  //   return this.memberService.save(member);
  // }

  //폴더이름 계정id, 이미지 파일 여러개 저장(개수 제한 없이), db에 저장 할 때는 어떻게 (새로 이미지 파일 table을 만드는게 나은지? (id,name,date))
  // @Post(':id/member')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: `./uploads/#${id}`, //계정별로 나눠서, 폴더 명을 USER ID, 이미지는 여러사진 - PATH는 DB 관리
  //       filename: (req, file, cb) => {
  //         const randomName = file.originalname.split('.', 1) + uuidv4;
  //         cb(null, `${randomName}${extname(file.originalname)}`);
  //       },
  //     }),
  //   }),
  // )
  // async save(
  //   @UploadedFile() file,
  //   @Body() member: Member,
  //   @Param('id') id: number,
  // ) {
  //   console.log(file);
  //   member.img = file.originalname.split('.', 1) + extname(file.originalname);
  //   const acct = await this.acctService.findOne(id);
  //   member.acct = acct;
  //   return this.memberService.save(member, id);
  // }

  @Post(':id/member') //member를 먼저 만들고 사진 추가?
  @UseInterceptors(
    MyNewFileInterceptor('file', (ctx) => {
      // const req = ctx.switchToHttp().getRequest() as Request;
      // console.log(`.upload/${req.params.id}`);
      return {
        storage: diskStorage({
          destination: (req, file, cb) => {
            // const { id } = req.body;
            const path = `./uploads/${req.params.id}`;
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
            return cb(null, `${randomName}-${_req.params.id}.${ext}`);
          },
        }),
      };
    }),
  )
  async save(
    @UploadedFile() file,
    @Body() member: Member,
    @Param('id') id: number,
  ) {
    const acct = await this.acctService.findOne(id);
    console.log(acct);
    member.acct = acct;
    // member.img = file.filename;
    const mimg = new Imgs2();
    mimg.url = file.filename;
    console.log(member);
    const memberFind = await this.memberService.save(member);
    console.log(memberFind);
    if (memberFind == undefined) {
      try {
        unlinkSync(`./uploads/${id}/${file.filename}`);
      } catch (err) {
        console.error(err);
      } finally {
        return;
      }
    }

    const mem = await this.memberService.findByName(member, id);
    console.log(`===${mem}===`);
    await this.imgsService.save(mimg, mem);
    return await this.imgsService.save(mimg, mem);

    //return await this.memberService.save(member);
    //await this.memberService.save(member);
    // const mem = await this.memberService.findByName(member.name);
    // return await this.imgsService.save(file);
  }

  @Get(':id/members')
  findAll(@Param('id') id: number): Promise<Member[]> {
    return this.memberService.findAllByAcct(id);
  }

  @Get('cam/:cid/members')
  async findByCam(@Param('cid') cid: number): Promise<Member[]> {
    return await this.memberService.findAllByCamByAcct(cid);
  }

  @Get(':id/member')
  async findOne(
    @Param('id') id: number,
    @Body() member: Member,
  ): Promise<Member> {
    return await this.memberService.findByName(member, id);
  }

  @Delete('member/:mid')
  remove(@Param('mid') mid: number) {
    this.memberService.remove(mid);
    return `member #${mid} deleted!`;
  }

  @Put('member/:mid')
  update(@Param('mid') mid: number, @Body() member: Member) {
    this.memberService.update(mid, member);
    return `member #${mid} updated!`;
  }
}
