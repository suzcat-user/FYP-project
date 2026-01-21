import React, { useState, useMemo, useRef } from 'react';
import { Hobby, Post, Comment } from '../types';
import ArcadeButton from './ui/ArcadeButton';

interface HobbyCommunityProps {
  hobby: Hobby | null;
  onBack: () => void;
  isDarkMode?: boolean;
}

const PIXEL_GIFS = [
  "https://media1.tenor.com/m/ULDjjjbmgt4AAAAd/yeyeskies-cynthia-erivo.gif",
  "https://media1.tenor.com/m/pwgQhX123s4AAAAC/cynthia-erivo-shocked.gif",
  "https://media1.tenor.com/m/uxC9pNjuaAIAAAAd/ariana-grande-hair-flip.gif",
  "https://media1.tenor.com/m/Wt1mxxqzC1gAAAAC/phatearl.gif",
  "https://media1.tenor.com/m/dhwxCmcCKAUAAAAd/stan-twitter-nurse-britney.gif",
  "https://media1.tenor.com/m/-t4PlsIvMjkAAAAC/kill-me-shoot-me.gif",
  "https://media1.tenor.com/m/t-Imk589wNcAAAAC/stan-twitter.gif",
  "https://media1.tenor.com/m/T5xyQ6PNiEcAAAAd/stan-twitter.gif",
  "https://media1.tenor.com/m/6COMq6z3l5oAAAAC/bosnov-67.gif",
  "https://media1.tenor.com/m/O-MmXat9u54AAAAC/benson-boone-coachella.gif",
  "https://media1.tenor.com/m/MuL00oOUHpAAAAAC/wicked-glinda-wicked-for-good.gif",
  "https://media1.tenor.com/m/rxjtdE-oKtMAAAAC/little-mermaid-laughing.gif"
];

const HobbyCommunity: React.FC<HobbyCommunityProps> = ({ hobby, onBack, isDarkMode = false }) => {
  const [joined, setJoined] = useState(false);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newAttachments = Array.from(files).map((file: File) => URL.createObjectURL(file));
      setAttachments(prev => [...prev, ...newAttachments]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const [posts, setPosts] = useState<Post[]>(() => {
    if (!hobby) return [];
    return [
      {
        id: '1',
        author: 'PixelMaster99',
        title: `Just started my first ${hobby.name} project!`,
        content: `I picked up the basics yesterday and I'm already hooked. The community here is amazing. Anyone have tips for a beginner? I'm using the standard kit for now.`,
        upvotes: 142,
        timestamp: '2h ago',
        comments: [
          { id: 'c1', author: 'RetroFan', content: 'Welcome to the club! Check the sidebar for the "Beginner Glitch-less" guide.', timestamp: '1h ago', upvotes: 12 },
          { id: 'c2', author: 'GameBoy', content: 'This is the way!', timestamp: '30m ago', upvotes: 5, gifs: [PIXEL_GIFS[0]] },
          { id: 'c3', author: 'NeonDreamer', content: 'Don\'t forget to calibrate your tools first! It makes a huge difference in the long run.', timestamp: '15m ago', upvotes: 2 }
        ]
      },
      {
        id: '2',
        author: 'Bit_Crusher_88',
        title: `Found a legendary ${hobby.name} shortcut!`,
        content: `If you angle your approach at exactly 45 degrees while using the "Flow State" buff, you can bypass the main difficulty spike in this hobby. It feels like cheating but it's totally vanilla!`,
        upvotes: 438,
        timestamp: '5h ago',
        attachments: ['https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=400'],
        comments: [
          { id: 'c4', author: 'SpeedRunner_X', content: 'Actually, the skip is even faster if you frame-perfect jump at the start.', timestamp: '4h ago', upvotes: 89 },
          { id: 'c5', author: 'LogicGate', content: 'Is this possible on the console version or just PC?', timestamp: '2h ago', upvotes: 14 }
        ]
      },
      {
        id: '3',
        author: 'Vapor_Voyager',
        title: `Monthly ${hobby.name} Meetup in Sector 7`,
        content: `Reminder that we're hosting a local lobby for all ${hobby.name} enthusiasts this Saturday. Bring your best gear and let's compare stats. Free pizza for anyone with a "Master" rank!`,
        upvotes: 89,
        timestamp: '8h ago',
        comments: [
          { id: 'c6', author: 'PizzzA_Lover', content: 'Count me in! I\'ll bring the extra controllers.', timestamp: '7h ago', upvotes: 20 }
        ]
      },
      {
        id: '4',
        author: 'NatureLover',
        title: `${hobby.name} is the best stress reliever`,
        content: `After a long week of debugging real life, nothing beats a few hours of this. Truly helps me find my center and reconnect with my creative core.`,
        upvotes: 210,
        timestamp: '1d ago',
        attachments: ['https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400', PIXEL_GIFS[1]],
        comments: [
          { id: 'c7', author: 'Zen_Master', content: 'Same here. It\'s like meditation but with better graphics.', timestamp: '20h ago', upvotes: 45 },
          { id: 'c8', author: 'Cactus_Jim', content: 'Absolutely. It is the only time my brain stops buzzing.', timestamp: '18h ago', upvotes: 12, gifs: [PIXEL_GIFS[2]] }
        ]
      },
      {
        id: '5',
        author: 'Save_State_Sam',
        title: `Which build is better for high-level ${hobby.name}?`,
        content: `I'm torn between the "Agility" focused setup and the "Tank" build. For those who have reached the end-game, what are you running? I feel like the Agility build lacks late-game sustainability.`,
        upvotes: 67,
        timestamp: '1d ago',
        comments: [
          { id: 'c9', author: 'Heavy_Hitter', content: 'Tank build all the way. You can\'t do damage if you\'re dead!', timestamp: '22h ago', upvotes: 31 },
          { id: 'c10', author: 'Glass_Cannon', content: 'Agility is fine if you just don\'t get hit. Git gud!', timestamp: '21h ago', upvotes: -12 }
        ]
      },
      {
        id: '6',
        author: 'Lore_Hunter',
        title: `The hidden history of ${hobby.name}`,
        content: `Did you know that ${hobby.name} actually originated from a 1984 arcade prototype that never saw the light of day? I found some old design docs in the archives. Truly fascinating stuff!`,
        upvotes: 752,
        timestamp: '3d ago',
        attachment: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&q=80&w=400',
        comments: [
          { id: 'c11', author: 'History_Buff', content: 'This is a quality post. I love deep dives into hobby origins.', timestamp: '2d ago', upvotes: 110 },
          { id: 'c12', author: 'OldSchool_Gamer', content: 'I remember hearing rumors about that prototype on BBS boards back in the day!', timestamp: '1d ago', upvotes: 54 }
        ]
      },
      {
        id: '7',
        author: 'Crafty_Creator',
        title: `My latest ${hobby.name} masterpiece`,
        content: `Spent the entire weekend on this project. The attention to detail really paid off! What do you all think? Any suggestions for improvement?`,
        upvotes: 324,
        timestamp: '4d ago',
        attachments: ['https://images.unsplash.com/photo-1541963463532-d68292c34d19?auto=format&fit=crop&q=80&w=400', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=400', PIXEL_GIFS[6]],
        comments: [
          { id: 'c13', author: 'Art_Critic', content: 'This is absolutely stunning! The composition is perfect.', timestamp: '3d ago', upvotes: 92 },
          { id: 'c14', author: 'Pixel_Perfectionist', content: 'Love the color palette. Very retro!', timestamp: '3d ago', upvotes: 45, gifs: [PIXEL_GIFS[7]] }
        ]
      },
      {
        id: '8',
        author: 'Tech_Wizard',
        title: `New ${hobby.name} tools and gadgets review`,
        content: `Just got my hands on the latest gear. The precision is incredible! Here's my unboxing and first impressions. Worth the investment?`,
        upvotes: 198,
        timestamp: '5d ago',
        attachments: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&q=80&w=400'],
        comments: [
          { id: 'c15', author: 'Gear_Head', content: 'Definitely worth it! The quality improvement is noticeable.', timestamp: '4d ago', upvotes: 67 },
          { id: 'c16', author: 'Budget_Builder', content: 'A bit pricey, but if you\'re serious, yes.', timestamp: '4d ago', upvotes: 23 }
        ]
      },
      {
        id: '9',
        author: 'Community_Manager',
        title: `Weekly ${hobby.name} Challenge Results`,
        content: `The voting is in! Here are the top entries from this week's challenge. Congratulations to all participants - amazing work everyone!`,
        upvotes: 456,
        timestamp: '6d ago',
        attachments: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=400', 'https://images.unsplash.com/photo-1541963463532-d68292c34d19?auto=format&fit=crop&q=80&w=400', PIXEL_GIFS[0], PIXEL_GIFS[1]],
        comments: [
          { id: 'c17', author: 'Winner_Winner', content: 'So proud to be in the top 3! Thanks for organizing.', timestamp: '5d ago', upvotes: 134 },
          { id: 'c18', author: 'Challenge_Addict', content: 'Can\'t wait for next week\'s theme!', timestamp: '5d ago', upvotes: 89, gifs: [PIXEL_GIFS[2], PIXEL_GIFS[3]] }
        ]
      },
      {
        id: '10',
        author: 'Retro_Enthusiast',
        title: `Vintage ${hobby.name} collection showcase`,
        content: `Been collecting old-school gear for years. Here's my prized possession - a 1980s original! Still works perfectly. Anyone else into vintage collecting?`,
        upvotes: 287,
        timestamp: '1w ago',
        attachments: ['https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&q=80&w=400', PIXEL_GIFS[4]],
        comments: [
          { id: 'c19', author: 'Vintage_Vibes', content: 'That\'s incredible! I have a similar piece from 1985.', timestamp: '6d ago', upvotes: 56 },
          { id: 'c20', author: 'Collector_Crazy', content: 'Vintage collecting is the best. So much character!', timestamp: '6d ago', upvotes: 34 }
        ]
      }
    ];
  });

  const activePost = useMemo(() => posts.find(p => p.id === activePostId), [posts, activePostId]);

  const handleCreatePost = () => {
    if (!newPostTitle) return;
    const newPost: Post = {
      id: Date.now().toString(),
      author: 'YOU',
      title: newPostTitle,
      content: newPostContent,
      upvotes: 0,
      timestamp: 'Just now',
      attachments: attachments.length > 0 ? attachments : undefined,
      comments: []
    };
    setPosts([newPost, ...posts]);
    setNewPostTitle('');
    setNewPostContent('');
    setAttachments([]);
    setShowCreateModal(false);
  };

  const handleAddComment = (postId: string, content: string, gifs?: string[]) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, {
            id: Date.now().toString(),
            author: 'YOU',
            content,
            timestamp: 'Just now',
            upvotes: 0,
            gifs
          }]
        };
      }
      return p;
    }));
  };

  const handleDeletePost = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post && post.author === 'YOU') {
      setPosts(prev => prev.filter(p => p.id !== postId));
      setActivePostId(null);
    }
  };

  const handleEditPost = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post && post.author === 'YOU') {
      setNewPostTitle(post.title);
      setNewPostContent(post.content);
      setEditingPostId(postId);
      setShowCreateModal(true);
      setActivePostId(null);
    }
  };

  const handleSaveEditedPost = () => {
    if (editingPostId && newPostTitle.trim() && newPostContent.trim()) {
      setPosts(prev => prev.map(p => 
        p.id === editingPostId 
          ? { ...p, title: newPostTitle, content: newPostContent }
          : p
      ));
      resetModalState();
    }
  };

  const resetModalState = () => {
    setShowCreateModal(false);
    setNewPostTitle('');
    setNewPostContent('');
    setAttachments([]);
    setEditingPostId(null);
  };

  if (!hobby) return <div className="p-10 text-center font-press-start">SELECT A HOBBY FIRST</div>;

  return (
    <div className={`h-full flex flex-col transition-colors duration-500 ${isDarkMode ? 'bg-[#0f111a] text-sky-100' : 'bg-[#dae0e6] text-gray-900'} relative`}>
      
      {/* Header */}
      <div className={`sticky top-0 z-30 border-b-4 transition-colors duration-500 ${isDarkMode ? 'bg-[#1a1c27] border-indigo-900' : 'bg-white border-sky-800'}`}>
          <div className="flex items-center gap-4 p-4 max-w-5xl mx-auto w-full">
              <button onClick={onBack} className={`font-press-start text-[1.2vmin] px-4 py-2 border-2 ${isDarkMode ? 'border-pink-500 text-pink-500' : 'border-sky-800 text-sky-800'}`}>BACK</button>
              <div className="flex-1">
                  <h1 className="font-press-start text-[2vmin] uppercase">r/{hobby.name.replace(/\s+/g, '').toLowerCase()}</h1>
              </div>
              <button 
                onClick={() => setJoined(!joined)}
                className={`font-press-start text-[1.2vmin] px-6 py-2 border-b-4 border-r-4 ${joined ? 'bg-gray-400' : isDarkMode ? 'bg-pink-600' : 'bg-sky-600'} text-white`}
              >
                {joined ? 'JOINED' : 'JOIN'}
              </button>
          </div>
      </div>

      <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto w-full py-6 px-4 flex flex-col md:flex-row gap-6">
              
              {/* Feed */}
              <div className="flex-1 flex flex-col gap-4">
                  <div className={`p-4 border-2 flex items-center gap-4 cursor-pointer ${isDarkMode ? 'bg-[#1a1c27] border-indigo-950' : 'bg-white border-gray-300'}`} onClick={() => setShowCreateModal(true)}>
                      <div className="w-10 h-10 rounded-full bg-gray-400"></div>
                      <div className="flex-1 p-2 font-vt323 text-xl opacity-50 border-2">Start a new quest (Post)...</div>
                  </div>

                  {posts.map(post => (
                    <div key={post.id} className={`flex border-2 transition-all ${isDarkMode ? 'bg-[#1a1c27] border-indigo-950 hover:border-indigo-600' : 'bg-white border-gray-300 hover:border-sky-400'}`}>
                        <div className={`w-12 flex flex-col items-center py-4 gap-2 ${isDarkMode ? 'bg-black/20' : 'bg-gray-50'}`}>
                            <button className="text-xl">▲</button>
                            <span className="font-press-start text-[1vmin]">{post.upvotes}</span>
                            <button className="text-xl">▼</button>
                        </div>
                        <div className="flex-1 p-4">
                            <h2 className="font-press-start text-[1.8vmin] mb-2">{post.title}</h2>
                            <p className="font-vt323 text-xl mb-2 line-clamp-3">{post.content}</p>
                            {post.attachment && (
                                <img src={post.attachment} alt="Attachment" className="max-h-[300px] w-full object-cover mb-4 border-2 border-current" />
                            )}
                            {post.attachments && post.attachments.slice(0, 1).map(att => (
                                <img key={att} src={att} alt="Attachment" className="max-h-[300px] w-full object-cover mb-4 border-2 border-current" />
                            ))}
                            <div className="flex gap-4 font-press-start text-[1vmin] opacity-70 items-center">
                                <span className="cursor-pointer hover:opacity-100" onClick={() => setActivePostId(post.id)}>💬 {post.comments.length} Comments</span>
                                {post.author === 'YOU' && (
                                  <>
                                    <button 
                                      onClick={() => handleEditPost(post.id)}
                                      className={`px-2 py-1 border-2 ${isDarkMode ? 'bg-blue-600 border-blue-900 text-white' : 'bg-blue-400 border-blue-700'}`}
                                    >
                                      EDIT
                                    </button>
                                    <button 
                                      onClick={() => handleDeletePost(post.id)}
                                      className={`px-2 py-1 border-2 ${isDarkMode ? 'bg-red-600 border-red-900 text-white' : 'bg-red-400 border-red-700'}`}
                                    >
                                      DELETE
                                    </button>
                                  </>
                                )}
                            </div>
                        </div>
                    </div>
                  ))}
              </div>

              {/* Sidebar */}
              <div className="w-full md:w-[300px] flex flex-col gap-4">
                  <div className={`border-2 p-4 ${isDarkMode ? 'bg-[#1a1c27] border-indigo-950' : 'bg-white border-gray-300'}`}>
                      <h3 className="font-press-start text-[1.2vmin] border-b-2 mb-4">ABOUT COMMUNITY</h3>
                      <p className="font-vt323 text-lg leading-tight mb-4">{hobby.description}</p>
                      <ArcadeButton onClick={() => setShowCreateModal(true)} className="w-full">CREATE POST</ArcadeButton>
                  </div>
              </div>
          </div>
      </div>

      {/* Post Detail Modal */}
      {activePost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto border-8 p-6 flex flex-col gap-6 ${isDarkMode ? 'bg-[#0f111a] border-indigo-900' : 'bg-white border-sky-800'}`}>
                  <div className="flex justify-between items-center border-b-4 pb-2">
                      <h2 className="font-press-start text-[2vmin]">{activePost.title}</h2>
                      <div className="flex gap-2">
                          {activePost.author === 'YOU' && (
                            <>
                              <button 
                                onClick={() => handleEditPost(activePost.id)}
                                className={`font-press-start text-[1vmin] px-3 py-1 border-2 ${isDarkMode ? 'bg-blue-600 border-blue-900 text-white' : 'bg-blue-400 border-blue-700'}`}
                                title="Edit Post"
                              >
                                EDIT
                              </button>
                              <button 
                                onClick={() => handleDeletePost(activePost.id)}
                                className={`font-press-start text-[1vmin] px-3 py-1 border-2 ${isDarkMode ? 'bg-red-600 border-red-900 text-white' : 'bg-red-400 border-red-700'}`}
                                title="Delete Post"
                              >
                                DELETE
                              </button>
                            </>
                          )}
                          <button onClick={() => setActivePostId(null)} className="font-press-start text-red-500">X</button>
                      </div>
                  </div>
                  <div className="font-vt323 text-2xl leading-relaxed">
                      {activePost.content}
                  </div>
                  {activePost.attachments && activePost.attachments.map(att => (
                      <img key={att} src={att} alt="Attachment" className="w-full max-h-[500px] object-contain border-4 border-current mb-2" />
                  ))}

                  {/* Comment Section */}
                  <div className="mt-8 border-t-4 pt-6">
                      <h3 className="font-press-start text-[1.5vmin] mb-4">COMMENTS</h3>
                      <CommentInput onAdd={(c, g) => handleAddComment(activePost.id, c, g)} isDarkMode={isDarkMode} />
                      <div className="flex flex-col gap-6 mt-8">
                          {activePost.comments.map(c => (
                              <div key={c.id} className="flex gap-4 border-l-4 pl-4 border-gray-400">
                                  <div className="flex-1">
                                      <div className="flex gap-2 font-vt323 text-lg opacity-60 mb-1">
                                          <span>u/{c.author}</span>
                                          <span>•</span>
                                          <span>{c.timestamp}</span>
                                      </div>
                                      <p className="font-vt323 text-xl">{c.content}</p>
                                      {c.gifs && c.gifs.map(gif => (
                                          <img key={gif} src={gif} alt="GIF" className="mt-2 max-w-[200px] border-2" />
                                      ))}
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Create Post Modal */}
      {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
              <div className={`w-full max-w-2xl border-8 p-6 flex flex-col gap-4 ${isDarkMode ? 'bg-[#1a1c27] border-pink-600' : 'bg-white border-sky-800'}`}>
                  <h2 className="font-press-start text-[2vmin] mb-4">{editingPostId ? 'EDIT ADVENTURE POST' : 'NEW ADVENTURE POST'}</h2>
                  <input 
                    type="text" 
                    placeholder="Title" 
                    value={newPostTitle}
                    onChange={e => setNewPostTitle(e.target.value)}
                    className={`p-3 font-vt323 text-2xl border-4 ${isDarkMode ? 'bg-slate-900 border-indigo-900' : 'bg-gray-50 border-gray-300'}`} 
                  />
                  <textarea 
                    rows={4}
                    placeholder="What's on your mind?" 
                    value={newPostContent}
                    onChange={e => setNewPostContent(e.target.value)}
                    className={`p-3 font-vt323 text-2xl border-4 ${isDarkMode ? 'bg-slate-900 border-indigo-900' : 'bg-gray-50 border-gray-300'}`}
                  ></textarea>
                  
                  {!editingPostId && (
                    <div className="flex items-center gap-4">
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className={`font-press-start text-[1vmin] p-2 border-2 ${isDarkMode ? 'bg-indigo-900 border-indigo-700' : 'bg-gray-200 border-gray-400'}`}
                        >
                          ATTACH FILES ({attachments.length})
                        </button>
                        <input type="file" ref={fileInputRef} hidden multiple onChange={handleFileChange} accept="image/*,image/gif" />
                        {attachments.length > 0 && (
                          <div className="flex gap-2 flex-wrap">
                            {attachments.map((att, index) => (
                              <div key={index} className="relative">
                                <img src={att} alt={`Attachment ${index + 1}`} className="w-16 h-16 object-cover border-2" />
                                <button 
                                  onClick={() => removeAttachment(index)}
                                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  )}

                  <div className="flex justify-end gap-4 mt-4">
                      <button onClick={resetModalState} className="font-press-start text-red-500">CANCEL</button>
                      <ArcadeButton onClick={editingPostId ? handleSaveEditedPost : handleCreatePost}>
                        {editingPostId ? 'SAVE CHANGES' : 'POST QUEST'}
                      </ArcadeButton>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

const CommentInput: React.FC<{ onAdd: (content: string, gifs?: string[]) => void; isDarkMode: boolean }> = ({ onAdd, isDarkMode }) => {
    const [text, setText] = useState('');
    const [showGifs, setShowGifs] = useState(false);
    const [selectedGifs, setSelectedGifs] = useState<string[]>([]);

    const toggleGif = (gif: string) => {
        setSelectedGifs(prev => 
            prev.includes(gif) 
                ? prev.filter(g => g !== gif) 
                : [...prev, gif]
        );
    };

    return (
        <div className="flex flex-col gap-2">
            <textarea 
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="What are your thoughts?"
                className={`w-full p-4 font-vt323 text-xl border-4 ${isDarkMode ? 'bg-slate-900 border-indigo-950 text-white' : 'bg-gray-50 border-gray-300'}`}
            ></textarea>
            <div className="flex justify-between items-center relative">
                <button 
                    onClick={() => setShowGifs(!showGifs)}
                    className={`font-press-start text-[1vmin] px-4 py-2 border-2 ${isDarkMode ? 'bg-indigo-950 border-indigo-800' : 'bg-gray-100 border-gray-300'}`}
                >
                    GIF ({selectedGifs.length})
                </button>
                {showGifs && (
                    <div className={`absolute bottom-full left-0 mb-2 p-2 grid grid-cols-4 gap-2 border-4 z-50 ${isDarkMode ? 'bg-slate-950 border-indigo-900' : 'bg-white border-gray-400'}`}>
                        {PIXEL_GIFS.map(g => (
                            <img 
                                key={g} 
                                src={g} 
                                className={`w-16 h-16 cursor-pointer hover:scale-110 ${selectedGifs.includes(g) ? 'border-4 border-green-500' : 'border-2'}`} 
                                onClick={() => toggleGif(g)}
                            />
                        ))}
                    </div>
                )}
                <ArcadeButton onClick={() => { onAdd(text, selectedGifs.length > 0 ? selectedGifs : undefined); setText(''); setSelectedGifs([]); setShowGifs(false); }}>COMMENT</ArcadeButton>
            </div>
        </div>
    );
};

export default HobbyCommunity;