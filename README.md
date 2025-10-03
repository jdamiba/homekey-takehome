# HomeKey - Property Intelligence Platform

A comprehensive real estate platform that transforms scattered property information into clear, actionable insights for confident property decisions.

## Features

- **User Authentication**: Secure sign-up and login with Clerk
- **Property Search**: Advanced filtering and search capabilities
- **Property Intelligence**: Market data, location insights, and financial analysis
- **User Dashboard**: Personalized property management and favorites
- **Database Integration**: PostgreSQL with Prisma ORM
- **Webhook Integration**: Automatic user data synchronization

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Authentication**: Clerk
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Neon account)
- Clerk account for authentication

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd homekey
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with the following variables:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@host:port/database"

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
   CLERK_SECRET_KEY="your_clerk_secret_key"
   CLERK_WEBHOOK_SECRET="your_webhook_secret"
   ```

4. **Set up the database**

   ```bash
   # Run the database schema
   psql -h your-host -U your-username -d your-database -f database/schema.sql

   # Generate Prisma client
   npx prisma generate
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
homekey/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── webhooks/      # Clerk webhooks
│   │   ├── users/         # User management
│   │   └── test-webhook/  # Testing endpoints
│   ├── dashboard/         # User dashboard
│   ├── properties/        # Property listings
│   ├── favorites/         # User favorites
│   └── about/             # About page
├── database/              # Database schema and setup
├── lib/                   # Utility functions and services
│   ├── db.ts             # Database connection
│   └── services/         # Business logic services
├── prisma/               # Prisma schema and migrations
└── public/               # Static assets
```

## API Endpoints

### Authentication

- `POST /api/webhooks/clerk` - Clerk webhook for user sync
- `GET /api/users` - Get all users (admin)
- `POST /api/users` - Create user (testing)
- `GET /api/users/[userId]/preferences` - Get user preferences
- `PUT /api/users/[userId]/preferences` - Update user preferences

### Testing

- `POST /api/test-webhook` - Create test user
- `GET /api/test-webhook` - Get all users

## Database Schema

The application uses a comprehensive PostgreSQL schema with the following main tables:

- **users** - User accounts (Clerk integration)
- **properties** - Property listings and details
- **property_images** - Property photos
- **property_history** - Price and status changes
- **user_favorites** - User's favorite properties
- **user_searches** - Search history and saved searches
- **property_comparisons** - User-created property comparisons
- **neighborhoods** - Location intelligence data
- **schools** - School information and ratings
- **property_schools** - Property-school relationships

## Authentication Flow

1. **User Sign-up**: User creates account via Clerk
2. **Webhook Trigger**: Clerk sends webhook to `/api/webhooks/clerk`
3. **Database Sync**: User data is automatically saved to database
4. **Session Management**: Clerk handles session management
5. **Protected Routes**: Middleware protects authenticated routes

## Development

### Running Tests

```bash
# Test webhook functionality
curl -X POST http://localhost:3000/api/test-webhook \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "first_name": "John", "last_name": "Doe"}'

# Get all users
curl http://localhost:3000/api/users
```

### Database Operations

```bash
# View database directly
psql -h your-host -U your-username -d your-database

# Reset database (if needed)
psql -h your-host -U your-username -d your-database -f database/schema.sql
```

## Deployment

### Vercel Deployment

1. **Connect to Vercel**

   ```bash
   vercel
   ```

2. **Set environment variables** in Vercel dashboard:

   - `DATABASE_URL`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `CLERK_WEBHOOK_SECRET`

3. **Update Clerk webhook URL** to point to your Vercel deployment

### Database Setup

1. **Create Neon database** (or use existing PostgreSQL)
2. **Run schema setup**:
   ```bash
   psql -h your-host -U your-username -d your-database -f database/schema.sql
   ```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@homekey.com or create an issue in the repository.
