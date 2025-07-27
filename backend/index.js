const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const { userRouter } = require("./routes/user");
const { adminRouter } = require("./routes/admin");
const { courseRouter } = require("./routes/course");

const app = express();
app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/course", courseRouter);

async function main(){
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB");
        
        app.listen(3000, () => {
            console.log("Server running on port 3000");
        });
    } catch(e) {
        console.error("Failed to start server:", e);
        process.exit(1);
    }
}

main();
