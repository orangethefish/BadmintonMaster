import { Request, Response, NextFunction } from 'express';

const formatDateToSQLite = (date: Date): string => {
  return date.toISOString().replace('T', ' ').replace('Z', '');
};

export const handleDates = (req: Request, res: Response, next: NextFunction) => {
  const now = new Date();
  const formattedNow = formatDateToSQLite(now);
  
  if (req.method === 'POST') {
    req.body.dateCreated = formattedNow;
    req.body.dateModified = formattedNow;
    req.body.dateDeleted = null;
  } else if (req.method === 'PUT' || req.method === 'PATCH') {
    req.body.dateModified = formattedNow;
  } else if (req.method === 'DELETE') {
    req.body.dateDeleted = formattedNow;
  }
  
  next();
}; 