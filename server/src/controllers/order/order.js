
import Order from "../../models/order"; import Branch from "../../models/branch.js"; import { Customer, DeliveryPartner } from "../../models/user.js";


export const createOrder = async (req, reply) => {
    try {
        const { userId } = req.user;
        const { items, branch, totalPrice } = req.body;
        const customerData = await Customer.findById(userId)
        const brachData = await Branch.find(branch);
        if (!customerData) {
            return reply.status(404).send({ message: "Customer not found" })
        }
     

        const newOrder = new Order({
            customer:userId,
            items:items.map((item)=>({
                id:item.id,
                item:item.item,
                count:item.count

            })),
            branch,
            totalPrice,
            deliveryLocation:{
                latitude:customerData.liveLocation.latitude,
                longitude:customerData.liveLocation.longitude,
                address:customerData.address || "No address available"
            },
            pickupLocation:{
                latitude:branchData.liveLocation.latitude,
                longitude:branchData.liveLocation.longitude,
                address:branchData.address || "No address available"
            },
        });

        const savedOrder = await newOrder.save();
        return reply.status(201).send({ message: "order delivered",savedOrder })
    }
    catch (error) {
        return reply.status(500).send({ message: "failed to create the order" })
    }
};


export const confirmOrder = async(req,reply)=>{
    try {
        const {orderId} = req.params;
        const{userId} = req.user;
        const{deliveryPersonLocation} = req.body;


        const deliveryPerson = await DeliveryPartner.findByOdId(userId);
        if(!deliveryPerson){
            return reply.status(404).send({message:"delivery person not found"})
        }
        const order = await Order.findById(orderId);


        if(!order) return reply.status(404).send({messages:"order not found"});


        if(!order.status !=='available'){ return reply.status(400).send({messages:"Order is not available"})
        }
     
        order.status = 'confirmed';
        
        order.deliveryPartner = userId;
        order.deliveryLocation={
            latitude:deliveryPersonLocation?.latitude,
            longitude:deliveryPersonLocation?.longitude,
            address:deliveryPersonLocation.address || ""
        }
        
        await order.save();

        return reply.send(order);
    } catch (error) {
        return reply.status(500).send({messages:"failed to confirm order"})
    }
}


export const updateOrderStatus = async(req,reply)=>{
    try {
        const {orderId} = req.params;
        const {status,deliveryPersonLocation} = req.body;

        const {userId} = req.users;

        const deliveryPerson = await DeliveryPartner.findById(userId);

        if(!deliveryPerson){
            return reply.status(404).send({messages:"deliveryPerson not found"})}

        const order = await Order.findById(orderId);


        if(!order) return reply.status(404).send({messages:"Order not found"});


        if(['cancelled','delivered'].includes(order.status)){ return reply.status(400).send({messages:"Order  can not be updated" })
        }

        if(order.deliveryPartner.toString() !== userId){
            return reply.status(400).send({messages:"Order  can not be updated" })

        }
     
     
        order.status = status;
        
        
        order.deliveryLocation = deliveryPersonLocation;


             
        await order.save();

        return reply.send(order);
        
    } catch (error) {
        return reply.status(500).send({messages:"failed to update the order status"})
        
    }
}


