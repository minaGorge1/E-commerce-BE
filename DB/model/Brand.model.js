import mongoose, { Schema, model, Types } from "mongoose";

const brandSchema = new Schema({

    name: { type: String, required: true, unique: true, trim: true, lower: true },
    image: { type: Object, required: true },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Types.ObjectId, ref: "User"},
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
})

const brandModel = mongoose.models.Brand || model("Brand", brandSchema)
export default brandModel

