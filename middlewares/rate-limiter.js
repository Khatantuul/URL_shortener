import redis from 'ioredis';
import moment from 'moment';

const redisClient = new redis({ url: process.env.REDIS_URL });

export const rateLimiter = async (req, res, next) => {
    const time_window = 60;
    const userID = req.user?.googleID;
    const userTier = req.user?.tier;
    const allowedMax = userTier === "tier_1" ? 10 : userTier === "tier_2" ? 100 : 1000;
    const redisKey = `${userID}`;

    try {
        const replies = await new Promise((resolve, reject) => {
            redisClient.multi()
                .incr(redisKey)
                .ttl(redisKey)
                .exec((err, _replies) => {
                    if (err) reject(err);
                    else resolve(_replies);
                });
        });

        const count = replies[0][1];
        const ttl = replies[1][1];

        if (ttl === -1) {
            const current_time = Math.floor(Date.now() / 1000); 
            const expiration_time = current_time + time_window
            redisClient.expireat(redisKey, expiration_time)
        }

        if (count > allowedMax) {
            return res.status(429).json({ message: "Too many requests" });
        }
        next();
    } catch (error) {
        console.error("Error performing rate limit:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
