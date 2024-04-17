const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const redis = require('redis')
const cors = require('cors');
const RedisStore = require('connect-redis').default
const { MONGO_PASSWORD, MONGO_IP, MONGO_PORT,MONGO_USER, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require('./config/config')
let redisClient = redis.createClient({
    url: `redis://${REDIS_URL}:${REDIS_PORT}`
})
redisClient.connect().catch(console.error)

const postRouter = require('./routes/postRoutes')
const userRouter = require('./routes/userRoutes')

const app =  express()

const connectWithRetry = () => {
    mongoose
    .connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`)
    .then(() => console.log("Succesfully connected to DB"))
    .catch((e) => {   
        console.log(e)
        setTimeout(connectWithRetry, 5000)
    })
}
connectWithRetry();

app.enable("trust proxy");
app.use(cors({}));
app.use(session ({
    store: new RedisStore({client: redisClient}),
    secret: SESSION_SECRET,
    cookie: {
        secure: false,
        resave: false,
        saveUninitialized: false, 
        httpOnly: true,
        maxAge: 30000,
    }
}))

app.use(express.json());
mongoose
    .connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`)
    .then(() => console.log("Succesfully connected to DB"))
    .catch((e) => console.log(e))

app.get("/api/v1", (req,res) => {
    res.send("<h2>Hi there!!!!</h2>")
});

app.use("/api/v1/posts", postRouter)
app.use("/api/v1/users", userRouter)

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}`))