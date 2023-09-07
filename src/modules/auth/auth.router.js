import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import * as validators from "./auth.validation.js";
import * as authController from "./controller/auth.js"
import { auth } from "../../middleware/auth.js";




const authRouter = Router()

authRouter.get("/test", authController.test)
//signup
authRouter.post("/sign_up", validation(validators.signUpSchema), authController.signUp)

//confirmEmail
authRouter.get("/confirmEmail/:token", validation(validators.token), authController.confirmEmail)

//requestNewEmail
authRouter.get("/requestNewEmail/:token", validation(validators.token), authController.requestNewEmail)

//signIn
authRouter.post("/sign_in", validation(validators.logInSchema), authController.signIn)

//sendCode
authRouter.patch("/sendCode/",validation(validators.sendCode), authController.sendCode)

//forGotPassword
authRouter.patch("/forGotPassword", validation(validators.forGotPassword), authController.forGotPassword)

//logOut
authRouter.post("/log_out", auth, authController.logOut)

export default authRouter