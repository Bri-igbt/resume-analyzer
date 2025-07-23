# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

### Tailwind CSS IntelliSense

This project has been configured to work with the [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) extension for VS Code. This extension provides:

- Autocomplete for Tailwind CSS classes
- Syntax highlighting for Tailwind CSS classes
- Linting for Tailwind CSS classes
- Hover previews for Tailwind CSS classes

To use Tailwind CSS IntelliSense:

1. Install the [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) extension in VS Code
2. Restart VS Code
3. Open a file with Tailwind CSS classes (e.g., any .tsx file in the app directory)
4. Start typing a Tailwind CSS class name in a `className` attribute to see autocomplete suggestions

The project includes the following configuration files for Tailwind CSS IntelliSense:

- `tailwind.config.js` - Configuration for Tailwind CSS
- `.vscode/settings.json` - VS Code settings for Tailwind CSS IntelliSense
- `types/tailwind.d.ts` - TypeScript type definitions for Tailwind CSS

---

Built with ❤️ using React Router.
