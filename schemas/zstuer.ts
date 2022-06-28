import { Schema } from "mongoose";

const zstuerSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    cookie: {
        type: String,
        required: false
    },
    expire: {
        type: Date,
        required: false
    },
    uuid: {
        type: String,
        required: false
    }
})

export { zstuerSchema }