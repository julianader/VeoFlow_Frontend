import { ArrowLeft, Trash2, Plus } from 'lucide-react';

interface ProjectsHeaderProps {
  projectCount: number;
  onBack: () => void;
  onDeleteAll: () => void;
  onCreateNew: () => void;
}

export default function ProjectsHeader({ projectCount, onBack, onDeleteAll, onCreateNew }: ProjectsHeaderProps) {
  const handleDeleteAll = () => {
    if (window.confirm(`Are you sure you want to delete all ${projectCount} project${projectCount !== 1 ? 's' : ''}? This action cannot be undone.`)) {
      onDeleteAll();
    }
  };

  return (
    <div className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <button
              onClick={onBack}
              className="flex items-center gap-1 sm:gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <div className="hidden sm:block h-6 w-px bg-gray-800"></div>
            <h1 className="text-base sm:text-lg lg:text-xl font-semibold text-white truncate">My Projects</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={onCreateNew}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 lg:px-4 py-2 text-xs sm:text-sm bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors font-medium"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Create New</span>
              <span className="sm:hidden">New</span>
            </button>
            {projectCount > 0 && (
              <button
                onClick={handleDeleteAll}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete All</span>
              </button>
            )}
            <div className="hidden md:block text-xs sm:text-sm text-gray-400">
              {projectCount} project{projectCount !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
