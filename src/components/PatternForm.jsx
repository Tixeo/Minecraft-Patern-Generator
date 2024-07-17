import React, { useState } from 'react';

const blocksList = [
    'stone', 'cobblestone', 'andesite', 'blackstone_top', 'dirt',
    'granite', 'diorite', 'sand', 'gravel', 'oak_planks', 'spruce_planks', 'birch_planks', 'jungle_planks',
    'acacia_planks', 'dark_oak_planks', 'crimson_planks', 'warped_planks', 'netherrack', 'end_stone',
    'clay', 'bricks', 'mossy_cobblestone', 'obsidian', 'mossy_stone_bricks', 'stone_bricks', 'cracked_stone_bricks',
    'chiseled_stone_bricks', 'end_stone_bricks', 'smooth_stone', 'polished_andesite', 'polished_diorite'
];

const PatternForm = () => {
    const [width, setWidth] = useState(10);
    const [height, setHeight] = useState(10);
    const [selectedBlocks, setSelectedBlocks] = useState([]);
    const [pattern, setPattern] = useState([]);
    const [useProcedural, setUseProcedural] = useState(false);
    const [neighborInfluence, setNeighborInfluence] = useState(0.5);
    const [density, setDensity] = useState(1);
    const [smoothness, setSmoothness] = useState(0.5);
    const [randomness, setRandomness] = useState(0.5);

    const handleBlockChange = (block) => {
        setSelectedBlocks(prev => 
            prev.includes(block) ? prev.filter(b => b !== block) : [...prev, block]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newPattern = useProcedural ? generateProceduralPattern(width, height, selectedBlocks, neighborInfluence, density, smoothness, randomness) : generateRandomPattern(width, height, selectedBlocks);
        setPattern(newPattern);
    };

    const generateRandomPattern = (width, height, blocks) => {
        return Array.from({ length: height }, () => 
            Array.from({ length: width }, () => blocks[Math.floor(Math.random() * blocks.length)])
        );
    };

    const generateProceduralPattern = (width, height, blocks, neighborInfluence, density, smoothness, randomness) => {
        const pattern = Array.from({ length: height }, () => Array(width).fill(null));

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                pattern[i][j] = Math.random() < density ? blocks[Math.floor(Math.random() * blocks.length)] : null;
            }
        }

        for (let s = 0; s < smoothness * 10; s++) {
            for (let i = 1; i < height - 1; i++) {
                for (let j = 1; j < width - 1; j++) {
                    if (pattern[i][j] === null || Math.random() < randomness) {
                        const neighbors = [
                            pattern[i-1][j], pattern[i+1][j],
                            pattern[i][j-1], pattern[i][j+1]
                        ].filter(Boolean);
                        const blockCount = {};

                        neighbors.forEach(block => {
                            blockCount[block] = (blockCount[block] || 0) + 1;
                        });

                        const mostCommonBlock = Object.keys(blockCount).reduce((a, b) => 
                            blockCount[a] > blockCount[b] ? a : b
                        );

                        if (Math.random() < neighborInfluence) {
                            pattern[i][j] = mostCommonBlock;
                        } else if (pattern[i][j] === null) {
                            pattern[i][j] = blocks[Math.floor(Math.random() * blocks.length)];
                        }
                    }
                }
            }
        }

        return pattern;
    };

    return (
        <div className="grid grid-cols-2 gap-4 p-4">
            <div className="space-y-4 p-4 bg-gray-100 rounded-lg shadow-md">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Width :</label>
                        <input
                            type="number"
                            value={width}
                            onChange={(e) => setWidth(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            min="1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Height :</label>
                        <input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            min="1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Blocs :</label>
                        <div className="grid grid-cols-2 gap-2 mt-1 p-2 border border-gray-300 rounded-md max-h-60 overflow-y-auto">
                            {blocksList.map(block => (
                                <div key={block}>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            value={block}
                                            onChange={() => handleBlockChange(block)}
                                            className="form-checkbox"
                                        />
                                        <span className="ml-2 text-gray-700">{block}</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={useProcedural}
                            onChange={() => setUseProcedural(!useProcedural)}
                            className="form-checkbox"
                        />
                        <label className="ml-2 text-gray-700">génération procédurale</label>
                    </div>
                    {useProcedural && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Influence :</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={neighborInfluence}
                                    onChange={(e) => setNeighborInfluence(e.target.value)}
                                    className=" w-full border border-gray-300 rounded-md"
                                />
                                <span>{neighborInfluence}</span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Density :</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={density}
                                    onChange={(e) => setDensity(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md"
                                />
                                <span>{density}</span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Smoothness :</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={smoothness}
                                    onChange={(e) => setSmoothness(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md"
                                />
                                <span>{smoothness}</span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Random :</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={randomness}
                                    onChange={(e) => setRandomness(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md"
                                />
                                <span>{randomness}</span>
                            </div>
                        </>
                    )}
                    <button
                        type="submit"
                        className="w-full py-2 px-4 text-white font-semibold rounded-md"
                    >
                        Generate
                    </button>
                </form>
            </div>
            <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-700">Generate Pattern :</h2>
                {pattern.length > 0 && (
                    <div className="mt-2 grid" style={{ gridTemplateColumns: `repeat(${width}, 40px)` }}>
                        {pattern.flat().map((block, index) => (
                            <div key={index} className="w-10 h-10" style={{
                                backgroundImage: `url(/blocks/${block}.png)`,
                                backgroundSize: 'cover'
                            }}></div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatternForm;