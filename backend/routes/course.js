const { Router } = require('express');
const { purchaseModel, courseModel } = require("../db");
const { userMiddleware } = require("../middleware/user");
const courseRouter = Router();

courseRouter.post("/purchase", userMiddleware, async function (req, res){
    try {
        const userId = req.userId;
        const { courseId } = req.body;
        
        // Validate courseId is provided
        if (!courseId) {
            return res.status(400).json({
                message: "Course ID is required"
            });
        }
        
        // Check if course exists
        const course = await courseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }
        
        // Check if user already purchased this course
        const existingPurchase = await purchaseModel.findOne({
            userId,
            courseId
        });
        
        if (existingPurchase) {
            return res.status(409).json({
                message: "You have already purchased this course"
            });
        }
        
        await purchaseModel.create({
            userId,
            courseId
        });
        
        res.json({
            message: "You have successfully bought the course"
        });
    } catch(e) {
        console.error("Purchase error:", e);
        res.status(500).json({
            message: "Error purchasing course"
        });
    }
});

courseRouter.get("/preview", async function (req, res){
    try {
        const courses = await courseModel.find({});
        
        res.json({
            courses
        });
    } catch(e) {
        console.error("Preview error:", e);
        res.status(500).json({
            message: "Error fetching courses"
        });
    }
});

module.exports = {
    courseRouter: courseRouter
};
