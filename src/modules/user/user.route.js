import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import validation from "../../middleware/validation.js";
import { fileUpload, fileValidation } from "../../utils/cloudMulter.js";
import * as userController from "./controller/user.js";
import * as validators from "./user.validation.js";
const userRouter = Router()

userRouter.get("/test", userController.test)

//update user
userRouter.patch("/update", auth, validation(validators.updateUser), userController.updateUser)
//delete user
userRouter.delete("/delete", auth, userController.deleteUser)
//soft delete user
userRouter.delete("/softDelete", auth, userController.softDeleteUser)
//get profile of user
userRouter.post("/userProfile", auth, userController.userProfile)
//update pass
userRouter.post("/updateProfile", validation(validators.updatePassword), auth, userController.updatePassword)
//userPirPicCloud
userRouter.post("/userPirPic", auth, validation(validators.userPirPic), fileUpload(fileValidation.image).single("image"), userController.userPirPic)
//userProPic multer
userRouter.post("/userPirPic", auth, validation(validators.userPirPic), fileUpload("user/profile", fileValidation.image).single("image"), userController.userProPic)
//userCoverPiC
userRouter.post("/userCoverPiC", auth, validation(validators.userCoverPiC), fileUpload(fileValidation.image).array("image"), userController.userCoverPiC)
//userCoverPiC multer
userRouter.post("/userCoverPiC", auth, validation(validators.userCoverPiC), fileUpload("user/profile/cover", fileValidation.image).array("image" , 5), userController.userCoverPiCMulter)

export default userRouter