import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Hobby, Post, Comment } from '../types';
import { getHobbyByName } from '../services/hobbyRecommendations';
import ArcadeButton from './ui/ArcadeButton';

interface HobbyCommunityProps {
  hobby: Hobby | null;
  onBack: () => void;
  isDarkMode?: boolean;
  currentUser?: string;
  userId?: number;
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


const AttachmentCarousel: React.FC<{ urls: string[]; className?: string }> = ({ urls, className }) => {
  const [index, setIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (!urls.length) return null;

  const goTo = (nextIndex: number) => {
    if (nextIndex === index) return;
    setIsFading(true);
    setIsLoaded(false);
    setTimeout(() => {
      setIndex(nextIndex);
      setIsFading(false);
    }, 180);
  };

  const goPrev = () => goTo((index - 1 + urls.length) % urls.length);
  const goNext = () => goTo((index + 1) % urls.length);

  return (
    <div className={`w-full relative ${className || ''}`}>
      <div className="relative w-full">
        {!isLoaded && (
          <div className="w-full h-[320px] bg-black/10 border-2 border-current animate-pulse rounded-2xl" />
        )}
        <img
          src={urls[index]}
          alt={`Attachment ${index + 1}`}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={`w-full max-h-[420px] object-contain border-2 border-current bg-black/5 transition-opacity duration-300 ease-in-out rounded-2xl ${isFading || !isLoaded ? 'opacity-0' : 'opacity-100'} ${!isLoaded ? 'absolute inset-0' : ''}`}
        />
      </div>
      {urls.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center border-2 border-white/50"
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            onClick={goNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center border-2 border-white/50"
            aria-label="Next image"
          >
            ›
          </button>
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
            {urls.map((_, dotIndex) => (
              <button
                key={dotIndex}
                onClick={() => goTo(dotIndex)}
                className={`w-2.5 h-2.5 rounded-full border ${dotIndex === index ? 'bg-white border-white' : 'bg-white/30 border-white/50'}`}
                aria-label={`Go to image ${dotIndex + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const HobbyCommunity: React.FC<HobbyCommunityProps> = ({ hobby, onBack, isDarkMode = false, currentUser = 'USER_1', userId }) => {
  const { hobbyName: hobbySlug } = useParams();
  const [joined, setJoined] = useState(false);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [attachments, setAttachments] = useState<Array<{ file: File; preview: string }>>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [resolvedUserId, setResolvedUserId] = useState<number | undefined>(userId);
  const [resolvedUsername, setResolvedUsername] = useState<string>(currentUser || 'USER_1');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newAttachments = Array.from(files).map((file: File) => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setAttachments(prev => [...prev, ...newAttachments]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const [posts, setPosts] = useState<Post[]>([]);
  const [postError, setPostError] = useState<string>('');

  // Recover user info from localStorage if not provided (handles refreshes/direct links)
  useEffect(() => {
    if (userId) {
      setResolvedUserId(userId);
    } else {
      const cached = localStorage.getItem('hobbyArcadeUser');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed?.user_id) {
            setResolvedUserId(parsed.user_id);
            if (parsed?.username) setResolvedUsername(parsed.username);
          }
        } catch (err) {
          console.warn('Failed to parse cached user', err);
          localStorage.removeItem('hobbyArcadeUser');
        }
      }
    }
    if (currentUser && currentUser !== resolvedUsername) {
      setResolvedUsername(currentUser);
    }
  }, [userId, currentUser, resolvedUsername]);

  const resolvedHobby = hobby || (hobbySlug ? getHobbyByName(hobbySlug.replace(/-/g, ' ')) : undefined);
  const communityId = resolvedHobby?.communityId;
  const displayHobbyName = resolvedHobby?.name || (hobbySlug ? hobbySlug.replace(/-/g, ' ') : 'HOBBY');

  // Load posts from database on mount or when hobby changes
  useEffect(() => {
    const loadPosts = async () => {
      try {
          if (!communityId) return;
          const response = await fetch(`http://localhost:3001/api/posts?community_id=${communityId}`);
        const data = await response.json();
        
        if (Array.isArray(data)) {
          const scopedPosts = data.filter((p: any) => p.community_id === communityId);
          const formattedPosts = scopedPosts.map((p: any) => {
            let parsedAttachments: string[] | undefined;
            if (p.image_urls) {
              if (Array.isArray(p.image_urls)) {
                parsedAttachments = p.image_urls;
              } else if (typeof p.image_urls === 'string') {
                try {
                  parsedAttachments = JSON.parse(p.image_urls);
                } catch (err) {
                  parsedAttachments = undefined;
                }
              }
            }

            return {
            id: p.post_id.toString(),
            author: p.username || 'Anonymous',
            title: p.title,
            content: p.content,
            upvotes: 0,
            timestamp: '',
            createdAt: p.created_at,
            attachments: parsedAttachments,
            comments: []
          };
          });
          setPosts(formattedPosts);
        }
      } catch (err) {
        console.error('Error loading posts:', err);
      }
    };

    loadPosts();
  }, [communityId]);

  const activePost = useMemo(() => posts.find(p => p.id === activePostId), [posts, activePostId]);

  const handleCreatePost = async () => {
    setPostError('');
    
    if (!newPostTitle.trim()) {
      setPostError('Title is required');
      return;
    }
    
    if (!resolvedUserId) {
      setPostError('User ID not found. Please login again.');
      return;
    }
    
    try {
        if (!communityId) {
          setPostError('Hobby not found. Please go back and select a hobby.');
          return;
        }

        const response = await fetch('http://localhost:3001/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: resolvedUserId,
            community_id: communityId,
          title: newPostTitle,
          content: newPostContent || 'No description'
        })
      });

      const data = await response.json();

      if (data.success) {
        let imageUrls: string[] = [];

        if (attachments.length > 0) {
          const formData = new FormData();
          attachments.forEach((att) => formData.append('photos', att.file));

          const uploadResponse = await fetch(`http://localhost:3001/api/uploads/posts?post_id=${data.post_id}`, {
            method: 'POST',
            body: formData
          });

          const uploadData = await uploadResponse.json();
          if (!uploadResponse.ok || !uploadData?.urls) {
            throw new Error(uploadData?.error || 'Failed to upload attachments');
          }

          imageUrls = uploadData.urls;

          await fetch(`http://localhost:3001/api/posts/${data.post_id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: resolvedUserId,
              title: newPostTitle,
              content: newPostContent || 'No description',
              image_urls: imageUrls
            })
          });
        }

        const newPost: Post = {
          id: data.post_id.toString(),
          author: resolvedUsername,
          title: newPostTitle,
          content: newPostContent,
          upvotes: 0,
          timestamp: '',
          createdAt: new Date().toISOString(),
          attachments: imageUrls.length > 0 ? imageUrls : undefined,
          comments: []
        };
        setPosts([newPost, ...posts]);
        resetModalState();
      } else {
        setPostError(data.error || 'Failed to create post');
      }
    } catch (err) {
      console.error('Error creating post:', err);
      setPostError('Network error. Could not create post.');
    }
  };

  const handleAddComment = async (postId: string, content: string, gifs?: string[]) => {
    if (!resolvedUserId) {
      setPostError('User ID not found. Please login again.');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:3001/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: resolvedUserId,
          post_id: postId,
          content
        })
      });

      const data = await response.json();

      if (data.success) {
        setPosts(prev => prev.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              comments: [...p.comments, {
                id: data.comment_id.toString(),
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
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleDeletePost = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post || post.author !== currentUser) {
      setPostError('You can only delete your own posts');
      return;
    }

    if (!resolvedUserId) {
      setPostError('User ID not found. Please login again.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: resolvedUserId
        })
      });

      const data = await response.json();

      if (data.success) {
        setPosts(prev => prev.filter(p => p.id !== postId));
        setActivePostId(null);
        setPostError('');
      } else {
        setPostError(data.error || 'Failed to delete post');
      }
    } catch (err) {
      console.error('Error deleting post:', err);
      setPostError('Network error. Could not delete post.');
    }
  };

  const handleEditPost = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post && post.author === currentUser) {
      setNewPostTitle(post.title);
      setNewPostContent(post.content);
      setEditingPostId(postId);
      setShowCreateModal(true);
      setActivePostId(null);
    }
  };

  const handleSaveEditedPost = async () => {
    if (!editingPostId || !newPostTitle.trim() || !newPostContent.trim()) {
      setPostError('Title and content are required');
      return;
    }

    if (!resolvedUserId) {
      setPostError('User ID not found. Please login again.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/posts/${editingPostId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: resolvedUserId,
          title: newPostTitle,
          content: newPostContent
        })
      });

      const data = await response.json();

      if (data.success) {
        setPosts(prev => prev.map(p => 
          p.id === editingPostId 
            ? { ...p, title: newPostTitle, content: newPostContent }
            : p
        ));
        resetModalState();
        setPostError('');
      } else {
        setPostError(data.error || 'Failed to update post');
      }
    } catch (err) {
      console.error('Error updating post:', err);
      setPostError('Network error. Could not update post.');
    }
  };

  const resetModalState = () => {
    setShowCreateModal(false);
    setNewPostTitle('');
    setNewPostContent('');
    setAttachments([]);
    setEditingPostId(null);
  };

  if (!resolvedHobby && !hobbySlug) return <div className="p-10 text-center font-press-start">SELECT A HOBBY FIRST</div>;

  return (
    <div className={`h-full flex flex-col transition-colors duration-500 ${isDarkMode ? 'bg-[#0f111a] text-sky-100' : 'bg-[#dae0e6] text-gray-900'} relative`}>
      
      {/* Header */}
      <div className={`sticky top-0 z-30 border-b-4 transition-colors duration-500 ${isDarkMode ? 'bg-[#1a1c27] border-indigo-900' : 'bg-white border-sky-800'}`}>
          <div className="flex items-center gap-4 p-4 max-w-5xl mx-auto w-full">
              <button onClick={onBack} className={`font-press-start text-[1.2vmin] px-4 py-2 border-2 ${isDarkMode ? 'border-pink-500 text-pink-500' : 'border-sky-800 text-sky-800'}`}>BACK</button>
              <div className="flex-1">
                  <h1 className="font-press-start text-[2vmin] uppercase">r/{displayHobbyName.replace(/\s+/g, '').toLowerCase()}</h1>
                  <p className={`mt-2 font-vt323 text-[1.8vmin] leading-snug ${isDarkMode ? 'text-indigo-200' : 'text-sky-700'}`}>
                    {resolvedHobby?.description || 'Explore posts and conversations in this hobby community.'}
                  </p>
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
                        <div className="flex-1 p-4">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`font-press-start text-[1.2vmin] ${post.author === currentUser ? 'text-yellow-400' : 'text-gray-400'}`}>u/{post.author}</h3>
                              {post.author === currentUser && <span className={`font-press-start text-[0.8vmin] px-2 py-1 rounded ${isDarkMode ? 'bg-yellow-600 text-white' : 'bg-yellow-300 text-gray-900'}`}>YOUR POST</span>}
                            </div>
                            <h2 className="font-press-start text-[1.8vmin] mb-2">{post.title}</h2>
                            <p className="font-vt323 text-xl mb-2 line-clamp-3">{post.content}</p>
                            {post.attachments && post.attachments.length > 0 && (
                              <AttachmentCarousel urls={post.attachments} className="mb-4" />
                            )}
                            <div className="flex gap-4 font-press-start text-[1vmin] opacity-70 items-center">
                              <span className="cursor-pointer hover:opacity-100" onClick={() => setActivePostId(post.id)}>💬 {post.comments.length} Comments</span>
                              {post.author === currentUser && (
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
                      <p className="font-vt323 text-lg leading-tight mb-4">{resolvedHobby?.description || 'Explore posts and conversations in this hobby community.'}</p>
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
                      <div className="flex-1">
                        <h2 className="font-press-start text-[2vmin] mb-2">{activePost.title}</h2>
                        <div className="flex items-center gap-2">
                          <span className={`font-press-start text-[1.2vmin] ${activePost.author === currentUser ? 'text-yellow-400' : 'text-gray-400'}`}>u/{activePost.author}</span>
                          {activePost.author === currentUser && <span className={`font-press-start text-[0.8vmin] px-2 py-1 rounded ${isDarkMode ? 'bg-yellow-600 text-white' : 'bg-yellow-300 text-gray-900'}`}>YOUR POST</span>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                          {activePost.author === currentUser && (
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
                  {activePost.attachments && activePost.attachments.length > 0 && (
                    <AttachmentCarousel urls={activePost.attachments} className="mb-2" />
                  )}

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
                  {postError && (
                    <div className="p-3 bg-red-500 text-white font-vt323 text-xl border-4 border-red-700">
                      {postError}
                    </div>
                  )}
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
                        <input type="file" ref={fileInputRef} hidden multiple onChange={handleFileChange} accept="image/*" />
                        {attachments.length > 0 && (
                          <div className="flex gap-2 flex-wrap">
                            {attachments.map((att, index) => (
                              <div key={index} className="relative">
                                <img src={att.preview} alt={`Attachment ${index + 1}`} className="w-16 h-16 object-cover border-2" />
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