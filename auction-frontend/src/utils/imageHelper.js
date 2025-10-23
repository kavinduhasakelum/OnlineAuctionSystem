// Helper function to get full image URL
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return 'https://via.placeholder.com/400x300?text=No+Image';
  
  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Get API base URL from environment
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'https://localhost:7096/api';
  
  // Remove '/api' from the end to get the base server URL
  const serverUrl = apiBaseUrl.replace('/api', '');
  
  // Ensure the path starts with /
  const path = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  
  return `${serverUrl}${path}`;
};
