import mongoose, { Schema, model, Types } from "mongoose";

const couponSchema = new Schema({
    name: { type: String, required: true , unique:true , trim: true , lower : true },
    amount: { type: Number, default: 1, required: true },
    image:{type: Object},
    expire : {type :Date , required: true}, // true
    usedBy: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Types.ObjectId, ref: "User"},
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
})


const couponModel = mongoose.models.Coupon || model("Coupon", couponSchema)
export default couponModel
