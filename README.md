# AI Pitch Writer

## 🚀 Project Overview

The AI Pitch Writer is a powerful web application designed to help entrepreneurs, product managers, job seekers, and sales professionals quickly generate compelling and professional pitches using advanced Artificial Intelligence. Whether you need a startup pitch, a product launch presentation, a personal brand statement, or an investor deck, this app leverages AI to craft tailored content in minutes.

## ✨ Features

*   **AI-Powered Pitch Generation:** Generate high-quality pitches for various types (Startup, Product, Personal, Investor) using Groq's fast AI models.
*   **Customizable Prompts:** Provide your core idea and additional details to guide the AI in generating relevant content.
*   **Pitch History:** View and manage all your previously generated pitches in a dedicated dashboard.
*   **Full Pitch View:** Access the complete content of any generated pitch on a dedicated detail page.
*   **Copy to Clipboard:** Easily copy generated pitch content for use in other documents or presentations.
*   **Secure Authentication:** User authentication powered by Supabase magic links.
*   **Responsive Design:** A clean and intuitive user interface that works seamlessly across desktop and mobile devices.
*   **Engaging Animations:** Subtle UI animations using Framer Motion enhance the user experience.
*   **Documentation:** Includes a `doc/` folder with a PRD outline and wireframe descriptions.

## 🛠️ Technologies Used

*   **Framework:** Next.js 15 (App Router)
*   **React:** React 18
*   **Styling:** Tailwind CSS
*   **UI Components:** shadcn/ui
*   **Animations:** Framer Motion
*   **AI Integration:** Vercel AI SDK with Groq (llama-3.1-8b-instant)
*   **Database:** MongoDB (via Prisma ORM)
*   **Authentication:** Supabase Auth
*   **Deployment:** Vercel

## ⚙️ Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

Make sure you have the following installed:

*   Node.js (v18 or higher recommended)
*   npm (or pnpm/yarn)
*   Git

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/NareenAsad/AI-Powered-Web-App.git
cd AI-Powered-Web-App
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install --legacy-peer-deps
\`\`\`
*Note: The \`--legacy-peer-deps\` flag is used to resolve potential peer dependency conflicts with React 19 Release Candidates.*

### 3. Environment Variables

Create a \`.env.local\` file in the root of your project and add the following environment variables. You can use \`.env.example\` as a template.

\`\`\`plaintext
# Database - Replace with your actual MongoDB connection string
DATABASE_URL="mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<dbname>?retryWrites=true&w=majority"

# Supabase - Replace with your actual Supabase project values
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Groq API - Your provided API key
GROQ_API_KEY=gsk_YOUR_GROQ_API_KEY

\`\`\`

*   **MongoDB Setup:** Ensure you have a MongoDB Atlas cluster set up and replace `<username>`, `<password>`, `<cluster-name>`, and `<dbname>` with your actual database credentials.
*   **Supabase Setup:** Create a Supabase project and configure authentication (e.g., Email Magic Link). Get your project URL and Anon Key from your Supabase project settings.
*   **Groq API Key:** Obtain an API key from Groq and replace `gsk_YOUR_GROQ_API_KEY`.

### 4. Initialize Prisma and Push Schema

After configuring your `DATABASE_URL`, initialize Prisma and push your schema to MongoDB:

\`\`\`bash
npm run db:generate
npm run db:push
\`\`\`

### 5. Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### 6. Build for Production

\`\`\`bash
npm run build
\`\`\`

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements or find any bugs, please open an issue or submit a pull request.
