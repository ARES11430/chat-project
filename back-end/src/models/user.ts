import mongoose, { Schema, Document, Model } from 'mongoose';
import jwt from 'jsonwebtoken';

// Environment configuration
const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

export interface IUser extends Document {
  name: string;
  lastName: string;
  userName: string;
  password: string;
  refreshToken?: string;
  generateAuthToken(): string;
  generateRefreshToken(): string;
}

class UserModel {
  private schema: Schema<IUser>;

  constructor() {
    this.schema = new Schema<IUser>(
      {
        name: {
          type: String,
          trim: true,
          required: [true, 'property name is required'],
          minlength: [3, 'property name should be at least 3 characters'],
          maxlength: [55, 'property name should be at most 55 characters'],
        },
        lastName: {
          type: String,
          trim: true,
          required: [true, 'property lastName is required'],
          minlength: [3, 'property lastName should be at least 3 characters'],
          maxlength: [55, 'property lastName should be at most 55 characters'],
        },
        userName: {
          type: String,
          trim: true,
          required: [true, 'property userName is required'],
          unique: true,
        },
        password: {
          type: String,
          trim: true,
          required: [true, 'property password is required'],
          minlength: [6, 'property password should be at least 6 characters'],
          maxlength: [
            1024,
            'property password should be at most 1024 characters',
          ],
        },
        refreshToken: {
          type: String,
        },
      },
      { timestamps: true }
    );

    // Attach methods to the schema
    this.schema.methods.generateAuthToken = this.generateAuthToken;
    this.schema.methods.generateRefreshToken = this.generateRefreshToken;
  }

  // Methods to be used on Mongoose documents
  generateAuthToken(this: IUser) {
    if (JWT_SECRET) {
      return jwt.sign({ _id: this._id, userName: this.userName }, JWT_SECRET, {
        expiresIn: '10m',
      });
    } else {
      throw new Error('Invalid Token Secret');
    }
  }

  generateRefreshToken(this: IUser) {
    if (REFRESH_SECRET) {
      return jwt.sign({ _id: this._id }, REFRESH_SECRET);
    } else {
      throw new Error('Invalid Refresh Token Secret');
    }
  }

  getModel(): Model<IUser> {
    return mongoose.model<IUser>('User', this.schema);
  }
}

const User = new UserModel().getModel();
export { User };
