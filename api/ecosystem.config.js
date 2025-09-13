module.exports = {
  apps: [
    {
      name: 'rent-api',
      script: 'app.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 8800
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 8800
      }
    }
  ]
};
