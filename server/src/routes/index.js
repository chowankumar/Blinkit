import { authRoutes } from "./auth.js";

const prefix = "/api";

export const reigsterRoutes = async(fastify)=>{
    fastify.register(authRoutes,{prefix:prefix})
}