import express from 'express';
const router = express.Router();
import { Response, Request, NextFunction } from "express";

/* GET home page */
router.get('/', (req: Request, res: Response, next: NextFunction): void => {
  res.send('Express server')
});

export default router;