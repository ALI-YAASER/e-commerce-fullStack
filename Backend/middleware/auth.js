// import jwt from 'jsonwebtoken'
//
// const authUser = async (req , res , next) => {
//     const {token} = req.headers;
//     if(!token) {
//         return res.json({success:false , message: 'Not Autorid login again'})
//
//     }
//
//     try{
//         const token_decode = jwt.verify(token,process.env.JWT_SECRET)
//         // req.body.userId = token_decode.id
//         req.userId = token_decode.id
//         req.userId = token_decode.userId;
//
//         next()
//     }catch(error) {
//         console.log(error)
//         res.json({success:false , message:error.message})
//     }
//
//
//
// }
//
// export default authUser
import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    const { token } = req.headers;

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = token_decode.userId; // ✅ Only this
        next();
    } catch (error) {
        console.log("❌ Token verification error:", error);
        res.status(401).json({ success: false, message: error.message });
    }
};

export default authUser;
// import jwt from 'jsonwebtoken';
//
// const authUser = async (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     const token = authHeader && authHeader.split(" ")[1]; // ✅ استخراج التوكن من Bearer
//
//     console.log("AUTH HEADER:", req.headers.authorization);
//     console.log("TOKEN EXTRACTED:", token);
//     if (!token) {
//         return res.status(401).json({ success: false, message: 'No token provided' });
//     }
//
//     try {
//         const token_decode = jwt.verify(token, process.env.JWT_SECRET);
//         req.userId = token_decode.userId;
//         next();
//     } catch (error) {
//         console.log("❌ Token verification error:", error);
//         res.status(401).json({ success: false, message: error.message });
//     }
// };
//
// export default authUser;
