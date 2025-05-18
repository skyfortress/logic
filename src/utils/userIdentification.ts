/**
 * Handles user identification for state management
 */

export const getUserId = (): string => {
  if (typeof window === 'undefined') {
    return 'default';
  }
  
  let userId = localStorage.getItem('userId');
  
  if (!userId) {
    // Generate a unique ID using timestamp and random number
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('userId', userId);
  }
  
  return userId;
};

export const clearUserId = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userId');
  }
};