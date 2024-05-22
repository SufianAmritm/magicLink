import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'users', autoIndex: true })
export class UserModel {
  @Prop({ type: String, required: true })
  email: string;
  @Prop({ type: 'string', required: true })
  password: string;
  @Prop({ type: String, required: true })
  oculusId: string;
}
const UserSchema = SchemaFactory.createForClass(UserModel);
UserSchema.index({ email: 1 }, { unique: true });
export { UserSchema };
