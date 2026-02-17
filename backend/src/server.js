import express from "express"
import cookieParser from "cookie-parser"
import path from "path"

import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import { apiLimiter, authLimiter } from "./middleware/rateLimit.middleware.js"
import { connectDB } from "./lib/db.js"
import { ENV } from "./lib/env.js"



const app = express()
const __dirname = path.resolve()

const PORT = ENV.PORT || 3000

app.use(express.json())
app.use(cookieParser())

// Current behavior:
// "/api/auth/*" uses authLimiter only 
app.use("/api/auth",authLimiter,authRoutes)
// Other API routes like "/api/message/*" go through apiLimiter 
app.use("/api",apiLimiter)
app.use("/api/message", messageRoutes)


if(ENV.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))

    app.get("*", (_,res) => {
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"))
    })
}



app.listen(PORT, () => {
    console.log("server is running on port 3000 ")
    connectDB()
})    
