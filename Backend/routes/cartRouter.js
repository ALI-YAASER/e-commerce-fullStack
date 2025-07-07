import express from 'express'
import {getUserCar , addToCar , updateCar } from '../controller/cartController.js'
import authUser from '../middleware/auth.js'

const cartRouter = express.Router()

cartRouter.post('/get',authUser,getUserCar)
cartRouter.post('/add',authUser,addToCar)
cartRouter.post('/update',authUser,updateCar)
export default cartRouter