import { FC } from 'react';

// Components
import HeadingTwo from '@/components/HeadingTwo';

const DashboardPage: FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <HeadingTwo>
                {`Dashboard`}
            </HeadingTwo>
            <p className="text-lg text-gray-700">Welcome to your dashboard!</p>
            <p className="text-sm text-gray-500 mt-2">This is a placeholder for your dashboard content.</p>
        </div>
    );
}


export default DashboardPage;