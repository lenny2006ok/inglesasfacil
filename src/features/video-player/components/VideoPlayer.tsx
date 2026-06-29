import React, { useEffect, useRef, useState } from 'react';

interface VideoPlayerProps {
  videoId: string;
  onTimeUpdate?: (currentTime: number) => void;
  onStateChange?: (state: number) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, onTimeUpdate, onStateChange }) => {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isApiReady, setIsApiReady] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);

      window.onYouTubeIframeAPIReady = () => {
        setIsApiReady(true);
      };
    } else {
      setIsApiReady(true);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isApiReady || !containerRef.current || !videoId) return;

    if (playerRef.current) {
      playerRef.current.loadVideoById(videoId);
      return;
    }

    playerRef.current = new window.YT.Player(containerRef.current, {
      height: '390',
      width: '100%',
      videoId: videoId,
      playerVars: {
        controls: 1,
        disablekb: 0,
        modestbranding: 1,
        rel: 0,
      },
      events: {
        onStateChange: (event: any) => {
          if (onStateChange) onStateChange(event.data);

          // Track time if playing
          if (event.data === window.YT.PlayerState.PLAYING) {
            intervalRef.current = window.setInterval(() => {
              if (playerRef.current && playerRef.current.getCurrentTime && onTimeUpdate) {
                onTimeUpdate(playerRef.current.getCurrentTime());
              }
            }, 100);
          } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
          }
        }
      }
    });

  }, [isApiReady, videoId]);

  return (
    <div style={{ position: 'relative', width: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
      {/* O containerRef será substituído pelo iframe do YouTube */}
      <div ref={containerRef}></div>
    </div>
  );
};
