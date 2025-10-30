import { Request, Response, NextFunction } from 'express';
import Credential from '../models/Credential';

const getWorkerId = () => process.env.WORKER_ID || 'worker-1';

export const issueCredential = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { credentialId, holderName, issuerName, credentialType, expiryDate, metadata } = req.body;

    if (!credentialId || !holderName || !issuerName || !credentialType) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: credentialId, holderName, issuerName, credentialType'
      });
      return;
    }

    const existingCredential = await Credential.findOne({ credentialId });

    if (existingCredential) {
      res.status(409).json({
        success: false,
        message: `Credential with ID ${credentialId} already exists`,
        issuedBy: existingCredential.workerId,
        issuedAt: existingCredential.createdAt
      });
      return;
    }

    const newCredential = new Credential({
      credentialId,
      holderName,
      issuerName,
      credentialType,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      workerId: getWorkerId(),
      metadata
    });

    await newCredential.save();

    res.status(201).json({
      success: true,
      message: `Credential issued by ${getWorkerId()}`,
      data: {
        credentialId: newCredential.credentialId,
        holderName: newCredential.holderName,
        issuerName: newCredential.issuerName,
        credentialType: newCredential.credentialType,
        issuedDate: newCredential.issuedDate,
        expiryDate: newCredential.expiryDate,
        workerId: newCredential.workerId,
        metadata: newCredential.metadata
      }
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
    message: 'Issuance service is healthy',
    workerId: getWorkerId(),
    timestamp: new Date().toISOString()
  });
};
