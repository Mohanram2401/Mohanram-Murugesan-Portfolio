# Aura Portfolio

Build a stunning, highly animated, ultra-modern, interactive, and professional developer portfolio web application with a secure Admin Dashboard backend. 

### Modern Visual Aesthetic & Color Palette

* Design Style: High-end dark mode aesthetics with sleek glassmorphism, subtle glowing accents, clean typography, and spacious layout.

* Color Palette:

  - Background: Very dark slate/black (`#0B0F17`)

  - Surface/Cards: Glassmorphism translucent dark slate (`#151C2C` with blur/opacity)

  - Primary Accent: Radiant Neon Electric Blue (`#3B82F6`)

  - Secondary Accent: Cyber Purple (`#8B5CF6`) or Vibrant Cyan (`#06B6D4`)

  - Text: Bright White (`#F9FAFB`) for headers, Soft Muted Gray (`#9CA3AF`) for body text

* UI Components: Lucide React icons, Tailwind CSS styling, Framer Motion transitions/effects, glowing borders on hover, dynamic gradient text, and responsive cards.

---

### Key Application Features & Architecture

#### 1. Public Portfolio Page (Highly Animated & Engaging)

Include smooth scrolling nav bar, scroll progress indicator, and section reveal animations.

* **Hero Section:** Dynamic animated headline, high-impact subtitle, interactive CTA buttons ("Explore Projects", "View Resume", "Get in Touch"), interactive background canvas/particles or subtle floating gradient orbs.

* **About & Skills:** Visual tech-stack radar/grid with dynamic progress bars or glowing skill tags categorized by Frontend, Backend, Database, and Tools.

* **Experience & Education:** Interactive vertical timeline with expandable nodes, glowing bullet points, company logos/placeholders, and dates.

* **Projects Showcase:** Interactive project grid with tag filters (e.g., React, Node, AI, Firebase). Each card features project preview image/placeholder, interactive live demo & GitHub buttons, key tech badges, and a modal view for deeper project details.

* **Certifications:** Modern badge-style showcase with credential links and verification dates.

* **Contact Section:** Functional contact form with success animations, along with direct links to GitHub, LinkedIn, Email, and social platforms.

#### 2. Protected Admin Dashboard (`/admin`)

* **Authentication:** Firebase Auth modal/page for secure email/password login. Route guards to protect the `/admin` page.

* **Content Management (Full CRUD Operations):**

  - Ability to Add, Edit, Update, and Delete Projects, Experience entries, Education history, Certifications, and Skills in real-time.

  - Image upload support or image URL input fields for project thumbnails and badges.

  - Form validation with interactive toast notification alerts for success/failure.

#### 3. Database & Backend Integration (Firebase)

* Integrate Firebase Firestore as the primary database for storing dynamic content (Projects, Skills, Experience, Education, Certifications).

* Include a `firebase.ts` configuration setup that loads credentials cleanly from environment variables (`import.meta.env`).

* Set up dynamic fallback mock data so the app looks complete immediately while waiting for Firebase configuration keys to be populated.

---

### Instructions for Code Generation

* Build all components using React, TypeScript, Tailwind CSS, and Lucide React icons.

* Use Framer Motion or Tailwind animations for entry transitions, hover lifts, glowing card states, and smooth modals.

* Ensure 100% responsiveness across desktop, tablet, and mobile browsers.

* Keep code modular with clean separation between UI components, Firebase service layers, and page routes (Public Home vs. Admin Panel).

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/bf740d1b-744e-4715-80be-344316a4cc85).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
