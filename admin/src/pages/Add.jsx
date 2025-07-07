import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App.jsx";
import { assets } from "../assets/assets.js";

const Add = ({ token }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subCategory: "",
    sizes: [],
    bestseller: false,
    date: Date.now(),
  });
  const [image1,setImage1] = useState(false)
  const [image2,setImage2] = useState(false)
  const [image3,setImage3] = useState(false)
  const [image4,setImage4] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleSize = (size) => {
    setFormData((prev) => {
      const updatedSizes = prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes: updatedSizes };
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
  
    // التحقق من الحقول المطلوبة
    if (!formData.name || !formData.description || !formData.price ||
        !formData.category || !formData.subCategory) {
      setError("Please fill all required fields");
      setIsSubmitting(false);
      return;
    }
  
    try {
      const productData = new FormData();
  
      // تعبئة البيانات النصية مباشرة
      productData.append('name', formData.name);
      productData.append('description', formData.description);
      productData.append('price', formData.price);
      productData.append('category', formData.category);
      productData.append('subCategory', formData.subCategory);
      productData.append('bestseller', formData.bestseller);
      productData.append('sizes', JSON.stringify(formData.sizes)); // كـ JSON string
      productData.append('date', new Date().toISOString());
  
      productData.append('images', image1);
      productData.append('images', image2);
      productData.append('images', image3);
      productData.append('images', image4);

  
      const response = await axios.post(`${backendUrl}/api/products`, productData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });
  
      if (response.data.success) {
        alert("✅ Product added successfully!");
  
        // إعادة تعيين النموذج
        setFormData({
          name: "",
          description: "",
          price: "",
          category: "",
          subCategory: "",
          sizes: [],
          bestseller: false,
          date: Date.now(),
        });
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
      }
    } catch (error) {
      console.error("❌ Error uploading product:", error.message);
      setError(error.response?.data?.msg || "An internal error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Add New Product</h2>
      
      {error && (
        <div className="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Product Name*</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Enter product name"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description*</label>
          <textarea
            name="description"
            required
            value={formData.description}
            onChange={handleChange}
            className="textarea textarea-bordered w-full"
            placeholder="Enter product description"
            rows="4"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Price*</label>
          <input
            type="number"
            name="price"
            required
            value={formData.price}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Enter price"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Main Category*</label>
          <select
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="select select-bordered w-full"
          >
            <option value="">Select a category</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Sub Category*</label>
          <select
            name="subCategory"
            required
            value={formData.subCategory}
            onChange={handleChange}
            className="select select-bordered w-full"
          >
            <option value="">Select a sub-category</option>
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-2">Available Sizes</label>
          <div className="flex gap-2 flex-wrap">
            {["S", "M", "L", "XL", "XXL", "XXXL"].map((size) => (
              <button
                type="button"
                key={size}
                onClick={() => toggleSize(size)}
                className={`px-3 py-1 rounded-full border ${
                  formData.sizes.includes(size)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="bestseller"
            name="bestseller"
            checked={formData.bestseller}
            onChange={handleChange}
            className="checkbox checkbox-primary"
          />
          <label htmlFor="bestseller" className="cursor-pointer">
            Mark as bestseller
          </label>
        </div>
        <div>
        <p className="block font-medium mb-2">Product Images* (max 4)</p>
       
         <div className="flex gap-2">
         <label htmlFor="image1">
          <img className="w-20 " src={!image1?  assets.upload_area : URL.createObjectURL(image1)} alt=""/>
          <input onChange={(e)=>setImage1(e.target.files[0])} type="file" id="image1" hidden/>
         </label>
         <label htmlFor="image2">
          <img className="w-20 " src={!image2?  assets.upload_area : URL.createObjectURL(image2)} alt=""/>
          <input onChange={(e)=>setImage2(e.target.files[0])} type="file" id="image2" hidden/>
         </label>
         <label htmlFor="image3">
          <img className="w-20 " src={!image3?  assets.upload_area : URL.createObjectURL(image3)} alt=""/>
          <input onChange={(e)=>setImage3(e.target.files[0])} type="file" id="image3" hidden/>
         </label>
         <label htmlFor="image4">
          <img className="w-20 " src={!image4?  assets.upload_area : URL.createObjectURL(image4)} alt=""/>
          <input onChange={(e)=>setImage4(e.target.files[0])} type="file" id="image4" hidden/>
         </label>
         </div>

        </div>

        <button
          type="submit"
          className="btn bg-rose-500 text-white w-full hover:bg-green-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner"></span>
              Adding Product...
            </>
          ) : (
            "Add Product"
          )}
        </button>
      </form>
    </div>
  );
};

export default Add;