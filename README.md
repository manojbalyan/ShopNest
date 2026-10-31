<div align="center">
  <img src="https://cdn-icons-png.flaticon.com/512/3514/3514491.png" alt="ShopNest Logo" width="80" />
  <h1>ShopNest - Full-Stack MERN E-Commerce App</h1>
  <p>A modern, full-stack E-commerce platform engineered with React, Node.js, Express, and MongoDB. Founded and maintained by Manoj Balyan.</p>
</div>

---

## 🛠 Tech Stack Details

- **Frontend:** Pure React.js (`react-scripts`), Redux Toolkit (for Cart state management), AuthContext API (for JWT user sessions).
- **Backend:** Node.js, Express.js architecture mapped with middleware-based routing.
- **Database:** MongoDB (via Mongoose schemas).
- **DevOps & CI/CD:** Docker (containerized backend), Docker Compose, GitHub Actions (automated build checks & Render deploy).
- **Features:** Unified Admin Dashboard, Direct Cloudinary Content Maps, Personal User Profiles matching mapped Order Histories.
- **Payments:** Razorpay fully implemented (utilize your test metrics or placeholder).
- **Cloud Storage:** Cloudinary integration for Product image uploading securely via Multer.

---

## 🚀 Quick Start / Local Development Guide

The workspace is configured beautifully using a monorepo-friendly setup with `concurrently`, enabling you to start everything from the very root folder.

### 1️⃣ Dependencies & Environments
Make sure you have MongoDB running locally, or map it to a remote database string.

Inside the `backend/` folder, ensure your `.env` looks like this:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/shopnest
JWT_SECRET=super_secret_key
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

From the **root folder** `shopnest/`, trigger a full install across environments:
```bash
npm run build
```

### 2️⃣ Populate the Database (Seeding)
Test the platform rapidly featuring beautiful dummy products (Unsplash) and automatic `Admin` role provisioning:
```bash
npm run seed
```
> **Seed Admin Access:** Email: `admin@shopnest.com` | Password: `password123`

### 3️⃣ Run Servers Start
Run this single command at the root to bind the Backend (Port 5000) and Frontend (Port 3000) natively:
```bash
npm run dev
```

---

## ☁️ 1-Click Deployment (Render Free-Tier Optimized)

The server codebase features a seamless fallback mechanic leveraging Node `process.env.NODE_ENV === "production"`. When deployed to Render as a singular instance, the Express backend hosts and correctly resolves static routes to `/frontend/build` rendering the whole platform completely free on 1 Node server.

1. Publish this repo onto **GitHub**.
2. Go to [Render Dashboard](https://dashboard.render.com).
3. Connect Repo -> Create a **Web Service**.
4. Configure Build Command:
   `npm run render-build` 
   *(This cleanly installs API + UI node_modules then generates `react-scripts build`)*
5. Configure Start Command:
   `npm start`
6. Open **Advanced > Environment Variables** and map your `.env` fields heavily defining `NODE_ENV = production`.
7. Hit **Deploy**. The robust path resolving inside `/backend/server.js` hosts it fluidly!

---

## 🐳 Docker Setup

### Option 1: Run Backend in Docker (Standalone)
Build and run the containerized Node.js backend:
```bash
# 1. Build the Docker image from backend directory
cd backend
docker build -t shopnest-backend .

# 2. Run the Docker container
docker run -p 5000:5000 --env-file .env shopnest-backend
```

### Option 2: Run Full Stack with Docker Compose
Run both the Backend and MongoDB locally with a single command:
```bash
# From project root
docker compose up --build
```

---

## 🔄 Automated CI/CD Pipeline (GitHub Actions)

This project uses **GitHub Actions** for automated Continuous Integration and Continuous Deployment (CI/CD):

1. **Continuous Integration (CI):**
   - On every `git push` or `pull_request` to the `master` branch, GitHub Actions:
     - Installs backend dependencies and checks backend health.
     - Installs frontend dependencies and verifies `npm run build` succeeds cleanly.
2. **Continuous Deployment (CD):**
   - Once all build checks pass on `master`, GitHub Actions triggers an automatic deployment to Render via a **Deploy Hook**.

### How to configure Render Auto-Deploy:
1. In your **Render Dashboard** -> Open your ShopNest Web Service.
2. Go to **Settings** -> Scroll down to **Deploy Hook** -> Copy the URL.
3. In your **GitHub Repository** -> Go to **Settings > Secrets and variables > Actions**.
4. Click **New repository secret**:
   - Name: `RENDER_DEPLOY_HOOK_URL`
   - Value: `<Paste your Render Deploy Hook URL>`
5. Done! Every future commit pushed to `master` will now test and deploy automatically!

---

## 📄 Postman Documentations
This repository includes a fully-scaffolded API testing toolkit: **`ShopNest_Postman_Collection.json`**. 
Simply Import this file directly into the local Postman IDE. It features variables like `{{token}}` properly mapped to effortlessly check protected admin/user/order payloads. Happy coding!
