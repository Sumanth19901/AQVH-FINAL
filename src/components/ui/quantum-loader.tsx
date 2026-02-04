import React from 'react';

export function QuantumLoader() {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full min-h-[60vh]">
            <div className="quantum-loader-container">
                <div className="atom">
                    <div className="nucleus"></div>
                    <div className="orbit">
                        <div className="electron"></div>
                    </div>
                    <div className="orbit">
                        <div className="electron"></div>
                    </div>
                    <div className="orbit">
                        <div className="electron"></div>
                    </div>
                </div>
            </div>
            <h2 className="mt-8 text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 animate-pulse">
                Initializing Quantum Environment...
            </h2>
        </div>
    );
}
