import { Request, Response, NextFunction } from 'express';

export const handleDates = (req: Request, res: Response, next: NextFunction) => {
  const now = new Date();
  
  if (req.method === 'POST') {
    req.body.dateCreated = now;
    req.body.dateModified = now;
    req.body.dateDeleted = null;
  } else if (req.method === 'PUT' || req.method === 'PATCH') {
    req.body.dateModified = now;
  } else if (req.method === 'DELETE') {
    req.body.dateDeleted = now;
  }
  
  next();
}; 