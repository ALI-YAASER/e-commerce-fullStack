import express from 'express'
import { loginUser,registerUser,adminLogin ,deleteUserProfileImage ,updateUserInformation ,getUserProfile } from '../controller/userController.js'
import authMiddleware from "../middleware/authMiddleware.js";
import adminAuth from "../middleware/adminAuth.js";
import multer from 'multer';


const userRouter = express.Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/profile',authMiddleware , getUserProfile);
userRouter.put('/update',authMiddleware,upload.single('profileImage'),updateUserInformation)
userRouter.delete('/delete-profile-image',authMiddleware,deleteUserProfileImage)
userRouter.post('/admin',adminLogin)

export default userRouter;