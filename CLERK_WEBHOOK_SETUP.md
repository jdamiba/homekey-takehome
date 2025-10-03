# Clerk Webhook Setup Guide

This guide explains how to set up Clerk webhooks to automatically sync user data to your database.

## 1. Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Clerk Webhook Secret (get this from Clerk Dashboard)
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Your existing Clerk keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

## 2. Setting Up the Webhook in Clerk Dashboard

1. Go to your [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your application
3. Navigate to **Webhooks** in the left sidebar
4. Click **Add Endpoint**
5. Configure the webhook:
   - **Endpoint URL**: `https://your-domain.com/api/webhooks/clerk`
   - **Events to Subscribe**: Select the following events:
     - `user.created`
     - `user.updated`
     - `user.deleted`
6. Click **Create**
7. Copy the **Signing Secret** and add it to your `.env.local` file as `CLERK_WEBHOOK_SECRET`

## 3. Webhook Events Handled

### `user.created`

- Creates a new user record in the database
- Sets default preferences (notifications, price alerts, email updates)
- Logs the user creation

### `user.updated`

- Updates existing user record with new information
- Handles changes to name, email, phone, profile image
- Logs the user update

### `user.deleted`

- Removes user from database
- Prisma automatically handles cascade deletes for related records (favorites, searches, comparisons)
- Logs the user deletion

## 4. Testing the Webhook

### Local Testing

Use the test endpoint to create a mock user:

```bash
curl -X POST http://localhost:3000/api/test-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890"
  }'
```

### Check Users

View all users in the database:

```bash
curl http://localhost:3000/api/test-webhook
```

## 5. Webhook Security

The webhook endpoint includes security measures:

- **Signature Verification**: Uses Svix to verify webhook signatures
- **Header Validation**: Ensures required Svix headers are present
- **Error Handling**: Comprehensive error handling and logging

## 6. Database Schema

The webhook creates users with the following structure:

```typescript
{
  id: string,           // Clerk user ID
  email: string,        // Primary email
  firstName?: string,   // First name
  lastName?: string,    // Last name
  phone?: string,       // Phone number
  profileImageUrl?: string, // Profile image URL
  preferences: {        // Default preferences
    notifications: true,
    priceAlerts: true,
    emailUpdates: true
  },
  createdAt: Date,      // Creation timestamp
  updatedAt: Date       // Last update timestamp
}
```

## 7. Troubleshooting

### Common Issues

1. **Webhook not receiving events**

   - Check that the endpoint URL is correct and accessible
   - Verify the webhook secret is correctly set
   - Check Clerk dashboard for webhook delivery status

2. **Database connection errors**

   - Verify DATABASE_URL is correctly set
   - Check that Prisma client is generated (`npx prisma generate`)
   - Ensure database tables exist

3. **Signature verification failures**
   - Verify CLERK_WEBHOOK_SECRET matches the one in Clerk dashboard
   - Check that all required headers are being sent

### Logs

Check your application logs for webhook processing messages:

- "User created in database: [user_id]"
- "User updated in database: [user_id]"
- "User deleted from database: [user_id]"

## 8. Production Deployment

When deploying to production:

1. Update the webhook endpoint URL in Clerk dashboard
2. Ensure environment variables are set in your production environment
3. Test the webhook with a real user signup
4. Monitor logs for any errors

## 9. Next Steps

After setting up the webhook:

1. Test user signup flow
2. Verify user data is correctly stored
3. Implement user profile management
4. Add user preferences management
5. Build user-specific features (favorites, searches, comparisons)
