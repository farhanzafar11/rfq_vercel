# GarajCloud RFQ Portal

GarajCloud RFQ Portal is a secure, automated web application designed to allow authenticated users to upload Bill of Quantities (BOQ) PDF files. The application proxies these uploads to a backend n8n workflow pipeline for automated processing and pricing quote generation.

## 🚀 Tech Stack

This project is built using modern web development standards and optimized for serverless edge environments:

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI Library:** [React 19](https://react.dev/)
- **Authentication:** [NextAuth.js v5 (Auth.js)](https://authjs.dev/) utilizing Google OAuth Provider with domain restriction.
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) structured with custom CSS variables (`app/globals.css`) tuned exactly to the GarajCloud brand palette.
- **Component Primitives:** [shadcn/ui](https://ui.shadcn.com/), [@base-ui/react](https://base-ui.com/), and [Lucide-React](https://lucide.dev/) icons.
- **Backend / Integration:** Server-side API route Proxying (`app/api/submit-boq`) connected to an external [n8n Webhook](https://n8n.io/).

## 🌟 Core Features

1. **Restricted Access Control**: Only authorized GarajCloud personnel can access the dashboard.
2. **Secure Proxying**: Client files are securely proxied via server-side Next.js route handlers (`submit-boq`) to the n8n backend, mitigating CORS issues and hiding webhook secrets from the client.
3. **Dynamic Feedback**: Real-time integration bridging n8n's "Respond to Webhook" nodes dynamically into the React user interface.
4. **File Validation**: Strict frontend and backend checks to ensure valid PDF routing under 20MB.

## 🛠️ Getting Started

First, ensure your `.env.local` is appropriately filled with your Google Auth and n8n webhook secrets:
*(See `.env.local.example` for reference keys).*

Run the development server:

```bash
npm run dev
# or
npm start (for production builds)
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Repository Map

- `/app/api`: Server-side proxies and NextAuth endpoints.
- `/app/dashboard`: Protected routes containing the main upload interfaces.
- `/components`: Modular UI components (StatusBanners, UploadCards, Session Providers).
- `/lib`: Helper utilities and Auth configuration.

## 🌐 Deployment

This application is edge-ready and built to be deployed on [Vercel](https://vercel.com/new). Ensure that `proxy.ts` (formerly middleware.ts) is actively intercepting and securing the route layer during deployment.
