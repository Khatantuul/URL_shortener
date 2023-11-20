import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    googleID: { type: String, required: true},
    tier: {type: String, enum: ["tier_1","tier_2","tier_3"], default: "tier_1"},
    email: { type: String, required: true },
    urls: [{ type: mongoose.Schema.Types.ObjectId, ref: "URL" }]
    }, {timestamps: true});


const URL_user = mongoose.model("URL_user",userSchema);

export default URL_user;