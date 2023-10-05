const express = require("express");
const mongoose = require("mongoose");
const redis = require("redis");
const cors = require("cors");
const session = require("express-session");
const RedisStore = require("connect-redis")(session)

const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, SESSION_SECRET, REDIS_PORT } = require("./config/config");

let redisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT,
})

const postRouter = require("./routes/postRoutes")
const userRouter = require("./routes/userRoutes")

const app = express();
const mongoURL= `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`

mongoose
.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("succesfully connected to DB"))
.catch((e) => console.log(e));
app.enable("trust proxy");
app.use(cors({}));
app.use(
    session({
      store: new RedisStore({client: redisClient}),
      resave: false, 
      saveUninitialized: true,
      secret: SESSION_SECRET,
      cookie: {
        secure: false,
        httponly: true,
        maxAge: 30000,
      }
    })
  )

app.use(express.json());    

app.get("/api/v1", (req, res) => {
    res.send("<h3>Hi There!!!</h3>");
});
   
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));
