import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './config/mongodb.js'
import connectCloundinary from './config/cloudinary.js'
import userRouter from './routes/userRouter.js'
import productRouter from './routes/productRouter.js'
import cartRouter from './routes/cartRouter.js'
import orderRouter from "./routes/orderRouter.js";

// App config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloundinary()

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)




const allowedOrigins = ['https://e-commerce-frontend-pi-sooty.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// 🛡️ Handle preflight requests (OPTIONS)
app.options('*', cors());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use(express.urlencoded({ extended: true })); // ← يدعم form-data
app.use(express.json());                          // ← بعده عادي


// Routes
app.use('/api/user', userRouter)
app.use('/api/products', productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/orders', orderRouter)

// API endpoint
app.get('/', (req, res) => {
    res.send("API WORK")
})

// Start server
app.listen(port, () => console.log(`Server started on port ${port}`))
