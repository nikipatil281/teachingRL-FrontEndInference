import React, { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import { bigSmile } from '@dicebear/collection'; const PxWrapper = ({ left, right, bottom, top, scale = 1, zIndex = 10, className = '', children, delay = 0 }) => (
    <div
        className={`absolute flex items-end justify-center ${className}`}
        style={{
            left, right, bottom, top, zIndex,
            transform: `scale(${scale})`,
            transformOrigin: bottom !== undefined ? 'bottom center' : 'top center',
            animationDelay: `${delay}s`,
            animationDuration: '4s'
        }}
    >
        {children}
    </div>
);

// --- Background Layers ---
const Sky = ({ weather }) => {
    let colors = ['bg-[#3fa8ef]', 'bg-[#5bbff4]', 'bg-[#7dd1f8]', 'bg-[#a7e2fa]', 'bg-[#cbf2ff]'];
    if (weather === 'Cloudy') {
        colors = ['bg-[#758a99]', 'bg-[#89a0b0]', 'bg-[#9fb7c9]', 'bg-[#b6cee0]', 'bg-[#d0e6f5]'];
    } else if (weather === 'Rainy') {
        colors = ['bg-[#3a4752]', 'bg-[#4a5866]', 'bg-[#5b6b7a]', 'bg-[#6d8091]', 'bg-[#8095a8]'];
    }

    return (
        <div className="absolute inset-0 w-full h-full flex flex-col z-0 select-none transition-colors duration-1000">
            {colors.map((c, i) => (
                <div key={i} className={`flex-[${i === 4 ? '8' : '3'}] ${c} transition-colors duration-1000`}></div>
            ))}
        </div>
    );
};

const DistantCity = () => (
    <div className="absolute bottom-[30%] w-full h-[70%] flex items-end z-[2] opacity-[0.8] select-none text-[#758db0]">
        {/* Layer 1 (Back) */}
        <div className="absolute w-[8%] h-[80%] left-[2%] bg-[#758db0] flex flex-col gap-1 p-1">
            {[...Array(6)].map((_, i) => <div key={i} className="flex justify-around"><div className="w-1 h-2 bg-[#8da5c7]"></div><div className="w-1 h-2 bg-[#8da5c7]"></div></div>)}
        </div>
        <div className="absolute w-[12%] h-[100%] left-[15%] bg-[#758db0] flex flex-col items-center">
            <div className="w-[40%] h-[15%] bg-[#758db0] mb-[-1px]"></div>
        </div>
        <div className="absolute w-[7%] h-[60%] left-[30%] bg-[#758db0]"></div>
        <div className="absolute w-[10%] h-[120%] left-[45%] bg-[#758db0] flex justify-around px-1 py-2">
            <div className="w-1.5 h-full border-r border-[#8da5c7]/30"></div>
            <div className="w-1.5 h-full border-r border-[#8da5c7]/30"></div>
        </div>
        <div className="absolute w-[15%] h-[90%] left-[65%] bg-[#758db0] flex items-start justify-center pt-2 gap-2">
            <div className="w-1.5 h-3 bg-[#8da5c7]"></div><div className="w-1.5 h-3 bg-[#8da5c7]"></div>
        </div>
        <div className="absolute w-[8%] h-[85%] left-[85%] bg-[#758db0]"></div>

        {/* Layer 2 (Front) */}
        <div className="absolute w-[10%] h-[60%] left-[5%] bg-[#5c7599] flex flex-col gap-2 p-1.5">
            {[...Array(4)].map((_, i) => <div key={i} className="flex justify-between"><div className="w-1.5 h-2 bg-[#758db0]"></div><div className="w-1.5 h-2 bg-[#758db0]"></div><div className="w-1.5 h-2 bg-[#758db0]"></div></div>)}
        </div>
        <div className="absolute w-[14%] h-[80%] left-[20%] bg-[#e38571] flex flex-col shadow-[inset_-6px_0_0_#c46c5a]">
            {/* Orangeish building */}
            <div className="absolute -top-4 left-[20%] w-[60%] h-4 bg-[#e38571] shadow-[inset_-3px_0_0_#c46c5a]"></div>
            <div className="absolute -top-10 left-[40%] w-[20%] h-6 bg-[#e38571] shadow-[inset_-3px_0_0_#c46c5a]"></div>
            <div className="w-full flex-1 flex gap-2 justify-center pt-4">
                <div className="w-2 h-full border-l border-[#c46c5a]/50"></div>
                <div className="w-2 h-full border-l border-[#c46c5a]/50"></div>
            </div>
        </div>
        <div className="absolute w-[16%] h-[70%] left-[38%] bg-[#c75e63] shadow-[inset_-6px_0_0_#a64b50] flex flex-col items-center">
            {/* Reddish building */}
            <div className="w-full h-3 border-b-2 border-[#a64b50] mt-4"></div>
            <div className="w-full h-3 border-b-2 border-[#a64b50] mt-4"></div>
            <div className="w-full h-3 border-b-2 border-[#a64b50] mt-4"></div>
        </div>
        <div className="absolute w-[11%] h-[85%] left-[58%] bg-[#9e6375] shadow-[inset_-4px_0_0_#804f5e]">
            {/* Purpleish building */}
            <div className="absolute -top-8 left-[30%] w-[40%] h-8 bg-[#9aa0b0] shadow-[inset_-3px_0_0_#7d8391] flex justify-center items-start">
                <div className="w-1 h-6 bg-[#7d8391] -mt-6"></div>
            </div>
            <div className="w-full h-full flex flex-col gap-3 p-2 pt-4">
                {[...Array(4)].map((_, i) => <div key={i} className="w-full flex justify-between"><div className="w-2 h-3 bg-[#7d8391]"></div><div className="w-2 h-3 bg-[#7d8391]"></div></div>)}
            </div>
        </div>
        <div className="absolute w-[20%] h-[65%] left-[75%] bg-[#d9a98c] shadow-[inset_-8px_0_0_#ba8c72]">
            {/* Tan building with awning structures */}
            <div className="absolute top-2 w-full h-4 bg-[#ba8c72]/50"></div>
            <div className="absolute top-10 w-full h-4 bg-[#ba8c72]/50"></div>
            <div className="absolute top-18 w-full h-4 bg-[#ba8c72]/50"></div>
        </div>
    </div>
);

const DistantCliffs = () => (
    <div className="absolute bottom-[28%] w-full h-[55%] flex items-end z-[3] opacity-[0.9] pointer-events-none text-white">
        {/* Cliff Left */}
        <div className="absolute left-[-5%] bottom-0 w-[40%] h-[60%] flex flex-col items-center">
            <div className="h-[20%] w-full bg-[#52a14e] border-t-[4px] border-[#68c962] relative">
                <OakTree left="20%" bottom="10%" scale={0.7} />
                <PineTree right="15%" bottom="10%" scale={0.8} />
            </div>
            <div className="flex-1 w-full bg-[#ab6a4e] shadow-[inset_-12px_12px_0_#8c543c] flex">
                <div className="w-[30%] h-full bg-[#8c543c] border-r-4 border-[#73432e]"></div>
            </div>
        </div>
        {/* Cliff Right */}
        <div className="absolute right-[-10%] bottom-0 w-[45%] h-[80%] flex flex-col items-end">
            <div className="h-[15%] w-[80%] bg-[#52a14e] border-t-[4px] border-[#68c962] relative">
                <PineTree right="40%" bottom="10%" scale={0.9} />
                <OakTree right="15%" bottom="10%" scale={0.7} />
            </div>
            <div className="flex-1 w-[80%] bg-[#ab6a4e] shadow-[inset_12px_12px_0_#8c543c] flex justify-end">
                <div className="w-[40%] h-full bg-[#8c543c] border-l-4 border-[#73432e]"></div>
            </div>
        </div>
        {/* Mid Cliff */}
        <div className="absolute right-[20%] bottom-0 w-[20%] h-[40%] flex flex-col items-center">
            <div className="h-[25%] w-full bg-[#52a14e] border-t-[4px] border-[#68c962] relative">
                <OakTree left="40%" bottom="10%" scale={0.65} />
            </div>
            <div className="flex-1 w-full bg-[#ab6a4e] border-x-[8px] border-t-[8px] border-[#8c543c]"></div>
        </div>
    </div>
);

const Ground = () => (
    <div className="absolute bottom-[22%] w-full h-[15%] flex flex-col z-[5]">
        {/* Grass outline / surface */}
        <div className="h-[50%] w-full bg-[#52a14e] border-t-[4px] border-[#68c962] relative">
            <div className="absolute top-2 left-[10%] w-[5%] h-1.5 bg-[#42853e]"></div>
            <div className="absolute top-1 left-[30%] w-[12%] h-1 bg-[#42853e]"></div>
            <div className="absolute top-3 left-[50%] w-[8%] h-1.5 bg-[#42853e]"></div>
            <div className="absolute top-1 right-[20%] w-[10%] h-1.5 bg-[#42853e]"></div>
            <div className="absolute top-3 right-[5%] w-[5%] h-1 bg-[#42853e]"></div>
        </div>
        {/* Dirt edge */}
        <div className="h-[50%] w-full bg-[#614032] border-t-[4px] border-[#4a2e23] relative overflow-hidden">
            <div className="absolute top-1 left-[15%] w-4 h-2 bg-[#4a2e23]"></div>
            <div className="absolute top-2 left-[45%] w-6 h-3 bg-[#4a2e23]"></div>
            <div className="absolute top-1 right-[25%] w-5 h-2 bg-[#4a2e23]"></div>
        </div>
    </div>
);

const Sidewalk = ({ weather }) => (
    <div className="absolute bottom-[10%] w-full h-[12%] bg-[#9ba4b5] border-t-[6px] border-[#b0bec5] z-[25] shadow-[0_6px_0_#5c667a] flex overflow-hidden">
        {/* Concrete slab joints */}
        {[...Array(20)].map((_, i) => (
            <div key={i} className="flex-1 h-full border-r-[3px] border-[#818c9e] opacity-40"></div>
        ))}

        {/* Weather Puddles */}
        {weather === 'Rainy' && (
            <div className="absolute inset-0 pointer-events-none opacity-60 mix-blend-multiply">
                <div className="absolute bottom-2 left-[15%] w-16 h-4 bg-[#758a9ada] rounded-[100%]"></div>
                <div className="absolute top-1 left-[40%] w-24 h-5 bg-[#758a9ada] rounded-[100%]"></div>
                <div className="absolute bottom-1 right-[20%] w-20 h-4 bg-[#758a9ada] rounded-[100%]"></div>
                <div className="absolute top-2 right-[5%] w-12 h-3 bg-[#758a9ada] rounded-[100%]"></div>
            </div>
        )}
        {/* Puddle reflections */}
        {weather === 'Rainy' && (
            <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay">
                <div className="absolute bottom-3 left-[16%] w-10 h-1.5 bg-white rounded-[100%]"></div>
                <div className="absolute top-2 left-[42%] w-16 h-2 bg-white rounded-[100%]"></div>
            </div>
        )}
    </div>
);

const Street = ({ className = "" }) => (
    <div className={`absolute bottom-0 w-full h-[10%] bg-[#2b2e35] border-t-[4px] border-[#3f454d] z-[30] shadow-[inset_0_4px_0_rgba(0,0,0,0.2)] flex flex-col justify-center select-none overflow-hidden ${className}`}>
        {/* Dashed center line */}
        <div className="w-full flex justify-around opacity-90 mx-auto">
            {[...Array(12)].map((_, i) => <div key={i} className="w-[5%] h-1.5 bg-[#f0e1a8] shadow-[0_2px_0_#968b64]"></div>)}
        </div>
    </div>
);

// --- Natural Elements ---
const Cloud = (props) => (
    <PxWrapper {...props} className="animate-pulse opacity-90">
        <div className="relative w-40 h-10 bg-white/90 shadow-[inset_0_-4px_0_#dbeafe] rounded-sm blur-[0.5px]">
            <div className="absolute bottom-3 left-6 w-24 h-12 bg-white/90 rounded-sm"></div>
            <div className="absolute bottom-6 left-12 w-16 h-8 bg-white/90 rounded-sm"></div>
            <div className="absolute top-2 -left-4 w-8 h-6 bg-white/90 rounded-sm shadow-[inset_0_-3px_0_#dbeafe]"></div>
            <div className="absolute top-1 -right-6 w-10 h-8 bg-white/90 rounded-sm shadow-[inset_0_-3px_0_#dbeafe]"></div>
        </div>
    </PxWrapper>
);

const Bird = (props) => (
    <PxWrapper {...props} className="animate-bounce">
        <div className="w-5 h-1.5 flex justify-between opacity-80">
            <div className="w-2h-1.5 bg-[#2c3e50] shadow-[1px_1px_0_rgba(0,0,0,0.3)] skew-y-12"></div>
            <div className="w-2 h-1.5 bg-[#2c3e50] shadow-[1px_1px_0_rgba(0,0,0,0.3)] -skew-y-12"></div>
        </div>
        <div className="w-2.5 h-1.5 bg-[#2c3e50] mx-auto -mt-1 shadow-[1px_1px_0_rgba(0,0,0,0.3)]"></div>
    </PxWrapper>
);

const PineTree = (props) => (
    <PxWrapper {...props}>
        <div className="relative flex flex-col items-center z-10">
            <div className="w-5 h-5 bg-[#4ade80] shadow-[inset_-3px_0_0_#22c55e]"></div>
            <div className="w-12 h-8 bg-[#22c55e] shadow-[inset_-5px_0_0_#16a34a] -mt-2 border-b-2 border-[#16a34a]"></div>
            <div className="w-20 h-10 bg-[#16a34a] shadow-[inset_-6px_0_0_#15803d] -mt-2 border-b-2 border-[#15803d]"></div>
            <div className="w-28 h-12 bg-[#15803d] shadow-[inset_-8px_0_0_#14532d] -mt-2 border-b-4 border-[#14532d]"></div>
            <div className="w-6 h-12 bg-[#78350f] shadow-[inset_-3px_0_0_#451a03] -mt-1 relative z-[-1]"></div>
        </div>
    </PxWrapper>
);

const OakTree = (props) => (
    <PxWrapper {...props}>
        <div className="relative flex flex-col items-center drop-shadow-md z-10">
            <div className="relative w-36 h-28 z-20 flex justify-center items-end -mb-2">
                <div className="absolute bottom-2 w-32 h-16 bg-[#3ea64d] shadow-[inset_0_-6px_0_#297d36]"></div>
                <div className="absolute bottom-12 w-28 h-12 bg-[#4ccf5f] shadow-[inset_0_-6px_0_#3ea64d]"></div>
                <div className="absolute bottom-20 w-16 h-8 bg-[#6cfc83] shadow-[inset_0_-5px_0_#4ccf5f]"></div>
                <div className="absolute bottom-4 -left-3 w-12 h-12 bg-[#297d36] shadow-[inset_0_-5px_0_#195e24]"></div>
                <div className="absolute bottom-6 -right-3 w-14 h-14 bg-[#3ea64d] shadow-[inset_0_-5px_0_#297d36]"></div>
            </div>
            <div className="w-6 h-16 bg-[#6e462f] shadow-[inset_-3px_0_0_#452818] relative z-10"></div>
        </div>
    </PxWrapper>
);

// --- Weather Overlay Elements ---
const Rain = () => {
    // Generate deterministic rain lines
    const rainLines = Array.from({ length: 150 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 120 - 10}%`,
        animationDelay: `-${Math.random() * 2}s`,
        animationDuration: `${0.4 + Math.random() * 0.3}s`,
        opacity: 0.2 + Math.random() * 0.4
    }));

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[45]">
            <style>
                {`
                @keyframes fall {
                    0% { transform: translate(0, -10vh) skewX(-15deg); }
                    100% { transform: translate(-20vw, 110vh) skewX(-15deg); }
                }
                `}
            </style>
            {rainLines.map((line) => (
                <div
                    key={line.id}
                    className="absolute top-0 w-[1.5px] h-20 bg-[#aed5f5]"
                    style={{
                        left: line.left,
                        opacity: line.opacity,
                        animation: `fall ${line.animationDuration} linear infinite`,
                        animationDelay: line.animationDelay
                    }}
                ></div>
            ))}
        </div>
    );
};

// --- Main Buildings ---

const PlayerCafe = ({ shopName = "Your Shop", ...props }) => (
    <PxWrapper {...props} zIndex={40}>
        <div className="relative w-72 h-72 flex flex-col items-center group drop-shadow-xl overflow-visible">

            {/* Top Pitched Roof */}
            <div className="absolute top-0 w-[96%] h-20 bg-[#2d325a] z-30 border-b-[6px] border-[#181a36] shadow-[0_6px_0_rgba(0,0,0,0.2)] flex justify-center overflow-hidden"
                style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }}>
                {/* Roof Tiles Texture */}
                <div className="absolute inset-0 flex space-x-2 opacity-30 transform -skew-x-12">
                    {[...Array(15)].map((_, i) => <div key={i} className="w-2.5 h-full bg-[#181a36]"></div>)}
                </div>
            </div>
            {/* Peaked roof trim overlap */}
            <div className="absolute top-0 w-[100%] h-20 z-30 pointer-events-none drop-shadow-sm"
                style={{ clipPath: 'polygon(48% 0%, 52% 0%, 100% 100%, 96% 100%, 50% 5%, 4% 100%, 0% 100%)' }}>
                <div className="w-full h-full bg-[#414878]"></div>
            </div>

            {/* Main Building Body */}
            <div className="absolute top-[76px] w-[88%] h-[calc(100%-76px)] bg-[#6b5853] border-[6px] border-b-0 border-[#332522] shadow-[inset_-10px_0_0_rgba(0,0,0,0.3)] flex flex-col items-center">

                {/* Brick Texture */}
                <div className="absolute inset-0 opacity-20 flex flex-wrap gap-[2px] p-2 pointer-events-none">
                    {[...Array(80)].map((_, i) => (
                        <div key={i} className={`h-2 ${i % 3 === 0 ? 'w-6' : 'w-10'} bg-[#1a1311] rounded-[1px]`}></div>
                    ))}
                </div>

                {/* Second Story Window (Opaque paper texture) */}
                <div className="mt-4 w-[85%] h-14 bg-[#ffebb3] border-[6px] border-[#332522] relative flex flex-col shadow-[inset_0_0_20px_rgba(255,166,77,0.7)] overflow-hidden z-10">
                    {/* Horizontal Mullion */}
                    <div className="absolute top-1/2 w-full h-[4px] bg-[#332522] -translate-y-1/2"></div>
                    {/* Vertical Mullions */}
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="absolute top-0 bottom-0 w-[4px] bg-[#332522]" style={{ left: `${(i + 1) * 16.6}%` }}></div>
                    ))}
                    {/* Rice paper texture layer */}
                    <div className="absolute inset-0 opacity-10 flex flex-col justify-around pointer-events-none">
                        {[...Array(10)].map((_, i) => <div key={i} className="w-full h-px bg-[#d4a855]"></div>)}
                    </div>
                </div>

                {/* Sub-roof between stories (Tiled) */}
                <div className="absolute top-[80px] -left-[10%] w-[120%] h-10 bg-[#2d325a] border-[6px] border-[#181a36] shadow-[0_8px_0_rgba(0,0,0,0.4)] z-20 overflow-hidden flex flex-col">
                    {/* Snow / Highlight on roof */}
                    <div className="w-full h-2.5 bg-[#757ca3]"></div>
                    {/* Vertical Tile lines */}
                    <div className="flex-1 w-full flex gap-1.5 opacity-40 relative top-[2px]">
                        {[...Array(24)].map((_, i) => <div key={i} className="w-1.5 h-full bg-[#181a36] shadow-[1px_0_0_#414878]"></div>)}
                    </div>
                </div>

                {/* Main Signboard (Centered tightly) */}
                <div className="absolute top-[68px] bg-[#e3d5c8] border-[6px] border-[#332522] px-6 py-1.5 z-30 shadow-[0_6px_0_rgba(0,0,0,0.4)] flex items-center gap-2">
                    <span className="text-[14px] text-[#332522] font-black uppercase tracking-[0.15em] whitespace-nowrap overflow-hidden text-ellipsis max-w-[140px] drop-shadow-sm">{shopName}</span>
                </div>

                {/* First Story Layout */}
                <div className="absolute bottom-0 w-full h-32 flex flex-col justify-end p-1.5 pt-0 z-10">

                    {/* Warm Ambient Glow behind elements */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#ffb457]/10 to-transparent pointer-events-none"></div>

                    {/* Noren (Japanese Curtains) */}
                    <div className="absolute top-[2px] left-3 right-3 h-12 flex gap-[3px] z-30">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="flex-1 bg-[#bf5a66] border-[3px] border-[#662730] rounded-b-md shadow-md relative flex flex-col items-center justify-end pb-1.5">
                                <div className="w-3.5 h-3.5 border border-[#ffb480]/50 rounded-full opacity-60"></div>
                                <div className="absolute bottom-0 w-full h-2 bg-[#d97c88]"></div>
                            </div>
                        ))}
                    </div>

                    {/* Left Window Front (Solid Wood Counter/Wall now) */}
                    <div className="absolute bottom-0 left-2 w-[52%] h-[80%] bg-[#d9a06c] border-[6px] border-b-0 border-[#332522] flex flex-col justify-end p-1.5 overflow-hidden">
                        {/* Solid Wood paneling details */}
                        <div className="absolute inset-0 flex justify-between p-1 opacity-40">
                            <div className="w-2 h-full border-x border-[#8c5943]"></div>
                            <div className="w-2 h-full border-x border-[#8c5943]"></div>
                            <div className="w-2 h-full border-x border-[#8c5943]"></div>
                        </div>
                        {/* Pickup Counter Opening (Opaque inside) */}
                        <div className="w-full h-14 bg-[#4a2b1f] border-[4px] border-[#8c5943] flex flex-col relative z-10 shadow-inner overflow-hidden mb-6">
                            {/* Dark interior shadow */}
                            <div className="absolute top-0 w-full h-4 bg-black/40"></div>
                            <div className="absolute bottom-0 w-full h-2 bg-[#8c5943]"></div>
                        </div>
                    </div>

                    {/* Right Sliding Door (Solid wood and opaque paper) */}
                    <div className="absolute bottom-0 right-2 w-[42%] h-[85%] bg-[#ffeebf] border-[6px] border-b-0 border-[#332522] shadow-[inset_4px_0_0_rgba(0,0,0,0.1),inset_0_0_20px_rgba(255,166,77,0.5)] flex p-1.5">
                        {/* Door Grid with opaque paper backing */}
                        <div className="w-full h-full border-[3px] border-[#5e4b47] flex flex-col gap-1.5 z-10 bg-[#fce5a4]">
                            <div className="flex-1 flex gap-1.5"><div className="flex-1 bg-[#fff6d9]"></div><div className="flex-1 bg-[#fff6d9]"></div></div>
                            <div className="flex-1 flex gap-1.5"><div className="flex-1 bg-[#fff6d9]"></div><div className="flex-1 bg-[#fff6d9]"></div></div>
                            <div className="flex-[0.6] bg-[#5e4b47] mt-auto border-t-2 border-[#332522]"></div> {/* Kickplate */}
                        </div>
                        <div className="absolute top-[45%] right-3 w-2 h-8 bg-[#332522] rounded-sm z-20"></div> {/* Handle */}
                    </div>
                </div>
            </div>

            {/* Glowing Vending Machine Outside */}
            <div className="absolute bottom-0 -left-[14%] w-16 h-[100px] bg-[#e6f0f5] border-[4px] border-[#829bb0] shadow-[0_0_20px_rgba(200,230,255,0.7)] flex flex-col items-center p-1.5 z-40 rounded-t-md">
                <div className="w-full h-5 bg-[#829bb0] mb-1.5 flex justify-center items-center shadow-inner">
                    <div className="w-8 h-2 bg-[#e6f0f5] opacity-50 rounded-sm"></div>
                </div>
                {/* Drink rows */}
                <div className="w-[90%] h-5 bg-[#465b6e] mb-1 flex justify-around items-end p-0.5 shadow-inner">
                    {[...Array(4)].map((_, i) => <div key={i} className={`w-1.5 h-3.5 ${i % 2 === 0 ? 'bg-[#ff5757]' : 'bg-[#57bdff]'} rounded-[1px]`}></div>)}
                </div>
                <div className="w-[90%] h-5 bg-[#465b6e] mb-[10px] flex justify-around items-end p-0.5 shadow-inner">
                    {[...Array(4)].map((_, i) => <div key={i} className={`w-1.5 h-3.5 ${i % 2 !== 0 ? 'bg-[#61ff61]' : 'bg-[#ffdb57]'} rounded-[1px]`}></div>)}
                </div>
                {/* Dispenser & Coin slot */}
                <div className="w-8 h-10 bg-black/15 rounded-sm mt-auto shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] relative">
                    <div className="absolute bottom-1 right-1 w-2.5 h-4 bg-white/90 rounded-[1px] shadow-sm"></div> {/* Glow / item */}
                </div>
            </div>

            {/* Stools out front (moved left in front of the window/counter) */}
            <div className="absolute bottom-1 left-[14%] w-8 h-10 z-[45] flex flex-col items-center">
                <div className="w-full h-3 bg-[#d9a06c] border-[3px] border-[#664b33] rounded-full shadow-lg z-10"></div>
                <div className="w-4 h-7 bg-[#664b33] -mt-1 shadow-md flex justify-between px-0.5">
                    <div className="w-1 h-full bg-[#4a3624]"></div><div className="w-1 h-full bg-[#4a3624]"></div>
                </div>
            </div>
            <div className="absolute bottom-1 left-[32%] w-8 h-10 z-[45] flex flex-col items-center">
                <div className="w-full h-3 bg-[#d9a06c] border-[3px] border-[#664b33] rounded-full shadow-lg z-10"></div>
                <div className="w-4 h-7 bg-[#664b33] -mt-1 shadow-md flex justify-between px-0.5">
                    <div className="w-1 h-full bg-[#4a3624]"></div><div className="w-1 h-full bg-[#4a3624]"></div>
                </div>
            </div>

            {/* Solid Foundation Line */}
            <div className="absolute -bottom-1 w-[96%] h-2.5 bg-[#1a1311] z-10"></div>
        </div>
    </PxWrapper>
);

const CompetitorCafe = (props) => (
    <PxWrapper {...props} zIndex={35}>
        <div className="relative w-80 h-64 bg-[#637482] border-[6px] border-[#374552] shadow-[inset_-16px_12px_0_rgba(72,85,97,0.8),12px_12px_0_rgba(0,0,0,0.2)] flex flex-col items-center">

            {/* Concrete Panels */}
            <div className="absolute inset-0 flex flex-col justify-evenly pointer-events-none opacity-20">
                {[...Array(5)].map((_, i) => <div key={i} className="w-full h-1 bg-black shadow-[0_1px_0_rgba(255,255,255,0.2)]"></div>)}
            </div>

            {/* Massive Roof Structure */}
            <div className="absolute -top-6 w-[105%] h-6 bg-[#4e5b66] border-[6px] border-[#374552] shadow-[0_6px_0_rgba(0,0,0,0.3)]"></div>

            {/* Neon Sign */}
            <div className="absolute top-5 w-[85%] h-14 bg-[#141b24] border-[4px] border-[#0a0e14] flex items-center justify-center shadow-[inset_0_0_15px_rgba(224,61,61,0.2),0_4px_0_rgba(0,0,0,0.2)] z-10">
                <span className="text-[20px] text-[#e03d3d] font-black uppercase tracking-[0.25em] drop-shadow-[0_0_8px_rgba(224,61,61,0.9)] ml-2">BeanMean</span>
            </div>

            {/* Dark Corporate Windows */}
            <div className="absolute top-28 left-6 right-6 h-28 bg-[#1f2937] border-[6px] border-[#0a0e14] flex shadow-[0_6px_0_rgba(0,0,0,0.1)] z-10">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex-1 border-r-[4px] border-[#0a0e14] last:border-0 bg-[#2d3a4d] shadow-[inset_-6px_-6px_0_#232d3d] relative overflow-hidden">
                        <div className="absolute top-0 right-2 w-8 h-[200%] bg-blue-100/10 skew-x-12 translate-y-[-20px] mix-blend-overlay"></div>
                    </div>
                ))}
            </div>

            {/* Double Doors */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-36 h-28 bg-[#9aa6b3] border-t-[6px] border-x-[6px] border-[#0a0e14] flex gap-2 p-2.5 z-20 shadow-[0_0_20px_rgba(10,14,20,0.6)]">
                <div className="flex-1 h-full bg-[#141b24] shadow-[inset_-4px_-4px_0_#1f2937] border-2 border-[#1f2937] relative flex items-center">
                    <div className="absolute right-2 w-3 h-10 bg-[#7a8694] rounded-sm shadow-sm border border-[#525e69]"></div>
                </div>
                <div className="flex-1 h-full bg-[#141b24] shadow-[inset_-4px_-4px_0_#1f2937] border-2 border-[#1f2937] relative flex items-center">
                    <div className="absolute left-2 w-3 h-10 bg-[#7a8694] rounded-sm shadow-sm border border-[#525e69]"></div>
                </div>
            </div>

            {/* LED Status Sign */}
            <div className="absolute bottom-4 right-12 w-20 h-10 bg-[#111822] border-[3px] border-[#0a0e14] flex items-center justify-center shadow-lg z-30 px-1">
                {props.isPresent ? (
                    <span className="text-[12px] text-[#4ade80] font-mono font-black uppercase tracking-wider animate-pulse drop-shadow-[0_0_6px_rgba(74,222,128,0.8)]">OPEN</span>
                ) : (
                    <span className="text-[10px] text-[#ef4444] font-mono font-black uppercase tracking-wider drop-shadow-[0_0_4px_rgba(239,68,68,0.6)]">CLOSED</span>
                )}
            </div>

            <div className="absolute bottom-0 w-full h-8 bg-[#374552] border-t-[4px] border-[#1e2730] shadow-[0_4px_0_rgba(0,0,0,0.1)]"></div>
        </div>
    </PxWrapper>
);

// --- Main Component Assembly ---

const CafeMap = ({ shopName = "Your Shop", weather = "Sunny", competitorPresent = true }) => {
    const isCloudy = weather === "Cloudy" || weather === "Rainy";
    const isRainy = weather === "Rainy";

    const avatarUri = useMemo(() => {
        return createAvatar(bigSmile, {
            seed: 'Sawyer',
            // adding nice subtle radius for styling just in case, though the parent div handles rounding
            radius: 50,
            backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf']
        }).toDataUri();
    }, []);

    return (
        <div className="w-full h-full bg-[#cbf2ff] relative overflow-hidden flex flex-col font-mono select-none">

            {/* Sky Background */}
            <Sky weather={weather} />

            {/* Distant Layers */}
            {/* Adjusted cloud positions slightly for harmony */}
            <Cloud top="10%" left="5%" scale={0.8} delay={0} opacity={isCloudy ? 0.9 : 0.8} />
            <Cloud top="18%" right="10%" scale={1.2} delay={1} opacity={isCloudy ? 0.9 : 0.8} />
            <Cloud top="5%" left="60%" scale={0.6} opacity={isCloudy ? 0.8 : 0.6} delay={2} />

            {/* Extra thick clouds for bad weather */}
            {isCloudy && <Cloud top="2%" left="25%" scale={1.5} opacity={0.6} delay={0.5} />}
            {isRainy && <Cloud top="8%" right="40%" scale={1.8} opacity={0.7} delay={1.5} />}

            <DistantCity />
            <DistantCliffs />

            {/* Increased prominent Sidewalk area below */}
            <Sidewalk weather={weather} />
            <Ground />
            <Street className="-mt-1" />

            {/* Midground Trees behind Cafes */}
            {/* Z-Index 12: Behind the cafes but in front of Ground */}
            <PineTree left="3%" bottom="28%" scale={1.1} zIndex={12} />
            <OakTree left="38%" bottom="30%" scale={0.8} zIndex={12} />
            <PineTree right="1%" bottom="32%" scale={0.9} zIndex={12} />

            {/* Main Subject: The Shops! */}
            {/* Pushed tightly to lateral edges to remove overlap completely */}
            {/* Z-Index sets them firmly in front */}
            <CompetitorCafe left="3%" bottom="20%" scale={0.55} isPresent={competitorPresent} />
            <PlayerCafe right="3%" bottom="20%" scale={0.65} shopName={shopName} />

            {/* Weather Overlay System */}
            {isRainy && <Rain />}

            {/* Global Weather Lighting Tint */}
            <div className={`absolute inset-0 pointer-events-none z-[48] transition-colors duration-1000 ${isRainy ? 'bg-[#1a2f42]/40 mix-blend-multiply' :
                isCloudy ? 'bg-[#708090]/25 mix-blend-multiply' :
                    'bg-transparent'
                }`}></div>

            {/* Player Avatar Placeholder */}
            {/* Sits over everything inside top-right corner */}
            <div className="absolute top-4 right-4 w-16 h-16 bg-white/40 rounded-full border-[3px] border-white/60 shadow-lg z-[60] backdrop-blur-sm flex items-center justify-center overflow-hidden">
                <img src={avatarUri} alt="Player Avatar" className="w-full h-full object-cover" />
            </div>

            {/* Overall Retro Filter (reduces harshness) */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAADCAYAAABS3WWCAAAAE0lEQVQIW2PAwn/MfxjA1MAAAwANJwH++eK/eQAAAABJRU5ErkJggg==')] z-[70]"></div>
            {/* Soft vignette */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_60px_rgba(0,0,0,0.2)] z-[70] mix-blend-overlay"></div>
        </div>
    );
};

export default CafeMap;
