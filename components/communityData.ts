import { CommunityData } from '../types';

export const initialCommunityData: CommunityData = {
  // Original Communities with Events
  "🎨 Arts & Crafts": {
    color: "bg-red-200",
    posts: [
      { id: "ac1", author: "CraftyCasey", avatar: "🎨", text: "Just finished this watercolor painting! Any tips?", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2071&auto=format&fit=crop", replies: [{ id: "acr1", author: "DIYDan", avatar: "🔨", text: "Looks amazing! Try using higher quality paper." }] },
    ],
    events: [
        { id: "ev-ac1", name: "Pottery Throwing Workshop", date: "Sat, Oct 12", location: "Community Art Center", cost: "$45" },
        { id: "ev-ac2", name: "Plein Air Painting Session", date: "Sun, Oct 20", location: "Lakeside Park", cost: "Free" },
        { id: "ev-ac3", name: "Knitting Circle for Beginners", date: "Wed, Oct 23", location: "The Cozy Cafe", cost: "Free (buy a coffee!)" }
    ]
  },
  "🎵 Music": {
    color: "bg-blue-200",
    posts: [
      { id: "m1", author: "GuitarHero", avatar: "🎸", text: "Trying to learn the 'Stairway to Heaven' solo. It's so fast!", image: "https://images.unsplash.com/photo-1510915361894-db8b60106945?q=80&w=2070&auto=format&fit=crop", replies: [{ id: "mr1", author: "MelodyMaker", avatar: "🎹", text: "Practice with a metronome, starting slow!" }] },
    ],
    events: [
        { id: "ev-m1", name: "Open Mic Night", date: "Fri, Oct 11", location: "The Daily Grind", cost: "Free" },
        { id: "ev-m2", name: "Ukulele Jam Session in the Park", date: "Sat, Oct 19", location: "Central Park Bandshell", cost: "Free" }
    ]
  },
  "🌳 Outdoors & Fitness": {
    color: "bg-green-200",
    posts: [
      { id: "of1", author: "HikerHolly", avatar: "🌲", text: "Just got back from a 5-mile hike! What's everyone's favorite local trail?", image: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop", replies: [] },
    ],
    events: [
        { id: "ev-of1", name: "Guided Hike at Johor Mountain", date: "Sat, Oct 26", location: "Johor Mountain Trailhead", cost: "$15" },
        { id: "ev-of2", name: "Outdoor Yoga at Sunrise", date: "Sun, Oct 27", location: "Sunset Point", cost: "$10" },
        { id: "ev-of3", name: "Community 5K Fun Run", date: "Sat, Nov 2", location: "City Hall Plaza", cost: "$25 (includes t-shirt)" }
    ]
  },
  "🍳 Culinary": {
    color: "bg-yellow-200",
    posts: [
      { id: "c1", author: "ChefCharlie", avatar: "👨‍🍳", text: "My sourdough came out like a rock. Help!", image: "https://images.unsplash.com/photo-1598373182133-52452f7691ef?q=80&w=1925&auto=format&fit=crop", replies: [{ id: "cr1", author: "BakerBri", avatar: "🥐", text: "It's a common problem! Don't give up!" }] },
    ],
    events: [
        { id: "ev-c1", name: "Pasta Making Masterclass", date: "Tue, Oct 15", location: "The Community Kitchen", cost: "$60" },
        { id: "ev-c2", name: "Fall Harvest Farmer's Market Tour", date: "Sat, Oct 19", location: "Downtown Farmer's Market", cost: "Free" }
    ]
  },
  "🎮 Gaming": {
    color: "bg-purple-200",
    posts: [
      { id: "g1", author: "PixelPioneer", avatar: "🕹️", text: "Just finished 'Cosmic Rift'. Blown away!", image: "https://images.unsplash.com/photo-1580327344181-c1163234e5a0?q=80&w=2070&auto=format&fit=crop", replies: [{ id: "gr1", author: "LevelUpLaura", avatar: "🚀", text: "The side quests are incredible, don't skip them!" }] },
    ],
    events: [
        { id: "ev-g1", name: "Retro Arcade Game Tournament", date: "Fri, Oct 18", location: "Pixel Palace Arcade", cost: "$10 entry" },
        { id: "ev-g2", name: "Board Game Cafe Meetup", date: "Wed, Oct 30", location: "The Meeple's Keep", cost: "$5 cover" }
    ]
  },
  "🏸 Badminton": {
    color: "bg-indigo-200",
    posts: [
      { id: "b1", author: "RacketPro", avatar: "🏸", text: "What's a good, affordable racket for a beginner?", image: "https://images.unsplash.com/photo-1594273822668-3b8a4a5209a8?q=80&w=2070&auto=format&fit=crop", replies: [{ id: "br1", author: "SmashQueen", avatar: "👑", text: "I started with a Yonex Nanoray Light 18i. Super lightweight!" }] },
    ],
     events: [
        { id: "ev-b1", name: "Beginner Badminton Clinic", date: "Mon, Oct 14", location: "Community Sports Hall", cost: "$5" },
        { id: "ev-b2", name: "Doubles Round Robin", date: "Sat, Oct 26", location: "Community Sports Hall", cost: "$10 per team" }
    ]
  },

  // New Communities with Events
  "📚 Reading & Writing": {
    color: "bg-orange-200", posts: [],
    events: [
      { id: "ev-rw1", name: "Silent Book Club Meetup", date: "Tue, Oct 22", location: "The Quiet Corner Cafe", cost: "Free" },
      { id: "ev-rw2", name: "Poetry Slam Night", date: "Thu, Nov 7", location: "The Underground Verse", cost: "$5" }
    ]
  },
  "🤖 Tech & Coding": {
    color: "bg-gray-300", posts: [],
    events: [
      { id: "ev-tc1", name: "Intro to Python Workshop", date: "Sat, Nov 9", location: "City Library Tech Hub", cost: "Free" },
      { id: "ev-tc2", name: "Hackathon: Build for Good", date: "Sat, Nov 16", location: "Innovate Co-working Space", cost: "Free (RSVP needed)" }
    ]
  },
  "🎬 Film & Photography": {
    color: "bg-teal-200", posts: [],
     events: [
      { id: "ev-fp1", name: "Classic Film Screening: Casablanca", date: "Fri, Oct 25", location: "The Retro Cinema", cost: "$8" },
      { id: "ev-fp2", name: "Golden Hour Photowalk", date: "Sun, Nov 3", location: "Pier 7", cost: "Free" }
    ]
  },
  "🌱 Gardening": {
    color: "bg-lime-200", posts: [],
    events: [
      { id: "ev-gd1", name: "Community Garden Planting Day", date: "Sat, Oct 12", location: "Northside Community Garden", cost: "Free" },
      { id: "ev-gd2", name: "Houseplant Swap Meet", date: "Sun, Oct 20", location: "The Green Thumbers Nursery", cost: "Free" }
    ]
  },
  "🎲 Board Games": {
    color: "bg-cyan-200", posts: [],
    events: [
      { id: "ev-bg1", name: "Strategy Game Sunday", date: "Sun, Oct 13", location: "The Meeple's Keep", cost: "$5 cover" }
    ]
  },
  "⭐ Stargazing": {
    color: "bg-slate-300", posts: [],
    events: [
      { id: "ev-sg1", name: "Orionids Meteor Shower Watch", date: "Mon, Oct 21", location: "Lookout Point (Outside city)", cost: "Free" }
    ]
  },
  "💃 Dance": {
    color: "bg-rose-200", posts: [],
    events: [
      { id: "ev-d1", name: "Beginner Salsa Class", date: "Wed, Oct 16", location: "Rhythm Dance Studio", cost: "$15 drop-in" }
    ]
  },
   "🧘 Yoga & Meditation": {
    color: "bg-violet-200", posts: [],
    events: [
      { id: "ev-ym1", name: "Sunset Beach Yoga", date: "Fri, Oct 18", location: "South Beach", cost: "Donation-based" }
    ]
  },
   "🚗 Cars & Mechanics": {
    color: "bg-amber-200", posts: [],
    events: [
      { id: "ev-cm1", name: "Classic Car Meetup", date: "Sun, Oct 20", location: "Old Sears Parking Lot", cost: "Free" }
    ]
  },
  "🏛️ History & Museums": {
    color: "bg-stone-300", posts: [],
     events: [
      { id: "ev-hm1", name: "Guided Tour of the Natural History Museum", date: "Sat, Oct 19", location: "City Museum", cost: "$20" }
    ]
  },
   "🎭 Theater & Acting": {
    color: "bg-fuchsia-200", posts: [],
     events: [
      { id: "ev-ta1", name: "Improv Comedy Workshop", date: "Tue, Oct 29", location: "The Comedy Loft", cost: "$10" }
    ]
  },
  "🗼 Language Exchange": {
    color: "bg-sky-200", posts: [],
     events: [
      { id: "ev-le1", name: "Spanish-English Conversation Hour", date: "Thu, Oct 24", location: "The Global Cafe", cost: "Free" }
    ]
  },
  "🧭 Urban Exploration": {
    color: "bg-neutral-300", posts: [],
     events: [
      { id: "ev-ue1", name: "City Murals & Street Art Tour", date: "Sat, Nov 2", location: "Meet at City Hall", cost: "Free" }
    ]
  }
};
