# AWS setup checklist

Use **Asia Pacific (Mumbai) — ap-south-1** everywhere.

## 1. Cognito

Create a Cognito User Pool in `ap-south-1`.

Recommended:
- Sign-in option: Email
- Required attributes: email, name
- Enable self-service sign-up
- Create an app client without a client secret for the browser app
- Configure email verification according to your AWS account

Copy:
- User Pool ID
- App Client ID

Put them in `.env`:
VITE_COGNITO_USER_POOL_ID=
VITE_COGNITO_CLIENT_ID=

## 2. DynamoDB

Create table:
`StudentExpenses`

Partition key:
`userId` — String

Sort key:
`expenseId` — String

Region:
`ap-south-1`

## 3. Lambda

Create Node.js Lambda.

Upload the contents of `lambda/expense-api` after running:
npm install

Environment:
TABLE_NAME=StudentExpenses

Lambda execution role needs DynamoDB:
- Query
- PutItem
- DeleteItem

## 4. API Gateway

Create an HTTP API or REST API with:
POST /expenses
GET /expenses
DELETE /expenses/{expenseId}

Configure Cognito/JWT authorization using the Cognito issuer and audience/client ID as required by your API Gateway configuration.

Set CORS for your S3 website origin.

Copy the API base URL into:
VITE_API_BASE_URL=

## 5. S3 hosting

Create an S3 bucket for the React build.

Build:
npm run build

Upload the contents of `dist/`.

For an SPA, configure the website/error routing according to your chosen S3 + CloudFront setup. For a production deployment, CloudFront is recommended in front of S3.

## 6. CloudWatch

Lambda automatically writes execution logs to CloudWatch when its execution role has the standard logging permissions.

## 7. Frontend configuration

Copy `.env.example` to `.env`, fill the three AWS values and API URL, then run:
npm run build

Never put AWS secret access keys in the frontend.
