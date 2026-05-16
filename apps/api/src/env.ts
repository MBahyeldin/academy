import "dotenv/config";

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

export const env = {
  PORT: Number(process.env.PORT ?? 3001),
  DATABASE_URL: required("DATABASE_URL"),
  JWT_SECRET: required("JWT_SECRET"),
  STRAPI_URL: process.env.STRAPI_URL ?? "http://localhost:1337",
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? "http://localhost:5173",
};
