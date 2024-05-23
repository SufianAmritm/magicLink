import { Module } from '@nestjs/common';
import { ApiService } from './user.service';
import { ApiController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from './models/user.model';
import { MagicLinkModel, MagicLinkSchema } from './models/magic-link';
import { NodemailerModule } from 'src/nodemailer/nodemailer.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserModel.name, schema: UserSchema },
      { name: MagicLinkModel.name, schema: MagicLinkSchema },
    ]),
    NodemailerModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ApiController],
  providers: [ApiService],
})
export class UserModule {}
