import { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Settings, X } from 'lucide-react';

import { Scene, StylePreset, Project } from '../types';
import { useProjects } from '../hooks/useProjects';
import EditorHeader from '../components/Editor/EditorHeader';
import EditorContent from '../components/Editor/EditorContent';
import Timeline from '../components/Editor/Timeline';
import StylePresets from '../components/Editor/StylePresets';
import VideoSettings from '../components/Editor/VideoSettings';
import VideoControls from '../components/Editor/VideoControls';
import NewSceneModal from '../components/Editor/NewSceneModal';
import EditSceneModal from '../components/Editor/EditSceneModal';
import VoiceOverModal from '../components/Editor/VoiceOverModal';
import SaveProjectDialog from '../components/Editor/SaveProjectDialog';

interface EditorPageProps {
  onBack: () => void;
  onViewProjects?: () => void;
  editingProject?: Project | null;
}

const mockPresets: StylePreset[] = [
  { id: '1', name: 'Cinematic', description: 'Hollywood-style dramatic scenes', thumbnail: '🎬' },
  { id: '2', name: 'Documentary', description: 'Professional real-world footage', thumbnail: '📹' },
  { id: '3', name: 'Animated', description: 'Cartoon and motion graphics', thumbnail: '🎨' },
  { id: '4', name: 'Tech Demo', description: 'Clean, modern technology showcase', thumbnail: '💻' },
  { id: '5', name: 'Educational', description: 'Clear instructional style', thumbnail: '📚' },
  { id: '6', name: 'Commercial', description: 'Product and brand advertising', thumbnail: '🎯' },
];

export default function EditorPage({ onBack, onViewProjects, editingProject }: EditorPageProps) {
  const { saveProject } = useProjects();
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [selectedPreset, setSelectedPreset] = useState('1');
  const [voiceOverEnabled, setVoiceOverEnabled] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(false);
  const [captionType, setCaptionType] = useState('standard');
  const [captionFontSize, setCaptionFontSize] = useState('medium');
  const [backgroundMusicEnabled, setBackgroundMusicEnabled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isVoiceOverModalOpen, setIsVoiceOverModalOpen] = useState(false);
  const [editingScene, setEditingScene] = useState<Scene | null>(null);
  const [voiceOverSceneId, setVoiceOverSceneId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState('Untitled Project');
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>('never');
  const [projectId, setProjectId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<string | null>(null);
  const [saveNotification, setSaveNotification] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);
  const [videoControls, setVideoControls] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
  });
  const pollingRef = useRef<number | null>(null);
  const audioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map());

  // Load editing project data if provided
  useEffect(() => {
    if (editingProject) {
      setProjectName(editingProject.name);
      setScenes(editingProject.scenes);
      setSelectedPreset(editingProject.selectedPreset);
      setVoiceOverEnabled(editingProject.voiceOverEnabled);
      setLastSaved(formatSaveTime(editingProject.updatedAt));
      setProjectId(editingProject.id || null); // Set the project ID
      
      // Load generated video URL if it exists
      if (editingProject.finalVideoUrl) {
        setGeneratedVideoUrl(editingProject.finalVideoUrl);
        console.log('Loaded video URL from project:', editingProject.finalVideoUrl);
      }
    }
  }, [editingProject]);

  const formatSaveTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const totalDuration = scenes.reduce((acc, scene) => acc + scene.duration, 0);

  const handleAddScene = (prompt: string, duration: number, style: string) => {
    const newScene: Scene = {
      id: Date.now().toString(),
      prompt,
      duration,
      style,
      status: Math.random() > 0.5 ? 'generating' : 'complete',
    };
    setScenes([...scenes, newScene]);
  };

  const handleDeleteScene = (id: string) => {
    setScenes(scenes.filter((scene) => scene.id !== id));
    if (selectedSceneId === id) {
      setSelectedSceneId(null);
    }
  };

  const handleReorderScenes = (newScenes: Scene[]) => {
    setScenes(newScenes);
  };

  const handleVideoControlChange = (control: string, value: number) => {
    setVideoControls(prev => ({
      ...prev,
      [control]: value
    }));
  };

  const handleEditScene = (sceneId: string) => {
    const scene = scenes.find(s => s.id === sceneId);
    if (scene) {
      setEditingScene(scene);
      setIsEditModalOpen(true);
    }
  };

  const handleSaveScene = (sceneId: string, prompt: string, duration: number, style: string) => {
    setScenes(scenes.map(scene => 
      scene.id === sceneId
        ? { ...scene, prompt, duration, style }
        : scene
    ));
    setIsEditModalOpen(false);
    setEditingScene(null);
  };

  const handleAddVoiceOver = (sceneId: string) => {
    setVoiceOverSceneId(sceneId);
    setIsVoiceOverModalOpen(true);
  };

  const handleSaveVoiceOver = async (sceneId: string, text: string, voiceType: string) => {
    try {
      const api = await apiImport();
      const res = await api.post('/videos/generate-voiceover', {
        sceneId,
        text,
        voiceType
      });

      const audioUrl = res?.data?.audioUrl;
      
      // Update scene with voice-over data
      setScenes(scenes.map(scene =>
        scene.id === sceneId
          ? {
              ...scene,
              voiceOver: {
                enabled: true,
                text,
                audioUrl,
                voiceType
              }
            }
          : scene
      ));

      setJobStatus('Voice-over generated ✓');
      setTimeout(() => setJobStatus(null), 3000);
    } catch (err: unknown) {
      console.error('Voice-over generation error:', err);
      alert((err as Error)?.message || 'Voice-over generation failed');
    }
  };
  const saveVideoToProject = async (videoUrl: string) => {
    if (!projectId) {
      console.warn('No project ID, cannot save video URL');
      return;
    }

    try {
      const api = await apiImport();
      // Only send the video URL, not the full scenes
      await api.put(`/projects/${projectId}`, {
        finalVideoUrl: videoUrl,
      });
      console.log('Video URL saved to project:', videoUrl);
    } catch (error) {
      console.error('Failed to save video URL to project:', error);
    }
  };

  const handleSaveProject = async (name: string) => {
    const project: Project = {
      id: projectId || undefined,
      name,
      scenes,
      totalDuration,
      selectedPreset,
      voiceOverEnabled,
      finalVideoUrl: generatedVideoUrl || undefined, // Include video URL when saving
      createdAt: editingProject?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const isUpdate = projectId && /^[0-9a-fA-F]{24}$/.test(projectId);
    const savedProject = await saveProject(project);
    
    // Update projectId with the backend-assigned ID
    if (savedProject && savedProject.id) {
      setProjectId(savedProject.id);
    }
    
    setProjectName(name);
    setLastSaved('just now');
    setIsSaveDialogOpen(false);
    
    // Show notification
    setSaveNotification(isUpdate ? 'Project updated successfully!' : 'Project saved successfully!');
    setTimeout(() => setSaveNotification(null), 3000);
  };

  const handleSaveClick = () => {
    // Check if project already has a valid MongoDB ID
    const hasValidId = projectId && /^[0-9a-fA-F]{24}$/.test(projectId);
    
    if (hasValidId) {
      // Auto-save without showing dialog
      handleSaveProject(projectName);
    } else {
      // Show dialog for new projects
      setIsSaveDialogOpen(true);
    }
  };

  const apiImport = async () => {
    const mod = await import('../services/api');
    return mod.default;
  };

  const generateVoiceForFirstScene = async () => {
    if (scenes.length === 0) return alert('Add at least one scene to generate voice-over.');

    const api = await apiImport();
    
    setJobStatus(`Generating voice-overs for ${scenes.length} scene(s)...`);
    
    try {
      for (let i = 0; i < scenes.length; i++) {
        const scene = scenes[i];
        setJobStatus(`Generating voice ${i + 1}/${scenes.length}...`);
        
        await api.post('/videos/generate-voiceover', { 
          sceneId: scene.id, 
          projectId: projectId || 'temp',
          text: scene.prompt
        });
      }
      
      setJobStatus(`All ${scenes.length} voice-overs ready! ✓`);
      setTimeout(() => setJobStatus(null), 3000);
    } catch (err: unknown) {
      console.error('Voice generation error', err);
      setJobStatus('voice-over error');
      
      // Show helpful error message
      const errorMsg = (err as Error)?.message || 'Voice generation failed';
      if (errorMsg.includes('Text-to-Speech API not enabled')) {
        alert('Google Cloud Text-to-Speech API is not enabled.\n\nTo enable it:\n1. Visit https://console.cloud.google.com/apis/library/texttospeech.googleapis.com\n2. Select your project\n3. Click "Enable"\n\nFor now, you can skip voice-over generation and just generate videos.');
      } else {
        alert(errorMsg);
      }
      setTimeout(() => setJobStatus(null), 3000);
    }
  };

  const generateVideoForFirstScene = async () => {
    if (scenes.length === 0) return alert('Add at least one scene to generate video.');

    const api = await apiImport();
    
    // Combine all scene prompts into one video
    setIsGeneratingVideo(true);
    setJobStatus(`Generating video with ${scenes.length} scene(s)...`);
    setGeneratedVideoUrl(null); // Clear old video URL before generating new one
    
    try {
      // Get selected style preset name
      const selectedStyle = mockPresets.find(p => p.id === selectedPreset);
      const styleName = selectedStyle?.name || 'Cinematic';
      
      // Combine all scene descriptions with their individual styles and durations
      const combinedPrompt = `Overall Style: ${styleName}. ` + scenes.map((scene, idx) => {
        return `Scene ${idx + 1} (${scene.duration}s, ${scene.style} style): ${scene.prompt}`;
      }).join('. ');
      
      console.log('Combined prompt with styles and durations:', combinedPrompt);
      
      const res = await api.post('/videos/generate-video', { 
        sceneId: scenes[0]?.id || 'combined', 
        projectId: projectId || 'temp',
        prompt: combinedPrompt,
        quality: 'standard',
        duration: scenes.reduce((sum, s) => sum + (s.duration || 5), 0), // Total duration
        style: styleName, // Overall style preset
        captions: captionsEnabled ? {
          enabled: true,
          type: captionType,
          fontSize: captionFontSize
        } : { enabled: false },
        backgroundMusic: backgroundMusicEnabled
      });
      
      const jobId = res?.data?.jobId;
      if (jobId) {
        setJobStatus('Generating combined video...');
        pollJob(jobId);
      } else {
        setJobStatus('Video generation started');
        setIsGeneratingVideo(false);
        setTimeout(() => setJobStatus(null), 3000);
      }
    } catch (err: unknown) {
      console.error('Video generation error', err);
      setJobStatus('video generation error');
      setIsGeneratingVideo(false);
      alert((err as Error)?.message || 'Video generation failed');
    }
  };

  const pollJob = async (jobId: string) => {
    const api = await apiImport();
    if (pollingRef.current) window.clearInterval(pollingRef.current);
    pollingRef.current = window.setInterval(async () => {
      try {
        const res = await api.get(`/videos/job/${jobId}`);
        const status = res?.data?.job?.status || 'unknown';
        const progress = res?.data?.job?.progress || 0;
        const videoUrl = res?.data?.job?.videoUrl; // GCS signed URL (preferred)
        const localPath = res?.data?.job?.localPath; // Local fallback path
        
        setJobStatus(`${status} (${progress}%)`);
        
        if (status === 'completed' || status === 'failed') {
          if (pollingRef.current) window.clearInterval(pollingRef.current);
          pollingRef.current = null;
          setIsGeneratingVideo(false);
          
          if (status === 'completed') {
            setJobStatus('Video ready! ✓');
            
            // Priority: 1) GCS signed URL, 2) Local path, 3) Constructed fallback
            let finalVideoUrl;
            
            if (videoUrl && videoUrl.startsWith('http')) {
              // Use GCS signed URL (best option - fast CDN delivery)
              finalVideoUrl = videoUrl;
              console.log('Using GCS signed URL');
            } else if (localPath) {
              // Use local path as fallback
              finalVideoUrl = `http://localhost:5002/${localPath}`;
              console.log('Using local fallback path');
            } else {
              // Ultimate fallback - construct local URL
              finalVideoUrl = `http://localhost:5002/uploads/videos/${jobId}.mp4`;
              console.log('Using constructed fallback URL');
            }
            
            setGeneratedVideoUrl(finalVideoUrl);
            
            // Save video URL to project
            await saveVideoToProject(finalVideoUrl);
            
            setTimeout(() => setJobStatus(null), 3000);
          } else {
            setJobStatus('Video generation failed');
            setTimeout(() => setJobStatus(null), 3000);
          }
        }
      } catch (err) {
        console.warn('Polling error', err);
      }
    }, 2500);
  };

  const downloadProjectHandler = async () => {
    if (!generatedVideoUrl) {
      alert('No video available to download. Generate a video first.');
      return;
    }
    
    try {
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = generatedVideoUrl;
      link.download = `${projectName.replace(/\s+/g, '_')}_${Date.now()}.mp4`;
      
      // For local files, fetch and download
      if (generatedVideoUrl.startsWith('http://localhost')) {
        const response = await fetch(generatedVideoUrl);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        link.href = blobUrl;
      }
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up blob URL if created
      if (!generatedVideoUrl.startsWith('http://localhost')) {
        setTimeout(() => URL.revokeObjectURL(link.href), 100);
      }
      
      console.log('Download started for:', generatedVideoUrl);
    } catch (err: unknown) {
      console.error('Download error', err);
      alert((err as Error)?.message || 'Download failed. The video URL may have expired.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <EditorHeader
        projectName={projectName}
        lastSaved={lastSaved}
        onBack={onBack}
        onSave={handleSaveClick}
        onViewProjects={onViewProjects}
        onGenerateVoice={generateVoiceForFirstScene}
        onGenerateVideo={generateVideoForFirstScene}
        onDownload={downloadProjectHandler}
        jobStatus={jobStatus}
      />

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col p-2 sm:p-3 lg:p-4 gap-3 sm:gap-4 overflow-hidden max-w-full">
          {/* Video Player - Fixed Max Height */}
          <div className="flex-1 min-h-0">
            <EditorContent 
              videoUrl={generatedVideoUrl}
              isGenerating={isGeneratingVideo}
              videoControls={videoControls}
              onVideoTimeUpdate={(currentTime, isPaused) => {
                // Sync audio with video playback
                let cumulativeTime = 0;
                scenes.forEach(scene => {
                  const sceneStart = cumulativeTime;
                  const sceneEnd = cumulativeTime + scene.duration;
                  const audioKey = `audio-${scene.id}`;
                  const audio = audioElementsRef.current.get(audioKey);

                  if (audio) {
                    const isInScene = currentTime >= sceneStart && currentTime < sceneEnd;
                    
                    if (isPaused) {
                      audio.pause();
                    } else if (isInScene) {
                      const audioTime = Math.max(0, currentTime - sceneStart);
                      
                      // Only play if paused AND not ended
                      if (audio.paused && !audio.ended) {
                        audio.currentTime = audioTime;
                        audio.play().catch(err => console.error('Audio play failed:', err));
                      } else if (audio.ended) {
                        // If audio has ended but we're still in scene, reset and play
                        audio.currentTime = audioTime;
                        audio.play().catch(err => console.error('Audio play failed:', err));
                      }
                      // Sync audio position (but don't restart if already playing)
                      else if (!audio.paused && Math.abs(audio.currentTime - audioTime) > 0.3) {
                        audio.currentTime = audioTime;
                      }
                    } else {
                      // Pause and reset when outside scene
                      if (!audio.paused) {
                        audio.pause();
                        audio.currentTime = 0;
                      }
                    }
                  }
                  
                  cumulativeTime = sceneEnd;
                });
              }}
            />
          </div>

          {/* Timeline and Controls at Bottom */}
          <div className="flex-shrink-0 flex flex-col lg:flex-row gap-3 sm:gap-4 w-full overflow-hidden">
            {/* Timeline */}
            <div className="flex-1 min-w-0 overflow-hidden">
              <Timeline
                scenes={scenes}
                onAddScene={() => setIsModalOpen(true)}
                onDeleteScene={handleDeleteScene}
                onReorderScenes={handleReorderScenes}
                selectedSceneId={selectedSceneId || undefined}
                onSelectScene={setSelectedSceneId}
                onEditScene={handleEditScene}
                onAddVoiceOver={handleAddVoiceOver}
                audioElementsRef={audioElementsRef}
              />
            </div>

            {/* Video Controls on the Right - Hidden on mobile */}
            <div className="hidden xl:block w-80 flex-shrink-0">
              <VideoControls onControlChange={handleVideoControlChange} />
            </div>
          </div>
        </div>

        {/* Collapsible Right Sidebar - Desktop only */}
        <div className={`flex-shrink-0 bg-gray-900 border-l border-gray-800 transition-all duration-300 ${isSidebarOpen ? 'w-80' : 'w-0'} overflow-hidden hidden lg:block`}>
          <div className="w-80 h-full overflow-y-auto p-3 lg:p-4 space-y-3 lg:space-y-4">
            <StylePresets
              presets={mockPresets}
              selectedPreset={selectedPreset}
              onSelectPreset={setSelectedPreset}
            />

            <VideoSettings
              captionsEnabled={captionsEnabled}
              onToggleCaptions={setCaptionsEnabled}
              captionType={captionType}
              onCaptionTypeChange={setCaptionType}
              captionFontSize={captionFontSize}
              onCaptionFontSizeChange={setCaptionFontSize}
              backgroundMusicEnabled={backgroundMusicEnabled}
              onToggleBackgroundMusic={setBackgroundMusicEnabled}
            />
          </div>
        </div>

        {/* Sidebar Toggle Button - Desktop only */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-gray-700 text-gray-300 p-2 rounded-l-lg transition-colors z-10"
          title={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
        >
          {isSidebarOpen ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>

        {/* Mobile Settings Button - Fixed position */}
        <button
          onClick={() => setIsMobileSettingsOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 z-30 p-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg hover:shadow-xl transition-all hover:scale-110"
          title="Settings"
        >
          <Settings className="w-6 h-6" />
        </button>

        {/* Mobile Settings Modal */}
        {isMobileSettingsOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMobileSettingsOpen(false)}
            />
            
            {/* Modal Content */}
            <div className="relative w-full sm:max-w-lg bg-gray-900 rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[80vh] sm:max-h-[90vh] overflow-hidden flex flex-col animate-slide-up">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <h2 className="text-lg font-semibold text-white">Video Settings</h2>
                <button
                  onClick={() => setIsMobileSettingsOpen(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <StylePresets
                  presets={mockPresets}
                  selectedPreset={selectedPreset}
                  onSelectPreset={setSelectedPreset}
                />

                <VideoSettings
                  captionsEnabled={captionsEnabled}
                  onToggleCaptions={setCaptionsEnabled}
                  captionType={captionType}
                  onCaptionTypeChange={setCaptionType}
                  captionFontSize={captionFontSize}
                  onCaptionFontSizeChange={setCaptionFontSize}
                  backgroundMusicEnabled={backgroundMusicEnabled}
                  onToggleBackgroundMusic={setBackgroundMusicEnabled}
                />
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-800">
                <button
                  onClick={() => setIsMobileSettingsOpen(false)}
                  className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:opacity-90 transition-opacity"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <NewSceneModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddScene={handleAddScene}
      />

      <EditSceneModal
        isOpen={isEditModalOpen}
        scene={editingScene}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingScene(null);
        }}
        onSave={handleSaveScene}
      />

      <VoiceOverModal
        isOpen={isVoiceOverModalOpen}
        sceneId={voiceOverSceneId}
        existingVoiceOver={scenes.find(s => s.id === voiceOverSceneId)?.voiceOver ? {
          text: scenes.find(s => s.id === voiceOverSceneId)?.voiceOver?.text || '',
          voiceType: scenes.find(s => s.id === voiceOverSceneId)?.voiceOver?.voiceType || 'en-US-Neural2-C'
        } : undefined}
        onClose={() => {
          setIsVoiceOverModalOpen(false);
          setVoiceOverSceneId(null);
        }}
        onSave={handleSaveVoiceOver}
      />

      {isSaveDialogOpen && (
        <SaveProjectDialog
          initialName={projectName}
          onSave={handleSaveProject}
          onClose={() => setIsSaveDialogOpen(false)}
        />
      )}

      {saveNotification && (
        <div className="fixed bottom-8 right-8 z-50 animate-fade-in">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">{saveNotification}</span>
          </div>
        </div>
      )}
    </div>
  );
}
