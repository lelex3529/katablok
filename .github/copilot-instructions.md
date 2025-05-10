<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is a Next.js 15 project using the App Router, TypeScript, and Tailwind CSS. The project aims to be a SaaS application named "Katalyx Proposals" for generating commercial proposals.

Key architectural considerations:

- Modularity: Strive for a clean, scalable, and maintainable architecture.
- Components: Reusable UI components are located in `/components`.
- Utilities: Utility functions and third-party integrations (like OpenAI) are in `/lib`.
- Types: Global TypeScript types are defined in `/types`.
- Configuration: Environment parameters and application settings are managed in `/config`.
- Styling: Tailwind CSS is used for styling, with configuration in `tailwind.config.ts` and global styles in `app/globals.css`.
- API: Internal APIs will be built using Next.js API routes (App Router).
- Authentication: An authentication system will be integrated (likely in `/auth` or using a service like Clerk/Auth.js).

When generating code, please:

- Follow Next.js best practices, especially for the App Router.
- Use TypeScript effectively, leveraging the defined global types.
- Ensure code is well-formatted (Prettier is configured).
- Maintain clear imports and consistent naming conventions.
- Prioritize decoupling of logic.
- Keep in mind the future SaaS nature of the project, allowing for features like AI generation, PDF creation, etc.
