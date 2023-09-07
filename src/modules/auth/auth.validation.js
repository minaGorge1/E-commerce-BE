import joi from "joi"
import { generalFields } from "../../middleware/validation.js"

export const signUpSchema = joi.object({
    firstName: joi.string().max(20).required().alphanum(),
    lastName: joi.string().max(20).required().alphanum(),
    userName: joi.string().max(20).required().alphanum(),
    address: joi.string(),
    gender: joi.string().valid('male', 'female'),
    phone: joi.string().required(),
    email: generalFields.email,
    password: generalFields.password,
    cPassword: generalFields.cPassword.valid(joi.ref('password'))
}).required()



export const logInSchema = joi.object({
    email: generalFields.email,
    password: generalFields.password
}).required()

export const token = joi.object({
    token: joi.string().required()
}).required()

export const sendCode = joi.object({
    email: generalFields.email
}).required()


export const forGotPassword = joi.object({
    email: generalFields.email,
    password: generalFields.password.required(),
    cPassword: generalFields.cPassword.valid(joi.ref("password")),
    code: joi.string().pattern(new RegExp(/^\d{4}$/)).required()
}).required()
