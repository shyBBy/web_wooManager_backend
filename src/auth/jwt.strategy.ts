import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifiedCallback } from 'passport-jwt';
import { UserService } from '../user/user.service';

export interface JwtPayload {
  email: string;
}

function cookieExtractor(req: any): null | string {
  return req && req.cookies ? req.cookies?.jwt ?? null : null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload, done: VerifiedCallback) {
    const user = await this.userService.getByEmail(payload.email);
    if (!user) {
      return done(new UnauthorizedException(), false);
    }
    return done(null, user);
  }
}
