// import productModel from "../models/productmodel.js";
// import fs from 'fs';
// import path from 'path';

// // Helper function to delete uploaded files on error
//         const cleanupFiles = (filePaths) => {
//         filePaths.forEach(filePath => {
//     fs.unlink(filePath, err => {
//     if (err) console.error('Error cleaning up file:', err);
//         });
// });
//         };

        // export const addProduct = async (req, res) => {
        //         let uploadedFiles = [];
              
        //         try {
        //           // 1. Validate uploaded files
        //           if (!req.files || req.files.length === 0) {
        //             return res.status(400).json({
        //               success: false,
        //               message: "At least one product image is required"
        //             });
        //           }
              
        //           // ✅ 2. Read fields directly from req.body
        //           const {
        //             name,
        //             description,
        //             price,
        //             category,
        //             subCategory,
        //             bestseller,
        //             sizes,
        //             date
        //           } = req.body;
              
        //           if (!name || !description || !price || !category || !subCategory) {
        //             return res.status(400).json({
        //               success: false,
        //               message: "Missing required fields"
        //             });
        //           }
              
        //           // 3. Process images
        //           uploadedFiles = req.files.map(file => file.path);
        //           const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
              
        //           // 4. Create and save the product
        //           const newProduct = new productModel({
        //             name: name.trim(),
        //             description: description.trim(),
        //             price: Number(price),
        //             images: imageUrls,
        //             category,
        //             subCategory,
        //             sizes: JSON.parse(sizes), // ✅ sizes is JSON string
        //             bestseller: bestseller === 'true',
        //             date: date ? new Date(date) : new Date()
        //           });
              
        //           await newProduct.validate();
        //           const savedProduct = await newProduct.save();
              
        //           res.status(201).json({
        //             success: true,
        //             message: "Product created successfully",
        //             product: savedProduct
        //           });
              
        //         } catch (error) {
        //           // Cleanup uploaded files
        //           if (uploadedFiles.length > 0) {
        //             uploadedFiles.forEach(filePath => {
        //               fs.unlink(filePath, err => {
        //                 if (err) console.error('Error cleaning up file:', err);
        //               });
        //             });
        //           }
              
        //           if (error.name === 'ValidationError') {
        //             const errors = Object.values(error.errors).map(err => ({
        //               field: err.path,
        //               message: err.message
        //             }));
              
        //             return res.status(400).json({
        //               success: false,
        //               message: "Validation failed",
        //               errors
        //             });
        //           }
              
        //           if (error.code === 11000) {
        //             return res.status(400).json({
        //               success: false,
        //               message: "Product with this name already exists"
        //             });
        //           }
              
        //           console.error('Product creation error:', error);
        //           res.status(500).json({
        //             success: false,
        //             message: "Internal server error",
        //             error: error.message
        //           });
        //         }
        //       };

// تأكد من المسار الصحيح

import productModel from "../models/productmodel.js";
import fs from 'fs';

// دالة مساعدة لحذف الصور عند حدوث خطأ
const cleanupFiles = (filePaths) => {
  filePaths.forEach(filePath => {
    fs.unlink(filePath, err => {
      if (err) console.error('Error cleaning up file:', err);
    });
  });
};

export const addProduct = async (req, res) => {
  let uploadedFiles = [];

  try {
    const {
      _id,
      name,
      description,
      price,
      category,
      subCategory,
      bestseller,
      sizes,
      date
    } = req.body;

    // ✅ تحقق من وجود صور
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required"
      });
    }

    // ✅ تحقق من الحقول الأساسية
    if (!name || !description || !price || !category || !subCategory) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // ✅ حفظ مسارات الصور
    uploadedFiles = req.files.map(file => file.path);
    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);

    // ✅ تجهيز بيانات المنتج
    const productData = {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      images: imageUrls,
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      bestseller: bestseller === 'true',
      date: date ? new Date(date) : new Date()
    };

    if (_id) productData._id = _id.trim(); // إدخال id يدويًا إن وُجد

    // ✅ إنشاء المنتج وحفظه
    const newProduct = new productModel(productData);
    await newProduct.validate();
    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: savedProduct
    });

  } catch (error) {
    if (uploadedFiles.length > 0) cleanupFiles(uploadedFiles);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Product with this ID or name already exists"
      });
    }

    console.error('Product creation error:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

              

export const getAllProducts = async (req, res) => {
        try {
        const products = await productModel.find().sort({ createdAt: -1 });
        res.status(200).json({
    success: true,
            count: products.length,
            products
});
        } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
    success: false,
            message: "Failed to fetch products",
            error: error.message
});
        }
        };

export const getProductById = async (req, res) => {
        try {
        const product = await productModel.findById(req.params.id);

        if (!product) {
        return res.status(404).json({
    success: false,
            message: "Product not found"
});
        }

        res.status(200).json({
    success: true,
            product
});
        } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({
    success: false,
            message: "Failed to fetch product",
            error: error.message
});
        }
        };

        export const updateProduct = async (req, res) => {
          try {
            const { id } = req.params;
        
            // تجميع الحقول النصية من body
            const updates = {
              name: req.body.name,
              description: req.body.description,
              price: req.body.price,
              category: req.body.category,
              subCategory: req.body.subCategory,
              sizes: req.body.sizes ? JSON.parse(req.body.sizes) : [],
              bestseller: req.body.bestseller === 'true'
            };
        
            // ✳️ 1. جلب الصور القديمة المحدثة من الواجهة
            let existingImages = [];
            if (req.body.images) {
              try {
                existingImages = JSON.parse(req.body.images);
              } catch (e) {
                console.error("Error parsing existing images:", e);
              }
            }
        
            // ✳️ 2. التعامل مع الصور الجديدة
            const newImages = req.files?.length
              ? req.files.map(file => `/uploads/${file.filename}`)
              : [];
        
            // ✳️ 3. دمج الصور النهائية (القديمة المتبقية + الجديدة)
            updates.images = [...existingImages, ...newImages];
        
            const updatedProduct = await productModel.findByIdAndUpdate(
              id,
              { $set: updates },
              { new: true, runValidators: true }
            );
        
            if (!updatedProduct) {
              return res.status(404).json({ success: false, message: "Product not found" });
            }
        
            res.status(200).json({
              success: true,
              message: "Product updated successfully",
              product: updatedProduct
            });
        
          } catch (error) {
            console.error("Update error:", error);
            res.status(500).json({
              success: false,
              message: error.message || "Failed to update product"
            });
          }
        };
        

export const deleteProduct = async (req, res) => {
        try {
        const product = await productModel.findByIdAndDelete(req.params.id);

        if (!product) {
        return res.status(404).json({
    success: false,
            message: "Product not found"
});
        }

        // Delete associated images
        product.images.forEach(image => {
            const imagePath = path.join(__dirname, '..', image);
    fs.unlink(imagePath, err => {
    if (err) console.error('Error deleting image:', err);
            });
});

        res.status(200).json({
    success: true,
            message: "Product deleted successfully"
});
        } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
    success: false,
            message: "Failed to delete product",
            error: error.message
});
        }
        }   ;