import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
    shortId: {type: String, unique: true, required: true},
    redirectUrl: {type: String, required: true},
}, {timestamps: true});

const URL = mongoose.model('URL', urlSchema);

export default URL;