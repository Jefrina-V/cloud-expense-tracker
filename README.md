# Cloud-Based Student Expense Tracker Using AWS

A modern React + TypeScript student expense tracker designed for AWS serverless deployment.

## AWS architecture

React/Vite → Amazon Cognito → API Gateway → AWS Lambda → DynamoDB
Frontend hosting → Amazon S3
Monitoring → Amazon CloudWatch

Region: `ap-south-1` (Asia Pacific - Mumbai)

## Features

- Cognito signup/login/logout
- Protected routes
- Dashboard summary cards
- Monthly expense total
- Transaction count
- Highest expense
- Category spending chart
- Add, view and delete expenses
- Responsive aesthetic UI
- API service ready for API Gateway/Lambda
- Local demo mode when AWS credentials are not configured

## Run

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` and add Cognito/API values when the AWS backend is ready.

## Lambda

See `lambda/expense-api/index.js` and `lambda/expense-api/package.json`.

## DynamoDB

Table: `StudentExpenses`
Partition key: `userId` (String)
Sort key: `expenseId` (String)

## API

POST `/expenses`
GET `/expenses`
DELETE `/expenses/{expenseId}`

The Lambda derives the user ID from the authenticated request context instead of trusting a userId supplied by the browser.

## 🚀 Live Demo

👉 [Open Student Expense Tracker](https://main.dwpvnc3whl3ik.amplifyapp.com)
