import axios from 'axios';


export const postReply = async (content, userId, commentId) => {
  try {
    const response = await axios.post('/api/replies', { content, userId, commentId });
    return response.data; 
  } catch (error) {
    console.error('Error posting reply:', error);
    throw error;
  }
};


export const editReply = async (replyId, content) => {
  try {
    const response = await axios.put(`/api/replies/${replyId}`, { content });
    return response.data; 
  } catch (error) {
    console.error('Error editing reply:', error);
    throw error;
  }
};


export const deleteReply = async (replyId) => {
  try {
    await axios.delete(`/api/replies/${replyId}`);
  } catch (error) {
    console.error('Error deleting reply:', error);
    throw error;
  }
};

export const fetchReplies = async (commentId,setReplies) => {
    try {
      const response = await axios.get(`/api/replies?commentId=${commentId}`);
      setReplies(response.data); 
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };
  