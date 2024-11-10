import { fetchUser, loginCustomer, loginDeliveryPartner } from "../controllers/auth/auth";
import { verifyToken } from "../middleware/auth";


export const authRoutes = async (fastify,options)=>{
    fastify.post("/customer/login",loginCustomer);
    fastify.post("/delivery/login",loginDeliveryPartner);
    fastify.post("/refresh-token",{preHandler:[verifyToken]},fetchUser);
};