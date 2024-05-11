/** source/routes/posts.ts */
import express from "express";
import controller from "../controllers/api";

const router = express.Router();

router.get('/airdrop/:user/:amount', controller.airdrop);

export = router;
