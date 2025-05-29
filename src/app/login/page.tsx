import { FC } from 'react';
import { loginAuth } from '../actions/auth';

// Components
import HeadingTwo from '@/components/HeadingTwo';
import InputText from '@/components/InputText';
import Button from '@/components/Button';

const LoginPage: FC = () => {
    return (
        <div>
            <form
                action={loginAuth}
                className='flex flex-col gap-4 p-4 my-8 rounded bg-white shadow-md
                max-w-md mx-auto'>
                <HeadingTwo>Login</HeadingTwo>
                <InputText
                    name="username"
                    label="Email"
                    type="text"
                    required
                    placeholder="Enter your email"
                />

                <InputText
                    name="password"
                    label="Password"
                    type="password"
                    required
                    placeholder="Enter your password"
                />

                <Button
                    type="submit"
                >
                    Login
                </Button>
            </form>
        </div>
    );
};

export default LoginPage;