import React from "react";

export const Loading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 to-red-950 flex flex-col items-center justify-center p-4">
      <img
        src="https://govcsucp.netlify.app/static/media/logo.f46d1ad7.png"
        alt="Logo"
        className="h-24 mb-8 animate-pulse"
      />
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/20 border-t-white"></div>
        <p className="mt-6 text-white/90 text-lg">
          Governo Provincial do Cunene
        </p>
        <p className="mt-2 text-white/70 text-sm">Carregando...</p>
      </div>
    </div>
  );
};

export default Loading;
