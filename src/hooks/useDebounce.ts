import { useEffect, useState } from "react";

/**
 * useDebounce Hook
 *
 * Delays updating a value until after a specified delay has passed
 * without the value changing.
 *
 * This is commonly used to:
 * - Prevent excessive API calls while typing
 * - Reduce unnecessary re-renders
 * - Improve performance in search inputs
 *
 * @template T - The type of the value being debounced
 * @param value - The value to debounce
 * @param delay - The delay time in milliseconds
 * @returns The debounced value
 */
export const useDebounce = <T>(value: T, delay: number): T => {
    // Stores the debounced value separately from the original value
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        /**
         * Creates a timer that updates the debounced value
         * only after the specified delay.
         *
         * If the `value` changes before the delay finishes,
         * the previous timer will be cleared and restarted.
         */
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        /**
         * Cleanup function:
         * Clears the previous timeout whenever:
         * - The value changes
         * - The delay changes
         * - The component unmounts
         *
         * This prevents memory leaks and ensures
         * only the latest value update is applied.
         */
        return () => clearTimeout(timer);
    }, [value, delay]);

    // Returns the stabilized (debounced) value
    return debouncedValue;
};
