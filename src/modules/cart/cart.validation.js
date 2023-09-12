import joi from "joi"
import { generalFields } from "../../middleware/validation.js"

export const addCart = joi.object({
    productId: generalFields.id.required(),
    quantity: joi.number().integer().positive().min(1).required(),
}).required()

export const deleteFromCart = joi.object({
    /* productId: generalFields.id.required(), */
    productIds:joi.array().items(generalFields.id).required() //array
}).required()

