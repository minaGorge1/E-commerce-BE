import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const headers = joi.object({
    authorization :joi.string().required(),
}).required()


export const createCategory = joi.object({
    name:joi.string().min(2).max(50).required(),
    file:generalFields.file/* .required(), */
    // if files  file:joi.array().items(generalFields.file.required()).required()
}).required()

export const updateCategory = joi.object({
    categoryId: generalFields.id,
    name:joi.string().min(2).max(50),
    file:generalFields.file,
    authorization:joi.string().required(),
}).required()

export const deleteCategory = joi.object({
    categoryId: generalFields.id,
    /* createdBy: generalFields.id, */
}).required()