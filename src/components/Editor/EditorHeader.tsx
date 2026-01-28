import { ArrowLeft, Download, Share2, Save, Play, Folder } from 'lucide-react';

interface EditorHeaderProps {
  projectName: string;
  lastSaved: string;
  onBack: () => void;
  onSave: () => void;
  onViewProjects?: () => void;
  onGenerateVoice?: () => void;
  onGenerateVideo?: () => void;
  onDownload?: () => void;
  jobStatus?: string | null;
}

export default function EditorHeader({ projectName, lastSaved, onBack, onSave, onViewProjects, onGenerateVoice, onGenerateVideo, onDownload, jobStatus }: EditorHeaderProps) {
  return (
    <div className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <button
              onClick={onBack}
              className="flex items-center gap-1 sm:gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>

            <div className="hidden sm:block h-6 w-px bg-gray-800"></div>

            {onViewProjects && (
              <>
                <button
                  onClick={onViewProjects}
                  className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  <Folder className="w-4 h-4" />
                  <span className="text-sm">My Projects</span>
                </button>
                <div className="hidden lg:block h-6 w-px bg-gray-800"></div>
              </>
            )}

            <div className="min-w-0 flex-1">
              <h1 className="text-sm sm:text-base lg:text-xl font-semibold text-white truncate">{projectName}</h1>
              <p className="hidden sm:block text-xs sm:text-sm text-gray-500 truncate">Last saved: {lastSaved}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
            <button
              onClick={onSave}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 lg:px-4 py-2 rounded-lg border border-gray-700 text-white hover:bg-gray-800 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline text-sm lg:text-base">Save</span>
            </button>

            <button 
              onClick={onGenerateVoice} 
              className="hidden md:flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg border border-purple-500 text-purple-400 hover:bg-purple-500/10 transition-colors text-sm lg:text-base"
              title="Generate AI voice-over for first scene"
            >
              <span>🎤 Voice-Over</span>
            </button>

            <button 
              onClick={onGenerateVideo} 
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 lg:px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:opacity-90 transition-opacity"
              title="Generate video with AI"
            >
              <Play className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm lg:text-base">Generate</span>
            </button>

            <button 
              onClick={onDownload} 
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg border border-green-500 text-green-400 hover:bg-green-500/10 transition-colors"
              title="Download final video"
            >
              <Download className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline text-sm lg:text-base">Download</span>
            </button>

            {jobStatus && (
              <div className="hidden lg:block px-3 py-2 text-sm text-cyan-400 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                {jobStatus}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
