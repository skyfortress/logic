import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { RootState } from '../../state/types';

const STATE_DIR = path.join(process.cwd(), 'data', 'state');
const STATE_FILE = 'fallacy_trainer_state.json';
const HISTORY_DIR = path.join(STATE_DIR, 'history');
const DEFAULT_USER_ID = 'default';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Ensure directories exist
    if (!fs.existsSync(STATE_DIR)) {
      fs.mkdirSync(STATE_DIR, { recursive: true });
    }
    
    if (!fs.existsSync(HISTORY_DIR)) {
      fs.mkdirSync(HISTORY_DIR, { recursive: true });
    }

    // Get user ID from request or use default
    const userId = typeof req.query.userId === 'string' 
      ? req.query.userId.replace(/[^a-zA-Z0-9_-]/g, '') 
      : req.body?.userId?.replace(/[^a-zA-Z0-9_-]/g, '') || DEFAULT_USER_ID;

    if (req.method === 'POST') {
      const state = req.body as RootState;
      if (!state || !state.fallacyTrainer) {
        return res.status(400).json({ error: 'Invalid state data' });
      }

      // Create user directory if needed
      const userStateDir = path.join(STATE_DIR, userId);
      const userHistoryDir = path.join(HISTORY_DIR, userId);
      
      if (!fs.existsSync(userStateDir)) {
        fs.mkdirSync(userStateDir, { recursive: true });
      }
      
      if (!fs.existsSync(userHistoryDir)) {
        fs.mkdirSync(userHistoryDir, { recursive: true });
      }

      // Save current state to user-specific file
      const stateFilePath = path.join(userStateDir, STATE_FILE);
      fs.writeFileSync(stateFilePath, JSON.stringify(state, null, 2));

      // Also save a timestamped version for history
      const timestamp = new Date().toISOString().replace(/:/g, '-');
      const historyFilePath = path.join(userHistoryDir, `state_${timestamp}.json`);
      fs.writeFileSync(historyFilePath, JSON.stringify(state, null, 2));

      // Clean up old history files (keep latest 50)
      const historyFiles = fs.readdirSync(userHistoryDir)
        .filter(file => file.startsWith('state_'))
        .sort()
        .reverse();
      
      if (historyFiles.length > 50) {
        historyFiles.slice(50).forEach(file => {
          fs.unlinkSync(path.join(userHistoryDir, file));
        });
      }

      return res.status(200).json({ success: true });
    } 
    else if (req.method === 'GET') {
      // Try user-specific state file first
      const userStateDir = path.join(STATE_DIR, userId);
      const userStateFilePath = path.join(userStateDir, STATE_FILE);
      
      // If user-specific file doesn't exist but we're not using the default user,
      // check if the default state file exists
      const defaultStateFilePath = path.join(STATE_DIR, STATE_FILE);
      let stateFilePath = userStateFilePath;
      
      if (!fs.existsSync(userStateFilePath)) {
        if (userId !== DEFAULT_USER_ID && fs.existsSync(defaultStateFilePath)) {
          // For backward compatibility - use the default file
          stateFilePath = defaultStateFilePath;
        } else if (!fs.existsSync(userStateDir)) {
          fs.mkdirSync(userStateDir, { recursive: true });
          
          if (!fs.existsSync(path.join(HISTORY_DIR, userId))) {
            fs.mkdirSync(path.join(HISTORY_DIR, userId), { recursive: true });
          }
          
          return res.status(200).json({ state: null });
        } else {
          return res.status(200).json({ state: null });
        }
      }

      const stateData = fs.readFileSync(stateFilePath, 'utf8');
      const state = JSON.parse(stateData);
      
      return res.status(200).json({ state });
    } 
    else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling state:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}