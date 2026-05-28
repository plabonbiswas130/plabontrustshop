import React, { useState, useEffect } from 'react';
import { Play, ExternalLink, Youtube } from 'lucide-react';
import { motion } from 'motion/react';

interface Video {
  id: number;
  video_url: string;
  channel_url: string;
}

export function VideoGallery() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/global/videos');
      const data = await response.json();
      setVideos(data);
    } catch (error) {
      console.error("Failed to fetch videos", error);
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 mb-24">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <Play className="text-pink-600 fill-pink-600" size={32} /> Watch & Learn
        </h2>
        <p className="text-sm text-gray-500 mt-1">আমাদের অফিসিয়াল ইউটিউব টিউটোরিয়াল এবং ভিডিও গাইডলাইনসমূহ</p>
      </div>

      {videos.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
          <Youtube size={64} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500 font-medium text-lg">কোনো ভিডিও পাওয়া যায়নি।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {videos.map((video) => {
            const videoId = getYouTubeId(video.video_url);
            return (
              <motion.div 
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 flex flex-col group transition-all duration-300 hover:shadow-xl"
              >
                <div className="relative aspect-video w-full bg-black">
                  {videoId ? (
                    <iframe 
                      className="absolute inset-0 w-full h-full" 
                      src={`https://www.youtube.com/embed/${videoId}`} 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white text-xs p-4 text-center">
                      Invalid Video Link
                    </div>
                  )}
                </div>
                
                <div className="p-4 bg-white flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-bold flex items-center gap-2 uppercase tracking-wider">
                    <Youtube size={16} className="text-red-600" /> YouTube Stream
                  </span>
                  <a 
                    href={video.channel_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs font-black text-pink-600 hover:text-pink-700 flex items-center gap-1.5 transition-all group-hover:gap-2 uppercase tracking-wide"
                  >
                    Visit Channel <ExternalLink size={12} />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
