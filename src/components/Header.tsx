import React from 'react';

interface HeaderProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
}
// Comentário técnico: Componente de cabeçalho responsivo com barra de busca
const Header: React.FC<HeaderProps> = ({ searchTerm, onSearchChange }) => {
    return (
        <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50 p-4">
            {/* Container superior: Logo e Filtro */}
            <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-32 bg-gray-200 flex items-center justify-center">
                <span className="text-xs text-gray-500 italic text-center px-1">Logo Retangular</span>
                </div>

                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
                    <span>Filters</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                </button>
            </div>

            {/* Barra de Pesquisa: Fica abaixo devido ao fluxo do flex-col implicitamente */}
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