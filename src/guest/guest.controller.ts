import {
  Body,
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
import { mkdirSync, unlink, unlinkSync } from 'fs';
import { diskStorage } from 'multer';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { AcctService } from 'src/acct/acct.service';
import { MyNewFileInterceptor } from 'src/member/fileInterceptor';
import { Guest } from './entity/guest.entity';
import { GuestService } from './guest.service';
import { v4 as uuid } from 'uuid';

@Controller('acct')
export class GuestController {
  constructor(
    private guestService: GuestService,
    private acctService: AcctService,
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
    guest.img = file.filename;
    const guestFind = await this.guestService.save(guest);
    if (guestFind == undefined) {
      try {
        unlinkSync(`./guests/${id}/${file.filename}`);
      } catch (err) {
        console.log(err);
      } finally {
        return;
      }
    }
    return guestFind;
  }
  @Get(':aid/guests')
  async findAll(@Param('aid') id: number): Promise<Guest[] | undefined> {
    const glist = await this.guestService.findAllByAcct(id);
    for (let i = 0; i < glist.length; i++) {
      glist[
        i
      ].img = `https://gate-keeper-v1.herokuapp.com/acct/${id}/guest/${glist[i].img};`;
    }
    return glist;
  }
  @Get(':aid/guest/:img')
  async getFile(
    @Param('img') img: string,
    @Param('aid') id: number,
    @Response({ passthrough: true }) res,
  ): Promise<StreamableFile> {
    const bucket = this.firebase.storage.bucket(
      process.env.NEXT_PUBLIC_FIRBASE_STORAGE_BUCKET,
    );
    const file = bucket.file(`guests/${id}/${img}`).createReadStream();
    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Disposition': 'filename=' + img,
    });
    return new StreamableFile(file);
  }
  @Get(':id/guest')
  findOne(@Param('id') id: number): Promise<Guest> {
    return this.guestService.findOne(id);
  }
  @Delete(':aid/guest/:id')
  async remove(@Param('id') id: number, @Param('aid') aid: number) {
    const guestFind = await this.guestService.findOne(id);
    if (guestFind) {
      try {
        unlinkSync(`./guests/${aid}/${guestFind.img}`);
      } catch (err) {
        console.log(err);
        return 'Delete failed';
      }
    }
    this.guestService.remove(id);
    return `guest #${id} Deleted!`;
  }
}
