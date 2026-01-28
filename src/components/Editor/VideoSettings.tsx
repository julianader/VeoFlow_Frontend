import { Music, Settings, Subtitles } from 'lucide-react';

interface VideoSettingsProps {
  captionsEnabled: boolean;
  onToggleCaptions: (enabled: boolean) => void;
  captionType: string;
  onCaptionTypeChange: (type: string) => void;
  captionFontSize: string;
  onCaptionFontSizeChange: (size: string) => void;
  backgroundMusicEnabled: boolean;
  onToggleBackgroundMusic: (enabled: boolean) => void;
}

export default function VideoSettings({ 
  captionsEnabled,
  onToggleCaptions,
  captionType,
  onCaptionTypeChange,
  captionFontSize,
  onCaptionFontSizeChange,
  backgroundMusicEnabled,
  onToggleBackgroundMusic
}: VideoSettingsProps) {
  return (
    <div className="bg-gray-950 rounded-xl sm:rounded-2xl border border-gray-800 p-4 sm:p-5 lg:p-6">
      <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Video Settings</h3>

      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-r from-green-500/10 to-teal-500/10 flex-shrink-0">
              <Subtitles className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-white truncate">Captions</p>
              <p className="text-xs text-gray-400 hidden sm:block">Add subtitles to your video</p>
            </div>
          </div>
          <button
            onClick={() => onToggleCaptions(!captionsEnabled)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              captionsEnabled ? 'bg-green-500' : 'bg-gray-700'
            }`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                captionsEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            ></div>
          </button>
        </div>

        {captionsEnabled && (
          <div className="pl-6 sm:pl-11 space-y-3 sm:space-y-4 animate-fade-in">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                Caption Style
              </label>
              <select 
                value={captionType}
                onChange={(e) => onCaptionTypeChange(e.target.value)}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-green-500"
              >
                <option value="standard">Standard (Bottom Center)</option>
                <option value="subtitle">Subtitle (Bottom, Full Width)</option>
                <option value="caption">Closed Captions (Box Style)</option>
                <option value="dynamic">Dynamic (Word by Word)</option>
                <option value="karaoke">Karaoke (Highlight Current)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                Font Size
              </label>
              <select 
                value={captionFontSize}
                onChange={(e) => onCaptionFontSizeChange(e.target.value)}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-green-500"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="extra-large">Extra Large</option>
              </select>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 flex-shrink-0">
              <Music className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-white truncate">Background Music</p>
              <p className="text-xs text-gray-400 hidden sm:block">Add audio bed to your video</p>
            </div>
          </div>
          <button
            onClick={() => onToggleBackgroundMusic(!backgroundMusicEnabled)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              backgroundMusicEnabled ? 'bg-blue-500' : 'bg-gray-700'
            }`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                backgroundMusicEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            ></div>
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10">
              <Settings className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Quality Mode</p>
              <p className="text-xs text-gray-400">Balance speed vs quality</p>
            </div>
          </div>
          <select className="px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500">
            <option>Fast</option>
            <option>Balanced</option>
            <option>High Quality</option>
          </select>
        </div>
      </div>
    </div>
  );
}
