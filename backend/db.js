const mongoose = require('mongoose');

const schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const userSchema = new schema({
    email: { type: String, unique: true },
    password: String,
    firstname: String,
    lastname: String
});

const adminSchema = new schema({
    email: { type: String, unique: true },
    password: String,
    firstname: String,
    lastname: String
});

const courseSchema = new schema({
    title: String,
    description: String,
    price: Number,
    imgURL: String,
    creatorId: ObjectId
});

const purchaseSchema = new schema({
    userId: ObjectId,
    courseId: ObjectId
});

const userModel = mongoose.model("user", userSchema);
const adminModel = mongoose.model("admin", adminSchema);
const courseModel = mongoose.model("course", courseSchema);
const purchaseModel = mongoose.model("purchase", purchaseSchema);

module.exports = {
    userModel,
    adminModel,
    courseModel,
    purchaseModel
}