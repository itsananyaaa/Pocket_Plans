import React, { useState, useEffect } from 'react';
import InputCard from '../components/InputCard';
import ResultCard from '../components/ResultCard';
import IntelligenceIndicators from '../components/IntelligenceIndicators';
import { Sparkles } from 'lucide-react';

interface ResultData {
    name: string;
    distance: string;
    duration: string;
    reason: string[];
    score?: number;
    weather?: string;
    must_take?: string[];
    alternative?: string;
    music_recommendations?: string[];
    image_url?: string;
}

const Dashboard: React.FC = () => {
    const [showResult, setShowResult] = useState(false);
    const [resultData, setResultData] = useState<ResultData | null>(null);
    const [isThinking, setIsThinking] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);

    useEffect(() => {
        fetch('http://127.0.0.1:8001/suggestions')
            .then(res => res.json())
            .then(data => setSuggestions(data))
            .catch(err => console.error("Failed to fetch suggestions", err));
    }, []);

    const handleSearch = async (data: { location: string; time: string; preference: string; budget: string }) => {
        setIsThinking(true);
        try {
            const response = await fetch('http://127.0.0.1:8001/recommend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Backend not available');
            const result = await response.json();

            setTimeout(() => {
                setResultData(result);
                setShowResult(true);
                setIsThinking(false);
            }, 800);

        } catch (error) {
            console.log("Using Fallback Data:", error);

            setTimeout(() => {
                const mockResult: ResultData = {
                    name: "Urban Coffee Break",
                    distance: "5 min walk",
                    duration: `${data.time} Minutes`,
                    reason: [
                        "Fits your time window perfectly",
                        `Matches your "${data.preference}" vibe`,
                        "Offline Mode Active"
                    ],
                    score: 75,
                    weather: "Offline",
                    must_take: ["Wallet", "Offline Map"],
                    alternative: "City Walk",
                    music_recommendations: ["Lo-fi Beats", "Acoustic Chill"],
                    image_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                };

                setResultData(mockResult);
                setShowResult(true);
                setIsThinking(false);
            }, 1500);
        }
    };

    const handleBack = () => {
        setShowResult(false);
        setResultData(null);
    };

    const handleAddToFavorites = async () => {
        if (!resultData) return;

        const fav = { name: resultData.name, location: "", score: resultData.score || 0 };

        try {
            await fetch('http://127.0.0.1:8001/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(fav)
            });

            alert("Added to favorites!");
        } catch (e) {
            console.error("Failed to save favorite", e);
        }
    };

    return (
        <div className="container mx-auto px-4 pt-6 pb-16">

            {!showResult ? (
                <div className="flex flex-col items-center">

                    {/* ===== MASSIVE HERO TITLE ===== */}
                    <div className="w-full flex justify-center items-center mb-16 mt-6">
                        <h1 className="text-[70px] md:text-[110px] lg:text-[150px] font-black tracking-tight text-black leading-none text-center">
                            PocketPlan
                        </h1>
                    </div>

                    {/* ===== INPUT CARD ===== */}
                    <div className="w-full max-w-lg mb-12">
                        <InputCard onSearch={handleSearch} isThinking={isThinking} />
                    </div>

                    {/* ===== QUICK SUGGESTIONS ===== */}
                    {suggestions.length > 0 && (
                        <div className="w-full max-w-2xl text-center animate-fade-in-up">
                            <p className="text-sm text-gray-500 mb-4 font-semibold uppercase tracking-wider flex items-center justify-center gap-2">
                                <Sparkles size={14} /> Quick Picks
                            </p>

                            <div className="flex flex-wrap justify-center gap-3">
                                {suggestions.map((s, i) => (
                                    <span
                                        key={i}
                                        className="px-4 py-2 bg-white rounded-full shadow-sm text-sm font-medium text-gray-700 border border-gray-100 hover:border-black transition-colors cursor-default"
                                    >
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ===== INTELLIGENCE SECTION ===== */}
                    <div className="mt-16 w-full max-w-4xl">
                        <IntelligenceIndicators />
                    </div>

                </div>
            ) : (
                <div className="w-full py-8 animate-fade-in flex justify-center">
                    {resultData && (
                        <ResultCard
                            onBack={handleBack}
                            onFavorite={handleAddToFavorites}
                            data={resultData}
                        />
                    )}
                </div>
            )}

        </div>
    );
};

export default Dashboard;
