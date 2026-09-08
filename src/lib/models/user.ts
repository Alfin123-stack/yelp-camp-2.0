import mongoose, { Schema, models, model } from "mongoose";

export interface IUser {
  _id: string;
  email: string;
  username: string;
  password: string;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = models.User || model<IUser>("User", UserSchema);

export default User;
export type UserDocument = mongoose.HydratedDocument<IUser>;
