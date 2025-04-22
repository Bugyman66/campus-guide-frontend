import axios from 'axios';

const config = {
    development: {
        API_URL: 'http://localhost:5000',
        PAYSTACK_CALLBACK_URL: 'http://localhost:3000/payment-success'
    },
    production: {
        API_URL: 'https://campus-guide-backend-n015.onrender.com',
        PAYSTACK_CALLBACK_URL: 'https://campus-guide-gamma.vercel.app/payment-success'
    }
};

const ENV = process.env.NODE_ENV === 'production' ? 'production' : 'development';
export default config[ENV];