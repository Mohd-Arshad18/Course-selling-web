const { Router } = require('express');
const { userModel, purchaseModel, courseModel } = require("../db");
const jwt = require('jsonwebtoken');
const { JWT_USER_PASSWORD } = require("../config");
const { userMiddleware } = require("../middleware/user");
const bcrypt = require('bcrypt');

const userRouter = Router();
const saltRound = 10;

userRouter.post("/signup", async function(req, res){
    try{
        const { email, password, firstname, lastname} = req.body;
        
        if (!email || !password || !firstname || !lastname) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }
    
        const hashedPassword = await bcrypt.hash(password, saltRound);
        
        await userModel.create({
        email: email,
        password: hashedPassword,
        firstname: firstname,
        lastname: lastname
        })
    
        res.json({
        message: "Signup succeeded"
        })
    } catch(e){
        res.status(500).json({
            message: "Internal error"
        })
    }    
})

userRouter.post("/signin", async function(req, res){
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }
        
        const user = await userModel.findOne({ email });

        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user._id }, JWT_USER_PASSWORD);
            res.json({
                message: "You are signed in",
                token
            });
        } else {
            res.status(403).json({
                message: "Incorrect credentials"
            });
        }
    } catch(e) {
        console.error("User signin error:", e);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

userRouter.get("/purchases", userMiddleware, async function (req, res){
    try {
        const userId = req.userId;
        
        const purchases = await purchaseModel.find({
            userId,
        });
        
        let purchaseCourseIds = [];
        
        for(let i = 0; i < purchases.length; i++){
            purchaseCourseIds.push(purchases[i].courseId);
        }
        
        const courseData = await courseModel.find({
            _id: { $in: purchaseCourseIds }
        });
        
        res.json({
            purchases,
            courseData
        });
    } catch(e) {
        console.error("Purchases error:", e);
        res.status(500).json({
            message: "Error fetching purchases"
        });
    }
});

module.exports = {
    userRouter: userRouter
}
