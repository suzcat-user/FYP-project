import React from 'react';
import { getHobbyIcon } from './utils/hobbyUtils';

interface HobbyBadgeProps {
    hobbyName: string;
}

const HobbyBadge: React.FC<HobbyBadgeProps> = ({ hobbyName }) => {
    const IconComponent = getHobbyIcon(hobbyName);

    return (
        <div className="bg-white p-3 rounded-xl border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
                {IconComponent ? <IconComponent /> : '❓'}
            </div>
            <span className="font-bold">{hobbyName}</span>
        </div>
    );
};

export default HobbyBadge;