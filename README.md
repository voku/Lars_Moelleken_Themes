# Lars Moelleken Themes

Animated portfolio site for Lars Moelleken with topic-driven sections, multiple visual themes, and a static GitHub Pages deployment flow.

## Overview

This repository contains a Vite + React + TypeScript single-page application that presents Lars Moelleken's profile, open-source work, and engineering focus areas in a highly stylized portfolio experience.

## Highlights

- Multi-theme presentation with manual and automatic theme switching
- Section-based storytelling for identity, architecture, open source, experience, and engineering
- Motion-driven transitions and scroll-aware navigation
- Static build output suitable for GitHub Pages

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Motion
- Lucide React

## Local Development

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
npm ci
```

### Start the dev server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## Available Scripts

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

- `npm run lint`: TypeScript type-checking
- `npm run build`: production build to `dist/`
- `npm run preview`: preview the production build locally

## Deployment

GitHub Pages deployment is automated through GitHub Actions.

- Push to `main` to trigger a production build and Pages deployment
- The workflow publishes the Vite output from `dist/`
- The Vite base path is configured for the repository Pages URL and can be overridden with `VITE_BASE_PATH` if needed

## Project Structure

```text
.
├── index.html          # App shell, SEO metadata, Open Graph tags
├── public/             # Static assets such as favicon and social preview image
├── src/
│   ├── App.tsx         # Main portfolio experience and sections
│   ├── index.css       # Theme tokens and styling
│   └── main.tsx        # React bootstrap
├── vite.config.ts      # Vite config and GitHub Pages base path handling
└── .github/workflows/  # Automated deployment workflow
```

## Key Files Detector Helper Prompt

Use this prompt when you want an agent to quickly identify the most relevant files for a change:

```text
Scan this repository and list the key files for the task. Group them by:
1. entry points
2. UI components
3. styling
4. build and deployment configuration
5. documentation
6. tests or validation

For each file, explain why it matters and call out any related environment variables, scripts, or workflows that could affect the change.
```

## Production Build Verification

Validate the application before shipping:

```bash
npm run lint
npm run build
```
