

const config = {
    isVercel: process.env.IS_VERCEL || false,
    port: process.env.PORT || 3333,
    mongodbURI: process.env.MONGODB_URI,
    mongodb: {
        user: process.env.MONGODB_USERNAME,
        pass: process.env.MONGODB_PASSWORD,
        retryWrites: true,
    w: 'majority'
    }
}

module.exports = config