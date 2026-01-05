import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    NestJwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const expiresIn = configService.get<string>('JWT_EXPIRES_IN', '7d');
        return {
          secret: configService.get<string>('JWT_SECRET', 'your-secret-key'),
          signOptions: {
            expiresIn: expiresIn as any, // JWT accepts string like '7d', '1h', etc.
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [JwtStrategy, JwtAuthGuard],
  exports: [NestJwtModule, PassportModule, JwtAuthGuard],
})
export class JwtModule {}

