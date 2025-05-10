
# NutriVerse API - Food Nutrition API Platform

A full-stack application providing a nutrition API service with developer dashboard, user authentication, and subscription management.

## Features

- **User Authentication**: Google OAuth and email/password login
- **Developer Dashboard**: API key management, usage stats, documentation
- **Admin Dashboard**: User management, food database management, data imports
- **Food API System**: Search foods by name, lookup by barcode, detailed nutrition data
- **Subscription Management**: Free, Basic, and Pro tiers with Stripe integration
- **Responsive Design**: Mobile-friendly interface built with React and Tailwind CSS

## Tech Stack

- **Frontend**: React, TailwindCSS, shadcn/ui
- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT, Google OAuth
- **Payments**: Stripe SDK
- **API**: RESTful endpoints with rate limiting

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas connection)
- Stripe account for payment processing

### Installation

1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   ```
3. Set up environment variables in `.env` file
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```
4. Seed the database with initial data
   ```bash
   node seed.js
   ```
5. Start the development server
   ```bash
   npm run dev
   ```

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/google` - Google OAuth authentication
- `GET /api/auth/me` - Get current user

#### API Keys
- `GET /api/keys` - Get all API keys for current user
- `POST /api/keys` - Generate new API key
- `PUT /api/keys/:id/deactivate` - Deactivate API key
- `GET /api/keys/usage` - Get API usage statistics
- `GET /api/keys/logs` - Get recent API logs

#### Food API
- `GET /v1_1/search/:query` - Search food by name
- `GET /v1_1/item?id=:item_id` - Get food by ID
- `GET /v1_1/barcode?code=:barcode` - Get food by barcode

#### Admin Routes
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/toggle-status` - Toggle user status
- `GET /api/admin/foods` - Get food items
- `POST /api/admin/foods` - Add new food item
- `DELETE /api/admin/foods/:id` - Delete food item
- `POST /api/admin/foods/upload` - Upload CSV file for bulk food import
- `GET /api/admin/api-usage` - Get API usage statistics
- `GET /api/admin/promocodes` - Get promo codes
- `POST /api/admin/promocodes` - Create promo code

#### Subscriptions
- `GET /api/subscriptions/current` - Get current subscription
- `POST /api/subscriptions/create-checkout-session` - Create checkout session
- `POST /api/subscriptions/create-portal-session` - Create portal session
- `POST /api/subscriptions/webhook` - Stripe webhook handler

## License

This project is licensed under the MIT License.
