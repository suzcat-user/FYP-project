import React, { useState, useRef } from 'react';
import { User } from '../types';
import HobbyBadge from './HobbyBadge';

interface ProfilePageProps {
    user: User;
    onUpdateDescription: (description: string) => void;
    onUpdateAvatar: (avatar: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateDescription, onUpdateAvatar }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [description, setDescription] = useState(user.description);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    const handleSave = () => {
        onUpdateDescription(description);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setDescription(user.description);
        setIsEditing(false);
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onUpdateAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const isUrl = user.avatar.startsWith('http') || user.avatar.startsWith('data:image');

    return (
        <div className="w-full max-w-3xl flex flex-col items-center animate-fade-in bg-white p-8 rounded-3xl border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)]">
            <div className="flex flex-col sm:flex-row items-center w-full">
                <div className="relative">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center text-5xl border-4 border-black mb-4 sm:mb-0 sm:mr-6 overflow-hidden">
                        {isUrl ? (
                            <img src={user.avatar} alt="User avatar" className="w-full h-full object-cover" />
                        ) : (
                            <span>{user.avatar}</span>
                        )}
                    </div>
                    <input type="file" accept="image/*" ref={avatarInputRef} onChange={handleAvatarChange} className="hidden" />
                    <button 
                        onClick={() => avatarInputRef.current?.click()}
                        className="absolute bottom-3 -right-1 sm:bottom-0 sm:right-5 bg-white p-1 rounded-full border-2 border-black hover:bg-gray-200 transition-colors"
                        title="Change profile picture"
                    >
                        ✏️
                    </button>
                </div>
                <div className="text-center sm:text-left">
                    <h2 className="font-fredoka text-4xl">{user.username}</h2>
                    <p className="text-gray-500">{user.email}</p>
                </div>
            </div>

            <div className="w-full my-8">
                <h3 className="font-fredoka text-2xl mb-2">About Me</h3>
                {isEditing ? (
                    <div>
                        <textarea
                            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <div className="flex gap-2 mt-2">
                            <button onClick={handleSave} className="font-fredoka bg-[#90F1AC] text-black px-4 py-2 rounded-full border-2 border-black hover:bg-[#7bce93]">Save</button>
                            <button onClick={handleCancel} className="font-fredoka bg-gray-200 text-black px-4 py-2 rounded-full border-2 border-black hover:bg-gray-300">Cancel</button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p className="bg-gray-100 p-4 rounded-lg border-2 border-gray-200 whitespace-pre-wrap">{user.description || "No description yet. Add one!"}</p>
                        <button onClick={() => setIsEditing(true)} className="font-fredoka bg-blue-300 text-black text-sm px-4 py-1 mt-2 rounded-full border-2 border-black hover:bg-blue-400">Edit Description</button>
                    </div>
                )}
            </div>

            <div className="w-full">
                <h3 className="font-fredoka text-2xl mb-4">My Hobby Badges</h3>
                {user.hobbies.length > 0 ? (
                    <div className="flex flex-wrap gap-4">
                        {user.hobbies.map(hobby => (
                            <HobbyBadge key={hobby} hobbyName={hobby} />
                        ))}
                    </div>
                ) : (
                    <p className="bg-yellow-100 p-4 rounded-lg border-2 border-yellow-200">No badges yet! Play the game to discover your hobbies and earn badges.</p>
                )}
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

export default ProfilePage;