import productModel from "../../../../DB/model/Product.model.js"
import couponModel from "../../../../DB/model/Coupon.model.js"
import cartModel from "../../../../DB/model/Cart.model.js"
import { asyncHandler } from "../../../utils/errorHandling.js"
import orderModel from "../../../../DB/model/Order.model.js"



export const test = asyncHandler((req, res, next) => {
    return res.json({ message: "hi" })
})


export const createOrder = asyncHandler(async (req, res, next) => {
    const { products, address, phone, note, couponName, paymentType } = req.body;

    if (couponName) {
        const coupon = await couponModel.findOne({ name: couponName.toLowerCase(), usedBy: { $nin: req.user._id } })
        if (!coupon || coupon.expire.getTime() < Date.now()) {
            return next(new Error(`In-valid coupon`, { cause: 400 }))
        }
        req.body.coupon = coupon;
    }

    const productsIds = []
    const finalProductsList = []
    let subtotal = 0;
    for (const product of products) {
        const checkProduct = await productModel.findOne({
            _id: product.productId,
            stock: { $gte: product.quantity },
            isDeleted: false
        })
        if (!checkProduct) {
            return nest(new Error(`In-valid product ${product.productId}`, { cause: 400 }))
        }
        productsIds.push(product.productId)
        product.name = checkProduct.name;
        product.unitPrice = checkProduct.unitPrice;
        product.finalPrice = checkProduct.finalPrice * product.quantity;
        finalProductsList.push(product);
        subtotal += product.finalPrice;
    }

    const order = await orderModel.create({
        userId: req.user._id,
        address,
        note,
        phone,
        products: finalProductsList,
        couponId: req.body.coupon?._id,
        subtotal,
        finalPrice: subtotal - (subtotal * ((req.body.coupon?.amount || 0) / 100)),
        paymentType,
        status: paymentType == 'card' ? 'waitPayment' : 'placed'
    })

    for (const product of products) {
        await productModel.updateOne({ _id: product.productId }, { $inc: { stock: -parseInt(product.quantity) } })
    }

    if (req.body.coupon?._id) {
        await couponModel.updateOne({ _id: req.body.coupon._id }, { $addToSet: { usedBy: req.user._id } })
    }

    await cartModel.updateOne({ userId: req.user._id }, {
        $pull: {
            products: {
                productId: { $in: productsIds }
            }
        }
    })

    return res.status(201).json({ massage: 'Done', order })
})