# ELETTRA Dashboard - Client

Vue 3 frontend for the ELETTRA Dashboard, GoCharge's AI Agent performance monitoring system.

## Tech Stack

- Vue 3 (Composition API, `<script setup>`)
- TypeScript
- Vite
- Tailwind CSS with shadcn-vue components
- Clerk for authentication
- Chart.js for data visualization

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from example:
```bash
cp .env.example .env
```

3. Configure environment variables:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=http://localhost:3001/api  # For local dev, leave empty to use proxy
```

4. Run development server:
```bash
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables in Vercel dashboard:
   - `VITE_CLERK_PUBLISHABLE_KEY`
   - `VITE_API_URL` (your deployed server URL + /api)
4. Deploy

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | Yes |
| `VITE_API_URL` | Backend API URL | Yes (production) |
