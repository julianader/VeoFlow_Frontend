import { useState, useEffect } from 'react';
import { Project } from '../types';
import api from '../services/api';

const PROJECTS_STORAGE_KEY = 'visionforge_projects';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load projects from backend if available, otherwise localStorage
  useEffect(() => {
    const load = async () => {
      const base = api.baseUrl;
      try {
        const res = await api.get('/api/projects');
        if (Array.isArray(res)) {
          setProjects(res);
          setIsLoaded(true);
          return;
        }
      } catch (err: any) {
        // If backend is not available or unauthorized, fall back to localStorage
        console.warn('Backend projects fetch failed, falling back to localStorage', err?.status || err);
      }

      const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
      if (stored) {
        try {
          setProjects(JSON.parse(stored));
        } catch (error) {
          console.error('Failed to load projects from localStorage:', error);
        }
      }
      setIsLoaded(true);
    };

    load();
  }, []);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    }
  }, [projects, isLoaded]);

  const saveProject = async (project: Project) => {
    try {
      // If project has an ID that looks like a timestamp (old format), remove it
      const isTimestampId = project.id && /^\d+$/.test(project.id);
      
      if (!project.id || isTimestampId) {
        // Create new project on backend
        const response = await api.post('/api/projects', {
          title: project.name,
          description: project.name,
          videoSettings: {
            voiceOverEnabled: project.voiceOverEnabled || false,
            stylePreset: project.selectedPreset || '1',
          }
        });
        
        const backendProjectId = response.data._id || response.data.id;
        
        // Now add scenes to the project
        if (project.scenes && project.scenes.length > 0) {
          for (const scene of project.scenes) {
            try {
              await api.post(`/api/projects/${backendProjectId}/scenes`, {
                title: scene.prompt.substring(0, 50) + (scene.prompt.length > 50 ? '...' : ''),
                script: scene.prompt,
                duration: scene.duration * 1000, // Convert to milliseconds
                stylePreset: scene.style,
                order: project.scenes.indexOf(scene),
              });
            } catch (err) {
              console.warn('Failed to add scene:', err);
            }
          }
        }
        
        const newProject = {
          ...project,
          id: backendProjectId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        setProjects((prev) => {
          const filtered = prev.filter((p) => p.id !== project.id);
          return [...filtered, newProject];
        });
        
        return newProject;
      }
      
      // Update existing project
      await api.put(`/api/projects/${project.id}`, {
        title: project.name,
        description: project.name,
        videoSettings: {
          voiceOverEnabled: project.voiceOverEnabled || false,
          stylePreset: project.selectedPreset || '1',
        }
      });
      
      setProjects((prev) => {
        const existingIndex = prev.findIndex((p) => p.id === project.id);
        if (existingIndex >= 0) {
          const updated = [...prev];
          const updatedProject = { ...project, updatedAt: new Date().toISOString() };
          updated[existingIndex] = updatedProject;
          return updated;
        }
        return prev;
      });
      
      return { ...project, updatedAt: new Date().toISOString() };
    } catch (err) {
      console.warn('Failed to persist project to backend:', err);
      // Fallback to localStorage only
      setProjects((prev) => {
        const existingIndex = prev.findIndex((p) => p.id === project.id);
        if (existingIndex >= 0) {
          const updated = [...prev];
          const updatedProject = { ...project, updatedAt: new Date().toISOString() };
          updated[existingIndex] = updatedProject;
          return updated;
        }
        const newProj = { ...project, id: project.id || `local_${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        return [...prev, newProj];
      });
      return project;
    }
  };

  const deleteProject = async (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    
    // Only try to delete from backend if it's a valid MongoDB ObjectID (not a timestamp)
    const isMongoId = id && /^[0-9a-fA-F]{24}$/.test(id);
    if (isMongoId) {
      try {
        await api.del(`/projects/${id}`);
      } catch (err) {
        console.warn('Failed to delete project on backend:', err);
      }
    }
  };

  const deleteAllProjects = async () => {
    const projectIds = [...projects.map(p => p.id)];
    setProjects([]);
    
    // Delete each project from backend (only valid MongoDB IDs)
    for (const id of projectIds) {
      const isMongoId = id && /^[0-9a-fA-F]{24}$/.test(id);
      if (isMongoId) {
        try {
          await api.del(`/api/projects/${id}`);
        } catch (err) {
          console.warn('Failed to delete project on backend:', err);
        }
      }
    }
    
    // Clear localStorage to remove old timestamp-based projects
    localStorage.removeItem('visionforge_projects');
  };

  const duplicateProject = (id: string) => {
    const projectToDuplicate = projects.find((p) => p.id === id);
    if (projectToDuplicate) {
      const newProject: Project = {
        ...projectToDuplicate,
        id: undefined as any, // Let backend assign new ID
        name: `${projectToDuplicate.name} (Copy)`,
      };
      saveProject(newProject);
      return newProject;
    }
  };

  const getProject = (id: string) => {
    return projects.find((p) => p.id === id);
  };

  return {
    projects,
    isLoaded,
    saveProject,
    deleteProject,
    deleteAllProjects,
    duplicateProject,
    getProject,
  };
};
