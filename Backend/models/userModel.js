// import mongoose from "mongoose";
// const userSchema = new mongoose.Schema({
//     name:{type: String, required:true},
//     email:{type: String, required:true , unique:true},
//     password:{type: String, required:true},
//     cartData: {
//         type: Object,
//         default: {}
//     }
// },{minimize:false})
//
// const userModel = mongoose.models.user || mongoose.model("user",userSchema)
// export default userModel
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: {
        type: Object,
        default: {}
    },
    address: {
        line1: { type: String, default: "" },
        line2: { type: String, default: "" },
    },
    phone: { type: String, default: "" },
    gender: { type: String, enum: ['Male', 'Female', 'Other' , ''], default: "" },
    birthday: { type: Date, default: null },
    profileImage: { type: String, default: "" } // optional field
}, { minimize: false });

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
