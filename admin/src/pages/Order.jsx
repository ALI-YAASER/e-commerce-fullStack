import React, {useEffect, useState} from 'react'
import {assets} from "../assets/assets.js";
import axios from "axios";
import {backendUrl} from "../App.jsx";
import {toast} from "react-toastify";

const Orders = ({token}) => {
    const [orders, setOrders] = useState([])
    const fetchAllOrders = async () => {

        if(!token){
            return null;
        }
     try {
         const response = await axios.post(
             backendUrl + '/api/orders/list',
             {}, // Body
             {
                 headers: {
                     Authorization: `Bearer ${token}`
                 }
             }
         );
         if(response.data.success){
             setOrders(response.data.orders)
         }else {
             toast.error(response.data.message)
         }
    }catch(err){
         console.log(err)
         toast.error(err.message)
     }
    }

    const statusHandler = async ( event , orderId) => {
    try{
        const response = await axios.post(backendUrl + '/api/orders/status',{orderId,status:event.target.value},{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if(response.data.success){
           await fetchAllOrders();
        }else{
            toast.error(response.data.message)
        }
    }catch (err) {
        console.log(err)
        toast.error(err.message)
    }
    }

useEffect(()=>{
    fetchAllOrders();
},[token])
    return (
        <div>
            {orders.map((order, index) => (
                <div key={index} className="mb-6 p-5 border rounded-lg bg-white shadow-md">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-3">
                        <img src={assets.parcel_icon} alt="Parcel Icon" className="w-8 h-8" />
                        <h3 className="text-lg font-bold">Order ID: <span className="text-gray-700">{order._id}</span></h3>
                    </div>

                    {/* Basic Info */}
                    <div className="grid sm:grid-cols-3 gap-2 text-sm text-gray-700">
                        <div>
                            <p><strong>User ID:</strong> {order.userId}</p>
                            <p><strong>Date:</strong> {new Date(order.date).toLocaleString()}</p>
                            {/*<p><strong>Status:</strong> {order.status || 'Order Placed'}</p>*/}
                        </div>
                        <div>
                            <p><strong>Customer Name:</strong> {order.name || 'N/A'}</p>
                            <p><strong>Email:</strong> {order.customerDetails?.email || 'N/A'}</p>
                            <p><strong>Phone:</strong> {order.customerDetails?.phone || 'N/A'}</p>
                        </div>
                        <div>
                            <b className='text-md'><strong>Amount:</strong> ${order.amount}</b>
                            <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                            <p><strong>Payment Status:</strong> {order.payment ? 'Done' : 'Pending'}</p>
                            <select value={order.status}  onChange={(e) => statusHandler(e, order._id)} className='my-2 font-semibold'>
                                <option value="Order Placed">Order Placed</option>
                                <option value="Packing">Packing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Out for delivery">Out for delivery</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                        </div>
                    </div>

                    {/* Address */}
                    <div className='grid sm:grid-cols-2 gap-2 text-sm text-gray-700'>
                    <div className="mt-3">
                        <p className="font-semibold">Shipping Address:</p>
                        <ul className="ml-4 list-disc text-sm text-gray-600">
                            <li>Country: {order.address?.country || 'N/A'}</li>
                            <li>City: {order.address?.city || 'N/A'}</li>
                            <li>State: {order.address?.state || 'N/A'}</li>
                            <li>Street: {order.address?.street || 'N/A'}</li>
                            <li>Zip Code: {order.address?.zipCode || 'N/A'}</li>
                        </ul>
                    </div>

                    {/* Items */}
                    <div className="mt-4">
                        <p className="font-semibold">Items:</p>

                        {order.items.map((item, i) => (

                            <div key={i} className="ml-2 text-sm text-gray-700">
                                - {item.name} x {item.quantity} ({item.size}) - ${item.price}
                            </div>
                        ))}

                    </div>
                    </div>
                </div>
            ))}

        </div>

    )
}

export default Orders
