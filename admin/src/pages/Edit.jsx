import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App.jsx";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const Edit = ({ token }) => {
  const { id: paramId } = useParams();
  const [manualId, setManualId] = useState("");
  const productId = paramId || manualId;

  const [productData, setProductData] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProduct = async () => {
    if (!productId) return toast.error("Please provide a product ID");
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/products/${productId}`);
      if (res.data.success) {
        setProductData(res.data.product);
      } else {
        toast.error("Product not found");
      }
    } catch (err) {
      toast.error("Failed to fetch product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paramId) fetchProduct();
  }, [paramId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const toggleSize = (size) => {
    setProductData((prev) => {
      const updatedSizes = prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes: updatedSizes };
    });
  };

  const handleImageChange = (e) => {
    setNewImages([...e.target.files]);
  };

  const clearNewImages = () => {
    setNewImages([]);
  };

  const removeExistingImage = (indexToRemove) => {
    setProductData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== indexToRemove)
    }));
  };

  const saveProduct = async () => {
    try {
      const formData = new FormData();

      formData.append("name", productData.name);
      formData.append("description", productData.description);
      formData.append("price", productData.price);
      formData.append("category", productData.category);
      formData.append("subCategory", productData.subCategory);
      formData.append("bestseller", productData.bestseller);
      formData.append("date", productData.date);
      formData.append("sizes", JSON.stringify(productData.sizes));
      formData.append("images", JSON.stringify(productData.images));

      newImages.forEach((img) => formData.append("images", img));

      const res = await axios.put(
        `${backendUrl}/api/products/${productId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Product updated successfully");
        setNewImages([]);
      } else {
        toast.error("Failed to update product");
      }
    } catch (err) {
      toast.error("Error while updating");
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Edit Product</h2>

      {!paramId && (
        <div className="flex gap-3 mb-4">

          <input
            type="text"
            value={manualId}
            onChange={(e) => setManualId(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Enter Product ID"
          />
          <button
            onClick={fetchProduct}
            className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Load
          </button>
        </div>
      )}

      {!productData && <p className="text-gray-500">No product loaded.</p>}

      {productData && (
        <form className="space-y-4">
          <label className="block font-medium mb-1">Product Name</label>
          <input
            type="text"
            name="name"
            value={productData.name || ""}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Product Name"
          />
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={productData.description || ""}
            onChange={handleChange}
            className="textarea textarea-bordered w-full"
            placeholder="Description"
          />
          <label className="block font-medium mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={productData.price || ""}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Price"
          />

          <div>
            <label className="block font-medium mb-1">Main Category*</label>
            <select
              name="category"
              required
              value={productData.category}
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
              value={productData.subCategory}
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
                    productData.sizes.includes(size)
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
              checked={productData.bestseller || false}
              onChange={handleChange}
              className="checkbox checkbox-primary"
            />
            <label htmlFor="bestseller" className="cursor-pointer">
              Mark as bestseller
            </label>
          </div>

          <input
            type="date"
            name="date"
            value={productData.date ? new Date(productData.date).toISOString().split("T")[0] : ""}
            onChange={(e) =>
              setProductData((prev) => ({
                ...prev,
                date: e.target.value,
              }))
            }
            className="input input-bordered w-full"
          />

          {productData.images && (
            <div className="flex gap-2 flex-wrap">
              {productData.images.map((img, index) => (
                <div key={index} className="relative w-20 h-20">
                  <img
                    src={`${backendUrl}${img}`}
                    alt={`img-${index}`}
                    className="w-full h-full object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute top-0 right-0 bg-red-600 text-white w-5 h-5 text-xs rounded-full flex items-center justify-center hover:bg-red-700"
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="file-input file-input-bordered w-full"
          />

          {newImages.length > 0 && (
            <button
              type="button"
              onClick={clearNewImages}
              className="mt-2 text-sm text-red-500 underline hover:text-red-700"
            >
              Clear new images
            </button>
          )}

          <button
            type="button"
            onClick={saveProduct}
            className="btn bg-rose-600 hover:bg-green-700 text-white w-full"
          >
            Save Changes
          </button>
        </form>
      )}
    </div>
  );
};

export default Edit;

