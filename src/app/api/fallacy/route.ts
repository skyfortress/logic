import { NextRequest, NextResponse } from 'next/server';
import enData from '../../data-en.json';
import uaData from '../../data-ua.json';
import { Fallacy } from '../types';

export interface FallacyResponse {
  fallacy: Fallacy | null;
  remaining: number;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const excludeIds = searchParams.get('exclude')?.split(',').filter(Boolean) || [];
  const lang = searchParams.get('lang') || 'en';
  
  const fallacyData = lang === 'ua' ? uaData : enData;
  
  const availableFallacies = fallacyData.filter((_, index) => !excludeIds.includes(index.toString()));
  
  if (availableFallacies.length === 0) {
    return NextResponse.json({ fallacy: null, remaining: 0 });
  }
  
  const randomIndex = Math.floor(Math.random() * availableFallacies.length);
  const selectedFallacy = availableFallacies[randomIndex];
  const originalIndex = fallacyData.findIndex(item => item === selectedFallacy);
  
  return NextResponse.json({
    fallacy: {
      ...selectedFallacy,
      id: originalIndex
    },
    remaining: availableFallacies.length - 1
  });
}