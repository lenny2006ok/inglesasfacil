import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { VideoPlayer } from '../features/video-player/components/VideoPlayer';
import { PronunciationLab } from '../features/pronunciation/components/PronunciationLab';

const WatchPage: React.FC = () => {
  const { videoId } = useParams();
  const [currentTime, setCurrentTime] = useState(0);

  // Fallback para o Discurso de Stanford (sempre online e com legendas perfeitas)
  const activeVideoId = videoId && videoId !== 'demo123' ? videoId : 'UF8uR6Z6KLc';
  
  // Cena demo
  const expectedPhrase = "Stay hungry stay foolish";

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <Link to="/browse" style={{ color: 'var(--color-primary-400)', fontWeight: 'bold' }}>
        &larr; Voltar para o Catálogo
      </Link>
      
      <h2 style={{ marginTop: '1rem', marginBottom: '2rem' }}>Praticando Cena</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Player de Vídeo do YouTube */}
        <VideoPlayer 
          videoId={activeVideoId} 
          onTimeUpdate={(time) => setCurrentTime(time)}
        />
        
        {/* Lab de Pronúncia */}
        <PronunciationLab expectedText={expectedPhrase} />
      </div>

      <div style={{ marginTop: '2rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
        <p>Tempo atual do vídeo: {currentTime.toFixed(2)}s</p>
      </div>
    </div>
  );
};

export default WatchPage;
