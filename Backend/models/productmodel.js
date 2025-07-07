import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    _id: {
        type: String, // 👈 ضروري لو عايز تعين ID يدويًا
        required: false
      },
    name:{type: String, required:true},
    description:{type: String, required:true},
    price:{type: Number, required:true},
    images: { type: [String], required: true },
    category:{type: String, required:true},
    subCategory:{type: String, required:true},
    sizes:{type:Array,required:true},
    bestseller: {type : Boolean},
    date:{type:Number,required:true}

})

const productModel= mongoose.models.product || mongoose.model("product",productSchema)

export default productModel

// import mongoose from "mongoose";

// const productSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: [true, 'Product name is required'],
//         trim: true,
//         maxlength: [100, 'Name cannot exceed 100 characters']
//     },
//     description: {
//         type: String,
//         required: [true, 'Description is required'],
//         trim: true
//     },
//     price: {
//         type: Number,
//         required: [true, 'Price is required'],
//         min: [0, 'Price cannot be negative'],
//         max: [1000000, 'Price cannot exceed 1,000,000']
//     },
//     images: {
//         type: String,
//         required: [true, 'At least one image is required'],
//         validate: {
//             validator: function(array) {
//                 return array.length > 0;
//             },
//             message: 'At least one image is required'
//         }
//     },
//     category: {
//         type: String,
//         required: [true, 'Category is required'],
//         enum: {
//             values: ['Men', 'Women', 'Kids'],
//             message: 'Invalid category'
//         }
//     },
//     subCategory: {
//         type: String,
//         required: [true, 'Sub-category is required'],
//         enum: {
//             values: ['Topwear', 'Bottomwear', 'Winterwear', 'Accessories'],
//             message: 'Invalid sub-category'
//         }
//     },
//     sizes: {
//         type: [String],
//         required: [true, 'At least one size is required'],
//         enum: {
//             values: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
//             message: 'Invalid size value'
//         }
//     },
//     bestseller: {
//         type: Boolean,
//         default: false
//     },
//     date: {
//         type: Date,
//         required: true,
//         default: Date.now
//     }
// }, {
//     timestamps: true,
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true }
// });

// // Add index for better query performance
// productSchema.index({ name: 'text', description: 'text' });

// const productModel = mongoose.models.product || mongoose.model("product", productSchema);

// export default productModel;