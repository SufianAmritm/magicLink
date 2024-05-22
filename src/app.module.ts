import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { NodemailerModule } from './nodemailer/nodemailer.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<MongooseModuleOptions> => {
        const uri = configService.get<string>('DATABASE_URI');
        if (!uri) {
          throw new Error('No db url');
        }
        try {
          await mongoose.connect(uri);
          return {
            uri,
          };
        } catch (error) {
          throw new Error(`Failed to connect to MongoDB: ${error.message}`);
        }
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    NodemailerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
