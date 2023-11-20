import express from 'express';
import * as subController from '../controllers/subscription-controller.js';
import { validateToken, authenticaUser } from '../middlewares/user-middleware.js';

const router = express.Router();

router.route("/")
    .post(validateToken, authenticaUser, subController.uplevelTier);
export default router;

