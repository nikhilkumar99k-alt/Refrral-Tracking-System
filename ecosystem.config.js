module.exports = {
  apps: [
    {
      name: "referral-tracking-system",
      script: "dist/index.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
        PORT: 3000,
        HTTPS_PORT: 3443,
        DATABASE_URL: process.env.DATABASE_URL,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        HTTPS_PORT: 3443,
        DATABASE_URL: process.env.DATABASE_URL,
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_file: "./logs/combined.log",
      time: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
  ],
};
