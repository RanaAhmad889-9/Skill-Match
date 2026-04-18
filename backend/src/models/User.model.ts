import mongoose , { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'USER' | 'ADMIN';

export interface IUser extends Document{
    _id:mongoose.Types.ObjectId,
    name:string,
    email:string,
    password: string,
    role:UserRole,
    skills:string[],
    matchHistory:Array<{
        jobId:mongoose.Types.ObjectId;
        score:number;
        matchedAt:Date;
    }>;
    comparePassword(candidatePassword:string):Promise<boolean>;
};

const UserSchema= new Schema<IUser>({
    name:{type:String, required:true, trim:true},
email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
    },
    skills: [{ type: String, lowercase: true, trim: true }],
    matchHistory: [
      {
        jobId: { type: Schema.Types.ObjectId, ref: 'Job' },
        score: Number,
        matchedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);