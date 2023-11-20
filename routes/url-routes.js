import express from 'express';
import * as urlController from '../controllers/url-controller.js';
import { rateLimiter} from './../middlewares/rate-limiter.js';
import { validateToken, authenticaUser } from '../middlewares/user-middleware.js';

const router = express.Router();

router.route("/")
    .post(validateToken, authenticaUser, rateLimiter, urlController.generateShortUrl);
router.route("/:shortId")
    .get(validateToken, authenticaUser, urlController.redirectToUrl);
router.route("/user/urls")
    .get(validateToken, authenticaUser, urlController.getUserUrls);
export default router;

