const { Router } = require('express');
const { adminModel, courseModel } = require("../db");
const jwt = require('jsonwebtoken');
const { JWT_ADMIN_PASSWORD } = require("../config");
const { adminMiddleware } = require("../middleware/admin");
const bcrypt = require('bcrypt');

const adminRouter = Router();
const saltRound = 10;

adminRouter.post("/signup", async function(req, res){
    try {
        const { email, password, firstname, lastname } = req.body;
        
        // Validate required fields
        if (!email || !password || !firstname || !lastname) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }
        
        // Check if admin already exists
        const existingAdmin = await adminModel.findOne({ email });
        if (existingAdmin) {
            return res.status(409).json({
                message: "Admin already exists"
            });
        }
        
        const hashedPassword = await bcrypt.hash(password, saltRound);
        
        await adminModel.create({
            email: email,
            password: hashedPassword,
            firstname: firstname,
            lastname: lastname
        });
        
        res.json({
            message: "Signup succeeded"
        });
    } catch(e) {
        console.error("Admin signup error:", e);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

adminRouter.post("/signin", async function(req, res){
    try {
        const { email, password } = req.body;
        
        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }
        
        const user = await adminModel.findOne({
            email: email
        });
        
        if(user && await bcrypt.compare(password, user.password)){
            const token = jwt.sign({
                id: user._id
            }, JWT_ADMIN_PASSWORD);
            res.json({
                message: "You are signed in",
                token: token
            });
        } else {
            res.status(403).json({
                message: "Incorrect credentials"
            });
        }
    } catch(e) {
        console.error("Admin signin error:", e);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

adminRouter.post("/course", adminMiddleware, async function (req, res){
    try {
        const adminId = req.userId;
        const { title, description, imgURL, price } = req.body;
        
        // Validate required fields
        if (!title || !description || !price) {
            return res.status(400).json({
                message: "Title, description, and price are required"
            });
        }
        
        const course = await courseModel.create({
            title: title,
            description: description,
            imgURL: imgURL,
            price: price,
            creatorId: adminId
        });
        
        res.json({
            message: "Course created",
            courseId: course._id
        });
    } catch(e) {
        console.error("Course creation error:", e);
        res.status(500).json({
            message: "Error creating course"
        });
    }
});

adminRouter.put("/course", adminMiddleware, async function (req, res){
    try {
        const adminId = req.userId;
        const { title, description, imgURL, price, courseId } = req.body;
        
        // Validate required fields
        if (!courseId) {
            return res.status(400).json({
                message: "Course ID is required"
            });
        }
        
        const result = await courseModel.updateOne({
            _id: courseId, 
            creatorId: adminId 
        }, {
            title: title, 
            description: description, 
            imgURL: imgURL, 
            price: price
        });
        
        // Check if course was found and updated
        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "Course not found or you don't have permission to update it"
            });
        }
        
        res.json({
            message: "Course updated"
        });
    } catch(e) {
        console.error("Course update error:", e);
        res.status(500).json({
            message: "Error updating course"
        });
    }
});

adminRouter.get("/course/bulk", adminMiddleware, async function (req, res){
    try {
        const adminId = req.userId;
        
        const courses = await courseModel.find({
            creatorId: adminId
        });
        
        res.json({
            message: "Courses retrieved successfully",
            courses
        });
    } catch(e) {
        console.error("Bulk courses error:", e);
        res.status(500).json({
            message: "Error retrieving courses"
        });
    }
});

module.exports = {
    adminRouter: adminRouter
};
