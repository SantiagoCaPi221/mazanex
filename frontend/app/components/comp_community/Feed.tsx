"use client";

import { useState, useEffect } from "react";
import { useUserStore } from "@/app/store/useUserStore";
import { publicationService } from "@/app/clients/publicationService";
import { Heart, MessageSquare, Send, Image as ImageIcon } from "lucide-react";

export function Feed() {
  const { user, showNotification } = useUserStore();
  const [posts, setPosts] = useState<any[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [loading, setLoading] = useState(true);

  // Cargar publicaciones al inicio
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
      userId: user.id,
      content: newPostContent,
      authorName: user.name,
      // Si tienes imágenes, se enviarían aquí
    });

    if (result) {
      setNewPostContent("");
      showNotification("¡Publicación creada!", "success");
      loadFeed(); // Recargamos para ver el post nuevo
    } else {
      showNotification("Error al publicar", "error");
    }
  };

  const handleLike = async (postId: number) => {
    if (!user) return;
    const success = await publicationService.toggleLike(postId, user.id);
    if (success) {
      // Truco visual rápido: actualizamos el contador localmente sin recargar todo el feed
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes: post.isLiked ? post.likes - 1 : post.likes + 1,
                isLiked: !post.isLiked,
              }
            : post
        )
      );
    }
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
      {/* CAJA PARA CREAR PUBLICACIÓN */}
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 backdrop-blur-sm">
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
            <div className="flex justify-between items-center border-t border-white/5 pt-4">
              <button className="text-slate-500 hover:text-indigo-400 transition-colors p-2 rounded-full hover:bg-white/5">
                <ImageIcon className="w-5 h-5" />
              </button>
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
              className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 backdrop-blur-sm transition-all hover:bg-white/[0.03]"
            >
              <div className="flex gap-4">
                {/* Avatar del autor */}
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center font-bold text-slate-300">
                  {post.authorName?.substring(0, 2).toUpperCase() || "??"}
                </div>

                <div className="flex-1">
                  {/* Nombre y Fecha */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white">
                      {post.authorName}
                    </span>
                    <span className="text-xs font-bold text-slate-500 uppercase">
                      {new Date(
                        post.createdAt || Date.now()
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Contenido */}
                  <p className="text-slate-300 mb-6">{post.content}</p>

                  {/* Botones de acción */}
                  <div className="flex items-center gap-6 text-slate-500">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-2 font-bold transition-colors ${
                        post.isLiked ? "text-rose-500" : "hover:text-rose-400"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          post.isLiked ? "fill-rose-500" : ""
                        }`}
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
