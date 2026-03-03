import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET || 'fallback_secret',
    });
  }

  async validate(payload: any) {
    // Validate that the user exists and isn't deleted
    const user = await this.prisma.user.findFirst({
      where: {
        id: payload.sub,
        schoolId: payload.schoolId,
        deletedAt: null,
      },
      select: { id: true, role: true, schoolId: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid or expired token.');
    }

    // Attach to the request object
    return { 
      userId: user.id, 
      schoolId: user.schoolId, 
      role: user.role 
    };
  }
}
