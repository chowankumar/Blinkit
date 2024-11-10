import { authRoutes } from "./auth.js";
import { categoryRoutes, productRoutes } from "./productRoutes.js";

const prefix = "/api";

export const reigsterRoutes = async(fastify)=>{
    fastify.register(authRoutes,{prefix:prefix})
    fastify.register(productRoutes,{prefix:prefix})
    fastify.register(categoryRoutes,{prefix:prefix})
}
