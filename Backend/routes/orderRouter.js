import express from 'express';
import {
    placeOrder,
    placeOrderStripe,
    placeOrderPaymob,
    allOrders,
    userOrders,
    updateStatus,
    getUserOrders,
    verifyStripe
} from '../controller/orderController.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const orderRouter = express.Router();

// Admin Features
orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

// Payment Features
orderRouter.post('/place', authUser, placeOrder);
orderRouter.post('/stripe', authUser , placeOrderStripe);
orderRouter.post('/paymob', authUser, placeOrderPaymob);

// User Feature
orderRouter.post('/userorders', authUser, userOrders);
orderRouter.get('/userorder', authUser, getUserOrders);

orderRouter.post('/verifyStripe', authUser, verifyStripe);

export default orderRouter;