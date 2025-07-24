const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const { userRouter } = require("./routes/user");
const { adminRouter } = require("./routes/admin");
const { courseRouter } = require("./routes/course");
const app = express();
app.use(express.json());

app.use("/api/user",userRouter);
app.use("/api/admin",adminRouter);
app.use("/api/course",courseRouter);

async function main(){
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(3000);
}

main();
