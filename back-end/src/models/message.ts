import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './user';

export type IMessage = {
  id: string;
  user: IUser;
  message: string;
  timestamp: Date;
};

class MessageModel {
  private schema: Schema<IMessage>;

  constructor() {
    this.schema = new Schema<IMessage>({
      id: {
        type: String,
        required: [true, 'Message ID is required'],
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
      },
      message: {
        type: String,
        required: [true, 'Message content is required'],
        trim: true,
        minlength: [1, 'Message should be at least 1 character long'],
        maxlength: [1000, 'Message should be at most 1000 characters long'],
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    });
  }

  getModel(): Model<IMessage> {
    return mongoose.model<IMessage>('Message', this.schema);
  }
}

const Message = new MessageModel().getModel();
export { Message };
