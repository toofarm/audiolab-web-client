import { FC } from 'react';
import Link from 'next/link';

const BlueLink: FC<{
    href: string;
    className?: string;
    children?: React.ReactNode;
}> = ({ href, className, children }) => {
    return (
        <Link
            href={href}
            className={`text-cta hover:text-cta-hover ${className ? className : ''}`}
        >
            {children}
        </Link>
    );
};

export default BlueLink;