import categoryModel from "../../../../DB/model/Category.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import slugify from "slugify";
import { asyncHandler } from "../../../utils/errorHandling.js";

export const getCategoryList = asyncHandler(async (req, res, next) => {
    const category = await categoryModel.find({ isDeleted: false }).populate([
        {
            path: "Subcategory"
        }
    ])
    return res.status(200).json({ message: "Done", category })
})

export const createCategory = asyncHandler(async (req, res, next) => {
    const name = req.body.name.toLowerCase();
    if (await categoryModel.findOne({ name })) {
        // return res.status(409).json({ message: `Duplicated category name ${name}` })
        return next(new Error(`Duplicated category name ${name}`, { cause: 409 }))
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/category` })

    const category = await categoryModel.create({
        name,
        slug: slugify(name, '_'),
        image: { secure_url, public_id },
        createdBy: req.user._id
    })
    if (!category) {
        return next(new Error("fail to create  your category", { cause: 400 }))
    }
    return res.status(201).json({ message: "Done", category })
})

export const updateCategory = asyncHandler(async (req, res, next) => {
    const { categoryId } = req.params
    const category = await categoryModel.findById(categoryId)
    if (!category) {
        return next(new Error("In-valid category id", { cause: 404 }))
    }
    if (req.body.name) {
        req.body.name = req.body.name.toLowerCase()
        if (req.body.name == category.name) {
            return next(new Error("Cannot update category with the same old name", { cause: 404 }))
        }
        if (await categoryModel.findOne({ name: req.body.name })) {
            return next(new Error(`Duplicated category name ${req.body.name}`, { cause: 404 }))
        }
        //req.body.slug = slugify(req.body.name, '_')
        category.slug = slugify(req.body.name, '_')
        category.name = req.body.name
    }
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/category` })
        await cloudinary.uploader.destroy(category.image.public_id)
        category.image = { secure_url, public_id }
    }
    //await updateOne({ _id: categoryId }, req.body)
    category.updatedBy =  req.user._id
    await category.save()
    return res.status(200).json({ message: "Done", category })
})

export const deleteCategory = asyncHandler(async (req, res, next) => {

    const category = await categoryModel.findById(req.params.categoryId)
    if (!category || category.isDeleted == true) {
        return next(new Error(`In-valid ID`, { case: 404 }))
    }
    category.isDeleted = true
    await category.save()
    return res.status(201).json({ message: "Done", category })
})