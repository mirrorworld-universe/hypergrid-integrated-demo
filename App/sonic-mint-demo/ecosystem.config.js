module.exports = {
  apps: [
    {
      args: 'start',
      autorestart: true,
      combine_logs: true,
      error_file: 'logs/mint-frontend/error.log',
      max_restarts: 5,
      min_uptime: '10s',
      name: 'mint-frontend',
      out_file: 'logs/mint-frontend/normal.log',
      restart_delay: 5000,
      script: 'npm',
    }
  ]
};