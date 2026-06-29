import React, { useEffect, useRef, useState } from 'react';

interface VideoPlayerProps {
  videoId: string;
  startTime?: number;
  durationSeconds?: number;
  onTimeUpdate?: (currentTime: number) => void;
  onStateChange?: (state: number) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, startTime = 0, durationSeconds = 15, onTimeUpdate, onStateChange }) => {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isApiReady, setIsApiReady] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
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

    const loadClip = () => {
      if (!playerRef.current) return;

      if (startTime > 0) {
        const endSeconds = startTime + durationSeconds;
        playerRef.current.loadVideoById({
          videoId,
          startSeconds: startTime,
          endSeconds,
        });
      } else {
        playerRef.current.loadVideoById({ videoId });
      }
    };

    if (playerRef.current) {
      loadClip();
      return;
    }

    playerRef.current = new window.YT.Player(containerRef.current, {
      height: '390',
      width: '100%',
      videoId,
      playerVars: {
        controls: 1,
        disablekb: 0,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
      },
      events: {
        onReady: () => {
          loadClip();
        },
        onStateChange: (event: any) => {
          if (onStateChange) onStateChange(event.data);

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
  }, [isApiReady, videoId, startTime, durationSeconds]);

  return (
    <div style={{ position: 'relative', width: '100%', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--glass-border)' }}>
      <div ref={containerRef} style={{ aspectRatio: '16 / 9' }} />
    </div>
  );
};
