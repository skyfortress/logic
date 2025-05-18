import { NextApiRequest, NextApiResponse } from 'next';
import enData from '../../data/data-en.json';
import uaData from '../../data/data-ua.json';
import enCorrectData from '../../data/correct-en.json';
import uaCorrectData from '../../data/correct-ua.json';
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
  
  const useCorrectData = Math.random() < 0.25;
  
  const regularData = lang === 'ua' ? uaData : enData;
  const correctData = lang === 'ua' ? uaCorrectData : enCorrectData;
  const fallacyData = useCorrectData ? correctData : regularData;
  
  const availableFallacies = fallacyData.filter((_, index) => {
    const actualId = useCorrectData ? index + 10000 : index;
    return !excludeIds.includes(actualId.toString());
  });
  
  if (availableFallacies.length === 0) {
    return res.status(200).json({ fallacy: null, remaining: 0 });
  }
  
  const randomIndex = Math.floor(Math.random() * availableFallacies.length);
  const selectedFallacy = availableFallacies[randomIndex];
  const originalIndex = fallacyData.findIndex(item => item === selectedFallacy);
  const uniqueId = useCorrectData ? originalIndex + 10000 : originalIndex;
  
  return res.status(200).json({
    fallacy: {
      ...selectedFallacy,
      id: uniqueId
    },
  });
}