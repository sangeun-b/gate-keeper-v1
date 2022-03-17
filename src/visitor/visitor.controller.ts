import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CamService } from 'src/cam/cam.service';
import { ImgsService } from 'src/Imgs2/imgs2.service';
import { MyNewFileInterceptor } from 'src/member/fileInterceptor';
import { MemberService } from 'src/member/member.service';
import { VisitorDTO } from './dto/visitor.dto';
import { Visitor } from './entity/visitor.entity';
import { VisitorService } from './visitor.service';

@Controller('cam')
export class VisitorController {
  constructor(
    private visitorService: VisitorService,
    private camService: CamService,
    private imgService: ImgsService,
    private memService: MemberService,
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
      console.log(`====${findMem.name}`);
      console.log(`==${visitor.name}`);
      visitor.img = file.filename;
    }
    return await this.visitorService.save(visitor);
  }

  @Get(':id/visitor')
  async findByDate(
    @Param('id') id: number,
    @Body() visitor: Visitor,
  ): Promise<Visitor[] | undefined> {
    return await this.visitorService.findByDate(visitor, id);
  }
  @Get(':id/visitors')
  async findAll(@Param('id') id: number): Promise<Visitor[] | undefined> {
    return await this.visitorService.findAllVisitor(id);
  }
}
