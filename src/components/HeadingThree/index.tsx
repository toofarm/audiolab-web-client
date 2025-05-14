import { FC } from "react";

type Props = {
    children: React.ReactNode;
};

const HeadingThree: FC<Props> = ({
    children,
}) => {
    return (
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {children}
        </h3>
    );
};

export default HeadingThree;