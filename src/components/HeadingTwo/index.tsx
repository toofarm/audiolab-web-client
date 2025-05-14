import { FC } from "react";

type Props = {
    children: React.ReactNode;
};

const HeadingTwo: FC<Props> = ({
    children,
}) => {
    return (
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {children}
        </h2>
    );
};

export default HeadingTwo;