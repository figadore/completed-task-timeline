# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/50eb454d-2c38-47df-9e56-3bc6f750a633

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/50eb454d-2c38-47df-9e56-3bc6f750a633) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/50eb454d-2c38-47df-9e56-3bc6f750a633) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Publishing to GitHub Pages

This repository is a Vite app. The workflow below builds the site and deploys the `dist/` output to GitHub Pages whenever you push to the `main` branch.

What I added:

- A `base` value in `vite.config.ts` that defaults to `/${process.env.REPO_NAME || 'completed-task-timeline'}/` for production builds.
- A GitHub Actions workflow at `.github/workflows/pages.yml` that builds and deploys on push to `main`.

How to use:

1. Open the repository Settings → Pages and ensure the Pages source is set to "GitHub Actions". (The workflow will create the Pages deployment automatically after a successful run.)
2. Push to `main` — GitHub Actions will run, build the site, and deploy it.
3. Your site will be available at `https://<your-username>.github.io/completed-task-timeline/` (or at the repository page for an organization repo).

Alternatives:

- If you prefer a `gh-pages` branch approach, you can use the `gh-pages` npm package to push the built `dist/` to a branch. This approach requires changing `vite.config.ts` base to `./` or `/completed-task-timeline/` depending on your target. Example:

	npm run build && npx gh-pages -d dist -b gh-pages

- Or publish the build into a `docs/` folder and configure Pages to serve from the `docs` folder on `main`.

If you want, I can: enable a `./` base for relative paths, create a `gh-pages` script, or adjust the workflow to publish from another branch—tell me which option you prefer.
