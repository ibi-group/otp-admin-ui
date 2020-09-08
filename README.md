# otp-admin-ui

Front end application to manage OpenTripPlanner (OTP) and
[otp-middleware](https://github.com/ibi-group/otp-middleware). This application
acts as a dashboard for managing OTP user accounts, third party
applications that have access to the OTP API, and other components involved.

## Requirements

This application depends on having both OTP and otp-middleware running. API
access for third party applications is heavily dependent on AWS services like
AWS API Gateway.

## Development

To get started with development:
1. Download the repo.
2. Update the local config and install dependencies.
3. Kick off the dev instance.

```bash
git clone https://github.com/ibi-group/otp-admin-ui.git
cd otp-admin-ui
cp .env.tmp .env.build
# Update .env.build values (e.g. $ vi .env.build)
# Install packages
yarn
# Start up dev instance
yarn dev
# Note: ensure otp-middleware is running
# (assumed to be at http://localhost:4567)
```

## Deployment

To deploy this site, first make sure `vercel` is installed globally. Then, run
`yarn deploy`.

```bash
yarn global add vercel
yarn deploy
```
