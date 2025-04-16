const config = {
    development: {
        API_URL: 'http://localhost:5000',
        CORS_ORIGIN: 'http://localhost:3000'
    },
    production: {
        API_URL: 'https://campus-guide-backend-n015.onrender.com',
        CORS_ORIGIN: 'https://campus-guide-ir29ynidv-bugyman66s-projects.vercel.app'
    }
};

const ENV = process.env.NODE_ENV === 'production' ? 'production' : 'development';

export default config[ENV];