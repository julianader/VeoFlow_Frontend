import { Play, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { Project } from '../../types';
import ProjectMenu from './ProjectMenu';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ProjectCard({ project, onEdit, onDuplicate, onDelete }: ProjectCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="group relative bg-gray-900/50 rounded-xl sm:rounded-2xl border border-gray-800 overflow-hidden hover:border-cyan-500/50 transition-all duration-300">
      {/* Thumbnail */}
      <div className="aspect-video bg-gradient-to-br from-cyan-900/20 via-blue-900/20 to-purple-900/20 flex items-center justify-center relative overflow-hidden">
        <div className="text-center">
          <div className="inline-flex p-3 sm:p-4 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
            <Play className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
          </div>
        </div>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 sm:gap-3">
          <button
            onClick={() => onEdit(project)}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:opacity-90 transition-opacity text-sm sm:text-base"
          >
            <Play className="w-3 h-3 sm:w-4 sm:h-4" />
            Edit
          </button>
        </div>
      </div>

      {/* Project Info */}
      <div className="p-3 sm:p-4 border-t border-gray-800">
        <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-white truncate">
              {project.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              {project.scenes.length} scene{project.scenes.length !== 1 ? 's' : ''} •{' '}
              {project.totalDuration}s
            </p>
          </div>

          {/* Menu Button */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center justify-center p-1.5 sm:p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isMenuOpen && (
              <ProjectMenu
                onDuplicate={() => {
                  onDuplicate(project.id);
                  setIsMenuOpen(false);
                }}
                onDelete={() => {
                  onDelete(project.id);
                  setIsMenuOpen(false);
                }}
              />
            )}
          </div>
        </div>

        {/* Metadata */}
        <ProjectMetadata project={project} />
      </div>
    </div>
  );
}

function ProjectMetadata({ project }: { project: Project }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="text-xs text-gray-500 space-y-1">
      <p>Created: {formatDate(project.createdAt)}</p>
      <p>Updated: {formatDate(project.updatedAt)}</p>
    </div>
  );
}
