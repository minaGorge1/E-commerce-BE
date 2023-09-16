import slugify from "slugify"
import brandModel from "../../../../DB/model/Brand.model.js"
import subcategoryModel from "../../../../DB/model/Subcategory.model.js"
import { asyncHandler } from "../../../utils/errorHandling.js"
import cloudinary from "../../../utils/cloudinary.js"
import { nanoid } from "nanoid"
import productModel from "../../../../DB/model/Product.model.js"
import userModel from "../../../../DB/model/User.model.js"

export const getProducts = asyncHandler(async (req, res, next) => {
    const productList = await productModel.find().populate([{
        path: "review",
        match: { isDeleted: false }
    }])

    for (let i = 0; i < productList.length; i++) {
        let calcRating = 0;
        for (let j = 0; j < productList[i].review.length; j++) {
            calcRating += productList[i].review[j].rating
        }
        const conVObject = productList[i].toObject()
        conVObject.rating = calcRating / productList[i].review.length
        productList[i] = conVObject

    }
    return res.json({ message: "Done", productList })
})

export const createProduct = asyncHandler(async (req, res, next) => {
    console.log(req.body.size);
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

    if (req.files?.subImages?.length) {
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
    if (req.files?.mainImage?.length) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.files?.mainImage[0].path, { folder: `${process.env.APP_NAME}/product/${product.customId}` })
        req.body.mainImage = { secure_url, public_id }
        await cloudinary.uploader.destroy(product.mainImage.public_id)
    }


    if (req.files?.subImages?.length) {

        req.body.subImages = []
        for (const file of req.files.subImages) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `${process.env.APP_NAME}/product/${product.customId}/subImages` })
            req.body.subImages.push({ secure_url, public_id })
        }
    }

    /* if (req.files?.subImages?.length) {
        cloudinary.api.delete_all_resources([''])
    } */

    req.body.updatedBy = req.user._id
    await productModel.updateOne({ _id: productId }, req.body)
    return res.status(201).json({ message: "Done" })
})

export const deleteProduct = asyncHandler(async (req, res, next) => {

    const product = await productModel.findById(req.params.productId)
    if (!product || product.isDeleted == true) {
        return next(new Error(`In-valid ID`, { case: 404 }))
    }
    product.isDeleted = true
    await product.save()
    return res.status(201).json({ message: "Done", product })
})

export const wishList = asyncHandler(async (req, res, next) => {
    const { productId } = req.params
    if (!await productModel.findOne({ _id: productId, isDeleted: false })) {
        return next(new Error('In-valid product', { cause: 404 }))
    }
    await userModel.updateOne({ _id: req.user._id }, { $addToSet: { wishList: productId } })

    return res.status(200).json({ message: "Done" })
})

export const deleteFromWishList = asyncHandler(async (req, res, next) => {
    const { productId } = req.params
    await userModel.updateOne({ _id: req.user._id }, { $pull: { wishList: productId } })
    return res.status(200).json({ message: "Done" })
})