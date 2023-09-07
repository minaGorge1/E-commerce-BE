import mongoose, { Schema, model, Types } from "mongoose";

const subcategorySchema = new Schema({

    name: { type: String, required: true, unique: true , lower : true},
    slug: { type: String, required: true },
    image: { type: Object, required: true },
    categoryId:{type: Types.ObjectId, ref: "Category", required: true},
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Types.ObjectId, ref: "User"},
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
})
//mongoose.model.commentModel ||
const subcategoryModel = mongoose.models.Subcategory || model("Subcategory", subcategorySchema)
export default subcategoryModel

