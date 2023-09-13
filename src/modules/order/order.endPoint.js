import { roles } from "../../middleware/auth.js";



export const endpoint = {
    create: [roles.Admin , roles.User],
    add: [roles.Admin , roles.User], // user
/*     update: [roles.Admin],*/
    delete: [roles.Admin , roles.User] 
}