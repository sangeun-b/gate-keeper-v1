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
import { mkdirSync, unlink, unlinkSync } from 'fs';
import { diskStorage } from 'multer';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { AcctService } from 'src/acct/acct.service';
import { MyNewFileInterceptor } from 'src/member/fileInterceptor';
import { Guest } from './entity/guest.entity';
import { GuestService } from './guest.service';
import { v4 as uuid } from 'uuid';
import { GImgs } from 'src/g-imgs/entity/g-imgs.entity';
import { GImgsService } from 'src/g-imgs/g-imgs.service';

@Controller('acct')
export class GuestController {
  constructor(
    private guestService: GuestService,
    private acctService: AcctService,
    private gImgsService: GImgsService,
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
  ) {}
  @Post(':id/guest')
  @UseInterceptors(
    MyNewFileInterceptor('file', (ctx) => {
      return {
        storage: diskStorage({
          destination: (req, file, cb) => {
            const path = `./guests/${req.params.id}`;
            mkdirSync(path, { recursive: true });
            return cb(null, path);
          },
          filename: (_req, file, cb) => {
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            const ext = file.originalname.split('.').pop();
            return cb(null, `${randomName}-${_req.params.id}.${ext}`);
          },
        }),
      };
    }),
  )
  async save(
    @UploadedFile() file,
    @Body() guest: Guest,
    @Param('id') id: number,
  ) {
    const acct = await this.acctService.findOne(id);
    guest.acct = acct;
    if (!file) {
      return await this.guestService.save(guest);
    } else {
      const gimg = new GImgs();
      const bucket = this.firebase.storage.bucket(
        process.env.NEXT_PUBLIC_FIRBASE_STORAGE_BUCKET,
      );
      const uploadedLink = await bucket.upload(file.path, {
        public: true,
        destination: `guests/${id}/${file.filename}`,
        metadata: {
          firebaseStorageDownloadTokens: uuid(),
        },
      });
      gimg.url = file.filename;
      const guestFind = await this.guestService.save(guest);
      // if (guestFind == undefined) {
      //   try {
      //     unlinkSync(`./guests/${id}/${file.filename}`);
      //   } catch (err) {
      //     console.log(err);
      //   } finally {
      //     return 'register failed!';
      //   }
      // }
      const guest2 = await this.guestService.findOne(guestFind.id);
      console.log(`saved guest: ${guest2}`);
      const saveImg = await this.gImgsService.save(gimg, guest2);
      saveImg.url = `https://gate-keeper-v1.herokuapp.com/guest/img/${id}/${saveImg.url}`;
      return guestFind;
    }
  }

  @Get(':aid/guests')
  findAll(@Param('aid') id: number): Promise<Guest[]> {
    return this.guestService.findAllByAcct(id);
  }

  @Get('guest/:gid')
  findOne(@Param('gid') id: number): Promise<Guest> {
    return this.guestService.findOne(id);
  }

  @Delete('guest/:gid')
  async remove(@Param('gid') gid: number) {
    const guestFind = await this.guestService.findOne(gid);
    if (guestFind) {
      this.guestService.remove(gid);
      return `guest #${gid} Deleted!`;
    } else {
      return 'Delete failed';
    }
  }

  @Put('guest/:gid')
  update(@Param('gid') gid: number, @Body() guest: Guest) {
    this.guestService.update(gid, guest);
    return `guest #${gid} updated!`;
  }
}
