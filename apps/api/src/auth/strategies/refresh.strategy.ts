import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    let token = null;
                    if (request && request.cookies) {
                        token = request.cookies['refresh_token'];
                    }
                    return token;
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret',
        });
    }

    async validate(payload: any) {
        if (!payload.sub) {
            throw new UnauthorizedException('Invalid refresh token.');
        }
        return { userId: payload.sub, schoolId: payload.schoolId, role: payload.role };
    }
}
