import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel } from './models/user.model';
import { Model, Types } from 'mongoose';
import { MagicLinkModel } from './models/magic-link';
import { NodeMailerService } from 'src/nodemailer/nodemailer.service';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { v4 } from 'uuid';
@Injectable()
export class ApiService {
  constructor(
    @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>,
    @InjectModel(MagicLinkModel.name)
    private readonly magicLinkModel: Model<MagicLinkModel>,
    @Inject(JwtService) private readonly jwtService: JwtService,
    private readonly nodemailer: NodeMailerService,
  ) {}
  async singUp(createUserDto: CreateUserDto) {
    return await this.userModel.create(createUserDto);
  }

  async createMagicLinkWithPlainUrlImplementations(
    email: string,
    deviceId: string,
  ) {
    const currentDateTime = new Date().getTime();

    const exists = await this.userModel.findOne({ email: email });
    if (!exists) return 'User does not exists';

    const magicLink = await this.magicLinkModel.findOne({
      user: exists._id,
      deviceId: deviceId,
    });
    let addAttempt = 0;
    if (magicLink) {
      const fiveMinutesAgo = currentDateTime - 5 * 60 * 1000;
      if (magicLink.lastAttemptsTime > fiveMinutesAgo) {
        // to prevent multiple requests attacks
        if (magicLink.lastAttempts >= 3) {
          return `Wait until cooldown ${magicLink.lastAttemptsTime}`;
        }
        addAttempt = 1;
      }
    }
    //using only device id as an identifier might not be the best idea. so we add a uuid for link. Creating a new link automatically invalidates previous ones, thus maintaining integrity.

    const uuid = v4();
    const link = `somelink?identifier=${deviceId}&id=${uuid}`;

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
          status: 'unused',
          deviceId: deviceId,
        });
      }
    }
    return 'Failed to send an email';
  }

  // Simple login with magic link
  async loginWithMagicPlainUrl(link: string) {
    const exists = await this.magicLinkModel.findOne({
      link: link,
      status: 'unused',
    });
    if (!exists) return 'Invalid link';
    if (exists.expiry <= new Date().getTime()) return 'Link expired';
    const user = exists.user;

    //Return token if main screen is our target!
    const token = 'generateTokenIfrequiredwithuserId' + user.toString();

    //
    //
    //
    //Or else throw an event here without any token,frontend must listen for that event, which might include a device Id, as a target.
    //
    //

    await this.magicLinkModel.updateMany(
      { user: exists.user, status: 'unused' },
      { status: 'used' },
    );
    return token;
  }

  //Magic Link with jwts
  async createMagicLinkWithJWTImplementations(email: string, deviceId: string) {
    const currentDateTime = new Date().getTime();

    const exists = await this.userModel.findOne({ email: email });
    if (!exists) return 'User does not exists';

    const magicLink = await this.magicLinkModel.findOne({
      user: exists._id,
      deviceId: deviceId,
    });
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
    const jwt = this.jwtService.sign(
      {
        deviceId: deviceId,
        userId: exists.id,
      },
      {
        expiresIn: 125,
      },
    );
    const link = `somelink?identifier=${deviceId}&token=${jwt}`;

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
            // we don't need expiry here, jwt will expire automatically

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
          status: 'unused',
          deviceId: deviceId,
        });
      }
    }
    return 'Failed to send an email';
  }

  //Login with JWT
  async loginMagicUrlWithToken(token: string) {
    try {
      const tokenDecoded = this.jwtService.verify(token);

      // get the latest link
      const { userId, deviceId } = tokenDecoded;
      const exists = await this.magicLinkModel.findOne({
        user: Types.ObjectId.createFromHexString(userId),
        deviceId: deviceId,
      });
      if (!exists) return 'Invalid link';
      if (exists.status === 'used') return 'Invalid link';
      const user = exists.user;

      //Return token if main screen is our target!
      const returntoken = 'generateTokenIfrequiredwithuserId' + user.toString();

      //
      //
      //
      //Or else throw an event here without any token,frontend must listen for that event, which might include a device Id, as a target.
      //
      //

      await this.magicLinkModel.updateMany(
        { user: exists.user, status: 'unused' },
        { status: 'used' },
      );
      return returntoken;
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        return 'Link expired';
      } else {
        return 'Unable to login. Something went wrong';
      }
    }
  }
}
