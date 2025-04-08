import axios from 'axios';

export const getAIResponse = async (message) => {
    try {
        const response = await axios.post('http://localhost:5000/api/assistant', 
            { message },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('Raw API response:', response.data);

        // Extract the reply from response
        if (response.data && response.data.reply) {
            return response.data.reply;
        }

        throw new Error('Invalid response format');
    } catch (error) {
        console.error('AI Assistant Error:', error);
        throw error;
    }
};