"use client";

import { useState, useEffect } from "react";
import { useUserStore } from "@/app/store/useUserStore";
import { publicationService } from "@/app/clients/publicationService";
import { Heart, MessageSquare, Send, Image as ImageIcon, Smile, Trash2, AlertTriangle } from "lucide-react";

export function Feed() {
  const { user, showNotification } = useUserStore();
  const [posts, setPosts] = useState<any[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [showEmojis, setShowEmojis] = useState(false);
  
  // Nuevo estado para controlar qué post se va a eliminar y mostrar el modal
  const [postToDelete, setPostToDelete] = useState<number | null>(null);

  // El arsenal masivo de emojis
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

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    setLoading(true);
    const data = await publicationService.getFeed();
    setPosts(data || []);
    setLoading(false);
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() || !user) return;

    const result = await publicationService.createPublication({
      authorId: user.id,
      content: newPostContent,
      authorName: user.name,
    });

    if (result) {
      setNewPostContent("");
      setShowEmojis(false);
      showNotification("¡Publicación creada!", "success");
      loadFeed();
    } else {
      showNotification("Error al publicar", "error");
    }
  };

  // Función que se ejecuta al confirmar en el modal
  const executeDelete = async () => {
    if (!postToDelete) return;

    const success = await publicationService.deletePublication(postToDelete);
    if (success) {
      setPosts(posts.filter(post => post.id !== postToDelete));
      showNotification("Publicación eliminada", "success");
    } else {
      showNotification("No se pudo eliminar la publicación", "error");
    }
    setPostToDelete(null); // Cerramos el modal
  };

  const handleLike = async (postId: number) => {
    if (!user) return;
    
    const success = await publicationService.toggleLike(postId, user.id);
    
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
      {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
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

      {/* CAJA PARA CREAR PUBLICACIÓN */}
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 backdrop-blur-sm relative z-20">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-indigo-500/20 rounded-full border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-300">
            {user?.name?.substring(0, 2).toUpperCase() || "ME"}
          </div>
          <div className="flex-1 space-y-4">
            <textarea
              placeholder="¿Qué está pasando en Mazanex?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="w-full bg-transparent border-none outline-none resize-none text-white placeholder-slate-500 font-medium"
              rows={3}
            />
            <div className="flex justify-between items-center border-t border-white/5 pt-4 relative">
              
              {/* Botones de Imagen y Emoji */}
              <div className="flex gap-2">
                <button className="text-slate-500 hover:text-indigo-400 transition-colors p-2 rounded-full hover:bg-white/5">
                  <ImageIcon className="w-5 h-5" />
                </button>
                
                <button 
                  onClick={() => setShowEmojis(!showEmojis)}
                  className={`transition-colors p-2 rounded-full ${showEmojis ? 'text-indigo-400 bg-white/5' : 'text-slate-500 hover:text-indigo-400 hover:bg-white/5'}`}
                >
                  <Smile className="w-5 h-5" />
                </button>

                {/* Popover de Emojis */}
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
                disabled={!newPostContent.trim()}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold tracking-wide flex items-center gap-2 transition-all"
              >
                PUBLICAR <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* LISTA DE PUBLICACIONES */}
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

                    {/* Botón de eliminar (Abre el Modal) */}
                    {user && post.authorId === user.id && (
                      <button 
                        onClick={() => setPostToDelete(post.id)}
                        className="text-slate-600 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"
                        title="Eliminar mi publicación"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <p className="text-slate-300 mb-6 break-words whitespace-pre-wrap">{post.content}</p>

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
                    <button className="flex items-center gap-2 font-bold hover:text-indigo-400 transition-colors">
                      <MessageSquare className="w-5 h-5" />
                      {post.comments?.length || 0}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}