import { Schema, model, Document, Model } from 'mongoose';

import { handleSaveError, setUpdateSettings } from './hooks.js';

export interface ISession extends Document {
  userId: Schema.Types.ObjectId;
  accessToken: string;
  refreshToken: string;
  accessTokenValidUntil: Date;
  refreshTokenValidUntil: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    accessTokenValidUntil: {
      type: Date,
      required: true,
    },
    refreshTokenValidUntil: {
      type: Date,
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

sessionSchema.post('save', handleSaveError);
sessionSchema.pre('findOneAndUpdate', setUpdateSettings);
sessionSchema.post('findOneAndUpdate', handleSaveError);

const SessionCollection: Model<ISession> = model<ISession>(
  'session',
  sessionSchema,
);

export default SessionCollection;
