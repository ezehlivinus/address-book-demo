import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Model, ObjectId } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
})
export class Contact {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: string;

  @Prop({
    ref: 'User',
    autopopulate: true,
    default: null,
    type: mongoose.Schema.Types.ObjectId
  })
  owner: mongoose.Schema.Types.ObjectId;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);

export type ContactDocument = Contact & Document;

export type ContactModel = Model<ContactDocument>;
