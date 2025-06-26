import { FC } from "react";

type Crumb = {
    label: string;
    href: string;
};

type Props = {
    items: Crumb[];
};

const Breadcrumb: FC<Props> = ({ items }) => {
    return (
        <nav className="flex items-center gap-2 p-4 bg-white rounded">
            {items.map((item, index) => (
                <span key={index} className="text-sm text-gray-600">
                    <a href={item.href} className="text-blue-500 hover:underline">
                        {item.label}
                    </a>
                    {index < items.length - 1 && <span className="mx-1">/</span>}
                </span>
            ))}
        </nav>
    );
};

export default Breadcrumb;
