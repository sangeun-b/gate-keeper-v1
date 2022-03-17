import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { Payload } from './payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: 'SECERT_KEY',
    });
  }

  async validate(payload: Payload, done: VerifiedCallback): Promise<any> {
    const acct = await this.authService.tokenValidateAcct(payload);
    if (!acct) {
      return done(
        new UnauthorizedException({ message: 'acct does not exist' }),
        false,
      );
    }
    return done(null, acct);
  }
}
