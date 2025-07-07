//
// import jwt from "jsonwebtoken";
// import userModel from "../models/userModel.js";
//
// const producted = async (req, res, next) => {
// try {
// // التحقق من وجود توكين في الهيدر
// const authHeader = req.headers.authorization;
//
// if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ msg: "لم يتم توفير رمز التحقق (Token)" });
// }
//
// const token = authHeader.split(" ")[1];
// console.log(token);
// const decoded = jwt.verify(token, process.env.JWT_SECRET);
//
// // جلب المستخدم من قاعدة البيانات
// const user = await userModel.findById(decoded.id).select("-password");
// if (!user) {
//     return res.status(401).json({ msg: "المستخدم غير موجود" });
// }
//
// // إرفاق المستخدم بطلب req
// req.user = user;
//
// next(); // السماح بالدخول للمسار المحمي
// } catch (err) {
// return res.status(401).json({ msg: "Token غير صالح أو منتهي", error: err.message });
// }
// };
//
// export default producted;
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const authMiddleware = async (req, res, next) => {
    try {
        // 1. Check for token in Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authorization token required (Bearer token)"
            });
        }

        // 2. Extract token
        const token = authHeader.split(" ")[1];

        // 3. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Check if user still exists
        const user = await userModel.findById(decoded.userId).select("-password"); // Note: using userId not id

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User no longer exists"
            });
        }

        // 5. Attach user to request
        req.user = user;
        req.userId = user._id; // Also attach just the ID for convenience

        next(); // Proceed to protected route
    } catch (err) {
        // Handle different JWT errors specifically
        let message = "Invalid token";
        if (err.name === "TokenExpiredError") {
            message = "Token expired";
        } else if (err.name === "JsonWebTokenError") {
            message = "Malformed token";
        }

        return res.status(401).json({
            success: false,
            message,
            error: process.env.NODE_ENV === "development" ? err.message : undefined
        });
    }
};

export default authMiddleware;
