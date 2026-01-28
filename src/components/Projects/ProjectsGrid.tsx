import { Project } from '../../types';
import ProjectCard from './ProjectCard';

interface ProjectsGridProps {
  projects: Project[];
  onEditProject: (project: Project) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ProjectsGrid({ projects, onEditProject, onDuplicate, onDelete }: ProjectsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={onEditProject}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
