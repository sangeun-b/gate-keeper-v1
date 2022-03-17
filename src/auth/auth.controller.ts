import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AcctDTO } from '../acct/dto/acct.dto';
import { AuthGuard } from './security/auth.guard';
import { Acct } from 'src/acct/entity/acct.entity';
import { CamService } from 'src/cam/cam.service';
import { Cam } from 'src/cam/entity/cam.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private camService: CamService,
  ) {}

  @Post('/register')
  async registerAccount(@Req() req: Request, @Body() acct: Acct): Promise<any> {
    const cam = new Cam();
    cam.addr = acct.addr;
    const findCam = await this.camService.findByAddr(cam);
    acct.cam = findCam;

    return await this.authService.registerAcct(acct);
  }

  @Post('/login')
  async login(@Body() acct: Acct, @Res() res: Response): Promise<any> {
    const jwt = await this.authService.validateAcct(acct);
    res.setHeader('Authorization', 'Bearer ' + jwt.accessToken);
    return res.json(jwt);
  }

  @Get('/authenticate')
  @UseGuards(AuthGuard) //사용자 정보 가지고옴
  isAuthenticated(@Req() req: Request): any {
    const acct: any = req.user;
    return acct;
  }
}
