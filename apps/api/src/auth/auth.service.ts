import { Injectable, UnauthorizedException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async login(emailOrPhone: string, pass: string) {
        // Attempt to find by email
        let user = await this.prisma.user.findFirst({
            where: { email: emailOrPhone, deletedAt: null },
        });

        // If not found, fallback to phone
        if (!user) {
            user = await this.prisma.user.findFirst({
                where: { phone: emailOrPhone, deletedAt: null },
            });
        }

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(pass, user.passwordHash);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: user.id, schoolId: user.schoolId, role: user.role };
        const accessToken = this.jwtService.sign(payload);

        // Refresh token generation
        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret',
            expiresIn: '30d',
        });

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                role: user.role,
                schoolId: user.schoolId,
            }
        };
    }

    async refreshTokens(userId: string, schoolId: string, role: Role) {
        const user = await this.prisma.user.findFirst({
            where: { id: userId, schoolId, deletedAt: null }
        });

        if (!user) throw new ForbiddenException('Access denied');

        const payload = { sub: user.id, schoolId: user.schoolId, role: user.role };

        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret',
            expiresIn: '30d',
        });

        return { accessToken, refreshToken };
    }
}
