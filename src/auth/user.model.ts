// user.model.ts
import { Schema, model, Document, Model } from 'mongoose';

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  comparePassword(password: string): boolean;
}

export interface UserModel extends Model<User> {
  findByUsername(username: string): Promise<User | null>;
}

const userSchema = new Schema<User>({
  username: String,
  email: { type: String, unique: true },
  password: String,
});

// Metode statis untuk mencari user berdasarkan username
userSchema.statics.findByUsername = function (
  this: UserModel,
  username: string,
): Promise<User | null> {
  return this.findOne({ username }).exec();
};

// Metode untuk membandingkan password
userSchema.methods.comparePassword = function (
  this: User,
  password: string,
): boolean {
  return this.password === password;
};

export const User = model<User, UserModel>('User', userSchema);
