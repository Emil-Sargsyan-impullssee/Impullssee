# Contact Form Setup Guide

## Overview

The contact form is now fully functional with a professional backend API. Follow these steps to configure and run it.

## Step 1: Backend Setup

### 1.1 Navigate to the server directory
```bash
cd server
```

### 1.2 Create the .env file
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```

### 1.3 Get your Resend API Key
1. Go to https://resend.com and sign up (it's free)
2. Navigate to API Keys section
3. Create a new API key
4. Copy the API key

### 1.4 Configure the .env file
Edit `server/.env` and replace the placeholder values:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS) - comma-separated for multiple ports
FRONTEND_URL=http://localhost:5173,http://localhost:5174

# Email Service Configuration (Resend)
# Replace 'your_resend_api_key_here' with your actual API key
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx

# Contact Email (where form submissions will be sent)
CONTACT_EMAIL=emilsargsyan43@gmail.com
```

**Important:**
- Replace `your_resend_api_key_here` with your actual Resend API key
- Keep `CONTACT_EMAIL` as your email address
- Never commit the `.env` file to Git

### 1.5 Start the backend server
```bash
npm run dev
```

You should see:
```
Server running on port 5000
Environment: development
```

## Step 2: Frontend Setup

### 2.1 Navigate to the project root
```bash
cd ..
```

### 2.2 Create the frontend .env file
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```

The `.env` file should contain:
```env
# Backend API URL
VITE_API_URL=http://localhost:5000
```

### 2.3 Start the frontend server
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or the next available port)

## Step 3: Test the Contact Form

1. Open your browser and navigate to the frontend URL
2. Scroll to the Contact section
3. Fill out the form with test data:
   - Name: Test User
   - Email: your-test-email@example.com
   - Project Type: Landing Page
   - Budget: $500 – $1,000
   - Message: This is a test message
4. Click "SEND MESSAGE"
5. You should see the success animation
6. Check your email (CONTACT_EMAIL) for the message

## Running Both Servers

To run both servers simultaneously, open two terminal windows:

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

## Testing Validation

The form includes comprehensive validation:

### Client-Side Validation
- Required fields check
- Email format validation
- Real-time error display

### Server-Side Validation
- Field length validation (name: 2-100 chars, message: 10-2000 chars)
- Email format validation
- Input sanitization
- Rate limiting (5 requests per 15 minutes per IP)

### Test Scenarios
1. **Empty fields**: Try submitting without filling all fields
2. **Invalid email**: Try submitting with an invalid email format
3. **Short message**: Try submitting with a message shorter than 10 characters
4. **Long message**: Try submitting with a message longer than 2000 characters
5. **Rate limiting**: Submit more than 5 times within 15 minutes (should show rate limit error)

## Troubleshooting

### Backend won't start
- Check if port 5000 is already in use
- Try changing the PORT in `server/.env`
- Ensure you ran `npm install` in the server directory

### Frontend can't connect to backend
- Verify the backend is running on port 5000
- Check that `VITE_API_URL` in the frontend `.env` matches the backend URL
- Check browser console for CORS errors
- Verify `FRONTEND_URL` in `server/.env` includes your frontend port

### Email not sending
- Verify your Resend API key is correct
- Check that the Resend API key has the correct permissions
- Check the backend console for error messages
- Ensure your email is verified in Resend (if required)

### CORS errors
- Check that `FRONTEND_URL` in `server/.env` includes your actual frontend URL
- The frontend port might be different (5173, 5174, etc.)
- Add all possible ports separated by commas

## Production Deployment

Before deploying to production:

1. **Update environment variables:**
   - Set `NODE_ENV=production` in `server/.env`
   - Update `FRONTEND_URL` to your production frontend URL
   - Update `VITE_API_URL` to your production backend URL

2. **Build the frontend:**
   ```bash
   npm run build
   ```

3. **Deploy the backend:**
   - Use a service like Railway, Render, or your own VPS
   - Ensure the backend is running on HTTPS
   - Update the frontend `VITE_API_URL` to the production backend URL

4. **Deploy the frontend:**
   - Use Vercel, Netlify, or your own server
   - Serve the `dist` folder
   - Ensure HTTPS is enabled

5. **Test in production:**
   - Submit a test form
   - Verify email delivery
   - Check error handling

## Security Notes

- Never commit `.env` files to Git
- Never share your Resend API key
- Use environment variables for all sensitive data
- The backend includes rate limiting to prevent spam
- All inputs are sanitized on the server side
- CORS is configured to only allow your frontend domains

## Summary

**Files Created/Modified:**
- Created `server/` directory with backend API
- Created `server/package.json` with backend dependencies
- Created `server/server.js` - Express server
- Created `server/routes/contact.js` - Contact form API endpoint
- Created `server/.env.example` - Environment variables template
- Created `server/.gitignore` - Server-specific ignore rules
- Created `server/README.md` - Backend documentation
- Modified `src/components/Contact.jsx` - Connected to backend API
- Created `.env.example` - Frontend environment variables template
- Modified `.gitignore` - Added environment variable protection
- Updated `README.md` - Complete project documentation

**Packages Installed (Backend):**
- express - Web framework
- cors - CORS middleware
- dotenv - Environment variable management
- resend - Email service
- express-rate-limit - Rate limiting

**Environment Variables to Configure:**

**Backend (`server/.env`):**
- `PORT=5000` - Server port
- `NODE_ENV=development` - Environment mode
- `FRONTEND_URL=http://localhost:5173,http://localhost:5174` - Allowed frontend URLs
- `RESEND_API_KEY=your_actual_api_key` - Your Resend API key
- `CONTACT_EMAIL=emilsargsyan43@gmail.com` - Your email address

**Frontend (`.env`):**
- `VITE_API_URL=http://localhost:5000` - Backend API URL

**Commands to Run:**

**Backend:**
```bash
cd server
npm install
npm run dev
```

**Frontend:**
```bash
npm run dev
```

**Testing the Contact Form:**
1. Start both servers (backend on port 5000, frontend on port 5173/5174)
2. Open the frontend in your browser
3. Navigate to the Contact section
4. Fill out the form with valid data
5. Click "SEND MESSAGE"
6. Verify the success animation appears
7. Check your email for the message

**Before Production Deployment:**
1. Get a real Resend API key from https://resend.com/api-keys
2. Configure `RESEND_API_KEY` in `server/.env`
3. Update `FRONTEND_URL` to your production domain
4. Update `VITE_API_URL` to your production backend URL
5. Set `NODE_ENV=production`
6. Test the form thoroughly
7. Deploy backend to a hosting service
8. Deploy frontend to a hosting service
9. Test the live contact form
