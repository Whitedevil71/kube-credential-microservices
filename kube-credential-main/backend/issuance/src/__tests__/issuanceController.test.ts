import { issueCredential } from '../controllers/issuanceController';

// Mock the Credential model
jest.mock('../models/Credential', () => {
  const mockFn: any = jest.fn(function (this: any, data: any) {
    Object.assign(this, data);
    this.save = jest.fn().mockResolvedValue(undefined);
  });
  mockFn.findOne = jest.fn();
  return { __esModule: true, default: mockFn };
});

import Credential from '../models/Credential';

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('issueCredential', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.WORKER_ID = 'worker-test-1';
  });

  it('should issue a new credential and return 201', async () => {
    (Credential as any).findOne.mockResolvedValue(null);

    const req: any = {
      body: {
        credentialId: 'TEST-1',
        holderName: 'Alice',
        issuerName: 'Org',
        credentialType: 'Degree'
      }
    };
    const res = mockRes();
    const next = jest.fn();

    await issueCredential(req, res, next);

    expect((Credential as any).findOne).toHaveBeenCalledWith({ credentialId: 'TEST-1' });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: expect.stringContaining('worker-test-1')
      })
    );
  });

  it('should return 409 if credential already exists', async () => {
    (Credential as any).findOne.mockResolvedValue({
      credentialId: 'TEST-1',
      workerId: 'worker-old',
      createdAt: new Date().toISOString()
    });

    const req: any = {
      body: {
        credentialId: 'TEST-1',
        holderName: 'Alice',
        issuerName: 'Org',
        credentialType: 'Degree'
      }
    };
    const res = mockRes();
    const next = jest.fn();

    await issueCredential(req, res, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.stringContaining('already exists')
      })
    );
  });
});
