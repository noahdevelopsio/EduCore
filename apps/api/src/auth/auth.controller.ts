import { Controller, Post, Body, Req, Res, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() body: any, @Res({ passthrough: true }) res: Response) {
        const { emailOrPhone, password } = body;
        const { accessToken, refreshToken, user } = await this.authService.login(emailOrPhone, password);

        // Set HTTP-only cookie for refresh token
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        return {
            success: true,
            data: { accessToken, user },
            message: 'Login successful'
        };
    }

    @UseGuards(AuthGuard('jwt-refresh'))
    @Post('refresh')
    async refreshTokens(@Req() req: any, @Res({ passthrough: true }) res: Response) {
        const userId = req.user.userId;
        const schoolId = req.user.schoolId;
        const role = req.user.role;

        const { accessToken, refreshToken } = await this.authService.refreshTokens(userId, schoolId, role);

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        return {
            success: true,
            data: { accessToken },
            message: 'Tokens refreshed'
        };
    }

    @Post('logout')
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('refresh_token');
        return {
            success: true,
            data: null,
            message: 'Logged out successfully'
        };
    }
}
