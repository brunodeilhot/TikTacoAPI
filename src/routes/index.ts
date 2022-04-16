import { Router } from "express";

const router = Router();

router.get('/', (_, res) => res.send('Project started'));

export default router;