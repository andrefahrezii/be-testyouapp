import { Schema, model, Document, Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

export interface Profile {
  name: string;
  birthday: number;
  horoscope: string;
  height: number;
  weight: number;
  interests: string[];
  photoprofile?: string;
  galery?: string[];
}

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  profile?: Profile | null;
  comparePassword(password: string): Promise<boolean>;
}

export interface UserModel extends Model<User> {
  findByUsername(username: string): Promise<User | null>;
}

const userSchema = new Schema<User>({
  username: String,
  email: { type: String, unique: true, sparse: true },
  password: String,
  profile: {
    type: {
      name: String,
      birthday: Number,
      height: Number,
      weight: Number,
      interests: [String],
      photoprofile: String,
      galery: [String],
    },
    default: null,
  },
});

userSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { email: { $exists: true } } },
);

userSchema.statics.findByUsername = function (
  this: UserModel,
  username: string,
): Promise<User | null> {
  return this.findOne({ username }).exec();
};

userSchema.methods.comparePassword = async function (
  this: User,
  password: string,
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

export const User = model<User, UserModel>('User', userSchema);
