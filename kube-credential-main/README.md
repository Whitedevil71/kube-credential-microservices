# Kube Credential System

[![Keep Render services warm](https://github.com/dwdjitendra-cloud/kube-credential/actions/workflows/keep-alive.yml/badge.svg)](https://github.com/dwdjitendra-cloud/kube-credential/actions/workflows/keep-alive.yml)

A complete microservices-based credential issuance and verification system built with Node.js, TypeScript, MongoDB Atlas, Docker, and Kubernetes. This system demonstrates production-grade microservices architecture with containerization and orchestration capabilities.

## Live URLs

- Frontend (Project URL): https://kube-credential-chi-pied.vercel.app
- Issuance API (Backend): https://kube-credential-4255.onrender.com/api
- Verification API (Backend): https://kube-credential-verification-backend.onrender.com/api

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Local Development](#local-development)
- [Running with Docker Compose](#running-with-docker-compose)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Deploy: Render (Backend) + Vercel (Frontend)](#deploy-render-backend--vercel-frontend)
- [API Documentation](#api-documentation)
- [Testing](#testing)
 - [AWS Deployment Strategy](#aws-deployment-strategy)
- [Screenshots](#screenshots)

## Architecture Overview

The Kube Credential system follows a microservices architecture with the following components:

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│                    Port: 5173 (dev) / 80                    │
└────────────┬───────────────────────────┬────────────────────┘
             │                           │
             │                           │
             ▼                           ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│  Issuance Service        │  │  Verification Service    │
│  (Node.js + Express)     │  │  (Node.js + Express)     │
│  Port: 3001              │  │  Port: 3002              │
│  Worker ID: worker-1     │  │  Worker ID: worker-1     │
└──────────┬───────────────┘  └──────────┬───────────────┘
           │                              │
           └──────────────┬───────────────┘
                          │
                          ▼
                ┌──────────────────┐
                │  MongoDB Atlas   │
                │   (Cloud DB)     │
                └──────────────────┘
```

### Microservices

1. **Issuance Service** (Port 3001)
   - Issues new credentials
   - Validates uniqueness
   - Returns worker ID with each issuance
   - Stores credentials in MongoDB

2. **Verification Service** (Port 3002)
   - Verifies credential existence
   - Checks expiry status
   - Returns issuance and verification worker IDs
   - Retrieves credential details

3. **Frontend Application** (Port 5173/80)
   - React + TypeScript + Tailwind CSS
   - Two main pages: Issue and Verify
   - Clean, responsive UI with real-time feedback
   - Displays worker information

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, TypeScript, Tailwind CSS, Vite, Axios |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB Atlas (Free Tier) |
| ORM | Mongoose |
| Containerization | Docker |
| Orchestration | Kubernetes |
| Testing | Jest |
| Version Control | Git/GitHub |

## Folder Structure

```
kube-credential/
├── backend/
│   ├── issuance/
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   │   └── issuanceController.ts
│   │   │   ├── models/
│   │   │   │   └── Credential.ts
│   │   │   ├── routes/
│   │   │   │   └── issuanceRoutes.ts
│   │   │   ├── utils/
│   │   │   │   └── db.ts
│   │   │   ├── middlewares/
│   │   │   │   └── errorHandler.ts
│   │   │   └── index.ts
│   │   ├── Dockerfile
│   │   ├── jest.config.js
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── verification/
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   │   └── verificationController.ts
│   │   │   ├── models/
│   │   │   │   └── Credential.ts
│   │   │   ├── routes/
│   │   │   │   └── verificationRoutes.ts
│   │   │   ├── utils/
│   │   │   │   └── db.ts
│   │   │   ├── middlewares/
│   │   │   │   └── errorHandler.ts
│   │   │   └── index.ts
│   │   ├── Dockerfile
│   │   ├── jest.config.js
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── kubernetes/
│       ├── issuance-deployment.yaml
│       ├── verification-deployment.yaml
│       ├── issuance-service.yaml
│       ├── verification-service.yaml
│       ├── ingress.yaml
│       └── secrets.yaml
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── IssuePage.tsx
│   │   │   └── VerifyPage.tsx
│   │   ├── components/
│   │   │   ├── Form.tsx
│   │   │   └── ResultCard.tsx
│   │   ├── api/
│   │   │   ├── issuanceAPI.ts
│   │   │   └── verificationAPI.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
│
├── docker-compose.yaml
├── README.md
└── .gitignore
```

## Prerequisites

- **Node.js** (v18+)
- **npm** or **yarn**
- **Docker** (for containerization)
- **Docker Compose** (for local multi-container setup)
- **Kubernetes** (kubectl and a cluster - Minikube, AWS EKS, etc.)
- **MongoDB Atlas Account** (Free tier)

## Environment Setup

### 1. MongoDB Atlas Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (M0 Free tier)
3. Create a database user with read/write permissions
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string

### 2. Environment Variables

Create `.env` files in each service directory:

#### Backend Issuance Service (backend/issuance/.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kube-credential?retryWrites=true&w=majority
PORT=3001
WORKER_ID=worker-issuance-1
NODE_ENV=development
```

#### Backend Verification Service (backend/verification/.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kube-credential?retryWrites=true&w=majority
PORT=3002
WORKER_ID=worker-verification-1
NODE_ENV=development
```

#### Frontend (frontend/.env)
```env
VITE_ISSUANCE_API_URL=http://localhost:3001/api
VITE_VERIFICATION_API_URL=http://localhost:3002/api
```

#### Root Directory (.env for Docker Compose)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kube-credential?retryWrites=true&w=majority
```

## Local Development

### Running Each Service Separately

If you're on Windows (PowerShell), you can run these in three separate terminals. The frontend will be available at http://localhost:5173.

#### 1. Issuance Service
```powershell
cd backend/issuance
npm install
npm run dev
```
Service runs on `http://localhost:3001`

#### 2. Verification Service
```powershell
cd backend/verification
npm install
npm run dev
```
Service runs on `http://localhost:3002`

#### 3. Frontend
```powershell
cd frontend
npm install
npm run dev
```
Application runs on `http://localhost:5173`

## Deploy: Render (Backend) + Vercel (Frontend)

This project is ready to deploy without a credit card using:
- Backends on Render (free web services)
- Frontend on Vercel (free)

### 1) Prepare your repository
- Push your project to GitHub.
- Ensure your MongoDB Atlas URI is available (free tier).

### 2) Deploy Issuance Backend on Render
1. Go to https://render.com and sign up with GitHub.
2. New → Web Service → Select your repo → Root Directory: `backend/issuance`
3. Environment: Node
4. Build Command: `npm ci && npm run build`
5. Start Command: `npm start`
6. Environment Variables:
   - `MONGODB_URI` = your Atlas connection string
   - `WORKER_ID` = `worker-issuance-1`
   - `NODE_ENV` = `production`
   - `NPM_CONFIG_PRODUCTION` = `false` (to install devDependencies for TypeScript build)
7. Create Web Service → wait for deploy. Note the URL, e.g. `https://issuance-service.onrender.com`.

Health check:
```powershell
Invoke-RestMethod -Method GET "https://<your-issuance>.onrender.com/api/health"
```

### 3) Deploy Verification Backend on Render
Repeat step 2 with `Root Directory: backend/verification` and `WORKER_ID=worker-verification-1`.

Test:
```powershell
Invoke-RestMethod -Method GET "https://<your-verification>.onrender.com/api/health"
```

Optional flow test:
```powershell
# Issue
Invoke-RestMethod -Uri "https://<your-issuance>.onrender.com/api/issue" -Method POST -Body (@{
  credentialId="CRED-2025-001"; holderName="Jitendra"; issuerName="IIEST Shibpur"; credentialType="Certificate"
} | ConvertTo-Json) -ContentType "application/json"

# Verify
Invoke-RestMethod -Uri "https://<your-verification>.onrender.com/api/verify" -Method POST -Body (@{
  credentialId="CRED-2025-001"
} | ConvertTo-Json) -ContentType "application/json"
```

### 4) Deploy Frontend on Vercel
1. Go to https://vercel.com and sign in with GitHub.
2. New Project → Import your repo → Root Directory: `frontend` → Framework: Vite.
3. Build Command: `npm ci && npm run build` (or Vercel auto-detect)
4. Output Directory: `dist`
5. Environment Variables:
  - `VITE_ISSUANCE_API_URL` = `https://kube-credential-4255.onrender.com/api`
  - `VITE_VERIFICATION_API_URL` = `https://kube-credential-verification-backend.onrender.com/api`
6. Deploy → get a URL like `https://your-app.vercel.app`.

If you later change backend URLs, update env vars in Vercel and redeploy.

### Quickstart (One-liners in PowerShell)

Run each of the following in its own PowerShell window/tab:

```powershell
npm run dev --prefix .\backend\issuance
```

```powershell
npm run dev --prefix .\backend\verification
```

```powershell
npm run dev --prefix .\frontend
```

Then open the app at: http://localhost:5173

## Running with Docker Compose

The easiest way to run the entire system locally:

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f
```

Access the application:
- Frontend: `http://localhost`
- Issuance Service: `http://localhost:3001`
- Verification Service: `http://localhost:3002`

Note: If Docker Desktop is not available, you can still run everything locally using the Local Development steps above. The backends will automatically use an in-memory MongoDB (see below) when `MONGODB_URI` is not provided.

## Kubernetes Deployment

### 1. Build Docker Images

```bash
# Build issuance service
cd backend/issuance
docker build -t kube-credential/issuance-service:latest .

# Build verification service
cd ../verification
docker build -t kube-credential/verification-service:latest .

# Build frontend
cd ../../frontend
docker build -t kube-credential/frontend:latest .
```

### 2. Create Kubernetes Secret

Update `backend/kubernetes/secrets.yaml` with your MongoDB URI, then:

```bash
kubectl apply -f backend/kubernetes/secrets.yaml
```

### 3. Deploy Services

```bash
# Apply all Kubernetes manifests
kubectl apply -f backend/kubernetes/issuance-deployment.yaml
kubectl apply -f backend/kubernetes/verification-deployment.yaml
kubectl apply -f backend/kubernetes/issuance-service.yaml
kubectl apply -f backend/kubernetes/verification-service.yaml
kubectl apply -f backend/kubernetes/ingress.yaml
```

### 4. Verify Deployments

```bash
# Check deployments
kubectl get deployments

# Check pods
kubectl get pods

# Check services
kubectl get services

# View logs
kubectl logs -f deployment/issuance-service
kubectl logs -f deployment/verification-service
```

### 5. Scaling

```bash
# Scale issuance service
kubectl scale deployment/issuance-service --replicas=3

# Scale verification service
kubectl scale deployment/verification-service --replicas=3
```

## API Documentation

### Issuance Service (Port 3001)

#### POST /api/issue
Issues a new credential.

**Request Body:**
```json
{
  "credentialId": "CRED-2024-001",
  "holderName": "Jitendra",
  "issuerName": "IIEST Shibpur",
  "credentialType": "Bachelor Degree",
  "expiryDate": "2025-12-31",
  "metadata": {}
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Credential issued by worker-issuance-1",
  "data": {
    "credentialId": "CRED-2024-001",
    "holderName": "Jitendra",
    "issuerName": "IIEST Shibpur",
    "credentialType": "Bachelor Degree",
    "issuedDate": "2024-10-12T10:30:00.000Z",
    "expiryDate": "2025-12-31T00:00:00.000Z",
    "workerId": "worker-issuance-1",
    "metadata": {}
  }
}
```

**Error Response (409 - Already Exists):**
```json
{
  "success": false,
  "message": "Credential with ID CRED-2024-001 already exists",
  "issuedBy": "worker-issuance-1",
  "issuedAt": "2024-10-12T10:30:00.000Z"
}
```

#### GET /api/health
Health check endpoint.

**Response (200):**
```json
{
  "success": true,
  "message": "Issuance service is healthy",
  "workerId": "worker-issuance-1",
  "timestamp": "2024-10-12T10:30:00.000Z"
}
```

### Verification Service (Port 3002)

#### POST /api/verify
Verifies a credential.

**Request Body:**
```json
{
  "credentialId": "CRED-2024-001"
}
```

**Success Response (200 - Verified):**
```json
{
  "success": true,
  "verified": true,
  "message": "Credential verified successfully",
  "data": {
    "credentialId": "CRED-2024-001",
    "holderName": "Jitendra",
    "issuerName": "IIEST Shibpur",
    "credentialType": "Bachelor Degree",
    "issuedDate": "2024-10-12T10:30:00.000Z",
    "expiryDate": "2025-12-31T00:00:00.000Z",
    "issuedBy": "worker-issuance-1",
    "verifiedBy": "worker-verification-1",
    "isExpired": false,
    "metadata": {}
  },
  "timestamp": "2024-10-12T10:35:00.000Z"
}
```

**Error Response (404 - Not Found):**
```json
{
  "success": false,
  "message": "Credential with ID CRED-2024-001 not found",
  "verified": false,
  "verifiedBy": "worker-verification-1",
  "timestamp": "2024-10-12T10:35:00.000Z"
}
```

#### GET /api/health
Health check endpoint.

**Response (200):**
```json
{
  "success": true,
  "message": "Verification service is healthy",
  "workerId": "worker-verification-1",
  "timestamp": "2024-10-12T10:30:00.000Z"
}
```

## Testing

### Running Unit Tests

#### Issuance Service
```powershell
cd backend/issuance
npm test
```

#### Verification Service
```powershell
cd backend/verification
npm test
```

### Test Coverage
```powershell
npm test -- --coverage
```

All tests are written with Jest and ts-jest. Both services include controller-level unit tests that cover happy-path and error scenarios.

## In-memory MongoDB for Local Dev

Both backend services support a seamless local development mode. If `MONGODB_URI` is not set, they will:

- Start or connect to a shared in-memory MongoDB instance on port 27018
- Use the database name `kube-credential`
- Automatically clean up on process exit (SIGINT)

This allows local runs without Docker or MongoDB Atlas. If port 27018 is already in use, stop whatever process is bound to it or set `MONGODB_URI` to your Atlas URI.

Environment variables you can set per service (in `.env`):

- `MONGODB_URI` – Atlas connection string (optional for local dev)
- `PORT` – Service port (defaults: 3001 issuance, 3002 verification)
- `WORKER_ID` – Identifier shown in responses (useful when running multiple replicas)

## AWS Deployment Strategy (Free Tier Friendly)

### Architecture on AWS

```
┌─────────────────────────────────────────────────────────────┐
│                     AWS Architecture                         │
└─────────────────────────────────────────────────────────────┘

Frontend (AWS Amplify or S3 + CloudFront)
  └─> Hosted React Application
       └─> https://main.xxxxx.amplifyapp.com (or CloudFront domain)

Backend Services (Elastic Beanstalk single-instance or EC2)
  ├─> Issuance Service (EB Node.js app)
  │    └─> https://issuance-env.XXXX.elasticbeanstalk.com
  │
  └─> Verification Service (EB Node.js app)
    └─> https://verification-env.XXXX.elasticbeanstalk.com

Database (MongoDB Atlas)
  └─> M0 Free Tier Cluster
       └─> Secured with VPC Peering (Optional)
```

### Deployment Paths

Pick one option per layer to stay in free/near-free limits:

- Frontend: AWS Amplify (free tier) OR S3 + CloudFront (free tier)
- Backend: AWS Elastic Beanstalk (single instance, free-tier EC2) OR one EC2 per service

The simplest free setup is: Amplify for frontend, and two Elastic Beanstalk apps for backends.

#### 1) Frontend: AWS Amplify (recommended)

1. Push your repo to GitHub.
2. In AWS Console > Amplify > New App > Host web app.
3. Connect GitHub repo, select the `frontend` folder as root.
4. Add environment variables:
  - `VITE_ISSUANCE_API_URL` = https://<issuance-eb-url>/api
  - `VITE_VERIFICATION_API_URL` = https://<verification-eb-url>/api
5. Save and deploy. Amplify assigns a domain like https://main.xxxxx.amplifyapp.com.

#### 2) Frontend: S3 + CloudFront

Build locally and upload:

```powershell
cd frontend
npm install; npm run build
aws s3 mb s3://my-kube-credential-frontend-<unique>
aws s3 sync dist/ s3://my-kube-credential-frontend-<unique> --delete
aws s3 website s3://my-kube-credential-frontend-<unique>/ --index-document index.html
```

Then create a CloudFront distribution pointing to this S3 bucket. Set Default Root Object to `index.html`.

#### 3) Backends: Elastic Beanstalk (Node.js platform)

We deploy each backend as its own EB application using the Node.js platform (no Docker). The `postinstall` script builds TypeScript automatically on deploy.

Prereqs:
- Install EB CLI: `pip install awsebcli` or use AWS CloudShell
- Configure AWS CLI: `aws configure`

Common env (per environment):
- `MONGODB_URI` = your Atlas connection string
- `WORKER_ID` = worker-issuance-1 or worker-verification-1
- `PORT` = 3001 (issuance) or 3002 (verification)

Deploy Issuance Service:
```powershell
cd backend/issuance
eb init --platform node.js --region us-east-1
eb create issuance-env --single --instance_types t2.micro --envvars "PORT=3001,MONGODB_URI=<your-uri>,WORKER_ID=worker-issuance-1,NODE_ENV=production"
eb deploy issuance-env
eb status issuance-env
```

Deploy Verification Service:
```powershell
cd ../verification
eb init --platform node.js --region us-east-1
eb create verification-env --single --instance_types t2.micro --envvars "PORT=3002,MONGODB_URI=<your-uri>,WORKER_ID=worker-verification-1,NODE_ENV=production"
eb deploy verification-env
eb status verification-env
```

After deploy, EB gives you public URLs:
- Issuance: https://issuance-env.XXXXX.elasticbeanstalk.com
- Verification: https://verification-env.XXXXX.elasticbeanstalk.com

Update your frontend envs (Amplify or S3 build) to point to these URLs with `/api` suffix.

#### 4) Backends: Single EC2 (manual) — alternative

For each service (repeat steps):
1. Launch a t2.micro in free tier with Amazon Linux 2023.
2. SSH in, install Node.js 18 and git.
3. Clone repo; cd to service folder; `npm install` then `npm run build`.
4. Set `.env` (PORT, MONGODB_URI, WORKER_ID); start with `node dist/index.js` or pm2.
5. Open security group ports (3001/3002) or put Nginx on 80 to proxy.

#### 1. Frontend on AWS Amplify

```bash
# Initialize Amplify in frontend directory
cd frontend
amplify init

# Deploy frontend
amplify publish
```

Or use the AWS Amplify Console:
1. Connect your GitHub repository
2. Select the `frontend` folder as the root
3. Build settings are auto-detected (Vite)
4. Deploy automatically on push

#### 2. Backend on AWS ECS Fargate

**Option A: Using ECS Fargate**

1. Push Docker images to Amazon ECR:
```bash
# Authenticate to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Tag and push images
docker tag kube-credential/issuance-service:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/issuance-service:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/issuance-service:latest

docker tag kube-credential/verification-service:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/verification-service:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/verification-service:latest
```

2. Create ECS Task Definitions for each service
3. Create ECS Services with Application Load Balancer
4. Configure environment variables in task definitions

**Option B: Using AWS EKS (Kubernetes)**

1. Create EKS cluster:
```bash
eksctl create cluster --name kube-credential-cluster --region us-east-1 --nodegroup-name standard-workers --node-type t3.medium --nodes 2
```

2. Update kubeconfig:
```bash
aws eks update-kubeconfig --name kube-credential-cluster --region us-east-1
```

3. Deploy using the existing Kubernetes manifests:
```bash
kubectl apply -f backend/kubernetes/
```

#### 3. Database (MongoDB Atlas)

1. Already configured and running on MongoDB Atlas
2. Update security settings to allow AWS IP ranges
3. Optional: Set up VPC Peering for enhanced security

### Environment Variables for Production

Update the following for production:

**Frontend:**
```env
VITE_ISSUANCE_API_URL=https://api.kube-credential.com/issuance/api
VITE_VERIFICATION_API_URL=https://api.kube-credential.com/verification/api
```

**Backend Services:**
- Use Elastic Beanstalk environment variables or EC2 `.env` files for MongoDB URI
- Optionally store secrets in AWS Systems Manager Parameter Store

Also set a distinct `WORKER_ID` per instance to observe behavior in responses.

## Screenshots

### Issue Credential Page
- Clean form interface for credential issuance
- Real-time validation
- Success/Error feedback with worker ID

### Verify Credential Page
- Simple verification interface
- Displays full credential details
- Shows issuance and verification worker IDs
- Indicates expiry status

Tip: The UI supports dark mode. Use the theme toggle in the header; your preference is saved to `localStorage` and applied immediately on page load to avoid flicker.

## Key Features

- **Microservices Architecture**: Independent, scalable services
- **Type Safety**: Full TypeScript implementation
- **Containerized**: Docker images for all services
- **Orchestration Ready**: Kubernetes manifests included
- **Production Ready**: Error handling, logging, health checks
- **Scalable**: Replica support with load balancing
- **Secure**: Environment-based configuration
- **Responsive UI**: Mobile-friendly interface
- **Worker Identification**: Track which worker handled each operation
- **Expiry Tracking**: Automatic credential expiry detection

## Development Notes

### Code Quality
- Modular architecture with separation of concerns
- Comprehensive error handling
- TypeScript for type safety
- RESTful API design
- Clean code principles

### Security Considerations
- Environment variables for sensitive data
- MongoDB Atlas with authentication
- CORS configuration
- Input validation
- Secure headers

### Scalability
- Horizontal scaling supported (replicas: 2 by default)
- Stateless microservices
- Database connection pooling
- Load balancing via Kubernetes services

## Troubleshooting

### MongoDB Connection Issues
```bash
# Test MongoDB connection
mongosh "mongodb+srv://username:password@cluster.mongodb.net/"
```

If you see connection errors locally and you intentionally did not set `MONGODB_URI`, ensure port 27018 is free. You can stop processes listening on that port and retry, or set `MONGODB_URI` to use Atlas.

### Docker Issues
```bash
# Clean rebuild
docker-compose down -v
docker-compose up --build
```

### Kubernetes Pod Issues
### Slow first request after idle (Render free tier)

Render free web services sleep after about 15 minutes of inactivity. The next request must “wake” the instance, which can take from several seconds up to a minute. To avoid this:

- Set up a free uptime monitor (UptimeRobot) to ping your health endpoints every 5–10 minutes.
  - Create two HTTP monitors:
    - https://kube-credential-4255.onrender.com/api/health
    - https://kube-credential-verification-backend.onrender.com/api/health
  - Interval: 5 minutes
- Ensure MONGODB_URI is set in production. The app disables in-memory Mongo in production to avoid long binary downloads.

The frontend now shows a brief “Waking server…” notice if a request takes longer than 5 seconds, so users know what’s happening on the very first request after idle.

```bash
# Check pod logs
kubectl logs -f <pod-name>

# Describe pod for events
kubectl describe pod <pod-name>

# Restart deployment
kubectl rollout restart deployment/<deployment-name>
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License

## Developer
Jitendra Kumar Dodwadiya

Email: jitendrakumar637587@gmail.com
