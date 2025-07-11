'use client';

import { FC } from 'react';
import { loginAuth } from '../actions/auth';

// Components
import HeadingTwo from '@/components/HeadingTwo';
import InputText from '@/components/InputText';
import Button from '@/components/Button';
import FormWithLoading from '@/components/FormWithLoading';
import { useSearchParams } from 'next/navigation';

const LoginPage: FC = () => {
    const searchParams = useSearchParams();

    return (
        <div>
            <FormWithLoading
                action={loginAuth}
                className='flex flex-col gap-4 p-4 my-8 rounded bg-white shadow-md max-w-md mx-auto'
                loadingMessage='Signing you in...'
            >
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

                <input type="hidden" name="next" value={searchParams.get('next') || '/dashboard'} />

                <Button type="submit">
                    Login
                </Button>
            </FormWithLoading>
        </div>
    );
};

export default LoginPage;