// import userModel from "../models/userModel.js";
//
// const getUserCar = async () => {
//     try {
//         const { userId } = req.body;
//
//         const userData = await userModel.findById(userId);
//         let cartData = await userData.cartData;
//         res.json({ success: true, message: cartData });
//
//     } catch (error) {
//         console.log(error)
//         res.json({success:false , message: error.message})
//     }
//
// };
// const addToCar = async () => {
//     try{
//     const { userId, itemId, size } = req.body;
//
//
//         const userData = await userModel.findById(userId);
//         let cartData = await userData.cartData;
//
//         // Update cart data
//         if (cartData[itemId]) {
//         if (cartData[itemId][size]) {
//             cartData[itemId][size] += 1;
//         }
//         else {
//             cartData[itemId][size] = 1;
//         }
//         }
//         else {
//         cartData[itemId] = {};
//         cartData[itemId][size] = 1;
//         }
//
//
//         await userModel.findByIdAndUpdate(userId, {cartData});
//
//         res.json({ success: true, message: "Added To Cart" });
//     }catch (error) {
//         console.log(error)
//         res.json({success:false , message: error.message})
//         }
//
// };
// const updateCar = async () => {
//     try{
//         const { userId, itemId, size , quantity } = req.body;
//
//         const userData = await userModel.findById(userId);
//         let cartData = await userData.cartData;
//
//         cartData[itemId][size] = quantity;
//
//         await userModel.findByIdAndUpdate(userId, {cartData});
//         res.json({ success: true, message: "Cart Updated" });
//
//     }catch(error){
//         console.log(error)
//         res.json({success:false , message: error.message})
//
//     }
//
// };
//
// export  {getUserCar , addToCar , updateCar} ;
import userModel from "../models/userModel.js";

// ✅ Get Cart
const getUserCar = async (req, res) => {
    try {
        const userId = req.userId; // استخدم الـ userId من التوكن

        const userData = await userModel.findById(userId);
        const cartData = userData.cartData || {};

        res.json({ success: true, message: cartData });
    } catch (error) {
        console.log("Get Cart Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Add to Cart
const addToCar = async (req, res) => {
    try {
        const userId = req.userId;


        const { itemId, size } = req.body;

        // console.log("==[ ADD TO CART ]==");
        // console.log("userId:", userId);
        // console.log("itemId:", itemId);
        // console.log("size:", size);

        const userData = await userModel.findById(userId);
        const cartData = userData.cartData || {};

        if (!itemId || !size) {
            throw new Error("Missing itemId or size");
        }

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }

        await userModel.findByIdAndUpdate(userId, { cartData });

        res.json({ success: true, message: "Added To Cart" });
    } catch (error) {
        console.error("Add to cart error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


// ✅ Update Cart
const updateCar = async (req, res) => {
    try {
        const userId = req.userId;
        const { itemId, size, quantity } = req.body;

        const userData = await userModel.findById(userId);
        const cartData = userData.cartData || {};

        if (!cartData[itemId]) cartData[itemId] = {};
        cartData[itemId][size] = quantity;

        await userModel.findByIdAndUpdate(userId, { cartData });

        res.json({ success: true, message: "Cart Updated" });
    } catch (error) {
        console.log("Update Cart Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { getUserCar, addToCar, updateCar };


