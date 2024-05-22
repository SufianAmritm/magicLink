import { Module } from '@nestjs/common';
import { ApiService } from './user.service';
import { ApiController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from './models/user.model';
import { MagicLinkModel, MagicLinkSchema } from './models/magic-link';
import { NodemailerModule } from 'src/nodemailer/nodemailer.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserModel.name, schema: UserSchema },
      { name: MagicLinkModel.name, schema: MagicLinkSchema },
    ]),
    NodemailerModule,
  ],
  controllers: [ApiController],
  providers: [ApiService],
})
export class UserModule {}
