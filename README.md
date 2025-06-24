# 📬 InboxIQ – AI-Powered Job Application Tracker

InboxIQ is an AI assistant-powered app that helps job seekers analyze, improve, and track job-related emails. It integrates resume uploads, Microsoft Outlook scanning, and OpenAI-powered insights — all in one streamlined, cloud-native dashboard.

## ✨ Features

- ✅ **Upload Resumes (PDF/TXT)** – AI will analyze and suggest improvements to your resume.
- 🤖 **AI Assistant (GPT-4)** – Ask questions like “How can I improve my job search?” or “Give me tips based on this rejection.”
- 📥 **Outlook Email Scanning** – Detects job applications, interview invites, and rejections.
- 📊 **Keyword Matching & Analytics** – Tracks email trends (coming soon).
- 🌐 **Modern UI** – Built with Next.js, Tailwind CSS, and React Query.

---

## 🧱 Tech Stack

| Category        | Tech                                               |
|----------------|----------------------------------------------------|
| Frontend       | Next.js (App Router), Tailwind CSS, React Query    |
| Backend        | Next.js API Routes, AWS Lambda                     |
| AI Integration | OpenAI API (GPT-4.1 Assistant)                     |
| File Parsing   | `pdfjs-dist` for PDF text extraction               |
| Auth           | Azure OAuth (Microsoft login)                      |
| Infra (WIP)    | Terraform (S3, Lambda, DynamoDB)                   |
| DevOps         | GitHub Actions, Docker (Planned)                   |

---

## 🧠 How It Works

1. User uploads a resume and enters a question (e.g. "Improve my resume").
2. InboxIQ extracts text (PDF or TXT), combines it with the user’s prompt.
3. Sends the input to OpenAI GPT-4.1 via `/api/ai`.
4. Displays AI-generated insights to help improve job applications.

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- OpenAI API key
- Microsoft Azure App Registration (for login)
- AWS Account (for Lambda integration)

### Setup

```bash
git clone https://github.com/your-username/inboxiq.git
cd inboxiq
npm install

OPENAI_API_KEY=your_key
AZURE_AD_CLIENT_ID=your_client_id
AZURE_AD_CLIENT_SECRET=your_client_secret
AZURE_AD_TENANT_ID=common

npm run dev

💡 Roadmap
 Stream responses from OpenAI

 S3 resume storage

 Dashboard analytics (keyword trends, rejection ratios)

 Job board integration (LinkedIn, Indeed scraping)

 Resume autogeneration from prompt

👨‍💻 Author
Nicholas Bryant
Senior Software Engineer | Cloud DevOps | React + AWS
LinkedIn | Portfolio