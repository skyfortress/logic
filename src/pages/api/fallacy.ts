import { NextApiRequest, NextApiResponse } from 'next';
import enData from '../../data/data-en.json';
import uaData from '../../data/data-ua.json';
import { Fallacy } from './types';

export interface FallacyResponse {
  fallacy: Fallacy | null;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const excludeIds = req.query.exclude ? 
    (req.query.exclude as string).split(',').filter(Boolean) : 
    [];
  const lang = (req.query.lang as string) || 'en';
  
  const fallacyData = lang === 'ua' ? uaData : enData;
  
  const availableFallacies = fallacyData.filter((_, index) => 
    !excludeIds.includes(index.toString())
  );
  
  if (availableFallacies.length === 0) {
    return res.status(200).json({ fallacy: null, remaining: 0 });
  }
  
  const randomIndex = Math.floor(Math.random() * availableFallacies.length);
  const selectedFallacy = availableFallacies[randomIndex];
  const originalIndex = fallacyData.findIndex(item => item === selectedFallacy);
  
  return res.status(200).json({
    fallacy: {
      ...selectedFallacy,
      id: originalIndex
    },
  });
}