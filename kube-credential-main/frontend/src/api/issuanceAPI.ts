import axios from 'axios';

const ISSUANCE_API_URL = import.meta.env.VITE_ISSUANCE_API_URL || 'http://localhost:3001/api';

export interface CredentialIssueRequest {
  credentialId: string;
  holderName: string;
  issuerName: string;
  credentialType: string;
  expiryDate?: string;
  metadata?: Record<string, any>;
}

export interface CredentialIssueResponse {
  success: boolean;
  message: string;
  data?: {
    credentialId: string;
    holderName: string;
    issuerName: string;
    credentialType: string;
    issuedDate: string;
    expiryDate?: string;
    workerId: string;
    metadata?: Record<string, any>;
  };
  issuedBy?: string;
  issuedAt?: string;
}

export const issueCredential = async (
  credentialData: CredentialIssueRequest
): Promise<CredentialIssueResponse> => {
  try {
    const response = await axios.post(`${ISSUANCE_API_URL}/issue`, credentialData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error('Failed to connect to issuance service');
  }
};
