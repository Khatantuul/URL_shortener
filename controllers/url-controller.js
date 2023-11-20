import {nanoid} from 'nanoid';
import URL from '../models/url.js';
import URL_user from '../models/user.js';

export const generateShortUrl = async (req, res) => {
    const { url } = req.body;
    if(!url) {
        return res.status(400).json({ message: "URL is required"});
    }
    const shortId = nanoid(6);
    const urlObjectID = await URL.create({
        shortId,
        redirectUrl: url
    })

    const user = await URL_user.findOne({googleID: req.user.googleID});
    user.urls.push(urlObjectID);
    await user.save();

    return res.status(200).json({id: shortId});
}

export const redirectToUrl = async (req, res) => {
    const shortId = req.params.shortId;
    // console.log("shortId", shortId);
    const point = await URL.findOne({shortId});
    if(!point) {
        return res.status(404).json({message: "URL not found"});
    }
    res.redirect(point.redirectUrl);
}

export const getUserUrls = async (req, res) => {
    const user = await URL_user.findOne({googleID: req.user.googleID}).populate("urls");
    return res.status(200).json({urls: user.urls});
}

export const extractTokenFromHeader = async (req) => {
    const authorization = req.headers.authorization;
    if(!authorization) {
        return null;
    }
    const token = authorization.split(" ")[1];
    return token;
}



