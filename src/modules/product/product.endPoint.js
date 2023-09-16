import { roles } from "../../middleware/auth.js";



export const endpoint = {
    create: [roles.Admin],
    update: [roles.Admin],
    delete: [roles.Admin],
    wishList: [roles.Admin,roles.User]
}