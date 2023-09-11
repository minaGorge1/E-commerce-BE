import joi from "joi"
import { generalFields } from "../../middleware/validation.js"

export const addCart =  joi.object({
    productId: generalFields.id.required(),
    quantity: joi.number().required(),
    }).required()

