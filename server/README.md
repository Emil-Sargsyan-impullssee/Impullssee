# Impullssee Backend Server

This is the backend server for the Impullssee portfolio contact form.

## Setup Instructions

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` and add your actual values:
- `RESEND_API_KEY`: Get your API key from https://resend.com/api-keys
- `CONTACT_EMAIL`: Your email address where form submissions will be sent
- `FRONTEND_URL`: Your frontend URL (default: http://localhost:5173,http://localhost:5174)

### 3. Run the Server
```bash
npm run dev
```

The server will start on port 5000 (or the port specified in `.env`).

## API Endpoints

### POST /api/contact
Submit the contact form.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "projectType": "Landing Page",
  "budget": "$500 – $1,000",
  "message": "I need a website built..."
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Message sent successfully"
}
```

**Response (Error):**
```json
{
  "error": "Error message"
}
```

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

## Features

- **Email Delivery**: Uses Resend for professional email delivery
- **Input Validation**: Server-side validation for all fields
- **Rate Limiting**: Prevents spam (5 requests per 15 minutes per IP)
- **CORS**: Configured for frontend-backend communication
- **Error Handling**: Comprehensive error handling and logging
- **Security**: Input sanitization and email validation

## Rate Limiting

The contact endpoint is rate-limited to prevent spam:
- 5 requests per 15 minutes per IP address
- Returns 429 status code when limit is exceeded

## Email Template

Emails are sent with a professional HTML template including:
- Sender name and email
- Project type and budget
- Full message content
- Reply-to functionality for easy responses

## Deployment

For production deployment:

1. Set `NODE_ENV=production` in your environment
2. Update `FRONTEND_URL` to your production frontend URL
3. Ensure `RESEND_API_KEY` and `CONTACT_EMAIL` are set
4. Use a process manager like PM2 for production:
   ```bash
   npm install -g pm2
   pm2 start server.js --name impullssee-server
   ```
