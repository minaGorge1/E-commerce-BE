import { roles } from "../../middleware/auth.js";



export const endpoint = {
    create: [roles.Admin,roles.User],
    update: [roles.Admin,roles.User],
    delete: [roles.Admin,roles.User]
}