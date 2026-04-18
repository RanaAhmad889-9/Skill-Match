import mongoose , {Document, Schema} from 'mongoose';

export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
export type JobStatus = 'Active' | 'Draft' | 'Closed';

export interface IJob extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  company: string;
  description: string;
  location: string;
  type: JobType;
  status: JobStatus;
  salary: string;
  requiredSkills: string[];
  createdBy: mongoose.Types.ObjectId;
  applicantCount: number;
}

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    location: { type: String, default: 'Remote' },
    type: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Remote'],
      default: 'Full-time',
    },
    status: {
      type: String,
      enum: ['Active', 'Draft', 'Closed'],
      default: 'Active',
    },
    salary: { type: String, default: '' },
    requiredSkills: [{ type: String, lowercase: true, trim: true }],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    applicantCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

JobSchema.index({ requiredSkills: 1 });
JobSchema.index({ status: 1 });
JobSchema.index({ title: 'text', description: 'text' });

export const Job = mongoose.model<IJob>('Job', JobSchema);