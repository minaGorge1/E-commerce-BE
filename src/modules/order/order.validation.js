import joi from "joi"
import { generalFields } from "../../middleware/validation.js"

export const signUpSchema =  joi.object({
        userName: joi.string().max(20).required().alphanum(),
        phone: joi.string().required(),
        email: generalFields.email,
        password: generalFields.password,
        cPassword: generalFields.cPassword.valid(joi.ref('password'))
    }).required()

