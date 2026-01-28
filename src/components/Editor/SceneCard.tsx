import { GripVertical, Trash2, Play, MoreVertical, Clock, Pen, Mic } from 'lucide-react';
import { Scene } from '../../types';

interface SceneCardProps {
  scene: Scene;
  onDelete: (id: string) => void;
  onPlay: (id: string) => void;
  onEdit: (id: string) => void;
  onAddVoiceOver: (id: string) => void;
}

export default function SceneCard({ scene, onDelete, onPlay, onEdit, onAddVoiceOver }: SceneCardProps) {
  const statusColors = {
    pending: 'bg-gray-600',
    generating: 'bg-blue-500 animate-pulse',
    complete: 'bg-green-500',
    error: 'bg-red-500',
  };

  const statusText = {
    pending: 'Pending',
    generating: 'Generating...',
    complete: 'Complete',
    error: 'Error',
  };

  return (
    <div className="group relative bg-gray-900 rounded-lg sm:rounded-xl border border-gray-800 overflow-hidden hover:border-cyan-500/50 transition-all duration-300">
      <div className="flex items-start sm:items-center gap-2 sm:gap-3 p-3 sm:p-4">
        <div className="hidden sm:block cursor-move text-gray-600 hover:text-gray-400">
          <GripVertical className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            <div className={`w-2 h-2 rounded-full ${statusColors[scene.status]}`}></div>
            <span className="text-xs font-medium text-gray-400">
              {statusText[scene.status]}
            </span>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{scene.duration}s</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 mb-2">
            {scene.prompt}
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 sm:py-1 rounded-md bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 text-xs text-cyan-400">
              {scene.style}
            </span>
            {scene.voiceOver?.enabled && (
              <span className="px-2 py-0.5 sm:py-1 rounded-md bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-xs text-purple-400 flex items-center gap-1">
                <Mic className="w-3 h-3" />
                <span className="hidden sm:inline">Voice-Over</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex sm:items-center gap-1 sm:gap-2 flex-col sm:flex-row">
          {scene.status === 'complete' && (
            <button
              onClick={() => onPlay(scene.id)}
              className="p-1.5 sm:p-2 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
            >
              <Play className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          )}

          <button
            onClick={() => onAddVoiceOver(scene.id)}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-purple-500/10 text-gray-400 hover:text-purple-400 transition-colors"
            title="Add voice-over"
          >
            <Mic className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>

          <button
            onClick={() => onEdit(scene.id)}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-purple-500/10 text-gray-400 hover:text-purple-400 transition-colors"
            title="Edit scene"
          >
            <Pen className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>

          <button
            onClick={() => onDelete(scene.id)}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {scene.status === 'generating' && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 animate-progress"></div>
        </div>
      )}
    </div>
  );
}
