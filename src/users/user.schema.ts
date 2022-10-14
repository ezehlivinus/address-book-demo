import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

export enum Roles {
  USER = 'USER',
  ADMIN = 'ADMIN'
}
type UserStatics = {
  hashPassword(password: string): Promise<string>;
};

type UserMethods = {
  comparePassword(password: string): Promise<boolean>;
};

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      return ret;
    }
  }
})
export class User {
  _id: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: Roles, default: Roles.USER })
  role: Roles;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.comparePassword = async function compare(password: string) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = async function hashPassword(
  password: string
) {
  const saltOrRounds = 10;
  const hash = await bcrypt.hash(password, saltOrRounds);
  return hash;
};

UserSchema.pre('save', async function preSave(next) {
  if (this.isModified('password') || this.isNew) {
    const saltOrRounds = 10;
    this.password = await bcrypt.hash(this.password, saltOrRounds);
  }
  next();
});

export type UserDocument = User & Document & UserMethods;

export type UserModel = Model<UserDocument> & UserStatics;
