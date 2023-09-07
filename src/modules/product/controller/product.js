import slugify from "slugify"
import brandModel from "../../../../DB/model/Brand.model.js"
import subcategoryModel from "../../../../DB/model/Subcategory.model.js"
import userModel from "../../../../DB/model/User.model.js"
import { asyncHandler } from "../../../utils/errorHandling.js"
import cloudinary from "../../../utils/cloudinary.js"
import { nanoid } from "nanoid"
import productModel from "../../../../DB/model/Product.model.js"




export const test = asyncHandler((req, res, next) => {
    return res.json({ message: "hi" })
})

/* (userName,phone,email,password,cPassword,status) */

//signUp
export const createProduct = asyncHandler(async (req, res, next) => {

    const { name, price, discount, categoryId, subcategoryId, brandId } = req.body;
    // check ids
    if (!await subcategoryModel.findOne({ _id: subcategoryId, categoryId })) {
        return next(new Error("In-valid category or subcategory ids", { cause: 400 }))
    }
    if (!await brandModel.findById(brandId)) {
        return next(new Error("In-valid brand Id", { cause: 400 }))
    }

    // create slug
    req.body.slug = slugify(nane, {
        replacement: "-",
        trim: true,
        lower: true
    })

    //calc final price
    req.body.finalPrice = price - (price * ((discount || 0) / 100))
    req.body.customId = nanoid()

    //handel image
    const { secure_url, public_url } = await cloudinary.uploader.upload(req.files?.mainImage[0].path, { folder: `${process.env.APP_NAME}/product/${req.body.customId}` })
    req.body.mainImage = { secure_url, public_url }

    if (req.files?.subImages?.lenght) {
        req.body.subImages = []
        for (const iterator of object) {
            const { secure_url, public_url } = await cloudinary.uploader.upload(file.path, { folder: `${process.env.APP_NAME}/product/${req.body.customId}/subImages` })
            req.body.subImages.push({ secure_url, public_url })
        }
    }
    req.body.createdBy = req.user._id
    const product = await productModel.create(req.body)
    return res.status(201).json({ message: "Done", product })

})
