import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Comment, Post } from '../types';
import ArcadeButton from './ui/ArcadeButton';

interface PostPageProps {
  isDarkMode?: boolean;
  currentUser?: string;
  userId?: number;
}

const API_BASE_URL = 'http://localhost:3001';

const DEFAULT_EMOJIS = [
  '😀','😃','😄','😁','😆','😅','😂','🤣','😊','😇','🙂','😉',
  '😍','😘','😜','🤪','😎','🥳','🤩','😴','🤔','🫡','😤','😭',
  '😮','😱','😬','😷','🤒','🤕','🥶','🥵','🤗','🙃','😵‍💫', '😡',
  '🙌','👏','🫶','🙏','🤝','👍','👎','💪','✌️','🤘','👌','🤙',
  '🔥','✨','💥','💫','🌟','🌈','⚡','☀️','🌙','🌧️','❄️','🌊',
  '❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💖','💘','💯',
  '🎉','🎊','🎈','🎁','🎂','🎯','🏆','🏅','🎮','🎨','🎵','🎬',
  '📌','📣','📢','📷','📸','🧠','💡','📚','✏️','📝','🧩','🛠️',
  '🚀','🛸','🏝️','🗺️','🍀','🌸','🌻','🍕','🍔','🍟','🍣','☕',
  '🍩','🍪','🍰','🍫','🍿','🥤','🧋','🍹','🍺','🥂','🍎','🍉',
  '🍓','🍒','🍇','🍍','🥑','🥦','🥕','🌽','🌮','🌯','🥗',
  '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐸',
  '🐵','🐥','🐧','🐦','🦄','🐢','🐠','🐬','🦋','🐝','🌼','🌺',
  '🏀','⚽','🏈','⚾','🎾','🏐','🏓','🎳','🛼','🚴','🏃','🧘',
  '⌛','⏰','📍','🧭','🧳','🎒','🛍️','🎧','📱','💻','🖥️','🖱️',
  '🔮','🧿','💎','🪄','🧸','🪅','🪩','🎀','🧵','🧶','🧷','🪡',
  '✅','❌','⚠️','❗','❓','➕','➖','➗','✖️','🔔','🔒','🔑'
];

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
          loading="eager"
          decoding="async"
          fetchPriority="high"
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

const CommentInput: React.FC<{ onAdd: (content: string, gifs?: string[]) => void; isDarkMode: boolean; emojis: string[]; gifs: string[] }> = ({ onAdd, isDarkMode, emojis, gifs }) => {
  const [text, setText] = useState('');
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [activeTab, setActiveTab] = useState<'emoji' | 'gif'>('emoji');
  const [mediaSearch, setMediaSearch] = useState('');
  const [selectedGifs, setSelectedGifs] = useState<string[]>([]);

  const handleAddEmoji = (emoji: string) => {
    setText(prev => `${prev}${emoji}`);
  };

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
        onChange={(e) => setText(e.target.value)}
        className={`p-3 font-vt323 text-xl border-4 ${isDarkMode ? 'bg-slate-900 border-indigo-900 text-white' : 'bg-gray-50 border-gray-300'}`}
        rows={3}
        placeholder="Write a comment..."
      />
      <div className="flex items-center justify-between gap-3">
        <div className="relative inline-block">
          <button
            onClick={() => setShowMediaPicker(!showMediaPicker)}
            className={`font-press-start text-[1vmin] px-3 py-2 border-2 ${isDarkMode ? 'bg-indigo-950 border-indigo-800 text-indigo-100' : 'bg-gray-100 border-gray-300 text-gray-800'}`}
          >
            MEDIA ({selectedGifs.length})
          </button>
          {showMediaPicker && (
            <div className={`absolute z-20 mt-3 p-3 border-2 w-80 max-h-64 overflow-y-auto shadow-lg ${isDarkMode ? 'bg-[#0f111a] border-indigo-900' : 'bg-white border-gray-300'}`}>
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => setActiveTab('emoji')}
                  className={`px-3 py-1 border-2 text-xs ${activeTab === 'emoji' ? 'bg-green-500 text-white border-green-700' : isDarkMode ? 'bg-slate-900 border-indigo-800 text-indigo-100' : 'bg-gray-100 border-gray-300 text-gray-800'}`}
                >
                  Emoji
                </button>
                <button
                  onClick={() => setActiveTab('gif')}
                  className={`px-3 py-1 border-2 text-xs ${activeTab === 'gif' ? 'bg-green-500 text-white border-green-700' : isDarkMode ? 'bg-slate-900 border-indigo-800 text-indigo-100' : 'bg-gray-100 border-gray-300 text-gray-800'}`}
                >
                  GIFs
                </button>
                <input
                  value={mediaSearch}
                  onChange={(e) => setMediaSearch(e.target.value)}
                  placeholder="Search"
                  className={`ml-auto px-2 py-1 text-xs border-2 w-32 ${isDarkMode ? 'bg-slate-900 border-indigo-900 text-white' : 'bg-gray-50 border-gray-300'}`}
                />
              </div>

              {activeTab === 'emoji' ? (
                <div className="grid grid-cols-5 gap-2">
                  {emojis
                    .filter((emoji) => !mediaSearch || emoji.includes(mediaSearch))
                    .map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleAddEmoji(emoji)}
                        className="text-2xl hover:scale-110 transition"
                        aria-label={`Insert ${emoji}`}
                      >
                        {emoji}
                      </button>
                    ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {gifs
                    .filter((gif) => !mediaSearch || gif.toLowerCase().includes(mediaSearch.toLowerCase()))
                    .map((gif) => (
                      <button
                        key={gif}
                        onClick={() => toggleGif(gif)}
                        className={`border-2 ${selectedGifs.includes(gif) ? 'border-green-400' : 'border-transparent'} rounded`}
                      >
                        <img src={gif} alt="gif" className="w-full h-20 object-cover" />
                      </button>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
        <button
          onClick={() => {
            if (text.trim()) {
              onAdd(text.trim(), selectedGifs);
              setText('');
              setShowMediaPicker(false);
              setMediaSearch('');
              setActiveTab('emoji');
              setSelectedGifs([]);
            }
          }}
          className={`px-4 py-2 border-2 ${isDarkMode ? 'bg-green-600 border-green-900 text-white' : 'bg-green-400 border-green-700'}`}
        >
          Comment
        </button>
      </div>
    </div>
  );
};

const PostPage: React.FC<PostPageProps> = ({ isDarkMode = false, currentUser = 'USER_1', userId }) => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string>('');
  const [emojiOptions, setEmojiOptions] = useState<string[]>(DEFAULT_EMOJIS);
  const [gifOptions, setGifOptions] = useState<string[]>(PIXEL_GIFS);
  const [resolvedUserId, setResolvedUserId] = useState<number | undefined>(userId);
  const [resolvedUsername, setResolvedUsername] = useState<string>(currentUser || 'USER_1');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [editingCommentGifs, setEditingCommentGifs] = useState<string[]>([]);
  const [showEditGifs, setShowEditGifs] = useState(false);
  const [editingPost, setEditingPost] = useState(false);
  const [editingPostTitle, setEditingPostTitle] = useState('');
  const [editingPostContent, setEditingPostContent] = useState('');

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

  useEffect(() => {
    const loadMediaCatalogs = async () => {
      try {
        const [emojiRes, gifRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/media/emojis`),
          fetch(`${API_BASE_URL}/api/media/gifs`)
        ]);

        if (emojiRes.ok) {
          const emojiData = await emojiRes.json();
          if (Array.isArray(emojiData?.emojis) && emojiData.emojis.length) {
            setEmojiOptions(emojiData.emojis);
          }
        }

        if (gifRes.ok) {
          const gifData = await gifRes.json();
          if (Array.isArray(gifData?.gifs) && gifData.gifs.length) {
            setGifOptions(gifData.gifs);
          }
        }
      } catch (err) {
        // keep defaults
      }
    };

    loadMediaCatalogs();
  }, []);

  useEffect(() => {
    const loadPost = async () => {
      try {
        if (!postId) return;
        const response = await fetch(`http://localhost:3001/api/posts/${postId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load post');
        }

        let parsedAttachments: string[] | undefined;
        if (data.image_urls) {
          if (Array.isArray(data.image_urls)) {
            parsedAttachments = data.image_urls;
          } else if (typeof data.image_urls === 'string') {
            try {
              parsedAttachments = JSON.parse(data.image_urls);
            } catch (err) {
              parsedAttachments = undefined;
            }
          }
        }

        const formattedPost: Post = {
          id: data.post_id.toString(),
          author: data.username || 'Anonymous',
          title: data.title,
          content: data.content,
          upvotes: 0,
          comments: [],
          timestamp: '',
          attachments: parsedAttachments
        };

        setPost(formattedPost);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load post');
      }
    };

    loadPost();
  }, [postId]);

  useEffect(() => {
    const loadComments = async () => {
      try {
        if (!postId) return;
        const response = await fetch(`http://localhost:3001/api/comments/post/${postId}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to load comments');
        }
        if (Array.isArray(data)) {
          const formatted = data.map((c: any) => ({
            id: c.comment_id.toString(),
            author: c.username || 'Anonymous',
            content: c.content,
            gifs: Array.isArray(c.gifs)
              ? c.gifs
              : typeof c.gifs === 'string'
                ? (() => {
                    try {
                      return JSON.parse(c.gifs);
                    } catch (err) {
                      return [];
                    }
                  })()
                : [],
            timestamp: new Date(c.created_at).toLocaleDateString(),
            upvotes: 0
          }));
          setComments(formatted);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load comments');
      }
    };

    loadComments();
  }, [postId]);

  const handleAddComment = async (content: string, gifs?: string[]) => {
    if (!resolvedUserId || !postId) return;

    try {
      const response = await fetch('http://localhost:3001/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: resolvedUserId,
          post_id: postId,
          content,
          gifs
        })
      });

    const data = await response.json();
    if (data.success) {
        setComments(prev => [
          {
            id: data.comment_id.toString(),
            author: resolvedUsername,
            content,
            gifs,
            timestamp: 'Just now',
            upvotes: 0
          },
          ...prev
        ]);
      }
    } catch (err) {
      setError('Failed to add comment');
    }
  };

  const handleStartEditComment = (commentId: string, content: string, gifs?: string[]) => {
    setEditingCommentId(commentId);
    setEditingCommentText(content);
    setEditingCommentGifs(gifs || []);
    setShowEditGifs(false);
  };

  const handleCancelEditComment = () => {
    setEditingCommentId(null);
    setEditingCommentText('');
    setEditingCommentGifs([]);
    setShowEditGifs(false);
  };

  const handleSaveComment = async (commentId: string) => {
    if (!resolvedUserId) return;

    try {
      const updateResponse = await fetch(`http://localhost:3001/api/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: resolvedUserId,
          content: editingCommentText,
          gifs: editingCommentGifs
        })
      });
      const data = await updateResponse.json();
      if (data.success) {
        setComments(prev => prev.map(c => c.id === commentId ? { ...c, content: editingCommentText, gifs: editingCommentGifs } : c));
        handleCancelEditComment();
      }
    } catch (err) {
      setError('Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!resolvedUserId) return;

    try {
      const response = await fetch(`http://localhost:3001/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: resolvedUserId
        })
      });

      const data = await response.json();
      if (data.success) {
        setComments(prev => prev.filter(c => c.id !== commentId));
      }
    } catch (err) {
      setError('Failed to delete comment');
    }
  };

  const canEditComment = (comment: Comment) => comment.author === resolvedUsername || comment.author === currentUser;
  const canEditPost = post && (post.author === resolvedUsername || post.author === currentUser);

  const handleStartEditPost = () => {
    if (!post) return;
    setEditingPost(true);
    setEditingPostTitle(post.title);
    setEditingPostContent(post.content);
  };

  const handleCancelEditPost = () => {
    setEditingPost(false);
    setEditingPostTitle('');
    setEditingPostContent('');
  };

  const handleSavePost = async () => {
    if (!resolvedUserId || !postId) return;
    if (!editingPostTitle.trim() || !editingPostContent.trim()) return;

    try {
      const response = await fetch(`http://localhost:3001/api/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: resolvedUserId,
          title: editingPostTitle.trim(),
          content: editingPostContent.trim()
        })
      });

      const data = await response.json();
      if (data.success) {
        setPost(prev => prev ? { ...prev, title: editingPostTitle.trim(), content: editingPostContent.trim() } : prev);
        handleCancelEditPost();
      } else {
        setError(data.error || 'Failed to update post');
      }
    } catch (err) {
      setError('Failed to update post');
    }
  };

  const commentCount = useMemo(() => comments.length, [comments]);

  if (!postId) {
    return (
      <div className="p-10 text-center font-press-start">POST NOT FOUND</div>
    );
  }

  return (
    <div className={`h-full flex flex-col transition-colors duration-500 ${isDarkMode ? 'bg-[#0f111a] text-sky-100' : 'bg-[#f7f7fb] text-gray-900'} relative`}>
      <div className="sticky top-0 z-30">
        <div className={`flex items-center gap-4 px-5 py-4 max-w-5xl mx-auto w-full ${isDarkMode ? 'text-sky-100' : 'text-gray-800'}`}>
          <button
            onClick={() => navigate(-1)}
            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${isDarkMode ? 'border-indigo-700 text-indigo-200' : 'border-gray-300 text-gray-700'}`}
            aria-label="Back"
          >
            ←
          </button>
          <div className="flex-1">
            <div className={`font-press-start text-[1.4vmin] uppercase ${isDarkMode ? 'text-indigo-200' : 'text-gray-600'}`}>
              r/community
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto w-full py-6 px-4 flex flex-col gap-6">
          {error && (
            <div className="p-3 bg-red-500 text-white font-vt323 text-xl border-4 border-red-700">
              {error}
            </div>
          )}

          {post && (
            <div className={`p-4 ${isDarkMode ? 'text-sky-100' : 'text-gray-900'}`}>
              <div className="flex items-center gap-2 text-sm mb-2">
                <span className={`font-press-start text-[1.2vmin] ${post.author === currentUser ? 'text-yellow-400' : 'text-gray-500'}`}>u/{post.author}</span>
                {canEditPost && !editingPost && (
                  <button
                    onClick={handleStartEditPost}
                    className="ml-2 text-yellow-400 hover:opacity-80"
                    title="Edit post"
                  >
                    ✏️
                  </button>
                )}
              </div>
              {editingPost ? (
                <div className="flex flex-col gap-3">
                  <input
                    value={editingPostTitle}
                    onChange={(e) => setEditingPostTitle(e.target.value)}
                    className={`p-3 font-press-start text-[2vmin] border-2 ${isDarkMode ? 'bg-slate-900 border-indigo-900 text-white' : 'bg-gray-50 border-gray-300'}`}
                  />
                  <textarea
                    rows={4}
                    value={editingPostContent}
                    onChange={(e) => setEditingPostContent(e.target.value)}
                    className={`p-3 font-vt323 text-2xl border-2 ${isDarkMode ? 'bg-slate-900 border-indigo-900 text-white' : 'bg-gray-50 border-gray-300'}`}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSavePost}
                      className={`px-3 py-1 border-2 ${isDarkMode ? 'bg-green-600 border-green-900 text-white' : 'bg-green-400 border-green-700'}`}
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEditPost}
                      className={`px-3 py-1 border-2 ${isDarkMode ? 'bg-gray-600 border-gray-900 text-white' : 'bg-gray-300 border-gray-500'}`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="font-press-start text-[3.2vmin] md:text-[2.6vmin] mb-3">{post.title}</h2>
                  <p className="font-vt323 text-2xl mb-5">{post.content}</p>
                </>
              )}
              {post.attachments && post.attachments.length > 0 && (
                <AttachmentCarousel urls={post.attachments} className="mb-6" />
              )}
            </div>
          )}

          <div className={`border-2 p-4 ${isDarkMode ? 'bg-[#1a1c27] border-indigo-950' : 'bg-white border-gray-300'}`}>
            <h3 className="font-press-start text-[1.2vmin] border-b-2 mb-4">COMMENTS</h3>
            <CommentInput onAdd={handleAddComment} isDarkMode={isDarkMode} emojis={emojiOptions} gifs={gifOptions} />
            <div className="flex flex-col gap-6 mt-8">
              {comments.map((c) => (
                <div key={c.id} className="flex gap-4 border-l-4 pl-4 border-gray-400">
                  <div className="flex-1">
                    <div className="flex gap-2 font-vt323 text-lg opacity-60 mb-1 items-center">
                      <span>u/{c.author}</span>
                      <span>•</span>
                      <span>{c.timestamp}</span>
                      {canEditComment(c) && (
                        <button
                          onClick={() => handleStartEditComment(c.id, c.content, c.gifs)}
                          className="ml-2 text-yellow-400 hover:opacity-80"
                          title="Edit comment"
                        >
                          ✏️
                        </button>
                      )}
                      {canEditComment(c) && (
                        <button
                          onClick={() => handleDeleteComment(c.id)}
                          className="ml-2 text-red-400 hover:opacity-80"
                          title="Delete comment"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                    {editingCommentId === c.id ? (
                      <div className="flex flex-col gap-2">
                        <textarea
                          value={editingCommentText}
                          onChange={(e) => setEditingCommentText(e.target.value)}
                          className={`p-2 font-vt323 text-xl border-2 ${isDarkMode ? 'bg-slate-900 border-indigo-900 text-white' : 'bg-gray-50 border-gray-300'}`}
                        />
                        <div className="relative inline-block">
                          <button
                            onClick={() => setShowEditGifs(!showEditGifs)}
                            className={`font-press-start text-[1vmin] px-3 py-2 border-2 ${isDarkMode ? 'bg-indigo-950 border-indigo-800 text-indigo-100' : 'bg-gray-100 border-gray-300 text-gray-800'}`}
                          >
                            GIF ({editingCommentGifs.length})
                          </button>
                          {showEditGifs && (
                            <div className={`absolute z-20 mt-3 p-3 border-2 w-72 max-h-52 overflow-y-auto shadow-lg ${isDarkMode ? 'bg-[#0f111a] border-indigo-900' : 'bg-white border-gray-300'}`}>
                              <div className="grid grid-cols-2 gap-2">
                                {gifOptions.map((gif) => (
                                  <button
                                    key={gif}
                                    onClick={() => setEditingCommentGifs(prev => prev.includes(gif) ? prev.filter(g => g !== gif) : [...prev, gif])}
                                    className={`border-2 ${editingCommentGifs.includes(gif) ? 'border-green-400' : 'border-transparent'} rounded`}
                                  >
                                    <img src={gif} alt="gif" className="w-full h-20 object-cover" />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveComment(c.id)}
                            className={`px-3 py-1 border-2 ${isDarkMode ? 'bg-green-600 border-green-900 text-white' : 'bg-green-400 border-green-700'}`}
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEditComment}
                            className={`px-3 py-1 border-2 ${isDarkMode ? 'bg-gray-600 border-gray-900 text-white' : 'bg-gray-300 border-gray-500'}`}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <p className="font-vt323 text-xl">{c.content}</p>
                        {c.gifs && c.gifs.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {c.gifs.map((gif, index) => (
                              <img
                                key={`${gif}-${index}`}
                                src={gif}
                                alt="comment gif"
                                className="w-full h-28 object-cover border-2 border-current"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={`py-6 flex justify-center border-t-8 transition-colors duration-500 ${isDarkMode ? 'bg-black/80 border-indigo-950' : 'bg-black/60 border-sky-900'}`}>
        <ArcadeButton onClick={() => navigate(-1)}>BACK TO COMMUNITY</ArcadeButton>
      </div>
    </div>
  );
};

export default PostPage;
