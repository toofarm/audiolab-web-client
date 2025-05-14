import { FC } from 'react';
import { loginAuth } from '../actions/auth';

const LoginPage: FC = () => {
    return (
        <div>
            <h1>Login</h1>
            <form action={loginAuth}>
                <label htmlFor="username">Email:</label>
                <input type="text" id="username" name="username" required />

                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required />

                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;