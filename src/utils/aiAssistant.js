import axios from 'axios';

export const getAIResponse = async (message) => {
    try {
        const response = await axios.post('https://campus-guide-backend-n015.onrender.com', {
            message
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        console.log('Full API Response:', response.data); // Debug log

        // Check if response exists and has the expected format
        if (response.data && response.data.reply) {
            return response.data.reply;
        }

        throw new Error('Invalid response format');
    } catch (error) {
        console.error('AI Assistant Error:', error.response?.data || error.message);
        throw error;
    }
};