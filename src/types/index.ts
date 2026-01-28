export interface Scene {
  id: string;
  prompt: string;
  duration: number;
  style: string;
  thumbnail?: string;
  status: 'pending' | 'generating' | 'complete' | 'error';
  voiceOver?: {
    enabled: boolean;
    text: string;
    audioUrl?: string;
    voiceType?: string;
  };
}

export interface Project {
  id?: string;
  name: string;
  scenes: Scene[];
  totalDuration: number;
  selectedPreset: string;
  voiceOverEnabled: boolean;
  voiceOverText?: string;
  voiceOverVoice?: string;
  finalVideoUrl?: string;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
}

export interface StylePreset {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
}
