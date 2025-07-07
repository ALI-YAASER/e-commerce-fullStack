import {v2 as cloudinary } from "cloudinary"


const connectCloundinary = async () => {
    cloudinary.config ({
        clound_name:process.env.clound_name,
        key_api:process.env.key_api,
        api_secret:process.env.api_secret
    })
}
export default connectCloundinary