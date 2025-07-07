import express from "express";
import {
    addProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from "../controller/productController.js";
import adminAuth from "../middleware/adminAuth.js";
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

// Get current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

// File filter: allow only image files
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Initialize multer with options
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB per image
    },
    fileFilter: fileFilter
});

const router = express.Router();

// POST: Add new product with images (max 4)
router.post("/", upload.array('images', 4), addProduct);

// GET: All products
router.get("/", getAllProducts);

// GET: Product by ID
router.get("/:id", getProductById);

// PUT: Update product
router.put("/:id", upload.array('images', 4),adminAuth, updateProduct);

// DELETE: Remove product
router.delete("/:id", adminAuth, deleteProduct);

export default router;
