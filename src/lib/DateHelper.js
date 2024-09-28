export function isYesterday(date) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
  
    const incomingDate = new Date(date);
    incomingDate.setHours(0, 0, 0, 0);
  
    return incomingDate.getTime() === yesterday.getTime();
  }