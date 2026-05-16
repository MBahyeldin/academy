export default ({ env }: { env: (key: string, fallback?: unknown) => unknown }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', 'localhost'),
      port: env('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'noor_cms'),
      user: env('DATABASE_USERNAME', 'noor'),
      password: env('DATABASE_PASSWORD', ''),
      ssl: env('DATABASE_SSL', false) ? { rejectUnauthorized: false } : false,
    },
    pool: { min: 2, max: 10 },
    acquireConnectionTimeout: 60000,
  },
})
