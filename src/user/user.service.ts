import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel } from './models/user.model';
import { Model } from 'mongoose';
import { MagicLinkModel } from './models/magic-link';
import { NodeMailerService } from 'src/nodemailer/nodemailer.service';

@Injectable()
export class ApiService {
  constructor(
    @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>,
    @InjectModel(MagicLinkModel.name)
    private readonly magicLinkModel: Model<MagicLinkModel>,
    private readonly nodemailer: NodeMailerService,
  ) {}
  async singUp(createUserDto: CreateUserDto) {
    return await this.userModel.create(createUserDto);
  }
  async createMagicLink(email: string) {
    const currentDateTime = new Date().getTime();

    const exists = await this.userModel.findOne({ email: email });
    if (!exists) return 'User does not exists';
    const link = `somelink?identifier=${exists.oculusId}`;

    const magicLink = await this.magicLinkModel.findOne({ user: exists._id });
    let addAttempt = 0;
    if (magicLink) {
      const fiveMinutesAgo = currentDateTime - 5 * 60 * 1000;
      if (magicLink.lastAttemptsTime > fiveMinutesAgo) {
        if (magicLink.lastAttempts >= 3) {
          return `Wait until cooldown ${magicLink.lastAttemptsTime}`;
        }
        addAttempt = 1;
      }
    }
    const sendEmailResponse = await this.nodemailer.sendEmail(
      exists.email,
      '@ArthurSignIn',
      link,
    );

    if (sendEmailResponse && sendEmailResponse.accepted.length > 0) {
      const expiryDate = currentDateTime + 1 * 60 * 1000 + 5000; //?? compensation time for queries or other errors;
      if (magicLink) {
        return await this.magicLinkModel.updateOne(
          { _id: magicLink._id },
          {
            expiry: expiryDate,
            link: link,
            lastAttempts: addAttempt ? magicLink.lastAttempts + 1 : 0,
            lastAttemptsTime: currentDateTime,
            status: 'unused',
          },
        );
      } else {
        return await this.magicLinkModel.create({
          link: link,
          expiry: expiryDate,
          user: exists._id,
        });
      }
    }
    return 'Failed to send an email';
  }

  async loginWithMagic(link: string) {
    const exists = await this.magicLinkModel.findOne({ link: link });
    if (!exists) return 'Invalid link';
    if (exists.expiry <= new Date().getTime()) return 'Link expired';
    if (exists.status === 'used') return 'Invalid link';
    const user = exists.user;
    const token = 'generateTokenIfrequiredwithuserId' + user.toString();
    await this.magicLinkModel.updateOne(
      { _id: exists._id },
      { status: 'used' },
    );
    return token;
  }
}
