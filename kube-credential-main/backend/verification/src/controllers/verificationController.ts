import { Request, Response, NextFunction } from 'express';
import Credential from '../models/Credential';

const getWorkerId = () => process.env.WORKER_ID || 'worker-1';

export const verifyCredential = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { credentialId } = req.body;

    if (!credentialId) {
      res.status(400).json({
        success: false,
        message: 'Missing required field: credentialId'
      });
      return;
    }

    const credential = await Credential.findOne({ credentialId });

    if (!credential) {
      res.status(404).json({
        success: false,
        message: `Credential with ID ${credentialId} not found`,
        verified: false,
        verifiedBy: getWorkerId(),
        timestamp: new Date().toISOString()
      });
      return;
    }

    const isExpired = credential.expiryDate && new Date() > new Date(credential.expiryDate);

    res.status(200).json({
      success: true,
      verified: true,
      message: isExpired
        ? 'Credential found but has expired'
        : 'Credential verified successfully',
      data: {
        credentialId: credential.credentialId,
        holderName: credential.holderName,
        issuerName: credential.issuerName,
        credentialType: credential.credentialType,
        issuedDate: credential.issuedDate,
        expiryDate: credential.expiryDate,
        issuedBy: credential.workerId,
        verifiedBy: getWorkerId(),
        isExpired,
        metadata: credential.metadata
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

export const healthCheck = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.status(200).json({
    success: true,
    message: 'Verification service is healthy',
    workerId: getWorkerId(),
    timestamp: new Date().toISOString()
  });
};
