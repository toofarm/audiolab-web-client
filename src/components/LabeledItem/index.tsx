import { FC } from 'react';

type Props = {
    label: string;
    item: string | number | boolean | React.ReactNode;
};

const LabeledItem: FC<Props> = ({ label, item }) => {
    return (
        <div className="flex items-center gap-2 justify-between p-2">
            <span className="text-sm font-medium text-secondary-txt ">{label}:</span>
            <span className="text-sm text-primary-txt
                font-semibold">
                {item}
            </span>
        </div>
    );
};

export default LabeledItem;