# Testora - AI-Powered Study Platform 🎓

An intelligent study and test preparation platform built with modern technologies, featuring adaptive learning, study plans, and comprehensive progress tracking.

## 🌟 Features

### Core Functionality
- **Smart Study Sessions**: Adaptive question difficulty based on performance
- **Comprehensive Lesson Management**: Structured lessons with topics and questions
- **AI-Powered Study Plans**: Personalized study schedules with AI recommendations
- **Progress Tracking**: Detailed analytics on learning progress and performance
- **Multi-Language Support**: Built with internationalization (i18n) support
- **Session Management**: Real-time study sessions with time tracking

### User Management
- **Authentication System**: Secure login/registration with JWT tokens
- **OAuth Integration**: Google and Apple sign-in support
- **Email Verification**: Account verification workflow
- **Password Reset**: Secure password recovery system
- **Profile Management**: Customizable user profiles and preferences

### Study Features
- **Question Types**: Multiple choice, true/false, fill-in-the-blank, and essay questions
- **Difficulty Levels**: Easy, medium, and hard question categories
- **Study History**: Complete session history and performance analytics
- **Streak Tracking**: Daily study streak monitoring
- **Mastery System**: Topic mastery calculation based on performance

### Admin Features
- **Content Management**: Create and manage lessons, topics, and questions
- **Bulk Operations**: Import multiple questions at once
- **Analytics Dashboard**: System-wide statistics and user insights
- **User Management**: Admin controls for user accounts

## 🛠️ Tech Stack

### Frontend (Web App)
- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) + Custom components
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **API Client**: [TanStack Query](https://tanstack.com/query) (React Query)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) validation
- **Internationalization**: [next-intl](https://next-intl-docs.vercel.app/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

### Backend (API)
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Fastify](https://www.fastify.io/)
- **Language**: TypeScript
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose ODM](https://mongoosejs.com/)
- **Authentication**: JWT tokens with bcrypt password hashing
- **OAuth**: Google and Apple OAuth integration
- **Rate Limiting**: Request rate limiting middleware
- **Security**: CORS, security headers, input validation
- **Email**: SMTP email service integration

### DevOps & Tooling
- **Monorepo**: [Turborepo](https://turbo.build/) for monorepo management
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Linting**: [ESLint](https://eslint.org/) with custom configurations
- **Code Formatting**: [Prettier](https://prettier.io/)
- **Type Checking**: TypeScript with strict mode
- **Git Hooks**: Pre-commit hooks for code quality

## 📁 Project Structure



## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm 8+
- MongoDB instance
- Google OAuth credentials (optional)
- Apple OAuth credentials (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/testora.git
   cd testora
pnpm install

PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/testora
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12

# OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email (Optional)
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password

NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# Start both API and Web in development mode
pnpm dev

# Or start individually
pnpm --filter api dev
pnpm --filter web dev

# Development
pnpm dev              # Start all apps in development
pnpm dev:api          # Start only API
pnpm dev:web          # Start only web app

# Building
pnpm
