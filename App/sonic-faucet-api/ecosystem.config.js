module.exports = {
  apps: [
    {
      name: 'sonic-faucet-api',
      script: 'node',
      args: 'build/server.js',
      autorestart: true,
      max_restarts: 5,
      min_uptime: '10s',
      restart_delay: 5000,
      out_file: 'logs/sonic-faucet-api/normal.log',
      error_file: 'logs/sonic-faucet-api/error.log',
      combine_logs: true,
    },
  ]
};