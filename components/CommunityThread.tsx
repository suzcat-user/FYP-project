import React, { useState, useRef } from 'react';
import { Community, Post, Reply, User } from '../types';

interface CommunityThreadProps {
  currentUser: User;
  communityName: string;
  community: Community;
  onAddPost: (communityName: string, post: Omit<Post, 'id' | 'replies' | 'author' | 'avatar'>) => void;
  onAddReply: (communityName: string, postId: string, reply: Omit<Reply, 'id' | 'author' | 'avatar'>) => void;
  onDeletePost: (communityName: string, postId: string) => void;
  onDeleteReply: (communityName: string, postId: string, replyId: string) => void;
  onNavigateToEvents: (communityName: string) => void;
}

const Avatar: React.FC<{ avatar: string, size?: 'large' | 'small' }> = ({ avatar, size = 'large' }) => {
    const isUrl = avatar.startsWith('http') || avatar.startsWith('data:image');
    const sizeClasses = size === 'large' 
      ? "w-12 h-12 text-2xl" 
      : "w-8 h-8 text-xl";

    return (
        <div className={`${sizeClasses} bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center border-2 border-black overflow-hidden`}>
            {isUrl ? (
                <img src={avatar} alt="User avatar" className="w-full h-full object-cover" />
            ) : (
                <span>{avatar}</span>
            )}
        </div>
    );
};


const CommunityThread: React.FC<CommunityThreadProps> = ({ 
    currentUser,
    communityName, 
    community,
    onAddPost,
    onAddReply,
    onDeletePost,
    onDeleteReply,
    onNavigateToEvents
}) => {
  const [newPostText, setNewPostText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!community) {
    return (
      <div className="text-center">
        <h2 className="font-fredoka text-3xl">Community not found!</h2>
        <p>Please go back to the hub and select a community.</p>
      </div>
    );
  }

  const { color, posts } = community;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = () => {
    if (newPostText.trim() === "") return;
    onAddPost(communityName, {
      text: newPostText,
      image: imagePreview,
    });
    setNewPostText("");
    setImagePreview(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };
  
  const handleCreateReply = (postId: string) => {
    if (replyText.trim() === "") return;
    onAddReply(communityName, postId, {
        text: replyText,
    });
    setReplyText("");
    setReplyingTo(null);
  }

  return (
    <div className="w-full max-w-3xl flex flex-col items-center animate-fade-in">
        <div className="text-center mb-6">
            <div className={`font-fredoka text-3xl sm:text-4xl inline-block px-6 py-2 rounded-full border-4 border-black mb-4 ${color}`}>
                <h2>{communityName}</h2>
            </div>
            <div>
                 <button 
                    onClick={() => onNavigateToEvents(communityName)}
                    className="font-fredoka bg-yellow-300 text-black px-4 py-2 rounded-full border-2 border-black hover:bg-yellow-400 transition-colors shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                >
                    📅 View Events
                </button>
            </div>
        </div>

      {/* Create Post Section */}
      <div className="w-full bg-white p-4 rounded-2xl border-2 border-black shadow-md mb-8">
        <textarea
            className="w-full p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
            rows={3}
            placeholder="Share your thoughts..."
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
        ></textarea>
        {imagePreview && (
            <div className="mt-2">
                <img src={imagePreview} alt="Preview" className="max-h-40 rounded-lg border-2 border-gray-200" />
            </div>
        )}
        <div className="flex justify-between items-center mt-2">
            <div>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="text-sm font-bold text-gray-500 hover:text-black">
                    📎 Upload Image
                </button>
            </div>
            <button 
                onClick={handleCreatePost}
                className="font-fredoka bg-[#90F1AC] text-black text-sm px-4 py-2 rounded-full border-2 border-black hover:bg-[#7bce93] transition-colors shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_rgba(0,0,0,1)]"
            >
                Create Post
            </button>
        </div>
      </div>

      {/* Posts */}
      <div className="w-full space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-5 rounded-2xl border-2 border-black shadow-md">
            <div className="flex items-start space-x-4">
              <Avatar avatar={post.avatar} />
              <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="font-bold">{post.author}</p>
                    {post.author === currentUser.username && (
                        <button onClick={() => onDeletePost(communityName, post.id)} className="text-xs text-red-500 hover:text-red-700 font-bold">Delete</button>
                    )}
                  </div>
                  <p className="my-2">{post.text}</p>
                  {post.image && (
                      <img src={post.image} alt="User submission" className="mt-3 rounded-lg border-2 border-gray-200 max-h-64 w-full object-cover" />
                  )}
                  <button onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)} className="text-xs font-bold text-gray-500 hover:text-black mt-2">
                    Reply
                  </button>
              </div>
            </div>
            {/* Replies */}
            {post.replies && post.replies.length > 0 && (
                <div className="ml-16 mt-4 space-y-3 border-l-4 border-gray-200 pl-4">
                    {post.replies.map(reply => (
                        <div key={reply.id} className="flex items-start space-x-3">
                             <Avatar avatar={reply.avatar} size="small" />
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <p className="font-bold text-sm">{reply.author}</p>
                                    {reply.author === currentUser.username && (
                                        <button onClick={() => onDeleteReply(communityName, post.id, reply.id)} className="text-xs text-red-500 hover:text-red-700 font-bold">Delete</button>
                                    )}
                                </div>
                                <p className="text-sm">{reply.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
             {/* Reply Input */}
            {replyingTo === post.id && (
                <div className="ml-16 mt-3">
                    <textarea 
                        className="w-full p-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                        rows={2}
                        placeholder={`Replying to ${post.author}...`}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                    />
                    <div className="text-right mt-1">
                         <button onClick={() => handleCreateReply(post.id)} className="font-fredoka bg-blue-300 text-black text-xs px-3 py-1 rounded-full border-2 border-black hover:bg-blue-400">
                            Post Reply
                        </button>
                    </div>
                </div>
            )}
          </div>
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

export default CommunityThread;