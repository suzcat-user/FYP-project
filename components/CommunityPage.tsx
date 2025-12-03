import React from 'react';

const HOBBY_CATEGORIES = [
  { name: "🎨 Arts & Crafts", color: "bg-red-200", description: "Share your paintings, pottery, and DIY projects!" },
  { name: "🎵 Music", color: "bg-blue-200", description: "Discuss instruments, favorite artists, and new music." },
  { name: "🌳 Outdoors & Fitness", color: "bg-green-200", description: "From hiking trails to workout tips, get active!" },
  { name: "🍳 Culinary", color: "bg-yellow-200", description: "Show off your best dishes and swap secret recipes." },
  { name: "🎮 Gaming", color: "bg-purple-200", description: "Connect with fellow gamers and talk about new releases." },
  { name: "🏸 Badminton", color: "bg-indigo-200", description: "Find partners, discuss gear, and share match highlights." },
];

interface CommunityPageProps {
    onSelectCommunity: (community: string) => void;
}

const CommunityPage: React.FC<CommunityPageProps> = ({ onSelectCommunity }) => {
  return (
    <div className="w-full flex flex-col items-center animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="font-fredoka text-5xl sm:text-6xl">Community Hub</h2>
        <p className="text-lg mt-2 max-w-xl">
          Discover a hobby, then discover a community! Select a category to join the conversation.
        </p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {HOBBY_CATEGORIES.map((category) => (
          <button
            key={category.name}
            onClick={() => onSelectCommunity(category.name)}
            className="bg-white p-6 rounded-3xl border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] text-left hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transform transition-all"
          >
            <div className={`font-fredoka text-2xl inline-block px-4 py-1 rounded-full border-2 border-black mb-4 ${category.color}`}>
              <h3>{category.name}</h3>
            </div>
            <p className="text-gray-600">{category.description}</p>
          </button>
        ))}
      </div>
       <style>{`
        @keyframes fade-in {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default CommunityPage;
