# Katalyx Proposals

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) for Katalyx Proposals, a SaaS application to generate commercial proposals.

## Project Setup

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS (with Typography plugin)
- **Linting/Formatting**: ESLint & Prettier

## Getting Started

First, ensure you have Node.js and npm installed. Then, install the project dependencies:

```bash
npm install
```

Next, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Project Structure

- `/app`: Core application routes (App Router).
- `/components`: Reusable UI components.
- `/lib`: Utility functions, API integrations (e.g., OpenAI).
- `/types`: Global TypeScript type definitions.
- `/styles`: TailwindCSS configuration and global styles (`app/globals.css`).
- `/config`: Environment variables and application settings.
- `/auth`: Placeholder for authentication logic.
- `/middleware.ts`: For route protection and other request processing.

## Key Libraries & Configurations

- **TailwindCSS**: Configured in `tailwind.config.ts` and `postcss.config.mjs`.
- **ESLint**: Configured in `eslint.config.mjs`.
- **Prettier**: Configured in `.prettierrc.json`.
- **TypeScript**: Configured in `tsconfig.json`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
