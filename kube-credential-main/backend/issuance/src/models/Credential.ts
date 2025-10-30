import mongoose, { Document, Schema } from 'mongoose';

export interface ICredential extends Document {
  credentialId: string;
  holderName: string;
  issuerName: string;
  credentialType: string;
  issuedDate: Date;
  expiryDate?: Date;
  workerId: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const CredentialSchema: Schema = new Schema(
  {
    credentialId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    holderName: {
      type: String,
      required: true
    },
    issuerName: {
      type: String,
      required: true
    },
    credentialType: {
      type: String,
      required: true
    },
    issuedDate: {
      type: Date,
      default: Date.now
    },
    expiryDate: {
      type: Date
    },
    workerId: {
      type: String,
      required: true
    },
    metadata: {
      type: Schema.Types.Mixed
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ICredential>('Credential', CredentialSchema);
