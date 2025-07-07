import React, { useEffect, useState } from 'react';
import { assets } from "../assets/assets.js";
import axios from "axios";
import { backendUrl } from "../App.jsx";
import { toast } from "react-toastify";
import Edit from './Edit.jsx'; 
import { Link } from "react-router-dom";



const List = ({ token }) => {
    const [list, setList] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState(null);


    const fetchlist = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/products');
            if (response.data.success) {
                setList(response.data.products);
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            console.log(err);
            toast.error(err.message);
        }
    };

    const removeproduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            const response = await axios.delete(`${backendUrl}/api/products/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                await fetchlist();
                toast.success("Product deleted successfully");
            }
        } catch (err) {
            console.error("Delete error:", err);

            if (err.response?.status === 403) {
                toast.error("Admin privileges required. Please login as admin.");
            } else {
                toast.error(err.response?.data?.message || "Failed to delete product");
            }
        }
    };

    useEffect(() => {
        fetchlist();
    }, []);

    let currency = "$";

    return (
        <div>
            <p className='mb-2'>All Products List</p>
            <div className="flex flex-col gap-3">
                {/* list table title */}
                <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 bg-slate-200">
                    <b>Image</b>
                    <b>Name</b>
                    <b>Category</b>
                    <b>Price</b>
                    <b className='text-center'>Action</b>
                </div>

                {/* Product List */}
                {Array.isArray(list) && list.length > 0 ? (
                    list.map((item, index) => (
                        <div
                            key={item._id || index}
                            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
                        >
                            <img
                                src={item.images?.[0] ? backendUrl + item.images[0] : assets.placeholder_image}
                                alt="product"
                                className="w-12 h-12 object-cover"
                                onError={(e) => {
                                    e.target.src = assets.placeholder_image;
                                }}
                                />

                            <p>{item.name || 'No name'}</p>
                            <p>{item.category || 'Uncategorized'}</p>
                            <p>{item.price || '0'}{currency}</p>
                            <div className="flex items-center gap-2 justify-end">
                            <Link
                                to={`/edit/${item._id}`}
                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 text-sm"
                                title="Edit product"
                            >
                                Edit
                            </Link>

                            <button
                                onClick={() => removeproduct(item._id)}
                                className="px-3 py-1 bg-rose-500 text-white rounded hover:bg-rose-600 transition duration-300 text-sm"
                                title="Delete product"
                            >
                                ✕
                            </button>
                            </div>

                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-sm">No products found.</p>
                )}
            </div>
        </div>
    );
};

export default List;
