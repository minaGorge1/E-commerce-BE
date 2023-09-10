import slugify from "slugify"
import brandModel from "../../../../DB/model/Brand.model.js"
import subcategoryModel from "../../../../DB/model/Subcategory.model.js"
import { asyncHandler } from "../../../utils/errorHandling.js"
import cloudinary from "../../../utils/cloudinary.js"
import { nanoid } from "nanoid"
import productModel from "../../../../DB/model/Product.model.js"

export const test = asyncHandler((req, res, next) => {
    return res.json({ message: "hi" })
})


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
    req.body.slug = slugify(name, {
        replacement: "-",
        trim: true,
        lower: true
    })

    //calc final price
    req.body.finalPrice = price - (price * ((discount || 0) / 100))
    req.body.customId = nanoid()

    //handel image
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.files?.mainImage[0].path, { folder: `${process.env.APP_NAME}/product/${req.body.customId}` })
    req.body.mainImage = { secure_url, public_id }

    if (req.files?.subImages?.lenght) {
        req.body.subImages = []
        for (const file of req.files.subImages) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `${process.env.APP_NAME}/product/${req.body.customId}/subImages` })
            req.body.subImages.push({ secure_url, public_id })
        }
    }
    req.body.createdBy = req.user._id
    const product = await productModel.create(req.body)
    return res.status(201).json({ message: "Done", product })
})

export const updateProduct = asyncHandler(async (req, res, next) => {

    const { productId } = req.params;
    const product = await productModel.findById(productId)
    if (!product) {
        return next(new Error("In-valid product id ", { cause: 404 }))
    }
    const { name, price, discount, categoryId, subcategoryId, brandId } = req.body;
    // check ids
    if (categoryId && subcategoryId) {
        if (!await subcategoryModel.findOne({ _id: subcategoryId, categoryId })) {
            return next(new Error("In-valid category or subcategory ids", { cause: 400 }))
        }
    }
    if (brandId) {
        if (!await brandModel.findById(brandId)) {
            return next(new Error("In-valid brand Id", { cause: 400 }))
        }
    }

    if (name) {
        req.body.slug = slugify(name, {
            replacement: "-",
            trim: true,
            lower: true
        })
    }


    //calc final price
    req.body.finalPrice = (price || discount) ? req.body.finalPrice = (price || product.price) - ((price || product.price) * ((discount || product.discount) / 100)) : product.finalPrice

    /*  if (price && discount) {
           req.body.finalPrice = price - (price * ((discount ) / 100))
       }else if(price){
           req.body.finalPrice = price - (price * ((product.discount ) / 100))
       }else if(discount){
           req.body.finalPrice = product.price - (product.price * ((discount ) / 100))
       } */


    //handel image
    if (req.files?.mainImage?.lenght) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.files?.mainImage[0].path, { folder: `${process.env.APP_NAME}/product/${product.customId}` })
        req.body.mainImage = { secure_url, public_id }
        await cloudinary.uploader.destroy(product.mainImage.public_id)
    }


    if (req.files?.subImages?.lenght) {
        req.body.subImages = []
        for (const file of req.files.subImages) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `${process.env.APP_NAME}/product/${product.customId}/subImages` })
            req.body.subImages.push({ secure_url, public_id })
        }
    }

/* if (req.files?.subImages?.lenght) {
    cloudinary.api.delete_all_resources([''])
} */

    req.body.updatedBy = req.user._id
    return res.status(201).json({ message: "Done", product })
})
