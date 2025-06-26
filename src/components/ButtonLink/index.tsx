import { FC } from 'react';

const ButtonLink: FC<{
    href: string;
    children: React.ReactNode;
    className?: string;
    target?: string;
}> = ({
    href,
    children,
    className = '',
    target = '_self' }) => {
        return (
            <a
                className={`inline-block px-4 py-2 bg-primary-txt text-white rounded hover:bg-primary-hover transition-colors duration-300 ${className ? className : ''}`}
                href={href}
                target={target}
                rel="noopener noreferrer"
            >
                {children}
            </a >
        );

    };

export default ButtonLink;