module.exports = {
  apps: [
    {
      name: "developers-whats91-com",
      script: "server.js",
      interpreter: "node",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
