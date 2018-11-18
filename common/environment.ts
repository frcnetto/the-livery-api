export const environment = {
    server: { port: process.env.SERVER_PORT || 3001 },
    db: { url: process.env.DB_URL || 'mongodb://localhost:27017/the-livery-api' },
    security: { saltRound: process.env.SALT_ROUND || 10 }
}