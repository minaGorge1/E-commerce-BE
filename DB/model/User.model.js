import mongoose, { Schema, model, Types } from "mongoose";

/* (userName,phone,email,password,cpassword,status) */

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    userName: {
        type: String,
        required: [true, "userName is required"],
        min: [2, "minimum length 2 char"],
        max: [20, "max length 20 char"],
        lower: true,
        trim: true
    },
    email: {
        type: String,
        unique: [true, "email must be unique value"],
        required: [true, "email is required"],
        lower: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "password is required"],
    },
    phone: {
        type: String,
        required: true
    },
    address: String,
    gender: {
        type: String,
        default: "male",
        enum: ["male", "female"]
    },
    status: {
        type: String,
        default: "offline",
        enum: ["offline", "online", "blocked"]
    },
    confirmEmail: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        default: "User",
        enum: ["User", "Admin"]
    },
    delete: {
        type: Boolean,
        default: false
    },
    image: Object,
    DOB: String,
    code: {
        type: Number,
        default: null
    },
    changePasswordTime: Date,
    wishList: [{ type: Types.ObjectId, ref: "Product" }]
}, {
    timestamps: true
})

const userModel = mongoose.models.User || model("User", userSchema)
export default userModel