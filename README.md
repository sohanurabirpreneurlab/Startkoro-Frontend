# StartKoro (frontend)

Frontend-only portfolio app with a ChatGPT-like chat UI, project-based chats, file uploads, and dark/light theme.

## Run locally

This environment doesn't have access to the npm registry, so dependencies can't be installed here. On your machine (with internet access):

```bash
cd startkoro-frontend
npm install
npm run dev
```

Then open the dev server URL shown in the terminal.

## Notes

- UI-first only: messages are stored in frontend state + `localStorage`.
- “AI replies” are a simple placeholder response for now (backend later).
- Uses shadcn/ui-style building blocks (Radix UI + CVA) inside `src/components/ui/*`.
- Dark mode uses a deep charcoal base with dark-red accents (see `src/index.css`).

## Add more shadcn/ui components (optional)

If you want to expand the component set later:

```bash
cd startkoro-frontend
npx shadcn@latest init
npx shadcn@latest add card badge tabs
```
