import React from "react";
import { TYPE_COLORS } from "../../constants/typeColors";

interface TypeBadgeProps {
    type: string;
    className?: string;
}

const TypeBadge: React.FC<TypeBadgeProps> = ({ type, className = "" }) => {
    const colorClass =
        TYPE_COLORS[type] ?? "bg-gray-300 text-gray-900";

    return (
        <span   
            className={`
                inline-flex items-center justify-center
                px-4 py-2 rounded
                text-s uppercase
                font-pokemon
                text-outline-black
                ${colorClass}
                ${className}
            `}
            aria-label={`Pokémon type ${type}`}
        >
            {type}
        </span>
    );
};

export default TypeBadge;
