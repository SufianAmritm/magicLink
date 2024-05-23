import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ collection: 'links', autoIndex: true })
export class MagicLinkModel {
  @Prop({ type: Number, default: 0 })
  expiry: number;
  @Prop({ type: Types.ObjectId, ref: 'UserModel', required: true })
  user: string;
  @Prop({ type: String, required: true })
  link: string;
  @Prop({ type: Number, default: 0 })
  lastAttempts: number;
  @Prop({ type: Number, default: 0 })
  lastAttemptsTime: number;
  @Prop({ type: String, default: 'unused' })
  status: string;
  @Prop({ type: String, default: null })
  deviceId: string;
}
const MagicLinkSchema = SchemaFactory.createForClass(MagicLinkModel);
MagicLinkSchema.index({ user: 1, deviceId: 1 }, { unique: true });
export { MagicLinkSchema };
