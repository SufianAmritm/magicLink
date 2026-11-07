# Magic Link Login

Passwordless login with **magic links**, built with **NestJS**, **MongoDB** and **JWT**.

## Features
- Sign up and request a login link by email (Nodemailer)
- Short-lived links tied to a device ID and a unique link ID
- A new link invalidates older ones
- Rate limit: max 3 requests per 5 minutes per device
- Supports multiple devices, and can invalidate other sessions on a new login
- JWT issued after the link is verified
- Response interceptor, request logging and exception filters
- Swagger API docs

## Tech
NestJS · TypeScript · MongoDB (Mongoose) · JWT · Nodemailer

## Run

```bash
npm install
# set MongoDB, JWT secret and SMTP settings in .env
npm run start:dev
```
