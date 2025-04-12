# 📸 InstaFuse — Instagram Integration Suite

[![MERN Stack](https://img.shields.io/badge/MERN-Stack-61DAFB?style=for-the-badge&logo=react&logoColor=white)](#tech-stack)

A modern Instagram management dashboard built with the MERN stack, featuring seamless OAuth integration, post analytics, and comment management through Instagram's Graph API. ⚡


## ✨ Key Features

- 🔐 **Instagram OAuth 2.0** via Facebook Login
- 🔄 **Token Management** with automatic refresh
- 📊 **Post Analytics** (Likes, Comments, Reach)
- 💬 **Comment Moderation** with reply functionality
- 📱 **Responsive Dashboard** with dark/light modes
- 📦 **State Management** with Zustand
- 🚀 **REST API** with Express.js

## 🛠 Tech Stack

**Frontend**  
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs)
![Zustand](https://img.shields.io/badge/Zustand-2A2A2A?style=flat&logo=react)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios)

**Backend**  
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express)
![Instagram Graph API](https://img.shields.io/badge/Instagram_Graph_API-E4405F?style=flat&logo=instagram)

## 🚀 Quick Start

### Prerequisites
- Node.js ≥18.x
- Instagram Business/Creator Account
- [Facebook Developer App](https://developers.facebook.com/)

### Installation

1. **Clone Repository**
```bash
git clone https://github.com/yourusername/instafuse.git
cd instafuse



Backend Setup

cd server
npm install
cp .env.example .env
npm run dev


Frontend Setup

cd ../client
npm install
cp .env.example .env
npm start



🔧 Configuration



.env Example:
# Server
INSTAGRAM_APP_ID=your_app_id
INSTAGRAM_APP_SECRET=your_app_secret
REDIRECT_URI=http://localhost:5000/auth/callback

# Client
VITE_API_BASE_URL=http://localhost:5000/api
VITE_INSTAGRAM_OAUTH_URL=https://api.instagram.com/oauth
📚 API Endpoints
Method	Endpoint	Description
GET	/auth/login	Initiate OAuth flow
GET	/auth/callback	OAuth callback handler
GET	/api/media	Get user media
POST	/api/comments/:id	Post comment reply
GET	/api/analytics	Get post metrics
🧠 State Management


🌟 Pro Tips
Use long-lived tokens (60 days) for production

Implement rate limiting for API calls

Add error boundaries in React components

Use React Query for data fetching

🤝 Contributing
Fork the project

Create your feature branch (git checkout -b feature/amazing-feature)

Commit changes (git commit -m 'Add amazing feature')

Push to branch (git push origin feature/amazing-feature)

Open Pull Request

📄 License
Distributed under the MIT License. See LICENSE for more information.

📬 Contact
Dikshit Mahanot - @dikjain - dikshitmahanot2005@gmail.com

Project Link: https://github.com/dikjain/instaAssignment-frontend