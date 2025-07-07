import jwt from "jsonwebtoken";
const adminAuth = async (req, res, next) => {
    try {
        // 1. Get token from either Auth header or cookie
        const token = req.headers.authorization?.split(' ')[1] ||
            req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Role check
        if (decoded.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Admin privileges required"
            });
        }

        // 4. Attach user to request
        req.user = decoded;
        next();

    } catch (error) {
        // Specific error messages
        let message = "Authentication failed";
        if (error.name === 'TokenExpiredError') {
            message = "Session expired";
        } else if (error.name === 'JsonWebTokenError') {
            message = "Invalid token";
        }

        res.status(401).json({
            success: false,
            message,
            error: error.message
        });
    }
};
export default adminAuth;