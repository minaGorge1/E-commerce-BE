import { Router } from "express";
import * as validators from "./coupon.validation.js";
import * as couponController from "./controller/coupon.js"
import { fileUpload, fileValidation } from "../../utils/cloudMulter.js";
import { validation } from "../../middleware/validation.js";
import { auth } from "../../middleware/auth.js";
import { endpoint } from "./coupon.endPoint.js";

const couponRouter = Router()

couponRouter.get("/", couponController.getCouponList);

couponRouter.post("/create-coupon",
    auth(endpoint.create),
    fileUpload(fileValidation.image).single("image"),
    validation(validators.createCoupon),
    couponController.createCoupon);

couponRouter.put("/update-coupon/:couponId",
    auth(endpoint.update),
    fileUpload(fileValidation.image).single("image"),
    validation(validators.updateCoupon),
    couponController.updateCoupon);

couponRouter.delete("/delete-coupon/:couponId",
    auth(endpoint.delete),
    validation(validators.deleteCoupon),
    couponController.deleteCoupon);

export default couponRouter


