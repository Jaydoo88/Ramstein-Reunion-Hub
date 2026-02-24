# Ramstein High School Class of 1988 - Reunion Website

This is a modern, mobile-first reunion website prototype for the Ramstein High School Class of 1988 (40-year reunion in 2028).

## Tech Stack
- **Framework:** React + Vite (Providing the same component-based architecture as Next.js, optimized for Replit's rapid mockup environment)
- **Styling:** Tailwind CSS + Radix UI (shadcn/ui)
- **Routing:** Wouter

## How to Edit Content
We've separated the textual content from the code to make it incredibly easy for you or the planning committee to update details as the reunion approaches.

1. Open `client/src/lib/content.ts`
2. Modify the strings, dates, and event details in the `siteContent` object.
3. The changes will automatically reflect across the entire website.

### Updating the Countdown
In `client/src/lib/content.ts`, update the `targetDate` property in the `countdown` section.
Format: `YYYY-MM-DDTHH:mm:ss` (e.g., `2028-07-01T18:00:00`)

### Updating Images & Logo
1. Upload your actual logo to `client/public/` (e.g., `logo.png`).
2. Update the image paths in the components or in the `content.ts` file if added there.
3. The current version uses high-quality placeholder stock photography that fits the vintage varsity theme.

## Deployment Instructions (Vercel & GitHub)

Although built in Replit, this is a standard Vite React application that easily deploys to Vercel and lives in GitHub.

**To push to GitHub:**
1. Use the Replit version control panel (Git icon on the left) to connect your GitHub account.
2. Commit your changes and push to a new repository.

**To deploy to Vercel:**
1. Log in to your [Vercel account](https://vercel.com).
2. Click "Add New..." -> "Project".
3. Import the GitHub repository you just created.
4. Vercel will automatically detect that it's a Vite project.
5. Build Command: `npm run build`
6. Output Directory: `dist/public`
7. Click "Deploy".

## Future Phases
Because this is built with clean, componentized React code, adding features later is straightforward:
- **RSVP System:** Connect to a backend database (like Supabase/PostgreSQL) and build a form using `react-hook-form`.
- **Photo Submissions:** Integrate a cloud storage solution (like AWS S3 or Cloudinary) and add an upload component.
- **Classmate Directory:** Build a protected route requiring login to view contact details of other classmates.
