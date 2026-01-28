import { Play } from 'lucide-react';

interface ProjectsEmptyStateProps {
  onCreateFirst: () => void;
}

export default function ProjectsEmptyState({ onCreateFirst }: ProjectsEmptyStateProps) {
  return (
    <div className="text-center py-20">
      <div className="inline-flex p-6 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 mb-4">
        <Play className="w-12 h-12 text-cyan-400" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">No projects yet</h2>
      <p className="text-gray-400 mb-8">
        Start creating your first video project to see it appear here
      </p>
      <button
        onClick={onCreateFirst}
        className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:opacity-90 transition-opacity"
      >
        <Play className="w-4 h-4" />
        Create Your First Project
      </button>
    </div>
  );
}
