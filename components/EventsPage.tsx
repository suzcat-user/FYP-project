import React from 'react';
import { Community } from '../types';

interface EventsPageProps {
    communityName: string;
    community: Community;
    onJoinEvent: (eventId: string) => void;
    participatedEventIds: string[];
}

const EventsPage: React.FC<EventsPageProps> = ({ communityName, community, onJoinEvent, participatedEventIds }) => {
    const { color, events } = community;

    return (
        <div className="w-full max-w-4xl flex flex-col items-center animate-fade-in">
            <div className={`font-fredoka text-3xl sm:text-4xl inline-block px-6 py-2 rounded-full border-4 border-black mb-2 ${color}`}>
                <h2>{communityName}</h2>
            </div>
            <h3 className="font-fredoka text-2xl mb-8">Upcoming Events</h3>
            
            {events && events.length > 0 ? (
                <div className="w-full space-y-6">
                    {events.map(event => {
                        const isParticipating = participatedEventIds.includes(event.id);
                        return (
                            <div key={event.id} className="bg-white p-6 rounded-2xl border-2 border-black shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex-1">
                                    <h4 className="font-fredoka text-2xl">{event.name}</h4>
                                    <p className="font-bold text-gray-600 mt-2">📍 {event.location}</p>
                                    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm">
                                        <p><span className="font-bold">📅 Date:</span> {event.date}</p>
                                        <p><span className="font-bold">💰 Cost:</span> {event.cost}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => onJoinEvent(event.id)}
                                    disabled={isParticipating}
                                    className={`font-fredoka text-lg px-6 py-3 rounded-xl border-2 border-black transition-colors shadow-[4px_4px_0px_rgba(0,0,0,1)] transform active:shadow-none active:translate-y-1 ${
                                        isParticipating
                                            ? 'bg-gray-300 cursor-not-allowed'
                                            : 'bg-green-300 hover:bg-green-400'
                                    }`}
                                >
                                    {isParticipating ? "You're Going!" : "Participate"}
                                </button>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="bg-yellow-100 p-4 rounded-lg border-2 border-yellow-200">
                    No upcoming events scheduled for this community yet. Check back soon!
                </p>
            )}

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

export default EventsPage;
