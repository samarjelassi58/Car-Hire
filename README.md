Car Rental App - README
A full-stack web application for renting cars online. Built with Node.js, Express, React.js, and MongoDB.
📦 Tech Stack
- Frontend: React.js, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB
- Authentication: JWT (JSON Web Tokens)
- State Management: Redux Toolkit
- API Testing: Postman
📁 Project Structure
car-rental-app/
├── backend/            # Node.js + Express API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/           # React app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── app/
│   │   │    ├── redux/
│   │   │    └── store.jsx
│   │   └── App.jsx
├── .gitignore
├── README.md
🚀 Getting Started
1️⃣ Clone the Repository
git clone https://github.com/your-username/car-rental-app.git
cd car-rental-app
2️⃣ Setup Backend
cd backend
npm install
nodemon server.js

> The backend runs on http://localhost:5173
3️⃣ Setup Frontend
cd ../frontend
npm install
npm run dev

> The React app runs on http://localhost:5173
✨ Features
- Secure Login & Register
- View available cars
- Book and manage reservations
- Admin dashboard for managing cars and bookings
- Real-time updates and status changes
🌍 API Endpoints (examples)
| Method | Endpoint             | Description         |
|--------|----------------------|---------------------|
| POST   | /api/auth/register   | Register new user   |
| POST   | /api/auth/login      | Authenticate user   |
| GET    | /api/cars            | Get available cars  |
🛠 Environment Variables
Create a .env file in /backend:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
👤 Author
Name: samar Jelassi
Email: samar.jelassi@episousse.com.tn

📄 License
This project is licensed under the MIT License.
