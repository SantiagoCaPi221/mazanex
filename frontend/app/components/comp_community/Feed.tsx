"use client";

import { useState, useEffect, useRef } from "react";
import { useUserStore } from "@/app/store/useUserStore";
import { publicationService } from "@/app/clients/publicationService";
import { Heart, MessageSquare, Send, Image as ImageIcon, Smile, Trash2, AlertTriangle, X } from "lucide-react";

// Componente helper para manejar avatares uniformemente
const Avatar = ({ url, name, className = "w-12 h-12" }: { url?: string, name?: string, className?: string }) => {
  return url ? (
    <img src={url} className={`${className} rounded-full object-cover border border-slate-700`} alt={name} />
  ) : (
    <div className={`${className} rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 text-sm`}>
      {name?.substring(0, 2).toUpperCase() || "??"}
    </div>
  );
};

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
  const emojiMenuRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  
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

  // 🔥 NUEVO: Lógica para cerrar emojis al clickear afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Si el click no es dentro del menú de emojis NI en el botón que lo abre
      if (
        emojiMenuRef.current && 
        !emojiMenuRef.current.contains(event.target as Node) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target as Node)
      ) {
        setShowEmojis(false);
      }
    };

    if (showEmojis) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojis]);

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
      authorAvatar: currentUser.avatarUrl
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
      {/* Modal de confirmación de borrado */}
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

      {/* Caja de Nueva Publicación */}
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 backdrop-blur-sm relative z-20">
        <div className="flex gap-4">
          <Avatar url={currentUser?.avatarUrl} name={currentUser?.name} />

          <div className="flex-1 space-y-4">
            <textarea
              placeholder="¿Qué está pasando en Mazanex?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="w-full bg-transparent border-none outline-none resize-none text-white placeholder-slate-500 font-medium"
              rows={3}
            />
            
            {/* 🔥 CONTENEDOR RELATIVO PARA EMOJIS */}
            <div className="relative">
              {showEmojis && (
                <div 
                  ref={emojiMenuRef}
                  className="absolute top-0 left-0 w-full sm:w-96 bg-slate-900 border border-indigo-500/30 rounded-xl p-2 grid grid-cols-8 gap-1 z-[60] shadow-2xl max-h-60 overflow-y-auto"
                >
                  {quickEmojis.map(e => (
                    <button key={e} onClick={() => addEmoji(e)} className="hover:bg-indigo-500/20 p-1 rounded text-lg">{e}</button>
                  ))}
                </div>
              )}
            </div>

            {selectedImage && (
              <div className="relative w-fit mt-2">
                <img src={selectedImage} alt="Preview" className="h-32 rounded-xl object-cover border border-white/10" />
                <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-rose-500 text-white p-1 rounded-full hover:bg-rose-600 shadow-lg">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex justify-between items-center border-t border-white/5 pt-4 relative">
              <div className="flex gap-2">
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageSelect} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="text-slate-500 hover:text-indigo-400 transition-colors p-2 rounded-full hover:bg-white/5">
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button 
                  ref={emojiButtonRef}
                  onClick={() => setShowEmojis(!showEmojis)} 
                  className={`transition-colors p-2 rounded-full ${showEmojis ? 'text-indigo-400 bg-white/5' : 'text-slate-500 hover:text-indigo-400 hover:bg-white/5'}`}
                >
                  <Smile className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={handleCreatePost}
                disabled={!newPostContent.trim() && !selectedImage}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-2 rounded-xl font-bold tracking-wide flex items-center gap-2 transition-all"
              >
                PUBLICAR <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Muro */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 backdrop-blur-sm group relative z-10">
            <div className="flex gap-4">
              <Avatar 
                url={post.authorId === currentUser?.id ? currentUser?.avatarUrl : post.authorAvatar} 
                name={post.authorName} 
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="font-bold text-white block">{post.authorName}</span>
                    <span className="text-xs text-slate-500 uppercase">{new Date(post.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                  {currentUser?.id && post.authorId === currentUser.id && (
                    <button onClick={() => setPostToDelete(post.id)} className="text-slate-600 hover:text-rose-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <p className="text-slate-300 mb-4">{post.content}</p>
                {post.mediaUrl && <img src={post.mediaUrl} alt="Contenido" className="rounded-2xl max-h-96 object-cover mb-4" />}

                <div className="flex items-center gap-6 text-slate-500">
                  <button onClick={() => handleLike(post.id)} className={`flex items-center gap-2 font-bold ${post.isLiked ? "text-rose-500" : ""}`}>
                    <Heart className={`w-5 h-5 ${post.isLiked ? "fill-rose-500" : ""}`} /> {post.likes || 0}
                  </button>
                  <button onClick={() => toggleComments(post.id)} className="flex items-center gap-2 font-bold hover:text-indigo-400">
                    <MessageSquare className="w-5 h-5" /> {post.comments?.length || 0}
                  </button>
                </div>

                {expandedPostId === post.id && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-4">
                    {post.comments?.map((comment: any, idx: number) => (
                      <div key={idx} className="bg-white/5 rounded-xl p-3 flex gap-3 text-sm">
                        <Avatar url={undefined} name={comment.authorName} className="w-8 h-8" />
                        <div>
                          <span className="font-bold text-white block">{comment.authorName}</span>
                          <p className="text-slate-300">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none"
                      />
                      <button onClick={() => handleAddComment(post.id)} className="bg-indigo-600 text-white px-4 py-2 rounded-xl"><Send className="w-4 h-4" /></button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}