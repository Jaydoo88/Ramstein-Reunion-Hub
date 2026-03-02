import dotenv from "dotenv";
import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile, writeFile } from "fs/promises";

// Load env vars before building client
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.production" });

const url = process.env.VITE_SUPABASE_URL;
console.log("DEBUG PUBLISHING ENV - VITE_SUPABASE_URL:", url ? `${url.substring(0, 15)}...` : "UNDEFINED");
console.log("DEBUG PUBLISHING ENV - VITE_SUPABASE_ANON_KEY:", process.env.VITE_SUPABASE_ANON_KEY ? "EXISTS" : "UNDEFINED");

// FORCE VITE TO SEE ENV VARS BY WRITING TO client/.env
// Replit's Static Publishing build step sometimes does not inject UI secrets into process.env.
// We explicitly write the environment variables (with fallbacks to our known public keys) 
// to client/.env so Vite's build step natively bakes them into import.meta.env.
try {
  const sbUrl = process.env.VITE_SUPABASE_URL || "https://plywbgbehmrpsnurhuos.supabase.co";
  const sbKey = process.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_7_zP7jPir0BvWuAeMkqvVA_O61XXgnY";
  
  let envContent = `VITE_SUPABASE_URL=${sbUrl}\nVITE_SUPABASE_ANON_KEY=${sbKey}\n`;
  
  await writeFile("client/.env", envContent);
  console.log("DEBUG PUBLISHING ENV - Successfully wrote client/.env with Supabase keys to ensure Vite injection.");
} catch (e) {
  console.error("Failed to write client/.env", e);
}

// server deps to bundle
const allowlist = [
  "@google/generative-ai",
  "axios",
  "connect-pg-simple",
  "cors",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-rate-limit",
  "express-session",
  "jsonwebtoken",
  "memorystore",
  "multer",
  "nanoid",
  "nodemailer",
  "openai",
  "passport",
  "passport-local",
  "pg",
  "stripe",
  "uuid",
  "ws",
  "xlsx",
  "zod",
  "zod-validation-error",
];

async function buildAll() {
  await rm("dist", { recursive: true, force: true });

  console.log("building client...");
  await viteBuild();
  
  // Cleanup the temporary client/.env we created for Vite
  try {
    await rm("client/.env", { force: true });
  } catch (e) {}

  console.log("building server...");
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = allDeps.filter((dep) => !allowlist.includes(dep));

  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/index.cjs",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    external: externals,
    logLevel: "info",
  });
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});