import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            <h1>Welcome to Campus Navigation App</h1>
            <Link to="/register">Register</Link> | <Link to="/login">Login</Link>
        </div>
    );
};

export default Home;
