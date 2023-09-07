import moment from "moment/moment.js";
import couponModel from "../../../../DB/model/Coupon.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import { asyncHandler } from "../../../utils/errorHandling.js";


export const getCouponList = asyncHandler(async (req, res, next) => {
    const couponList = await couponModel.find({ isDeleted: false })
    return res.status(200).json({ message: "DOne", couponList })
})

export const createCoupon = asyncHandler(async (req, res, next) => {
    req.body.name = req.body.name.toLowerCase()
    if (req.body?.expire) {
        req.body.expire =  moment.utc(req.body.expire)
    }
    if (await couponModel.findOne({ name: req.body.name })) {
        return next(new Error(`Duplicated coupon name ${req.body.name}`, { case: 409 }))
    }

    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/coupon` })
        req.body.image = { secure_url, public_id }
    }
    req.body.createdBy = req.user._id
    const coupon = await couponModel.create(req.body)
    return res.status(201).json({ message: "Done", coupon })
})


export const updateCoupon = asyncHandler(async (req, res, next) => {
    const { couponId } = req.params
    const coupon = await couponModel.findById(couponId)

    if (!coupon || coupon.isDeleted == true) {
        return next(new Error(`In-valid ID`, { case: 404 }))
    }

    // duplicated new Name
    if (req.body.name) {
        req.body.name = req.body.name.toLowerCase()
        if (req.body.name == coupon.name) {
            return next(new Error(`Cannot update coupon with the same old name  `, { case: 400 }))
        }
        if (await couponModel.findOne({ name: req.body.name })) {
            return next(new Error(`Duplicated coupon name ${req.body.name}`, { case: 409 }))
        }
        /*         coupon.name = req.body.name
                coupon.expire = req.body.expire */
    }

    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/coupon` })
        if (coupon.image?.public_id) {
            await cloudinary.uploader.destroy(coupon.image?.public_id)
        }
        req.body.image = { secure_url, public_id }
    }

    /*  if (req.body.amount) {
     coupon.amount = req.body.amount
     } */
     req.body.updatedBy = req.user._id
    /* await coupon.save() */
    const couponUpdate = await couponModel.updateOne({ _id: couponId }, req.body)
    return res.status(201).json({ message: "Done", couponUpdate })
})



export const deleteCoupon = asyncHandler(async (req, res, next) => {

    const coupon = await couponModel.findById(req.params.couponId)
    if (!coupon || coupon.isDeleted == true) {
        return next(new Error(`In-valid ID`, { case: 404 }))
    }
    coupon.isDeleted = true
    await coupon.save()
    return res.status(201).json({ message: "Done", coupon })
})
