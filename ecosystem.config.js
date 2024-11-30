module.exports = {
    apps: [
        {
            name: "ece_9065_backend",
            script: "./backend/dist/app.js",
            exec_mode: "cluster",
            autorestart: true,
            watch: true,
            instances: "1",
            env: {
                DB_HOST: "localhost",
                DB_PORT: 27017,
                DB_DATABASE: "ece9065",
                DB_USER: "root",
                DB_PASSWORD: "root",
                JWT_SECRET: "secret",
                PORT: "3030",
                NODE_ENV: "development",
            },
            env_production: {
                DB_HOST: "localhost",
                DB_PORT: 27017,
                DB_DATABASE: "ece9065",
                DB_USER: "root",
                DB_PASSWORD: "root",
                JWT_SECRET: "secret",
                PORT: "3030",
                NODE_ENV: "production",
            },
        },
    ],
};
