import { verifyCredential } from '../controllers/verificationController';

// Mock the Credential model
jest.mock('../models/Credential', () => {
  const mockModel: any = {};
  mockModel.findOne = jest.fn();
  return { __esModule: true, default: mockModel };
});

import Credential from '../models/Credential';

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('verifyCredential', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.WORKER_ID = 'worker-test-2';
  });

  it('should return 404 if credential not found', async () => {
    (Credential as any).findOne.mockResolvedValue(null);

    const req: any = { body: { credentialId: 'MISSING' } };
    const res = mockRes();
    const next = jest.fn();

    await verifyCredential(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, verified: false })
    );
  });

  it('should verify credential and return 200', async () => {
    const cred = {
      credentialId: 'TEST-2',
      holderName: 'Bob',
      issuerName: 'Org',
      credentialType: 'Certificate',
      issuedDate: new Date().toISOString(),
      expiryDate: undefined,
      workerId: 'worker-any',
      metadata: {}
    };
    (Credential as any).findOne.mockResolvedValue(cred);

    const req: any = { body: { credentialId: 'TEST-2' } };
    const res = mockRes();
    const next = jest.fn();

    await verifyCredential(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, verified: true })
    );
  });
});
