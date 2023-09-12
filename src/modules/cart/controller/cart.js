import { asyncHandler } from "../../../utils/errorHandling.js"
import productModel from "../../../../DB/model/Product.model.js"
import cartModel from "../../../../DB/model/Cart.model.js"


export const getMyCart = asyncHandler(async (req, res, next) => {
    const cart = await cartModel.findOne({ userId: req.user._id })
    return res.json({ message: "hi", cart })
})

export const addCart = asyncHandler(async (req, res, next) => {
    const { productId, quantity } = req.body;
    const product = await productModel.findOne({
        _id: productId,
        stock: { $gte: quantity },
        isDeleted: false
    })
    if (!product) {
        return next(new Error(`In-valid product max available stock is : ${product?.stock}`, { cause: 400 }))
    }

    const cart = await cartModel.findOne({ userId: req.user._id })
    if (!cart) {
        const newCart = await cartModel.create({
            userId: req.user._id,
            product: [{ productId, quantity }]

        })
        return res.status(201).json({ message: "Done", newCart })
    }

    let matchProduct = false
    for (const product of cart.products) {
        if (product.productId.toString() == productId) {
            product.quantity = quantity
            matchProduct = true
            break;
        }
    }

    if (!matchProduct) {
        cart.products.push({ productId, quantity })
    }

    await cart.save()

    return res.status(200).json({ message: `Done`, cart })
})


export const deleteFromCart = asyncHandler(async (req, res, next) => {
    const { productIds } = req.body;
    const cart = await cartModel.updateOne({ userId: req.user._id }
        , {
            $pull: {
                products: {
                    productId: {
                        $in: productIds
                    }
                }
            }
        })
    return res.status(200).json({ message: `Done`, cart })
})


export const clearCart = asyncHandler(async (req, res, next) => {
    const cart = await cartModel.updateOne({ userId: req.user._id },{ products: [] })
    return res.status(200).json({ message: `Done`, cart })
})
