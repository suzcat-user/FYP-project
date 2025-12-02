import React from 'react';
import * as HobbyIcons from '../icons/HobbyIcons';

type IconMap = { [key: string]: React.FC };

const HOBBY_ICON_MAP: IconMap = {
    // Exact matches from HobbyIcons
    AdventureExplorer: HobbyIcons.AdventureExplorer,
    TreeClimber: HobbyIcons.TreeClimber,
    ScienceWhiz: HobbyIcons.ScienceWhiz,
    NightOwl: HobbyIcons.NightOwl,
    AnimalLover: HobbyIcons.AnimalLover,
    MovieStar: HobbyIcons.MovieStar,
    BookWorm: HobbyIcons.BookWorm,
    MagicLover: HobbyIcons.MagicLover,
    Daydreamer: HobbyIcons.Daydreamer,
    PetWhisperer: HobbyIcons.PetWhisperer,
    SuperheroFan: HobbyIcons.SuperheroFan,
    SillyGoose: HobbyIcons.SillyGoose,

    // Aliases and likely AI responses
    'Adventure': HobbyIcons.AdventureExplorer,
    'Exploring': HobbyIcons.AdventureExplorer,
    'Scavenger Hunt': HobbyIcons.AdventureExplorer,
    'Hiking': HobbyIcons.TreeClimber,
    'Climbing': HobbyIcons.TreeClimber,
    'Nature': HobbyIcons.TreeClimber,
    'Science': HobbyIcons.ScienceWhiz,
    'Experiments': HobbyIcons.ScienceWhiz,
    'Stargazing': HobbyIcons.NightOwl,
    'Astronomy': HobbyIcons.NightOwl,
    'Animals': HobbyIcons.AnimalLover,
    'Pets': HobbyIcons.PetWhisperer,
    'Veterinary': HobbyIcons.AnimalLover,
    'Movies': HobbyIcons.MovieStar,
    'Filmmaking': HobbyIcons.MovieStar,
    'Acting': HobbyIcons.MovieStar,
    'Reading': HobbyIcons.BookWorm,
    'Writing': HobbyIcons.BookWorm,
    'Storytelling': HobbyIcons.BookWorm,
    'Magic': HobbyIcons.MagicLover,
    'Fantasy': HobbyIcons.MagicLover,
    'Imagination': HobbyIcons.Daydreamer,
    'Creative Writing': HobbyIcons.BookWorm,
    'Superheroes': HobbyIcons.SuperheroFan,
    'Comics': HobbyIcons.SuperheroFan,
    'Jokes': HobbyIcons.SillyGoose,
    'Comedy': HobbyIcons.SillyGoose,
    'Baking': HobbyIcons.SillyGoose, // No specific icon, re-using
    'Cooking': HobbyIcons.SillyGoose,
    'Gaming': HobbyIcons.SuperheroFan, // Re-using
    'Video Games': HobbyIcons.SuperheroFan, // Re-using
    'Drawing': HobbyIcons.MagicLover, // Re-using
    'Painting': HobbyIcons.MagicLover,
    'Art': HobbyIcons.MagicLover,
    'Photography': HobbyIcons.MovieStar,
    'Music': HobbyIcons.MovieStar,
    'Singing': HobbyIcons.MovieStar,
    'Dancing': HobbyIcons.MovieStar,
    'Sports': HobbyIcons.TreeClimber,
    'Soccer': HobbyIcons.TreeClimber,
    'Basketball': HobbyIcons.TreeClimber,
    'Gardening': HobbyIcons.TreeClimber,
    'Coding': HobbyIcons.ScienceWhiz,
    'Programming': HobbyIcons.ScienceWhiz,
    'Robotics': HobbyIcons.ScienceWhiz,
    'Chess': HobbyIcons.ScienceWhiz,
    'Puzzles': HobbyIcons.ScienceWhiz,
    'Board Games': HobbyIcons.SillyGoose,
    'DIY Projects': HobbyIcons.ScienceWhiz,
    'Crafting': HobbyIcons.MagicLover,
    'Knitting': HobbyIcons.MagicLover,
    'Sewing': HobbyIcons.MagicLover,
    'Yoga': HobbyIcons.Daydreamer,
    'Meditation': HobbyIcons.Daydreamer,
    'Cycling': HobbyIcons.AdventureExplorer,
    'Running': HobbyIcons.TreeClimber,
    'Swimming': HobbyIcons.AnimalLover,
    'Fishing': HobbyIcons.AnimalLover,
    'Camping': HobbyIcons.TreeClimber,
    'Bird Watching': HobbyIcons.NightOwl,
    'Collecting': HobbyIcons.BookWorm,
    'Antiques': HobbyIcons.BookWorm,
    'Stamps': HobbyIcons.BookWorm,
    'Coins': HobbyIcons.BookWorm,
    'Volunteering': HobbyIcons.AnimalLover,
    'Language Learning': HobbyIcons.BookWorm,
    'Traveling': HobbyIcons.AdventureExplorer,
    'History': HobbyIcons.BookWorm,
    'Archaeology': HobbyIcons.AdventureExplorer,
    'Geocaching': HobbyIcons.AdventureExplorer,
    'Surfing': HobbyIcons.AnimalLover,
    'Skateboarding': HobbyIcons.SuperheroFan,
    'Skiing': HobbyIcons.TreeClimber,
    'Snowboarding': HobbyIcons.TreeClimber,
    'Pottery': HobbyIcons.MagicLover,
    'Sculpting': HobbyIcons.MagicLover,
    'Calligraphy': HobbyIcons.BookWorm,
    'Origami': HobbyIcons.MagicLover,
    'Jewelry Making': HobbyIcons.MagicLover,
    'Candle Making': HobbyIcons.MagicLover,
    'Soap Making': HobbyIcons.MagicLover,
    'Blogging': HobbyIcons.BookWorm,
    'Vlogging': HobbyIcons.MovieStar,
    'Podcasting': HobbyIcons.MovieStar,
    'Graphic Design': HobbyIcons.ScienceWhiz,
    'Web Design': HobbyIcons.ScienceWhiz,
    'Animation': HobbyIcons.MovieStar,
    'Astrology': HobbyIcons.NightOwl,
    'Tarot Reading': HobbyIcons.MagicLover,
    'Archery': HobbyIcons.SuperheroFan,
    'Fencing': HobbyIcons.SuperheroFan,
    'Martial Arts': HobbyIcons.SuperheroFan,
    'Rock Climbing': HobbyIcons.TreeClimber,
    'Kayaking': HobbyIcons.AdventureExplorer,
    'Canoeing': HobbyIcons.AdventureExplorer,
    'Sailing': HobbyIcons.AdventureExplorer,
    'Metal Detecting': HobbyIcons.AdventureExplorer,
    'Foraging': HobbyIcons.TreeClimber,
    'Mycology': HobbyIcons.TreeClimber,
    'Beekeeping': HobbyIcons.AnimalLover,
    'Home Brewing': HobbyIcons.ScienceWhiz,
    'Mixology': HobbyIcons.ScienceWhiz,
    'Parkour': HobbyIcons.SuperheroFan,
    'Urban Exploration': HobbyIcons.AdventureExplorer,
    'Lock Picking': HobbyIcons.ScienceWhiz,
    'Car Restoration': HobbyIcons.ScienceWhiz,
    'Model Building': HobbyIcons.ScienceWhiz,
};

export const getHobbyIcon = (hobbyName: string): React.FC | null => {
    // Try a direct match first
    if (HOBBY_ICON_MAP[hobbyName]) {
        return HOBBY_ICON_MAP[hobbyName];
    }
    // Try a case-insensitive, space-removed match
    const normalizedName = hobbyName.replace(/\s+/g, '');
    if (HOBBY_ICON_MAP[normalizedName]) {
        return HOBBY_ICON_MAP[normalizedName];
    }
    // Try finding a key that is a substring of the hobbyName
    for (const key in HOBBY_ICON_MAP) {
        if (hobbyName.toLowerCase().includes(key.toLowerCase())) {
            return HOBBY_ICON_MAP[key];
        }
    }

    return null;
};
