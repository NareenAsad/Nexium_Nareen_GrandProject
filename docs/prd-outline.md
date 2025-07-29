# Product Requirements Document (PRD): AI Pitch Writer

## 1. Introduction

### 1.1 Document Purpose
To define the requirements for the AI Pitch Writer application, guiding development, design, and testing.

### 1.2 Product Vision
An AI-powered platform that enables users to quickly generate compelling pitches for various purposes (startup, product, personal, investor) using Groq AI integrated through an n8n-powered workflow.

### 1.3 Target Audience
Entrepreneurs, startup founders, product managers, job seekers, sales professionals, and anyone needing to craft professional pitches efficiently.

## 2. Business Goals

### 2.1 Key Objectives
- Enable users to generate high-quality pitches in minutes.
- Provide a user-friendly interface for pitch customization and management.
- Offer a secure and private environment for user data.
- Support open contributions and growth of the app’s features.

### 2.2 Success Metrics (KPIs)
- Number of pitches generated per user.
- User retention rate.
- Feedback or star ratings from users.
- Application performance and uptime.

## 3. User Stories / Use Cases

- As a **startup founder**, I want to **generate a compelling investor pitch** so I can secure funding.
- As a **product manager**, I want to **create a product launch pitch** so I can introduce new features effectively.
- As a **job seeker**, I want to **craft a personal brand pitch** so I can stand out in interviews.
- As a **user**, I want to **view my past pitches** in a dashboard.
- As a **user**, I want to **delete pitches** I no longer need.
- As a **user**, I want to **copy generated pitches** to my clipboard for reuse.

## 4. Functional Requirements

### 4.1 User Authentication
- Users can sign up and sign in using Supabase Magic Link.
- Users can securely sign out.

### 4.2 Pitch Generation
- Users input an idea and select a pitch type (Startup, Product, Personal, Investor).
- Optional field: Additional context/details.
- AI-generated pitch is created using Groq’s LLaMA-3 model via an n8n workflow/webhook.
- Display a loading state while pitch is being generated.
- Render the pitch in a readable format using Markdown.

### 4.3 Pitch Management
- Users can view a list of their past pitches in a dashboard (Pitch History).
- Users can view full pitch details on a dedicated page.
- Users can delete individual pitches.
- Users can copy content to clipboard with one click.

### 4.4 Data Storage
- Store user information (ID, email).
- Store pitch information: ID, userId, title, content, type, metadata, timestamps.

## 5. Non-Functional Requirements

### 5.1 Performance
- Pitch generation via AI should complete in 5–10 seconds.
- Fast app load times (< 2s per page).

### 5.2 Security
- Supabase authentication with Magic Link.
- All data encrypted at rest and in transit.
- Authorization checks to ensure data isolation between users.

### 5.3 Usability
- Clean, intuitive UI with animations.
- Responsive layout across desktop, tablet, and mobile.
- Clear error handling and feedback messages.

### 5.4 Scalability
- MongoDB and Groq APIs integrated via n8n should scale with growing users.
- Vercel deployment ensures scalability for global traffic.

### 5.5 Accessibility
- Follows WCAG accessibility standards (keyboard navigation, ARIA labels, semantic HTML).

## 6. Technical Specifications

### 6.1 Frontend
- **Framework:** Next.js 15 (App Router)
- **React:** React 18
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **Animations:** Framer Motion

### 6.2 Backend
- Next.js Server Actions / API Routes

### 6.3 Database
- MongoDB via Prisma ORM

### 6.4 Authentication
- Supabase Magic Link (email-based login)

### 6.5 AI Integration
- n8n workflow with Groq API (via Webhook)
- Model: `llama-3.1-8b-instant`

### 6.6 Deployment
- Vercel

## 7. Future Considerations (Out of Scope for V1)

- User profiles and editable settings
- Pitch editing functionality after generation
- Predefined pitch templates
- Integration with additional AI models (e.g., OpenAI, Claude)
- Premium tier with advanced features
- Social sharing or export to PDF

## 8. Project Timeline & Deliverables

| **Milestone**             | **Date**   | **Push to**                 |
|--------------------------|------------|-----------------------------|
| PRD + wireframes         | Day 15     | `/grand-project/docs/`     |
| Backend & DB setup       | Day 18     | `/grand-project/api/`      |
| Frontend UI              | Day 21     | `/grand-project/app/`      |
| AI logic + testing       | Day 24     | `/grand-project/ai/`       |
| Public demo live         | Day 27     | —                           |
| Docs  | Day 29     | `README.md`                |
