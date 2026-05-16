import { mergeConfig } from 'vite';

export default (config) => {
  // Important: always return the modified config
  return mergeConfig(config, {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    server: {
      port: 1337,
      strictPort: false,
      host: "0.0.0.0",
      allowedHosts: ["localhost", "academy-cms.flookaa.com"],
    }
  });
};
