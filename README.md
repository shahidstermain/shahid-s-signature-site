# Shahid Moosa — Signature Portfolio

The personal engineering portfolio of Shahid Moosa, a Distributed Systems Engineer specializing in cloud databases, high-scale query optimization, and reliable infrastructure.

This site serves as a central hub for my technical writing, resume, and engineering philosophy. It is built with performance, accessibility, and SEO in mind.

## 🛠️ Tech Stack

*   **Frontend**: React 18, TypeScript, Vite
*   **Styling**: Tailwind CSS, Shadcn UI, Custom Design System
*   **Animation**: Framer Motion
*   **Routing**: React Router v6
*   **Icons**: Lucide React
*   **Deployment**: Firebase Hosting

## 🚀 Key Features

*   **Technical Blog**: A custom markdown-based blog engine rendering technical deep dives into distributed systems (CAP theorem, sharding, consistency models).
*   **SEO & Metadata**: Fully optimized with Open Graph tags, Twitter Cards, JSON-LD structured data, and dynamic sitemap generation.
*   **RSS Feed**: Automatic RSS feed generation for blog syndication.
*   **Interactive UI**: Features a "Live Terminal" component and subtle ambient glow effects.
*   **Responsive Design**: Mobile-first approach with optimized layouts for all screen sizes.

## 📂 Project Structure

```
src/
├── assets/        # Static assets (images, logos)
├── components/    # React components
│   ├── layout/    # Header, Footer
│   ├── sections/  # Home page sections (Hero, Writing, etc.)
│   └── ui/        # Reusable UI primitives (Button, Card, etc.)
├── data/          # Static content data (articles.ts)
├── hooks/         # Custom React hooks
├── lib/           # Utility functions (RSS, Sitemap, Utils)
├── pages/         # Route components (Index, BlogPost, RSSFeed)
└── App.tsx        # Main application entry & routing
```

## 📜 Engineering Philosophy

*   **Data is the product**: Every query matters. Treating database interactions with the gravity of revenue impact.
*   **Fast debugging**: Developing intuition for finding root causes in distributed systems quickly.
*   **Reliability over features**: Prioritizing boring solutions that work over clever ones that fail at 3 AM.
*   **Knowledge Sharing**: Teaching and documenting to empower other engineers.

## 💻 Development

### Prerequisites

*   Node.js (v18+)
*   npm

### Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Deploy to Firebase
firebase deploy
```

## 📄 License

All original content (blog posts, personal bio) is © Shahid Moosa.
Code is provided for educational purposes.
