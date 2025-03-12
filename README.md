# Attendly 💼

**Attendly** is a powerful and efficient **attendance management system** designed for seamless tracking and record-keeping. With a user-friendly interface and a robust backend, **Attendly** simplifies attendance tracking, making it easier for organizations to manage attendance effortlessly.  

---

## Features  

- **User Authentication** – Secure login & role-based access  
- **Attendance Tracking** – Mark, update, and monitor attendance in real-time  
- **Dashboard Analytics** – View attendance statistics & insights  
- **Role Management** – Different access levels for admins & users  
- **Responsive UI** – Optimized for both desktop & mobile use  

---

## 🛠 Tech Stack  

- **Next.js** - Frontend
- **TypeScript** - Type-safety
- **TailwindCSS** - Styling
- **Shadcn UI** - Components
- **Node.js** - Runtime
- **Express.js** - Backend
- **PostgreSQL** - Database
- **JWT Authentication** - Security
- **Docker** - Containerization
- **CICD (GitHub Actions)** - Automation

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/TamizhSK/Attendly.git
cd Attendly
```

### 2️⃣ Install Dependencies

```sh
npm install
```

### 3️⃣ Set Up Environment Variables

Create a `.env` file in the root directory and add the required environment variables:

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 4️⃣ Run the Application

```sh
npm run dev
```

🔹 The app should now be running at http://localhost:3000

## 📜 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /auth/login | User Login |
| POST   | /auth/signup | User Registration |
| GET    | /attendance | Fetch attendance data |
| POST   | /attendance | Mark attendance |

## ☁️ Deployment

🔹 Attendly supports Docker for easy deployment:

```sh
docker-compose up --build
```

## 📬 Feedback & Contributions

We welcome contributions! If you have any suggestions or encounter any issues, feel free to:

- Submit a pull request
- Open an issue

Peace :)
