export const extractDate = (dateString: string): string => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
  };
  
  export const extractTime = (dateString: string): string => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleTimeString();
  };