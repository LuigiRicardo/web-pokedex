import React from 'react';
import { TYPE_COLORS } from '../../constants/typeColors';

/**
 * Props for the TypeBadge component.
 *
 * - type: Pokémon type identifier (e.g., "fire", "water")
 * - className: Optional additional Tailwind classes for external styling control
 *
 * The component is intentionally presentation-focused and stateless.
 */
interface TypeBadgeProps {
  type: string;
  className?: string;
}

/**
 * TypeBadge Component
 *
 * Responsibilities:
 * - Visually represent a Pokémon type
 * - Apply consistent color theming based on predefined TYPE_COLORS mapping
 * - Provide accessible labeling for screen readers
 *
 * Architectural Notes:
 * - Pure presentational component (no internal state)
 * - Styling logic is centralized in TYPE_COLORS constant
 * - Gracefully falls back to a neutral color if an unknown type is provided
 * - Accepts external className to allow contextual styling (e.g., selection state)
 */
const TypeBadge: React.FC<TypeBadgeProps> = ({ type, className = '' }) => {
  /**
   * Determines the CSS color class based on the type.
   *
   * If the provided type does not exist in TYPE_COLORS,
   * a neutral gray style is applied as a fallback.
   *
   * This ensures visual stability even if new or unexpected
   * type values are introduced.
   */
  const colorClass = TYPE_COLORS[type] ?? 'bg-gray-300 text-gray-900';

  return (
    /**
     * Badge element styled as an inline label.
     *
     * Design decisions:
     * - inline-flex for proper alignment in flexible layouts
     * - uppercase text for consistent visual identity
     * - custom Pokémon font for thematic coherence
     * - text-outline-black for improved contrast/readability
     *
     * Accessibility:
     * - aria-label provides contextual meaning to assistive technologies
     */
    <span
      className={`
                inline-flex items-center justify-center
                px-2 py-1 rounded
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
