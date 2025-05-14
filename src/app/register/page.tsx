import { FC } from 'react';
import { registerAuth } from '../actions/auth';

const RegisterPage: FC = () => {
    return (
        <div>
            <h1>Register</h1>
            <form method="post" action={registerAuth}>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" required />

                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required />

                <label htmlFor="first_name">First Name:</label>
                <input type="text" id="first_name" name="first_name" required />

                <label htmlFor="last_name">Last Name:</label>
                <input type="text" id="last_name" name="last_name" required />

                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegisterPage;