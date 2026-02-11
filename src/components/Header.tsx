import React from 'react';
import pokedexLogo from '../assets/pokedex-logo.png';

interface HeaderProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onOpenFilters: () => void;
    filtersOpen: boolean;
}
const Header: React.FC<HeaderProps> = ({
    searchTerm,
    onSearchChange,
    onOpenFilters,
    filtersOpen,
}) => {
    return (
        <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50 p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center">
                    <img fetchPriority='high' className="h-15 w-auto" src={pokedexLogo} alt="Pokedex Logo" />
                </div>

                <button
                    onClick={onOpenFilters}
                    aria-haspopup="dialog"
                    aria-expanded={filtersOpen}
                    aria-controls="filter-menu"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label="Open filters"
                >  
                    <span>Filters</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                </button>
            </div>
            <div className="relative">
                <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search Pokémon..." 
                    className="w-full p-2 pl-10 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
        </header>
    );
};

export default Header;