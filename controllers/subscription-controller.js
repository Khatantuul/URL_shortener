import URL_user from '../models/user.js';

export const uplevelTier = async (req, res) => {
    const { tier } = req.body;
    if(!tier) {
        return res.status(400).json({ message: "Tier is required"});
    }
    const user = await URL_user.findOne({googleID: req.user.googleID});
    user.tier = tier === "none" ? "default" : tier;
    await user.save();
    return res.status(200).json({tier: tier});
}