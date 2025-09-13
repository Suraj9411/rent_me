# Home Rental Platform

A full-stack home rental platform built with React, Node.js, Express, Prisma, and Socket.io.

## Features

- User authentication (register/login)
- Property listings with search and filters
- Real-time chat system
- Property management (add/edit/delete)
- User profiles and saved properties
- Responsive design

## Project Structure

```
rent/
├── api/                 # Backend API server
├── client/             # React frontend
├── socket/             # Socket.io server for real-time chat
└── render.yaml         # Render deployment configuration
```

## Prerequisites

- Node.js 18+ 
- MongoDB database
- npm or yarn

## Local Development Setup

### 1. Backend API Setup

```bash
cd api
npm install
```

Create a `.env` file in the `api` directory:
```env
DATABASE_URL="mongodb://localhost:27017/rent_platform"
JWT_SECRET_KEY="your-super-secret-jwt-key"
CLIENT_URL="http://localhost:5173"
PORT=8800
NODE_ENV="development"
```

Generate Prisma client:
```bash
npx prisma generate
```

Start the development server:
```bash
npm run dev
```

### 2. Socket Server Setup

```bash
cd socket
npm install
```

Create a `.env` file in the `socket` directory:
```env
CLIENT_URL="http://localhost:5173"
SOCKET_PORT=4000
```

Start the socket server:
```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:8800
VITE_SOCKET_URL=http://localhost:4000
```

Start the development server:
```bash
npm run dev
```

## Deployment to Render

### 1. Environment Variables Setup

In your Render dashboard, set the following environment variables for each service:

**API Service:**
- `DATABASE_URL`: Your MongoDB connection string
- `JWT_SECRET_KEY`: A secure random string
- `CLIENT_URL`: Your frontend URL
- `NODE_ENV`: production

**Socket Service:**
- `CLIENT_URL`: Your frontend URL
- `NODE_ENV`: production

**Frontend Service:**
- `VITE_API_URL`: Your API service URL
- `VITE_SOCKET_URL`: Your socket service URL

### 2. Deploy Using render.yaml

The project includes a `render.yaml` file for easy deployment. Simply connect your GitHub repository to Render and it will automatically deploy all three services.

### 3. Manual Deployment

If you prefer manual deployment:

1. **API Service**: Deploy as a Web Service with Node.js environment
2. **Socket Service**: Deploy as a Web Service with Node.js environment  
3. **Frontend Service**: Deploy as a Static Site

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/posts` - Get all posts with filters
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `GET /api/users/profile` - Get user profile
- `GET /api/chats` - Get user chats
- `GET /api/messages/:chatId` - Get chat messages

## Database Schema

The project uses Prisma with MongoDB. Key models include:
- User (authentication and profile)
- Post (property listings)
- PostDetail (detailed property information)
- SavedPost (user saved properties)
- Chat (conversations between users)
- Message (individual messages)

## Technologies Used

- **Frontend**: React, Vite, SCSS, React Router
- **Backend**: Node.js, Express, Prisma
- **Database**: MongoDB
- **Real-time**: Socket.io
- **Authentication**: JWT with cookies
- **Deployment**: Render

## Troubleshooting

### Common Issues

1. **"Cannot set headers after they are sent"**: Fixed in post controller
2. **CORS errors**: Ensure CLIENT_URL is set correctly
3. **Database connection**: Verify DATABASE_URL and MongoDB access
4. **JWT errors**: Check JWT_SECRET_KEY is set

### Development vs Production

- Development uses localhost URLs
- Production uses environment variables for all URLs
- Ensure all environment variables are set in production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC License
