import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { NodeMailerService } from './nodemailer.service';
import { ConfigService } from '@nestjs/config';
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>('MAILER_HOST'),
          port: Number(config.get<string>('MAILER_PORT')),
          auth: {
            user: config.get<string>('MAILER_USER'),
            pass: config.get<string>('MAILER_PASS'),
          },
        },
      }),

      inject: [ConfigService],
    }),
  ],
  providers: [NodeMailerService],
  exports: [NodeMailerService],
})
export class NodemailerModule {}
