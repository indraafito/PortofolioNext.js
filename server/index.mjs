import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import pg from "pg";
import { z } from "zod";

dotenv.config();

const { Pool } = pg;

const {
  DATABASE_URL,
  PORT = 3001,
  JWT_SECRET = "change-me",
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  CORS_ORIGIN,
} = process.env;

if (!DATABASE_URL) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("ADMIN_EMAIL and ADMIN_PASSWORD are required");
  process.exit(1);
}

const app = express();

const allowedOrigins = CORS_ORIGIN
  ? CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : ["http://localhost:5173", "http://localhost:8080"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json());

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  max: 10,
});

const query = async (text, params) => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
};

const bootstrapSql = `
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'user');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL DEFAULT 'Afito Indra Permana',
  tagline TEXT,
  title TEXT DEFAULT 'Informatics Engineer',
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT,
  start_year INTEGER NOT NULL,
  end_year INTEGER,
  description TEXT,
  achievements TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('hard', 'soft')),
  icon_name TEXT,
  proficiency INTEGER CHECK (proficiency >= 0 AND proficiency <= 100),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  technologies TEXT[] DEFAULT '{}',
  github_url TEXT,
  live_url TEXT,
  thumbnail_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_profiles_updated_at') THEN
    CREATE TRIGGER update_profiles_updated_at
      BEFORE UPDATE ON public.profiles
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_education_updated_at') THEN
    CREATE TRIGGER update_education_updated_at
      BEFORE UPDATE ON public.education
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_skills_updated_at') THEN
    CREATE TRIGGER update_skills_updated_at
      BEFORE UPDATE ON public.skills
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_projects_updated_at') THEN
    CREATE TRIGGER update_projects_updated_at
      BEFORE UPDATE ON public.projects
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.education DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

INSERT INTO public.education (institution, degree, field_of_study, start_year, end_year, description, order_index)
SELECT 'Universitas Negeri Malang', 'S1', 'Informatika', 2021, NULL, 'Currently pursuing Bachelor degree in Informatics', 1
WHERE NOT EXISTS (SELECT 1 FROM public.education LIMIT 1);

INSERT INTO public.skills (name, category, icon_name, proficiency, order_index)
SELECT 'Front-End Development', 'hard', 'Code', 90, 1
WHERE NOT EXISTS (SELECT 1 FROM public.skills LIMIT 1);
`;
const authLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const educationSchema = z.object({
  institution: z.string().min(1),
  degree: z.string().min(1),
  field_of_study: z.string().nullable().optional(),
  start_year: z.number().int(),
  end_year: z.number().int().nullable().optional(),
  description: z.string().nullable().optional(),
  achievements: z.string().nullable().optional(),
  order_index: z.number().int().optional(),
});

const skillSchema = z.object({
  name: z.string().min(1),
  category: z.enum(["hard", "soft"]),
  icon_name: z.string().nullable().optional(),
  proficiency: z.number().int().min(0).max(100).nullable().optional(),
  order_index: z.number().int().optional(),
});

const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  technologies: z.array(z.string().min(1)).optional(),
  github_url: z.string().url().nullable().optional(),
  live_url: z.string().url().nullable().optional(),
  thumbnail_url: z.string().url().nullable().optional(),
  order_index: z.number().int().optional(),
});

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  message: z.string().min(1).max(1000),
});

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

app.get("/health", async (_req, res) => {
  try {
    const { rows } = await query("SELECT 1 as ok");
    const { rows: info } = await query("SELECT current_database() as db, now() as server_time");
    res.json({
      status: "ok",
      db: true,
      check: rows[0]?.ok === 1,
      database: info[0]?.db,
      server_time: info[0]?.server_time,
    });
  } catch (error) {
    res.status(200).json({
      status: "ok",
      db: false,
      error: error?.message ?? "DB check failed",
    });
  }
});

app.post("/auth/login", async (req, res) => {
  const parsed = authLoginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.errors[0]?.message ?? "Invalid payload" });
  }

  const { email, password } = parsed.data;

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "12h" });
  res.json({ token });
});

app.get("/auth/me", authenticate, (req, res) => {
  res.json({ email: req.user.email });
});

app.get("/profiles", async (_req, res) => {
  let { rows } = await query("SELECT * FROM profiles ORDER BY created_at ASC");
  if (rows.length === 0) {
    const insert = await query(
      `INSERT INTO profiles (full_name, tagline, title, photo_url)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        "Afito Indra Permana",
        "Passionate about creating innovative solutions through code",
        "Informatics Engineer",
        null,
      ],
    );
    rows = insert.rows;
  }
  res.json(rows);
});

app.put("/profiles/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const { full_name, tagline, title, photo_url } = req.body;

  const { rows } = await query(
    `UPDATE profiles
     SET full_name = $1,
         tagline = $2,
         title = $3,
         photo_url = $4,
         updated_at = NOW()
     WHERE id = $5
     RETURNING *`,
    [full_name, tagline ?? null, title ?? null, photo_url ?? null, id],
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: "Profile not found" });
  }

  res.json(rows[0]);
});

app.get("/education", async (_req, res) => {
  const { rows } = await query("SELECT * FROM education ORDER BY order_index ASC, created_at ASC");
  res.json(rows);
});

app.post("/education", authenticate, async (req, res) => {
  const parsed = educationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.errors[0]?.message ?? "Invalid payload" });
  }

  const data = parsed.data;
  const { rows } = await query(
    `INSERT INTO education (institution, degree, field_of_study, start_year, end_year, description, achievements, order_index)
     VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8, (
       SELECT COALESCE(MAX(order_index), -1) + 1 FROM education
     )))
     RETURNING *`,
    [
      data.institution,
      data.degree,
      data.field_of_study ?? null,
      data.start_year,
      data.end_year ?? null,
      data.description ?? null,
      data.achievements ?? null,
      data.order_index ?? null,
    ],
  );

  res.status(201).json(rows[0]);
});

app.put("/education/:id", authenticate, async (req, res) => {
  const parsed = educationSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.errors[0]?.message ?? "Invalid payload" });
  }

  const updates = parsed.data;
  const fields = [];
  const values = [];
  let index = 1;

  for (const [key, value] of Object.entries(updates)) {
    fields.push(`${key} = $${index}`);
    values.push(value);
    index++;
  }

  if (fields.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  values.push(req.params.id);

  const { rows } = await query(
    `UPDATE education SET ${fields.join(", ")}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`,
    values,
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: "Education not found" });
  }

  res.json(rows[0]);
});

app.delete("/education/:id", authenticate, async (req, res) => {
  const { rows } = await query("DELETE FROM education WHERE id = $1 RETURNING id", [req.params.id]);
  if (rows.length === 0) {
    return res.status(404).json({ message: "Education not found" });
  }
  res.status(204).send();
});

app.get("/skills", async (_req, res) => {
  const { rows } = await query("SELECT * FROM skills ORDER BY order_index ASC, created_at ASC");
  res.json(rows);
});

app.post("/skills", authenticate, async (req, res) => {
  const parsed = skillSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.errors[0]?.message ?? "Invalid payload" });
  }

  const data = parsed.data;

  const { rows } = await query(
    `INSERT INTO skills (name, category, icon_name, proficiency, order_index)
     VALUES ($1, $2, $3, $4, COALESCE($5, (
       SELECT COALESCE(MAX(order_index), -1) + 1 FROM skills
     )))
     RETURNING *`,
    [
      data.name,
      data.category,
      data.icon_name ?? null,
      data.proficiency ?? null,
      data.order_index ?? null,
    ],
  );

  res.status(201).json(rows[0]);
});

app.put("/skills/:id", authenticate, async (req, res) => {
  const parsed = skillSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.errors[0]?.message ?? "Invalid payload" });
  }

  const updates = parsed.data;
  const fields = [];
  const values = [];
  let index = 1;

  for (const [key, value] of Object.entries(updates)) {
    fields.push(`${key} = $${index}`);
    values.push(value);
    index++;
  }

  if (fields.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  values.push(req.params.id);

  const { rows } = await query(
    `UPDATE skills SET ${fields.join(", ")}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`,
    values,
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: "Skill not found" });
  }

  res.json(rows[0]);
});

app.delete("/skills/:id", authenticate, async (req, res) => {
  const { rows } = await query("DELETE FROM skills WHERE id = $1 RETURNING id", [req.params.id]);
  if (rows.length === 0) {
    return res.status(404).json({ message: "Skill not found" });
  }
  res.status(204).send();
});

app.get("/projects", async (_req, res) => {
  const { rows } = await query("SELECT * FROM projects ORDER BY order_index ASC, created_at ASC");
  res.json(rows);
});

app.post("/projects", authenticate, async (req, res) => {
  const parsed = projectSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.errors[0]?.message ?? "Invalid payload" });
  }

  const data = parsed.data;

  const { rows } = await query(
    `INSERT INTO projects (title, description, technologies, github_url, live_url, thumbnail_url, order_index)
     VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, (
       SELECT COALESCE(MAX(order_index), -1) + 1 FROM projects
     )))
     RETURNING *`,
    [
      data.title,
      data.description,
      data.technologies ?? [],
      data.github_url ?? null,
      data.live_url ?? null,
      data.thumbnail_url ?? null,
      data.order_index ?? null,
    ],
  );

  res.status(201).json(rows[0]);
});

app.put("/projects/:id", authenticate, async (req, res) => {
  const parsed = projectSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.errors[0]?.message ?? "Invalid payload" });
  }

  const updates = parsed.data;
  const fields = [];
  const values = [];
  let index = 1;

  for (const [key, value] of Object.entries(updates)) {
    fields.push(`${key} = $${index}`);
    values.push(value);
    index++;
  }

  if (fields.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  values.push(req.params.id);

  const { rows } = await query(
    `UPDATE projects SET ${fields.join(", ")}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`,
    values,
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: "Project not found" });
  }

  res.json(rows[0]);
});

app.delete("/projects/:id", authenticate, async (req, res) => {
  const { rows } = await query("DELETE FROM projects WHERE id = $1 RETURNING id", [req.params.id]);
  if (rows.length === 0) {
    return res.status(404).json({ message: "Project not found" });
  }
  res.status(204).send();
});

app.get("/contact-messages", authenticate, async (_req, res) => {
  const { rows } = await query("SELECT * FROM contact_messages ORDER BY created_at DESC");
  res.json(rows);
});

app.post("/contact-messages", async (req, res) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.errors[0]?.message ?? "Invalid payload" });
  }

  const data = parsed.data;

  const { rows } = await query(
    `INSERT INTO contact_messages (name, email, message)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [data.name, data.email, data.message],
  );

  res.status(201).json(rows[0]);
});

app.patch("/contact-messages/:id/read", authenticate, async (req, res) => {
  const { read } = req.body;
  const { rows } = await query(
    `UPDATE contact_messages
     SET read = $1
     WHERE id = $2
     RETURNING *`,
    [!!read, req.params.id],
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: "Message not found" });
  }

  res.json(rows[0]);
});

app.delete("/contact-messages/:id", authenticate, async (req, res) => {
  const { rows } = await query("DELETE FROM contact_messages WHERE id = $1 RETURNING id", [req.params.id]);
  if (rows.length === 0) {
    return res.status(404).json({ message: "Message not found" });
  }
  res.status(204).send();
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

const tryListen = (port, maxRetries = 5) =>
  new Promise((resolve, reject) => {
    const p = Number(port) || 3001;
    const server = app.listen(p, () => {
      resolve({ server, port: p });
    });

    server.on("error", (err) => {
      if (err?.code === "EADDRINUSE" && maxRetries > 0) {
        const nextPort = p + 1;
        console.warn(`Port ${p} is in use, trying ${nextPort}...`);
        // small delay before retrying
        setTimeout(() => {
          tryListen(nextPort, maxRetries - 1).then(resolve).catch(reject);
        }, 300);
      } else {
        reject(err);
      }
    });
  });

const startServer = async () => {
  try {
    await query(bootstrapSql);
    console.log("Database schema ensured");
  } catch (error) {
    console.error("Failed to initialize database schema:", error);
    process.exit(1);
  }

  try {
    const { port: listenedPort } = await tryListen(process.env.PORT || PORT, 5);
    console.log(`API server listening on http://localhost:${listenedPort}`);

    // If Vite's dev client expects a specific API base URL, warn if mismatch
    if (process.env.NEXT_PUBLIC_API_URL) {
      try {
        const desired = new URL(process.env.NEXT_PUBLIC_API_URL);
        const desiredPort = Number(desired.port) || (desired.protocol === "https:" ? 443 : 80);
        if (desired.hostname === "localhost" && desiredPort !== listenedPort) {
          console.warn(
            `Warning: NEXT_PUBLIC_API_URL is set to ${process.env.NEXT_PUBLIC_API_URL} but server is listening on port ${listenedPort}. Update NEXT_PUBLIC_API_URL or set PORT to ${listenedPort} when running dev.`,
          );
        }
      } catch (e) {
        // ignore malformed URL in env
      }
    }
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
