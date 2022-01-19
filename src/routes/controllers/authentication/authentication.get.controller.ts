import { Request, Response } from "express";
export const hasActiveSession = async (req: Request, res: Response) => {
  const sessionActive = !!req.user;
  return res.status(200).send({ session: sessionActive });
};
