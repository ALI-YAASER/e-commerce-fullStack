
import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import Stripe from 'stripe';


const currency = 'inr'
const deliveryCharge = 10;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


// ✅ Place order with Cash on Delivery (COD)
const placeOrder = async (req, res) => {
    try {
        const userId = req.userId;
        const { items, name, amount, address, customerDetails, paymentMethod } = req.body;

        const orderData = {
            userId,
            user: userId,
            name,
            items,
            address,
            amount,
            customerDetails,
            paymentMethod: paymentMethod || 'COD',
            payment: false,
            date: Date.now()
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(
            userId,
            { $push: { orders: newOrder._id } },
            { new: true }
        );

        res.json({
            success: true,
            message: "Order placed successfully",
            order: newOrder
        });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({
            success: false,
            message: "Failed to place order",
            error: error.message
        });
    }
};

// ✅ Stripe Checkout
const placeOrderStripe = async (req, res) => {
    try {
        const userId = req.userId;
        const { items ,amount , address , customerDetails } =req.body;
        const {origin} = req.headers;
        const orderData = {
             userId,                        // ✅ required
            user: userId,                  // ✅ required
            name: customerDetails.name, 
            items,
            address,
            amount,
            paymentMethod:'Stripe',
            payment:false,
            date: Date.now()
        }
        const newOrder = new orderModel(orderData)
        await newOrder.save()
        const line_items = items.map((item) => ({
            price_data:{
                currency:currency,
                product_data: {
                    name:item.name
                },
                unit_amount: item.price*100
            },
            quantity: item.quantity
        }))

        line_items.push({  
            price_data:{
                currency:currency,
                product_data: {
                name:'Delivery Charges'
                            },
                unit_amount: deliveryCharge*100
                        },
                quantity: 1
                    
        })
        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode:'payment',

        })
        res.json({success:true,session_url:session.url})

    } catch (err) {
        console.error("Stripe order error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

const verifyStripe = async (req, res) => {
    const { orderId, success, userId } = req.body;

    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} });
            res.json({ success: true });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


import axios from 'axios';

const placeOrderPaymob = async (req, res) => {
    try {
        const userId = req.userId;
        const { items, amount, address, customerDetails } = req.body;
        const { origin } = req.headers;

        // 1. Create Order in MongoDB
        const orderData = {
            userId,
            user: userId,
            name: customerDetails.name,
            items,
            address,
            amount,
            customerDetails,
            paymentMethod: 'Paymob',
            payment: false,
            date: Date.now()
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // 2. Get Auth Token from Paymob
        const authRes = await axios.post('https://accept.paymob.com/api/auth/tokens', {
            api_key: process.env.PAYMOB_API_KEY
        });
        const token = authRes.data.token;

        // 3. Register Order on Paymob
        const orderRes = await axios.post('https://accept.paymob.com/api/ecommerce/orders', {
            auth_token: token,
            delivery_needed: false,
            amount_cents: amount * 100,
            currency: "EGP",
            items: []
        });

        const orderId = orderRes.data.id;

        // 4. Generate Payment Key
        const billingData = {
            first_name: customerDetails.name,
            last_name: customerDetails.name,
            email: customerDetails.email,
            phone_number: customerDetails.phone,
            apartment: "NA",
            floor: "NA",
            street: "NA",
            building: "NA",
            city: address.city || "Cairo",
            state: address.state || "Cairo",
            country: "EG",
            postal_code: address.zipCode || "0000"
        };

        const payKeyRes = await axios.post('https://accept.paymob.com/api/acceptance/payment_keys', {
            auth_token: token,
            amount_cents: amount * 100,
            expiration: 3600,
            order_id: orderId,
            billing_data: billingData,
            currency: "EGP",
            integration_id: process.env.PAYMOB_INTEGRATION_ID
        });

        const paymentKey = payKeyRes.data.token;

        // 5. Redirect to payment iframe
        const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;

        res.json({ success: true, url: iframeUrl });

    } catch (err) {
        console.error("Paymob order error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};


// ✅ Get orders for one user
const getUserOrders = async (req, res) => {
    try {
        const userId = req.userId;
        const orders = await orderModel.find({ user: userId })
            .populate("user", "name email")
            .populate("items.product", "name price image")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Get user orders error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ✅ Get all orders (Admin)
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, orders });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ✅ Get orders for current logged user (simple)
const userOrders = async (req, res) => {
    try {
        const userId = req.userId;
        const orders = await orderModel.find({ userId });
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Admin can update order status
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        const updated = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });

        if (!updated) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.json({ success: true, message: "Order updated successfully", order: updated });
    } catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: e.message });
    }
};

export {
    placeOrder,
    placeOrderStripe,
    placeOrderPaymob,
    allOrders,
    updateStatus,
    userOrders,
    getUserOrders,
    verifyStripe
};
