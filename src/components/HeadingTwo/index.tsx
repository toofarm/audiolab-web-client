import { FC } from "react";

type Props = {
    children: React.ReactNode;
};

const HeadingTwo: FC<Props> = ({
    children,
}) => {
    return (
        <h2 className="text-3xl font-bold text-primary-txt">
            {children}
        </h2>
    );
};

export default HeadingTwo;