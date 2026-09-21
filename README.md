# Impullssee Portfolio

A modern, responsive portfolio website for Emil Sargsyan - Frontend & Full Stack Developer.

## Features

- Modern React + Vite setup
- Responsive design for all screen sizes
- Interactive components with smooth animations
- Functional contact form with email delivery
- Professional backend API with validation

## Getting Started

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` to set your backend API URL (default: `http://localhost:5000`)

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or next available port)

### Backend Setup (Contact Form)

The contact form requires a backend server to process submissions and send emails.

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `server/.env` and add:
- `RESEND_API_KEY`: Get your API key from https://resend.com/api-keys
- `CONTACT_EMAIL`: Your email address where form submissions will be sent
- `FRONTEND_URL`: Your frontend URL (default: `http://localhost:5173,http://localhost:5174`)

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Running Both Servers

To run both frontend and backend simultaneously, open two terminal windows:

**Terminal 1 (Frontend):**
```bash
npm run dev
```

**Terminal 2 (Backend):**
```bash
cd server
npm run dev
```

## Project Structure

```
my-app/
├── src/                  # React frontend source
│   ├── components/       # React components
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── server/              # Backend API server
│   ├── server.js        # Express server
│   ├── routes/          # API routes
│   └── .env.example     # Environment variables template
└── package.json         # Frontend dependencies
```

## Contact Form

The contact form is fully functional with:
- Client-side validation
- Server-side validation
- Email delivery via Resend
- Rate limiting (5 requests per 15 minutes per IP)
- Professional email templates
- Error handling and user feedback

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `npm run dev` - Start backend server
- `npm start` - Start backend server (production)

## Technologies

- **Frontend:** React, Vite, CSS
- **Backend:** Node.js, Express
- **Email:** Resend API
- **Icons:** React Icons, Font Awesome

## Deployment

For production deployment:

1. Build the frontend:
```bash
npm run build
```

2. Configure production environment variables for both frontend and backend

3. Deploy the frontend (e.g., Vercel, Netlify, or your own server)

4. Deploy the backend (e.g., Railway, Render, or your own server)

5. Update `FRONTEND_URL` in the backend `.env` to your production URL

## License

ISC
