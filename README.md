# Aura Portfolio - Cyber Security & Software Engineering Portfolio

Aura Portfolio is a stunning, highly animated, ultra-modern, interactive, and professional developer portfolio web application built with **React**, **TypeScript**, and **Tailwind CSS**. It is integrated with a secure **Supabase** backend for CRUD content management and **Cloudinary** for drag-and-drop resume hosting.

## 🚀 Key Visual & Interactive Features

1. **Cybersecurity Startup Preloader:**
   * A sequential checklist that simulates firewall diagnostics, database handshakes, and decryption progress from `0%` to `100%` with green checkmarks (`[✓] OK`) before transitioning into the main viewport.

2. **Interactive Security Shell Bot (Terminal):**
   * Floating at the bottom-left corner of the screen is a robot-themed chatbot helper.
   * Features bot reply icons, a blinking cursor, CRT scanlines, and fluid layout scaling (supports Minimize, Restart Connection, and Maximize to Center Fullscreen).
   * Supports command executions: `help`, `about`, `projects`, `whoami`, `contact` (interactive questionnaire sequence dispatched directly to Supabase).

3. **Desktop & Mobile Navbar triggers:**
   * Header contains a matching Terminal trigger button that toggles the Shell helper from anywhere.
   * Leverages a tablet-friendly breakpoint wrap (`lg:hidden`) to prevent layout clipping when browser DevTools are open.

4. **3D Skills Globe:**
   * Hover-pausable canvas networks featuring orbiting glow particles.
   * Completely borderless modal layout dismissing seamlessly via the `ESC` key or backdrop clicks.

5. **Secured Admin Panel (`/admin`):**
   * Route-guard authentication connected to Supabase Auth.
   * Fully validated management forms for Projects, Experiences, Education details, and Certifications.
   * Streamlined Resume manager with automated drag-and-drop Cloudinary uploading.

---

## 🛠️ Technology Stack

* **Frontend:** React, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons.
* **Backend Database & Auth:** Supabase (PostgreSQL).
* **Asset Storage:** Cloudinary.
* **Routing:** TanStack Router & Start.

---

## ⚙️ Development Setup & Configuration

### 1. Database Setup (Supabase)
Initialize your Supabase database by running the following queries inside your Supabase **SQL Editor**:

```sql
-- Create Contacts Table
CREATE TABLE public.contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Settings Table
CREATE TABLE public.settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    roles TEXT[] NOT NULL,
    bio TEXT NOT NULL,
    avatar TEXT NOT NULL,
    email TEXT NOT NULL,
    github TEXT,
    linkedin TEXT,
    resume_url TEXT,
    show_resume BOOLEAN DEFAULT true,
    show_stats BOOLEAN DEFAULT true,
    stats JSONB DEFAULT '[]'::jsonb,
    visible_sections JSONB DEFAULT '{"about":true,"experience":true,"projects":true,"certifications":true,"contact":true}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Resumes Table
CREATE TABLE public.resumes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT DEFAULT 'pdf',
    active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

-- Set up Public Reading policies
CREATE POLICY "Allow public read access" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.resumes FOR SELECT USING (true);
CREATE POLICY "Allow public insert contacts" ON public.contacts FOR INSERT WITH CHECK (true);

-- Set up Authenticated Admin policies
CREATE POLICY "Admin full write settings" ON public.settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full write resumes" ON public.resumes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full read contacts" ON public.contacts FOR SELECT USING (auth.role() = 'authenticated');
```

Create a login user inside the **Authentication** panel in your Supabase dashboard to access the `/admin` portal.

### 2. File Storage (Cloudinary)
1. Set up an unsigned upload preset inside your Cloudinary settings dashboard.
2. Select raw file formats as allowed extensions (or leave open to accept PDF/TXT resumes).

### 3. Environment Variables Configuration
Create a `.env.local` file inside the root directory and populate it with your credentials:

```env
VITE_SUPABASE_URL=https://<your-project-id>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
VITE_CLOUDINARY_CLOUD_NAME=<your-cloud-name>
VITE_CLOUDINARY_UPLOAD_PRESET=<your-preset-name>
```

---

## 💻 Local Execution

### 1. Installation
```sh
npm install
```

### 2. Run Local Development Server
```sh
npm run dev
```

### 3. Build & Compile for Production
```sh
npm run build
```

---
*Created by Mohanram Murugesan. Built with React, Tailwind CSS, & Framer Motion.*
