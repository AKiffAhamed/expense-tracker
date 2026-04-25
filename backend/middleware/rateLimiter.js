import ratelimit from "../config/upstash.js";

const ratelimiter = async(req, res, next) =>{
    try {
        // you should update it with user id or IP
        const { success } = await ratelimit.limit("my-rate-limit");

        if(!success){
            return res.status(429).json({
                message:"Too many atempts. Please try again later."
            })
        }

        next();
    } catch (error) {
        console.log("rate limit error:",error);
        next(error);
    }
};

export default ratelimiter;