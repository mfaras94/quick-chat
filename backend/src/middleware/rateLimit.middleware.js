import  rateLimit from "express-rate-limit"

export const globalRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max:100,
    message: { message: "Too many requests, please try again later." },

})

export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: "Too many auth attempts, please try again later." },
})


export const updateProfileRateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: { message: "Too many profile update requests, please try again later." },
})

export const sendMessageRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: { message: "Too many messages sent, please slow down." },
    keyGenerator: (req) => req.user?._id?.toString() || req.ip,
})
