import { Schema, model, Document, models, type Model } from 'mongoose'
import { isLength, isEmail, isURL } from 'validator'

export enum AccessRole {
  USER = 'user',
  OWNER = 'owner',
  ADMIN = 'admin',
}

export interface IUser extends Document {
  _id: string
  email: string
  password?: string
  name: string
  role: AccessRole
  avatarURL?: string
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
      validate: [isEmail, 'Incorrect email format'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      validate: [
        (val: string) => isLength(val, { min: 2, max: 50 }),
        'Name should be 2 to 50 characters long',
      ],
    },
    role: {
      type: String,
      required: true,
      enum: Object.values(AccessRole),
      default: AccessRole.USER,
    },
    avatarURL: {
      type: String,
      required: false,
      validate: [(val: string) => isURL(val), 'Invalid URL for avatar'],
    },
  },
  {
    timestamps: true,
  },
)

const User: Model<IUser> = models?.User || model<IUser>('User', userSchema)
export default User
