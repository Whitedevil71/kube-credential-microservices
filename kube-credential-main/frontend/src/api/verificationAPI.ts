import axios from 'axios';

const VERIFICATION_API_URL = import.meta.env.VITE_VERIFICATION_API_URL || 'http://localhost:3002/api';

export interface CredentialVerifyRequest {
  credentialId: string;
}

export interface CredentialVerifyResponse {
  success: boolean;
  verified: boolean;
  message: string;
  data?: {
    credentialId: string;
    holderName: string;
    issuerName: string;
    credentialType: string;
    issuedDate: string;
    expiryDate?: string;
    issuedBy: string;
    verifiedBy: string;
    isExpired: boolean;
    metadata?: Record<string, any>;
  };
  verifiedBy?: string;
  timestamp: string;
}

export const verifyCredential = async (
  credentialId: string
): Promise<CredentialVerifyResponse> => {
  try {
    const response = await axios.post(`${VERIFICATION_API_URL}/verify`, { credentialId });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error('Failed to connect to verification service');
  }
};
