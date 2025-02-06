const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authRouter = require("./routers/auth");
const shareRouter = require("./routers/share");
const postRouter = require("./routers/post");
const topicRouter = require("./routers/topic");
const userRouter = require("./routers/user");
const authMiddleware = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api", authRouter);

app.use(authMiddleware);
app.use("/api", shareRouter);
app.use("/api", postRouter);
app.use("/api", topicRouter);
app.use("/api", userRouter);

mongoose
    .connect(process.env.MONGOURL)
    .then(() => console.log("Connected to mongodb"))
    .catch((e) => console.log(e))

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server started at PORT ${PORT}`);
});
