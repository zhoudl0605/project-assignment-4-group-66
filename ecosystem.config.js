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
                DB_AUTH_SOURCE: "admin",
                JWT_SECRET: "secret",
                PORT: "30301",
                NODE_ENV: "development",
            },
            env_production: {
                DATABASE_HOST: "155.138.146.94",
                DATABASE_PORT: 27017,
                DATABASE_NAME: "ece9065",
                DATABASE_USER: "ece9065",
                DATABASE_PASSWORD: "ece9065",
                DB_AUTH_SOURCE: "ece9065",
                JWT_SECRET: "secret",
                PORT: "3030",
                NODE_ENV: "production",
                SMTP_HOST: "smtp.gmail.com",
		SMTP_PORT: 587,
		SMTP_USER: "alex.zhou0605@gmail.com",
		SMTP_PASSWORD: "sgmr rcal tlpq zlsd"
            },
        }
    ],
};
