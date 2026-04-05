# FeedPulse - AI-Powered Feedback Platform
FeedPulse is a lightweight internal tool that lets teams collect product feedback and feature requests from users, then uses Google Gemini AI to automatically categorise, prioritise, and summarise them — giving product teams instant clarity on what to build next

## 🎯 Features

- **Smart Feedback Collection**: Public form for users to submit feedback with title, category, email, and detailed message
- **AI-Powered Analysis**: Automatic categorization (sentiment, priority, tags) using Google Gemini API
- **Admin Dashboard**: Secure dashboard to view, filter, and manage all feedback submissions
- **JWT Authentication**: Secure admin login with token-based authentication
- **Rate Limiting**: Protection against abuse (5 submissions/hour, 10 logins/15 mins)
- **Responsive Design**: Beautiful UI with Tailwind CSS (works on mobile & desktop)
- **Real-time Updates**: Instant feedback analysis and status management

## 📊 Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **AI**: Google Gemini API (gemini-1.5-flash model)
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod (runtime schema validation)
- **Rate Limiting**: express-rate-limit
- **Dev Tool**: tsx (ES module TypeScript support)

### Frontend
- **Framework**: Next.js 14+ with React Server Components
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Package Manager**: npm

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas)
- Google Gemini API key (free from [AI Studio](https://aistudio.google.com/app/apikeys))

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/your-username/feedpulse.git
cd feedpulse 
```

#### 2. Backend Setup
```bash
cd backend
npm install
```

#### 3. Create a .env file in the backend directory:
```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/feedpulse
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_jwt_secret_key_here
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

#### 4. Start the backend server:
```bash
npm run dev
```

#### 5. Frontend Setup:
```bash
cd ../frontend
npm install
```
#### 6. Start the development server:
```bash
npm run dev
```

## 📝 How to Use

### 1. Submit Feedback (Public)
- Navigate to `http://localhost:3000/`
- Fill out the feedback form:
  - **Title**: Brief title of your feedback (max 120 characters)
  - **Email**: Your email address (optional)
  - **Category**: Choose one:
    - Bug (report a problem)
    - Feature Request (suggest new functionality)
    - Improvement (suggest enhancements to existing features)
  - **Message**: Detailed feedback description (min 20, max 2000 characters)
    - A progress bar shows your character count
    - Must have at least 20 characters to submit
  - **Name**: Your name (optional)
- Click **"Submit →"** button
- AI will automatically analyze your feedback:
  - Categorizes the feedback type
  - Detects sentiment (Positive/Neutral/Negative)
  - Assigns priority score (1-10)
  - Generates summary and tags
- You'll see a success message confirming submission

### 2. Access Admin Dashboard

#### Login to Admin Panel
1. Navigate to `http://localhost:3000/dashboard/login`
2. Enter demo credentials:
   - **Email**: `admin@example.com`
   - **Password**: `admin123`
3. Click **"Login →"** button
4. You'll be redirected to the dashboard

#### Dashboard Features
- **View All Feedback**: See complete list of all submitted feedback
- **Filter by Status**: 
  - New (recently submitted)
  - In-progress (being worked on)
  - Resolved (completed)
- **Filter by Sentiment**:
  - Positive
  - Neutral
  - Negative
- **View AI Analysis**:
  - Category (auto-assigned by Gemini)
  - Sentiment score
  - Priority level (1-10 scale)
  - AI-generated summary
  - Relevant tags
- **Update Status**: Change feedback status directly in the table


## 🔌 API Endpoints

### Public Endpoints (No Authentication Required)

#### 1. Submit Feedback
**POST** `/api/feedback`

```bash
curl -X POST http://localhost:5000/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Login button not working",
    "description": "The login button on the homepage does not respond when clicked. I tried on Chrome and Firefox with the same result.",
    "category": "Bug",
    "submitterName": "John Doe",
    "submitterEmail": "john@example.com"
  }'
  ```

#### 2. Admin Login
**POST** `/api/auth/login`

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
  ```

#### 3. Get All Feedback (with Filters)
**POST** `/api/feedback`

```bash
# Get all feedback (page 1, 10 items per page)
curl http://localhost:5000/api/feedback \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
  ```

```bash
# Get feedback with pagination
curl http://localhost:5000/api/feedback \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -G --data-urlencode "page=1" \
  --data-urlencode "limit=10"
  ```

  ```bash
# Filter by status (new, in-progress, resolved)
curl http://localhost:5000/api/feedback \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -G --data-urlencode "status=new"
  ```

  ```bash
# Filter by sentiment (Positive, Neutral, Negative)
curl http://localhost:5000/api/feedback \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -G --data-urlencode "sentiment=Negative"
  ```

  ```bash
# Combine multiple filters
curl http://localhost:5000/api/feedback \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -G --data-urlencode "page=1" \
  --data-urlencode "limit=5" \
  --data-urlencode "status=new" \
  --data-urlencode "sentiment=Positive"
  ```

#### 4. Update Feedback Status
**PATCH** `/api/feedback/:id`

```bash
# Update status to in-progress
curl -X PATCH http://localhost:5000/api/feedback/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"status": "in-progress"}'
  }'
```

```bash
# Update status to resolved
curl -X PATCH http://localhost:5000/api/feedback/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"status": "resolved"}'
```

#### Project Structure

```
feedpulse/
│
├── backend/                          # Node.js Express API
│   ├── src/
│   │   ├── server.ts                 # Express app initialization & routes
│   │   ├── config/
│   │   │   ├── db.ts                 # MongoDB connection logic
│   │   │   └── env.ts                # Environment variables loading
│   │   ├── controllers/              # HTTP request handlers
│   │   │   ├── feedbackController.ts # POST /api/feedback handler
│   │   │   ├── updateFeedbackController.ts  # PATCH /api/feedback/:id handler
│   │   │   └── loginController.ts    # POST /api/auth/login handler
│   │   ├── middleware/               # Express middleware
│   │   │   ├── authMiddleware.ts     # JWT token verification
│   │   │   ├── rateLimiter.ts        # Rate limiting (prevents abuse)
│   │   │   └── errorHandler.ts       # Global error handling
│   │   ├── models/
│   │   │   └── Feedback.ts           # MongoDB Feedback schema
│   │   ├── routes/
│   │   │   └── feedbackRoutes.ts     # API route definitions
│   │   ├── services/
│   │   │   └── gemini_service.ts     # Google Gemini AI analysis
│   │   ├── utils/
│   │   │   └── sanitizer.ts          # Input sanitization (XSS prevention)
│   │   └── validators/
│   │       └── feedback_val.ts       # Zod validation schemas
│   ├── .env                          # Environment variables (NOT committed)
│   ├── .gitignore                    # Files to ignore in git
│   ├── package.json                  # Dependencies & scripts
│   ├── tsconfig.json                 # TypeScript configuration
│   └── README.md                     # Backend documentation
│
├── frontend/                         # Next.js React frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx            # Root HTML layout
│   │   │   ├── page.tsx              # Home page (feedback form)
│   │   │   ├── globals.css           # Tailwind CSS imports & animations
│   │   │   ├── components/
│   │   │   │   └── FeedbackForm.tsx  # Feedback submission form component
│   │   │   └── dashboard/
│   │   │       ├── page.tsx          # Admin dashboard (feedback management)
│   │   │       └── login/
│   │   │           └── page.tsx      # Admin login page
│   │   └── (other Next.js files)
│   ├── public/                       # Static assets
│   ├── .env.local                    # Local environment variables
│   ├── .gitignore                    # Files to ignore in git
│   ├── package.json                  # Dependencies & scripts
│   ├── tsconfig.json                 # TypeScript configuration
│   ├── next.config.ts                # Next.js configuration
│   ├── postcss.config.mjs            # PostCSS for Tailwind
│   └── README.md                     # Frontend documentation
│
├── .gitignore                        # Root .gitignore
└── README.md                         # This file

```

### Screenshots

<img width="1918" height="896" alt="image" src="https://github.com/user-attachments/assets/ae88dbfd-ece2-47c2-b612-35f059128c1c" />



