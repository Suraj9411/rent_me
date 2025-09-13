module.exports = {
  apps: [
    {
      name: 'rent-socket',
      script: 'app.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        SOCKET_PORT: 4000
      },
      env_production: {
        NODE_ENV: 'production',
        SOCKET_PORT: 4000
      }
    }
  ]
};
