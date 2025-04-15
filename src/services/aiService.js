import api from '../utils/api';

export const getAIResponse = async (message) => {
    try {
        console.log('Sending request to:', process.env.REACT_APP_API_URL);
        const response = await api.post('/api/assistant', { message });
        console.log('Response received:', response.data);
        return response.data.reply;
    } catch (error) {
        console.error('AI Service Error:', error);
        throw error;
    }
};