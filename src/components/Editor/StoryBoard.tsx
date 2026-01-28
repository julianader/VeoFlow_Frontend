import { Plus } from 'lucide-react';
import { Scene } from '../../types';
import SceneCard from './SceneCard';

interface StoryboardProps {
  scenes: Scene[];
  onAddScene: () => void;
  onDeleteScene: (id: string) => void;
  onPlayScene: (id: string) => void;
  onEditScene: (id: string) => void;
  onAddVoiceOver: (id: string) => void;
}

export default function Storyboard({ scenes, onAddScene, onDeleteScene, onPlayScene, onEditScene, onAddVoiceOver }: StoryboardProps) {
  const totalDuration = scenes.reduce((acc, scene) => acc + scene.duration, 0);

  return (
    <div className="bg-gray-950 rounded-xl sm:rounded-2xl border border-gray-800 p-4 sm:p-5 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">Storyboard</h3>
          <p className="text-xs sm:text-sm text-gray-400">
            {scenes.length} scenes • {totalDuration}s total
          </p>
        </div>

        <button
          onClick={onAddScene}
          className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:opacity-90 transition-opacity text-sm sm:text-base"
        >
          <Plus className="w-4 h-4" />
          <span className="sm:inline">Add Scene</span>
        </button>
      </div>

      <div className="space-y-2 sm:space-y-3">
        {scenes.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="inline-flex p-3 sm:p-4 rounded-full bg-gray-900 border border-gray-800 mb-3 sm:mb-4">
              <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
            </div>
            <p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-4 px-4">No scenes yet. Start by adding your first scene.</p>
            <button
              onClick={onAddScene}
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:opacity-90 transition-opacity text-sm sm:text-base"
            >
              <Plus className="w-4 h-4" />
              Create First Scene
            </button>
          </div>
        ) : (
          scenes.map((scene) => (
            <SceneCard
              key={scene.id}
              scene={scene}
              onDelete={onDeleteScene}
              onPlay={onPlayScene}
              onEdit={onEditScene}
              onAddVoiceOver={onAddVoiceOver}
            />
          ))
        )}
      </div>
    </div>
  );
}
