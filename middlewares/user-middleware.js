import { OAuth2Client } from 'google-auth-library';
import URL_user from './../models/user.js';


const oauth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET);

export const validateToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];

    try {
        const ticket = await oauth2Client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID
        });

        const payload = ticket.getPayload();
        if (payload) {
            req.user = payload;
            next();
        } else {
            throw new Error("Invalid payload");
        }
    } catch (error) {
        console.error("Error verifying ID token:", error);
        res.sendStatus(401);
    }
}

export const authenticaUser = async (req,res,next) => {
    try {

        const userID = req.user?.sub; 
        if (!userID) {
            return res.sendStatus(401).json({ message: "Unauthorized: User id not sent by the validator" });
        }

        const user = await URL_user.findOne({ googleID: userID });

        if (user) {
            req.user = user;
            console.log("already user was there", req.user)
        } else {
            const newUser = await URL_user.create({
                googleID: userID,
                tier: "tier_1",
                email: req.user.email
            });
            req.user = newUser;
            console.log('req.user', req.user);
        }

        next();
        }catch (error) {
            console.error("Error finding/setting user:", error);
            res.sendStatus(500).json({ message: "Internal Server Error" });
        }
}