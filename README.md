# A&X Labs Website

AI Engineering & Hardware Integration Consultancy website built with SvelteKit.

## Features

- ⚡ SvelteKit + TypeScript + Tailwind CSS
- 📝 Markdown-driven content for easy updates
- 🎨 Dark industrial design aesthetic
- ✨ Glitch text preloader animation
- ♿ Accessibility-first with WCAG compliance
- 📱 Fully responsive
- 🔍 SEO optimized

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── lib/
│   ├── components/     # Reusable components
│   ├── sections/       # Page sections (Hero, Services, About, Contact)
│   ├── animations/     # Animation utilities
│   ├── utils/          # Helper functions
│   ├── stores/         # Svelte stores
│   └── types.ts        # TypeScript types
├── routes/             # SvelteKit routes
└── app.html           # HTML template

content/               # Markdown content files
├── hero.md
├── services.md
├── about.md
└── contact.md

static/                # Static assets
├── .nojekyll
├── robots.txt
├── humans.txt
└── favicon.svg
```

## Content Management

Edit markdown files in `/content/` directory to update website content without touching code.

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.
