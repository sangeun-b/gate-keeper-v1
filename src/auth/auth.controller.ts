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
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Acct register&login API')
export class AuthController {
  constructor(
    private authService: AuthService,
    private camService: CamService,
  ) {}

  @Post('/register')
  @ApiOperation({
    summary: 'Acct 생성',
    description: 'Acct 생성',
  })
  @ApiCreatedResponse({ description: 'Acct 생성', type: Acct })
  async registerAccount(@Req() req: Request, @Body() acct: Acct): Promise<any> {
    const cam = new Cam();
    const addr2 = acct.addr.split('동');
    const addr3 = addr2[0] + '동';
    console.log(`===${addr2}`);
    console.log(`!!!${addr3}`);
    cam.addr = addr3;
    console.log(`@@@${addr3}`);
    const findCam = await this.camService.findByAddr(cam);
    acct.cam = findCam;
    console.log(findCam);

    return await this.authService.registerAcct(acct);
  }

  @Post('/login')
  @ApiOperation({
    summary: '로그인',
    description: '로그인',
  })
  @ApiCreatedResponse({ description: '로그인', type: Acct })
  async login(@Body() acct: Acct, @Res() res: Response): Promise<any> {
    const jwt = await this.authService.validateAcct(acct);
    res.setHeader('Authorization', 'Bearer ' + jwt.accessToken);
    return res.json(jwt);
  }

  @Get('/authenticate')
  @ApiOperation({
    summary: 'Acct 조회(Token)',
    description: 'token이용하여 Acct 정보 조회',
  })
  @ApiCreatedResponse({
    description: 'token이용하여 Acct 정보 조회',
    type: Acct,
  })
  @UseGuards(AuthGuard) //응답할때 pwd 삭제?
  isAuthenticated(@Req() req: Request): any {
    const acct: any = req.user;
    return acct;
  }
}
