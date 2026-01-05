# Ghufron Ainun Najib - Portfolio

<div align="center">
  <img src="/public/favicon.svg" alt="Logo" width="80" height="80" />
  
  <h1>Artisan Web Experiences</h1>
  
  <p>
    A premium personal portfolio website showcasing projects and skills with a <strong>Brutalist Editorial</strong> design system.
    Built with modern web technologies and a focus on performance, accessibility, and smooth animations.
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  </p>
</div>

<br />

![Portfolio Preview](/public/og-image.png)

## 🎨 Design Philosophy

This portfolio departs from standard card-based layouts, embracing an **Editorial Brutalist** aesthetic:

- **Asymmetric Layouts**: Intentional grid breaks and whitespace usage.
- **Typography First**: Strong contrast between Serif headings (_Playfair Display_) and Mono technical details (_JetBrains Mono_).
- **Motion Design**: Fluid transitions powered by `framer-motion` and `locomotive-scroll` behaviors.

## ✨ Key Features

- **Smooth Scroll**: Custom lenis-like scrolling experience.
- **CMS Integration**: Supabase-backed admin dashboard for managing blog posts.
- **Dynamic Theming**: System-aware Dark/Light mode with comprehensive color token mapping.
- **Responsive Navigation**: Mobile-first menu with backdrop blurs and gesture support.
- **Security**: Row Level Security (RLS) enabled on database tables.

## 🛠️ Tech Stack

**Frontend**

- **Core**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn/UI (Radix Primitives)
- **Animation**: Framer Motion
- **Icons**: Lucide React

**Backend**

- **BaaS**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage

**Tooling**

- **Linting**: ESLint, Prettier
- **Git Hooks**: Husky (optional setup)

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/Ghufrnainun/My-Porto-Guwe.git
    cd My-Porto-Guwe
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory:

    ```env
    VITE_SUPABASE_URL=your_project_url
    VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── ui/           # Shadcn/Radix primitives
│   └── ...           # Feature components (Hero, About, etc.)
├── pages/            # Route pages (Index, Projects, etc.)
├── hooks/            # Custom React hooks (useAuth, etc.)
├── integrations/     # Supabase client & generated types
└── index.css         # Global styles & Tailwind directives
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <p>Crafted with coffee by <a href="https://github.com/Ghufrnainun">Ghufron Ainun Najib</a></p>
</div>
