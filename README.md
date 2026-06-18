# Cardora - Next.js Frontend

A modern, performant Next.js 16 application for Cardora's car dealership website. Built with React 19, TypeScript, Tailwind CSS, and integrated with Typesense for vehicle search.

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v18.17.0 or higher (v20+ recommended)
- **npm**: v9+ or **yarn** v3.6+ or **pnpm** v8+

### Installation & Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cardora-fe
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint to check code quality |

## 🎨 Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 16.2.4 | React framework with SSR/SSG |
| **React** | 19.2.4 | UI library |
| **TypeScript** | 5 | Type safety |
| **Tailwind CSS** | 4 | Utility-first CSS framework |
| **Lucide React** | 1.8.0 | Icon library |
| **React Query** | 5.99.2 | Server state management |
| **Typesense** | 3.0.6 | Search & filtering |

## 🏗️ Architecture Patterns

### Folder Structure Conventions

- **Page files**: Use Next.js convention (`page.tsx`, `layout.tsx`)
- **Component directories**: Group related components in feature folders
- **Naming**: PascalCase for components, camelCase for utilities
- **Index files**: Export components from `index.ts` for cleaner imports
- **Constants & Types**: Co-locate with related components when specific, or keep in feature folder


### Import Paths

The project uses path aliases for cleaner imports:
- `@/app` - App directory files
- `@/components` - React components
- `@/lib` - Utility functions
- `@/assets` - Static assets
- `@/constants` - Constants
- `@/types` - Type definitions

 
## 📦 Build & Deployment

### Build for Production

```bash
npm run build
```

### Run Production Build Locally

```bash
npm start
```

### Deploy to Vercel (Recommended)

1. Push code to GitHub repository
2. Connect repository to [Vercel](https://vercel.com)
3. Vercel automatically detects Next.js and configures build settings
4. Environment variables are set in Vercel dashboard
5. Deploy on push to main branch

## 🎯 Key Features

- ✅ Server-side rendering with Next.js 16 App Router
- ✅ Type-safe development with TypeScript
- ✅ Responsive design with Tailwind CSS
- ✅ Real-time search with Typesense integration
- ✅ Client-side state management with React Query
- ✅ Form validation with Zod
- ✅ Accessibility focused components
- ✅ Image optimization with Next.js Image component
- ✅ Dark mode support with next-themes

 

## 🐛 Troubleshooting

### Port 3000 Already in Use

```bash
# Kill process on port 3000 and restart
npm run dev
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### Dependencies Issues

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```
 

## 📞 Support & Contact

For questions or issues, please contact the development team or refer to the project's issue tracker.

## 📄 License

This project is proprietary to Cardora. All rights reserved.

---

**Last Updated**: June 2026
**Next.js Version**: 16.2.4
**Node.js Minimum**: v18.17.0
