import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AcctService } from '../acct/acct.service';
import { AcctDTO } from '../acct/dto/acct.dto';
import * as bcrypt from 'bcrypt';
import { Payload } from './security/payload.interface';
import { Acct } from '../acct/entity/acct.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private acctService: AcctService,
    private jwtService: JwtService,
  ) {}

  async registerAcct(newAcct: Acct): Promise<Acct> {
    const acctFind: Acct = await this.acctService.findByFields({
      where: { acct_id: newAcct.acct_id },
    });
    if (acctFind) {
      throw new HttpException(
        'Account Id already used!',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.acctService.save(newAcct);
  }

  async validateAcct(
    acctDTO: Acct,
  ): Promise<{ accessToken: string } | undefined> {
    const acctFind: Acct = await this.acctService.findByFields({
      where: { acct_id: acctDTO.acct_id },
    });
    const valiPassword = await bcrypt.compare(acctDTO.pwd, acctFind.pwd);
    if (!acctFind || !valiPassword) {
      throw new UnauthorizedException();
    }
    const payload: Payload = { id: acctFind.id, acct_id: acctFind.acct_id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
  async tokenValidateAcct(payload: Payload): Promise<Acct | undefined> {
    return await this.acctService.findByFields({
      where: { id: payload.id },
    });
  }
}
