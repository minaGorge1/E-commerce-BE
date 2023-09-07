import brandModel from "../../../../DB/model/Brand.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

export const getBrandList = asyncHandler(async (req, res, next) => {
    const brand = await brandModel.find({ isDeleted: false })
    return res.status(200).json({ message: "Done", brand })
})

export const createBrand = asyncHandler(async (req, res, next) => {
    const name = req.body.name.toLowerCase();
    if (await brandModel.findOne({ name })) {
        return next(new Error({ message: `Duplicated brand name ${name}` }, { cause: 409 }))
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/brand` })

    const brand = await brandModel.create({
        name,
        image: { secure_url, public_id },
        createBy: req.user._id
    })
    if (!brand) {
        return next(new Error("fail to create  your brand", { cause: 400 }))
    }
    return res.status(201).json({ message: "Done", brand })
})

export const updateBrand = asyncHandler(async (req, res, next) => {
    const { brandId } = req.params
    const brand = await brandModel.findById(brandId)
    if (!brand) {
        return next(new Error("In-valid brand id", { cause: 404 }))
    }
    if (req.body.name) {
        req.body.name = req.body.name.toLowerCase()
        if (req.body.name == brand.name) {
            return next(new Error("Cannot update brand with the same old name", { cause: 404 }))
        }
        if (await brandModel.findOne({ name: req.body.name })) {
            return next(new Error(`Duplicated brand name ${req.body.name}`, { cause: 404 }))
        }
        brand.name = req.body.name
    }
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/brand` })
        await cloudinary.uploader.destroy(brand.image.public_id)
        brand.image = { secure_url, public_id }
    }
    //await updateOne({ _id: brandId }, req.body)
    brand.updatedBy = req.user._id
    await brand.save()
    return res.status(200).json({ message: "Done", brand })
})

export const deleteBrand = asyncHandler(async (req, res, next) => {

    const brand = await brandModel.findById(req.params.brandId)
    if (!brand || brand.isDeleted == true) {
        return next(new Error(`In-valid ID`, { case: 404 }))
    }
    brand.isDeleted = true
    await brand.save()
    return res.status(201).json({ message: "Done", brand })
})