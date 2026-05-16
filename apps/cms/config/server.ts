export default ({ env }: { env: (key: string, fallback?: unknown) => unknown }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env('PORT', 1337),
  app: {
    keys: (env('APP_KEYS', '') as string).split(','),
  },
})
