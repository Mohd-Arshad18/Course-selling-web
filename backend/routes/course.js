const { Router } = require('express');
const { purchaseModel, courseModel } = require("../db");
const { userMiddleware } = require("../middleware/user");
const courseRouter = Router();

courseRouter.post("/purchase", userMiddleware, async function (req, res){
    try {
        const userId = req.userId; // from middleware
        const { courseId } = req.body;
        
        await purchaseModel.create({
            userId,
            courseId
        });
        
        res.json({
            message: "You have successfully bought the course"
        });
    } catch(e) {
        res.status(500).json({
            message: "Error purchasing course"
        });
    }
});

courseRouter.get("/preview", async function (req, res){
    const courses = await courseModel.find({});
    
    res.json({
        courses
    })
})

module.exports = {
    courseRouter: courseRouter
}
