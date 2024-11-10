import { Customer, DeliveryPartner } from "../../models";


export const updateUser = async(req,reply)=>{
    try {
        const{userId} = req.user;
        const updateData = req.body;

        let user = await Customer.findById(userId) || await DeliveryPartner.findById(userId);

        if(!user){
            return reply.status(404)
            .send({message:"User Not Found"})
        }

        let UserModel;
        if(user.role === "Customer"){
            UserModel = Customer;
        }else if(user.role === "DeliveryPartner"){
            UserModel = DeliveryPartner;
        }else{
            return reply.status(400)
            .send({message:"invalid user role"})
        }

        const UpdateUser = await UserModel.findByIdAndUpdate(
            userId,
            {$set : updateData},
            {new : true, runValidators : true}
        )

        if(!updateUser){
            return reply.status(404)
            .send({message:"User not found"})
        }

        return reply.send({
            message:"User updated",
        user: updateUser})
    } catch (error) {
        return reply.status(500)
        .send({message:"failed to update the user",error})
    }
}