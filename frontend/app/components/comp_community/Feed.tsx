"use client";

import { useState, useEffect, useRef } from "react";
import { useUserStore } from "@/app/store/useUserStore";
import { publicationService } from "@/app/clients/publicationService";
import { Heart, MessageSquare, Send, Image as ImageIcon, Smile, Trash2, AlertTriangle, X } from "lucide-react";

export function Feed() {
  const { user: rawUser, showNotification } = useUserStore();
  const currentUser = rawUser?.user || rawUser;

  const [posts, setPosts] = useState<any[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [showEmojis, setShowEmojis] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
  const [commentContent, setCommentContent] = useState("");

  const quickEmojis = [
    "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "🥲", "☺️", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", 
    "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🥸", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", 
    "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", 
    "😥", "😓", "🤗", "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", 
    "😪", "😵", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👿", "👹", "👺", "🤡", "💩", "👻", "💀", 
    "👽", "👾", "🤖",
    "👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍", 
    "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "💪", "🦾", "🧠", "🫀", "🫁", "👀",
    "🎮", "🕹️", "🎲", "🧩", "🏆", "🥇", "🥈", "🥉", "🏅", "🎖️", "🎯", "🔮", "🪄", "🚀", "🛸", "🌍", "🌙", "⭐", "✨", "⚡", 
    "🔥", "💥", "💯", "🎵", "🎶", "🎧", "💻", "🖥️", "📱", "⚔️", "🛡️", "🗡️", "💣", "🧨", "🔫", "🩸", "🍔", "🍕", "🍟", "🍺"
  ];

  const loadFeed = async () => {
    setLoading(true);
    const data = await publicationService.getFeed();
    
    const adaptedPosts = (data || []).map((post: any) => {
      const likedByList = Array.isArray(post.likedBy) ? post.likedBy : [];
      return {
        ...post,
        likes: likedByList.length,
        isLiked: currentUser?.id ? likedByList.includes(currentUser.id) : false
      };
    });

    setPosts(adaptedPosts);
    setLoading(false);
  };

  useEffect(() => {
    loadFeed();
  }, [currentUser?.id]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = async () => {
    if ((!newPostContent.trim() && !selectedImage) || !currentUser?.id) return;

    const result = await publicationService.createPublication({
      authorId: currentUser.id,
      content: newPostContent,
      authorName: currentUser.name || "Usuario",
      mediaUrl: selectedImage,
    });

    if (result) {
      setNewPostContent("");
      setSelectedImage(null);
      setShowEmojis(false);
      showNotification("Publicación creada", "success");
      loadFeed();
    } else {
      showNotification("Error al publicar", "error");
    }
  };

  const executeDelete = async () => {
    if (!postToDelete || !currentUser?.id) return;

    const success = await publicationService.deletePublication(postToDelete, currentUser.id);
    if (success) {
      setPosts(posts.filter(post => post.id !== postToDelete));
      showNotification("Publicación eliminada", "success");
    } else {
      showNotification("No se pudo eliminar la publicación", "error");
    }
    setPostToDelete(null);
  };

  const handleLike = async (postId: number) => {
    if (!currentUser?.id) return;
    
    const success = await publicationService.toggleLike(postId, currentUser.id);
    
    if (success) {
      setPosts(
        posts.map((post) => {
          if (post.id === postId) {
            const currentLikes = typeof post.likes === 'number' ? post.likes : 0;
            return {
              ...post,
              likes: post.isLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1,
              isLiked: !post.isLiked,
            };
          }
          return post;
        })
      );
    }
  };

  const toggleComments = (postId: number) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
    } else {
      setExpandedPostId(postId);
      setCommentContent("");
    }
  };

  const handleAddComment = async (postId: number) => {
    if (!commentContent.trim() || !currentUser?.id) return;

    const result = await publicationService.addComment(postId, {
      authorId: currentUser.id,
      authorName: currentUser.name || "Usuario",
      content: commentContent,
    });

    if (result) {
      setCommentContent("");
      showNotification("Comentario añadido", "success");
      loadFeed();
    } else {
      showNotification("Error al comentar", "error");
    }
  };

  const addEmoji = (emoji: string) => {
    setNewPostContent(prev => prev + emoji);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {postToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-500">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">Eliminar publicación</h3>
            </div>
            <p className="text-slate-400 mb-6 font-medium">
              ¿Estás seguro de que quieres eliminar esto? Esta acción no se puede deshacer y desaparecerá del muro.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setPostToDelete(null)}
                className="px-4 py-2 rounded-xl font-bold text-slate-300 hover:bg-white/5 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={executeDelete}
                className="px-4 py-2 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors shadow-lg shadow-rose-600/20"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 backdrop-blur-sm relative z-20">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-indigo-500/20 rounded-full border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-300 shrink-0">
            {currentUser?.name?.substring(0, 2).toUpperCase() || "ME"}
          </div>
          <div className="flex-1 space-y-4">
            <textarea
              placeholder="¿Qué está pasando en Mazanex?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="w-full bg-transparent border-none outline-none resize-none text-white placeholder-slate-500 font-medium"
              rows={3}
            />

            {selectedImage && (
              <div className="relative w-fit">
                <img src={selectedImage} alt="Preview" className="h-32 rounded-xl object-cover border border-white/10" />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-2 -right-2 bg-rose-500 text-white p-1 rounded-full hover:bg-rose-600 shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex justify-between items-center border-t border-white/5 pt-4 relative">
              <div className="flex gap-2">
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  onChange={handleImageSelect} 
                  className="hidden" 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-slate-500 hover:text-indigo-400 transition-colors p-2 rounded-full hover:bg-white/5"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
                
                <button 
                  onClick={() => setShowEmojis(!showEmojis)}
                  className={`transition-colors p-2 rounded-full ${showEmojis ? 'text-indigo-400 bg-white/5' : 'text-slate-500 hover:text-indigo-400 hover:bg-white/5'}`}
                >
                  <Smile className="w-5 h-5" />
                </button>

                {showEmojis && (
                  <div className="absolute top-12 left-0 bg-slate-900 border border-white/10 rounded-xl p-3 shadow-2xl z-50 grid grid-cols-8 gap-1 w-[320px] max-h-[250px] overflow-y-auto animate-in fade-in slide-in-from-top-2">
                    {quickEmojis.map((emoji, index) => (
                      <button 
                        key={index}
                        onClick={() => addEmoji(emoji)}
                        className="hover:bg-white/10 p-1.5 rounded-lg text-xl transition-colors flex items-center justify-center hover:scale-110"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleCreatePost}
                disabled={!newPostContent.trim() && !selectedImage}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold tracking-wide flex items-center gap-2 transition-all"
              >
                PUBLICAR <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-10 text-slate-500 font-bold uppercase tracking-widest text-sm">
            No hay publicaciones aún. ¡Sé el primero!
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 backdrop-blur-sm transition-all hover:bg-white/[0.03] group relative z-10"
            >
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center font-bold text-slate-300 shrink-0">
                  {post.authorName?.substring(0, 2).toUpperCase() || "??"}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-bold text-white block truncate">
                        {post.authorName}
                      </span>
                      <span className="text-xs font-bold text-slate-500 uppercase">
                        {new Date(post.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>

                    {currentUser?.id && post.authorId === currentUser.id && (
                      <button 
                        onClick={() => setPostToDelete(post.id)}
                        className="text-slate-600 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"
                        title="Eliminar mi publicación"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <p className="text-slate-300 mb-4 break-words whitespace-pre-wrap">{post.content}</p>
                  
                  {post.mediaUrl && (
                    <img src={post.mediaUrl} alt="Contenido" className="rounded-2xl max-h-96 object-cover border border-white/5 mb-4" />
                  )}

                  <div className="flex items-center gap-6 text-slate-500">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-2 font-bold transition-colors ${
                        post.isLiked ? "text-rose-500" : "hover:text-rose-400"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${post.isLiked ? "fill-rose-500" : ""}`}
                      />
                      {post.likes || 0}
                    </button>
                    <button 
                      onClick={() => toggleComments(post.id)}
                      className={`flex items-center gap-2 font-bold transition-colors ${expandedPostId === post.id ? 'text-indigo-400' : 'hover:text-indigo-400'}`}
                    >
                      <MessageSquare className="w-5 h-5" />
                      {post.comments?.length || 0}
                    </button>
                  </div>

                  {expandedPostId === post.id && (
                    <div className="mt-4 pt-4 border-t border-white/5 space-y-4">
                      <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        {post.comments?.map((comment: any, idx: number) => (
                          <div key={idx} className="bg-white/5 rounded-xl p-3">
                            <span className="font-bold text-white text-sm">{comment.authorName}</span>
                            <p className="text-slate-300 text-sm mt-1">{comment.content}</p>
                          </div>
                        ))}
                        {(!post.comments || post.comments.length === 0) && (
                          <p className="text-slate-500 text-sm italic">No hay comentarios aún.</p>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={commentContent}
                          onChange={(e) => setCommentContent(e.target.value)}
                          placeholder="Escribe un comentario..."
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-indigo-500 transition-colors"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddComment(post.id);
                          }}
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          disabled={!commentContent.trim()}
                          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2 rounded-xl flex items-center justify-center transition-colors"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}