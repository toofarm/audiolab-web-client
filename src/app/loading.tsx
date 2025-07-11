import { FC } from 'react';

// Components
import LoadingSpinner from '@/components/LoadingSpinner';

const Loading: FC = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <LoadingSpinner size="lg" />
        </div>
    );
}

export default Loading;