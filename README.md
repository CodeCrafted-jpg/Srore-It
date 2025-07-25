 📦 Store-It

[![Live Demo](https://img.shields.io/badge/Live-Demo-green?style=flat-square)](https://srore-it.vercel.app/)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Appwrite](https://img.shields.io/badge/Backend-Appwrite-ff385c?logo=appwrite&logoColor=white)](https://appwrite.io/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](#license)

---

## 🚀 Overview

**Store-It** is a modern web app that allows users to upload, manage, and organize files in the cloud — securely and efficiently.

🔗 **Live Site**: [https://srore-it.vercel.app](https://srore-it.vercel.app)

---

## ✨ Features

- 🔐 **Authentication** via Appwrite
- 📁 **File Uploading** with drag-and-drop support
- 📊 **Dashboard** with real-time storage usage and analytics
- 🗃️ Categorized file listing (images, documents, videos, etc.)
- 🔍 **Search & filter** functionality
- 🧾 File details viewer (size, type, preview, extension)
- 🧹 File deletion & management
- 📦 Storage tracking by file type
- ✅ Responsive & accessible UI with Radix UI and Tailwind

---

## 🛠️ Tech Stack

### Frontend

- **Next.js 15**
- **React 19**
- **TailwindCSS** + **Radix UI**
- **React Hook Form + Zod** (for form validation)
- **Recharts** (for analytics)

### Backend

- **Appwrite** (Storage, Auth, Database)
- **node-appwrite** SDK

---

## 🧑‍💻 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/store-it.git
cd store-it
2. Install dependencies
bash
Copy
Edit
npm install
3. Add environment variables
Create a .env.local file and add:

env
Copy
Edit
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_BUCKET_ID=your_bucket_id
(Adjust if using self-hosted Appwrite.)

4. Start the development server
bash
Copy
Edit
npm run dev
📁 Folder Structure
bash
Copy
Edit
/components     # Reusable UI components
/app            # Next.js App Router
/lib            # Appwrite client and helpers
/constants      # App-wide constants
/types          # TypeScript interfaces
/assets         # Static icons/images
📸 Screenshots
(Add relevant screenshots here once you have them)

📦 Deployment
Deployed using Vercel. To deploy your own:

Push code to GitHub

Connect repo to Vercel

Add environment variables

Done!

🧾 License
This project is licensed under the MIT License.

author
 **Sayan Mallick**
