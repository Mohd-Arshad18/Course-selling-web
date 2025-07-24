const { Router } = require('express');
const { adminModel, courseModel } = require("../db");
const jwt = require('jsonwebtoken');
const { JWT_ADMIN_PASSWORD } = require("../config");
const { adminMiddleware } = require("../middleware/admin");
const bcrypt = require('bcrypt');

const adminRouter = Router();
const saltRound = 10;

adminRouter.post("/signup", async function(req, res){
    const { email, password, firstname, lastname} = req.body;
    
    const hashedPassword = await bcrypt.hash(password, saltRound);
    
    await adminModel.create({
        email: email,
        password: hashedPassword,
        firstname: firstname,
        lastname: lastname
    })
    
    res.json({
        message: "Signup succeeded"
    })
})

adminRouter.post("/signin", async function(req, res){
    const { email, password} = req.body;
    
    const hashedPassword = await bcrypt.hash(password, saltRound);
    
    const user = adminModel.findOne({
        email: email
    })
    
    if(user && await bcrypt.compare(hashedPassword, user.password)){
        const token = jwt.sign({
            id: user._id
        }, JWT_ADMIN_PASSWORD)
        res.json({
            message: "You are signed in",
            token: token
        })
    }else{
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }
})

adminRouter.post("/course", async function (req, res){
    const adminId = req.userId;
    
    const { title, description, imgURL, price} = req.body;
    
    const course = await courseModel.create({
        title: title,
        description: description,
        imgURL: imgURL,
        price: price,
        creatorId: adminId
    })
    
    res.json({
        message: "Course created",
        courseId: course._id
    })
})


adminRouter.put("/course", async function (req, res){
    const adminId = req.userId;
    
    const { title, description, imgURL, price} = req.body;
    
    const course = await courseModel.updateOne({
        _id: courseId, 
        creatorId: adminId 
    }, {
        title: title, 
        description: description, 
        imgURL: imgURL, 
        price: price
    })
    
    res.json({
        message: "Course updated"
    })
})

adminRouter.get("/course/bulk", adminMiddleware, async function (req, res){
    const adminId = req.userId;
    
    const courses = await courseModel.find({
        creatorId: adminId
    });
    
    res.json({
        message: "Course updated",
        courses
    })
})

module.exports = {
    adminRouter: adminRouter
}
