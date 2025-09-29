# Serenity Wellness App - Backend Setup

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Atlas Connection String
# Replace with your actual MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/serenity-wellness?retryWrites=true&w=majority

# JWT Secret Key (change this to a secure random string in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Port
PORT=3008
```

## MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Create a database user
4. Get your connection string
5. Replace the connection string in your `.env` file

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth)
- `POST /api/auth/logout` - Logout user (requires auth)

### User Preferences
- `GET /api/preferences` - Get user preferences (requires auth)
- `PUT /api/preferences` - Update user preferences (requires auth)
- `POST /api/preferences/reset` - Reset preferences to default (requires auth)

### Meditation Data
- `GET /api/meditation` - Get all meditations (with optional filtering)
- `GET /api/meditation/:id` - Get specific meditation

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## User Registration Example

```json
POST /api/auth/register
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

## User Login Example

```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

## Update Preferences Example

```json
PUT /api/preferences
Authorization: Bearer <your-jwt-token>
{
  "favoriteThemes": ["Morning Calm", "Stress Relief"],
  "preferredDuration": "15 minutes",
  "bestTimeOfDay": "Evening",
  "notifications": true,
  "theme": "dark"
}
```

## Running the Server

```bash
npm start
```

The server will run on http://localhost:3008
