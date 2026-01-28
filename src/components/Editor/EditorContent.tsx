import { Play, Maximize2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface EditorContentProps {
  videoUrl?: string | null;
  isGenerating?: boolean;
  videoControls?: {
    brightness: number;
    contrast: number;
    saturation: number;
    hue: number;
  };
  onVideoTimeUpdate?: (currentTime: number, isPaused: boolean) => void;
}

export default function EditorContent({ videoUrl, isGenerating, videoControls, onVideoTimeUpdate }: EditorContentProps) {
  const [videoError, setVideoError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Notify parent when video plays/pauses/seeks
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !onVideoTimeUpdate) return;

    const handlePlay = () => {
      onVideoTimeUpdate(video.currentTime, false);
    };

    const handlePause = () => {
      onVideoTimeUpdate(video.currentTime, true);
    };

    const handleTimeUpdate = () => {
      if (!video.paused) {
        onVideoTimeUpdate(video.currentTime, false);
      }
    };

    const handleSeeked = () => {
      onVideoTimeUpdate(video.currentTime, video.paused);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('seeked', handleSeeked);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('seeked', handleSeeked);
    };
  }, [videoUrl, onVideoTimeUpdate]);

  const handleRetry = () => {
    setVideoError(false);
    setRetryCount(prev => prev + 1);
  };

  const handleVideoError = () => {
    setVideoError(true);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen && videoRef.current) {
      videoRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center bg-black relative">
      {isGenerating ? (
        <div className="text-center space-y-6 px-4">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <Play className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-purple-500" />
          </div>
          <div className="space-y-2">
            <p className="text-white text-lg font-semibold">Generating Your Video</p>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
              This may take a few minutes. We're using AI to create your video scenes.
            </p>
          </div>
          <div className="flex items-center justify-center gap-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      ) : videoUrl ? (
        <div className="relative w-full h-full flex items-center justify-center max-h-[600px]">
          {videoError ? (
            <div className="text-center space-y-4">
              <p className="text-red-400">Failed to load video</p>
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <video
                key={`${videoUrl}-${retryCount}`}
                ref={videoRef}
                className="max-w-full max-h-full object-contain"
                style={{
                  filter: videoControls
                    ? `brightness(${videoControls.brightness}%) contrast(${videoControls.contrast}%) saturate(${videoControls.saturation}%) hue-rotate(${videoControls.hue}deg)`
                    : undefined,
                }}
                controls
                onError={handleVideoError}
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <button
                onClick={toggleFullscreen}
                className="absolute bottom-20 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors"
                title="Fullscreen"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="text-center space-y-4 px-4">
          <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto">
            <Play className="w-10 h-10 text-gray-600" />
          </div>
          <p className="text-gray-400">Add scenes and click Generate to create your video</p>
        </div>
      )}
    </div>
  );
}
