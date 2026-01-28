import { Plus, Play, Trash2, Pen, Mic, Volume2, GripVertical, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { Scene } from '../../types';
import { useState, useEffect, useRef } from 'react';

interface AudioTrack {
  id: string;
  sceneId: string;
  audioUrl: string;
  text: string;
  startTime: number; // in seconds
  duration: number;
}

interface TimelineProps {
  scenes: Scene[];
  onAddScene: () => void;
  onDeleteScene: (id: string) => void;
  onReorderScenes: (scenes: Scene[]) => void;
  selectedSceneId?: string;
  onSelectScene: (id: string) => void;
  onEditScene?: (id: string) => void;
  onAddVoiceOver?: (id: string) => void;
  audioElementsRef?: React.MutableRefObject<Map<string, HTMLAudioElement>>;
}

export default function Timeline({ 
  scenes, 
  onAddScene, 
  onDeleteScene, 
  onReorderScenes,
  selectedSceneId,
  onSelectScene,
  onEditScene,
  onAddVoiceOver,
  audioElementsRef: externalAudioRef
}: TimelineProps) {
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([]);
  const [draggedAudioId, setDraggedAudioId] = useState<string | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const audioElementsRef = externalAudioRef || useRef<Map<string, HTMLAudioElement>>(new Map());
  const scenesScrollRef = useRef<HTMLDivElement>(null);
  const audioScrollRef = useRef<HTMLDivElement>(null);

  // Sync audio tracks with scenes when scenes change
  useEffect(() => {
    const tracks: AudioTrack[] = [];
    let currentTime = 0;
    
    scenes.forEach(scene => {
      if (scene.voiceOver?.enabled && scene.voiceOver?.audioUrl) {
        tracks.push({
          id: `audio-${scene.id}`,
          sceneId: scene.id,
          audioUrl: scene.voiceOver.audioUrl,
          text: scene.voiceOver.text,
          startTime: currentTime,
          duration: scene.duration
        });
      }
      currentTime += scene.duration;
    });
    
    setAudioTracks(tracks);
  }, [scenes]);

  // Pre-create audio elements when tracks change
  useEffect(() => {
    const backendUrl = 'http://localhost:5002';
    
    audioTracks.forEach(track => {
      // Only create if doesn't exist
      if (!audioElementsRef.current.has(track.id)) {
        // Handle both full URLs and relative paths
        let audioUrl = track.audioUrl;
        if (audioUrl.startsWith('http')) {
          // Already a full URL - use as is
          console.log('[Timeline] Using full URL:', audioUrl);
        } else {
          // Relative path - prepend backend URL
          audioUrl = `${backendUrl}${audioUrl}`;
          console.log('[Timeline] Built URL from path:', audioUrl);
        }
        
        const audio = new Audio(audioUrl);
        audio.preload = 'auto';
        
        audio.addEventListener('ended', () => {
          setPlayingAudioId(null);
        });
        
        audio.addEventListener('error', (e: any) => {
          console.error('[Timeline] Audio load error for', track.id);
          console.error('[Timeline] Failed URL:', audioUrl);
          console.error('[Timeline] Make sure backend is running on http://localhost:5002');
        });
        
        audio.addEventListener('loadeddata', () => {
          console.log('[Timeline] Audio loaded successfully:', track.id);
        });
        
        audioElementsRef.current.set(track.id, audio);
      }
    });
  }, [audioTracks]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/html'));
    if (dragIndex === dropIndex) return;

    const newScenes = [...scenes];
    const [removed] = newScenes.splice(dragIndex, 1);
    newScenes.splice(dropIndex, 0, removed);
    onReorderScenes(newScenes);
  };

  const handleAudioDragStart = (e: React.DragEvent, audioId: string) => {
    setDraggedAudioId(audioId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleAudioDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleAudioDrop = (e: React.DragEvent, position: number) => {
    e.preventDefault();
    if (!draggedAudioId) return;

    setAudioTracks(prev => 
      prev.map(track => 
        track.id === draggedAudioId 
          ? { ...track, startTime: position }
          : track
      )
    );
    setDraggedAudioId(null);
  };

  const handleDeleteAudio = (audioId: string) => {
    // Stop and cleanup audio if it's playing
    const audio = audioElementsRef.current.get(audioId);
    if (audio) {
      audio.pause();
      audio.src = '';
      audioElementsRef.current.delete(audioId);
    }
    if (playingAudioId === audioId) {
      setPlayingAudioId(null);
    }
    setAudioTracks(prev => prev.filter(track => track.id !== audioId));
  };

  const scrollScenes = (direction: 'left' | 'right') => {
    if (scenesScrollRef.current) {
      const scrollAmount = 300;
      scenesScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollAudio = (direction: 'left' | 'right') => {
    if (audioScrollRef.current) {
      const scrollAmount = 300;
      audioScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handlePlayAudio = (track: AudioTrack) => {
    // Get or create audio element
    let audio = audioElementsRef.current.get(track.id);
    
    if (!audio) {
      const backendUrl = 'http://localhost:5002';
      
      // Handle both full URLs and relative paths
      let audioUrl = track.audioUrl;
      if (audioUrl.startsWith('http')) {
        console.log('[Play] Using full URL:', audioUrl);
      } else {
        audioUrl = `${backendUrl}${audioUrl}`;
        console.log('[Play] Built URL from path:', audioUrl);
      }
      
      audio = new Audio(audioUrl);
      audioElementsRef.current.set(track.id, audio);
      
      // Add event listeners
      audio.addEventListener('ended', () => {
        setPlayingAudioId(null);
      });
      
      audio.addEventListener('error', (e: any) => {
        console.error('Audio playback error:', e);
        console.error('Failed URL:', audioUrl);
        alert(`Failed to play audio. The audio file might not exist yet.\n\nURL: ${audioUrl}\n\nMake sure the voice-over was generated successfully.`);
        setPlayingAudioId(null);
      });
    }

    // Toggle play/pause
    if (playingAudioId === track.id) {
      audio.pause();
      setPlayingAudioId(null);
    } else {
      // Stop any currently playing audio
      audioElementsRef.current.forEach((aud, id) => {
        if (id !== track.id) {
          aud.pause();
          aud.currentTime = 0;
        }
      });
      
      audio.currentTime = 0;
      audio.play().catch(err => {
        console.error('Failed to play audio:', err);
        alert('Failed to play audio');
      });
      setPlayingAudioId(track.id);
    }
  };

  // Cleanup audio elements on unmount
  useEffect(() => {
    return () => {
      audioElementsRef.current.forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      audioElementsRef.current.clear();
    };
  }, []);

  // Calculate total timeline duration
  const totalDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0);
  const pixelsPerSecond = 40; // Width ratio for positioning

  // Generate waveform bars for visual effect
  const generateWaveform = (duration: number) => {
    const bars = Math.floor(duration * 10); // 10 bars per second
    return Array.from({ length: bars }, (_, i) => {
      const height = Math.random() * 60 + 40; // Random height between 40-100%
      return height;
    });
  };

  return (
    <div className="bg-gray-900 border-t border-gray-800 p-4 max-w-full overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-semibold text-gray-300">Timeline</h3>
        <div className="flex-1 h-px bg-gray-800"></div>
        <span className="text-xs text-gray-500">{scenes.length} scenes • {totalDuration}s total</span>
      </div>
      
      {/* Scenes Track */}
      <div className="mb-4 w-full">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-medium text-gray-400">Video Scenes</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => scrollScenes('left')}
              className="p-1 rounded hover:bg-gray-700 transition-colors text-gray-400 hover:text-cyan-400"
              title="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollScenes('right')}
              className="p-1 rounded hover:bg-gray-700 transition-colors text-gray-400 hover:text-cyan-400"
              title="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div 
          ref={scenesScrollRef}
          className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="flex flex-nowrap gap-3 pb-2" style={{ width: 'max-content' }}>
          {scenes.map((scene, index) => (
            <div
              key={scene.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onClick={() => onSelectScene(scene.id)}
              className={`relative flex-shrink-0 w-40 h-24 rounded-lg border-2 cursor-move transition-all ${
                selectedSceneId === scene.id
                  ? 'border-cyan-500 bg-cyan-500/10'
                  : 'border-gray-700 bg-gray-800 hover:border-gray-600'
              }`}
            >
              <div className="p-3 h-full flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-mono text-gray-400">Scene {index + 1}</span>
                  <div className="flex items-center gap-1">
                    {onAddVoiceOver && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddVoiceOver(scene.id);
                        }}
                        className="text-gray-500 hover:text-purple-400 transition-colors"
                        title="Add voice-over"
                      >
                        <Mic className="w-3 h-3" />
                      </button>
                    )}
                    {onEditScene && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditScene(scene.id);
                        }}
                        className="text-gray-500 hover:text-purple-400 transition-colors"
                        title="Edit scene"
                      >
                        <Pen className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteScene(scene.id);
                      }}
                      className="text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-300 line-clamp-2">{scene.prompt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{scene.duration}s</span>
                  {scene.voiceOver?.enabled && (
                    <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30 flex items-center gap-1">
                      <Mic className="w-3 h-3" />
                      Voice
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          <button
            onClick={onAddScene}
            className="flex-shrink-0 w-40 h-24 rounded-lg border-2 border-dashed border-gray-700 hover:border-cyan-500 bg-gray-800/50 hover:bg-gray-800 transition-all flex items-center justify-center group"
          >
            <div className="text-center">
              <Plus className="w-6 h-6 mx-auto text-gray-600 group-hover:text-cyan-400 transition-colors" />
              <span className="text-xs text-gray-500 group-hover:text-cyan-400 transition-colors mt-1 block">Add Scene</span>
            </div>
          </button>
          </div>
        </div>
      </div>

      {/* Audio Track */}
      <div className="border-t border-gray-800 pt-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-medium text-gray-400">Audio Track</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => scrollAudio('left')}
              className="p-1 rounded hover:bg-gray-700 transition-colors text-gray-400 hover:text-purple-400"
              title="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollAudio('right')}
              className="p-1 rounded hover:bg-gray-700 transition-colors text-gray-400 hover:text-purple-400"
              title="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div 
          ref={audioScrollRef}
          className="relative h-20 w-full bg-gray-800/50 rounded-lg border border-gray-700 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
          onDragOver={handleAudioDragOver}
          onDrop={(e) => handleAudioDrop(e, 0)}
        >
          <div style={{ width: `${totalDuration * pixelsPerSecond + 100}px`, minWidth: '100%' }}>
          {/* Timeline ruler */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-gray-900/50 border-b border-gray-700 flex items-center px-2">
            {Array.from({ length: Math.ceil(totalDuration) + 1 }, (_, i) => (
              <div key={i} className="absolute" style={{ left: `${i * pixelsPerSecond}px` }}>
                <span className="text-[10px] text-gray-500">{i}s</span>
              </div>
            ))}
          </div>

          {/* Audio clips */}
          <div className="absolute top-4 left-0 right-0 bottom-0 p-2">
            {audioTracks.map((track) => {
              const waveform = generateWaveform(track.duration);
              return (
                <div
                  key={track.id}
                  draggable
                  onDragStart={(e) => handleAudioDragStart(e, track.id)}
                  onClick={() => handlePlayAudio(track)}
                  className={`absolute top-2 h-12 rounded border cursor-pointer transition-all group ${
                    playingAudioId === track.id
                      ? 'bg-gradient-to-r from-purple-500 to-purple-400 border-purple-300 shadow-lg shadow-purple-500/50'
                      : 'bg-gradient-to-r from-purple-600/80 to-purple-500/80 border-purple-400/50 hover:from-purple-500/90 hover:to-purple-400/90'
                  }`}
                  style={{
                    left: `${track.startTime * pixelsPerSecond}px`,
                    width: `${track.duration * pixelsPerSecond}px`
                  }}
                  title="Click to play/pause"
                >
                  {/* Waveform visualization */}
                  <div className="absolute inset-0 flex items-center justify-around px-1 opacity-60 pointer-events-none">
                    {waveform.map((height, i) => (
                      <div
                        key={i}
                        className="w-0.5 bg-white/80 rounded-full"
                        style={{ height: `${height}%` }}
                      ></div>
                    ))}
                  </div>

                  {/* Audio info overlay */}
                  <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
                    <div className="flex items-center gap-1">
                      <GripVertical className="w-3 h-3 text-white/60" />
                      {playingAudioId === track.id ? (
                        <Pause className="w-3 h-3 text-white animate-pulse" />
                      ) : (
                        <Mic className="w-3 h-3 text-white" />
                      )}
                      <span className="text-[10px] text-white font-medium truncate max-w-[100px]">
                        {track.text.substring(0, 20)}...
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAudio(track.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto"
                    >
                      <Trash2 className="w-3 h-3 text-white/80 hover:text-red-400" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>          </div>        </div>
        {audioTracks.length === 0 && (
          <p className="text-xs text-gray-500 text-center mt-2">
            No audio tracks yet. Add voice-overs to scenes to see them here.
          </p>
        )}
      </div>
    </div>
  );
}
