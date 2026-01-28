import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Project } from './types';
import Navbar from './components/Layout/Navbar';
import LandingPage from './pages/LandingPage';
import EditorPage from './pages/EditorPage';
import ProjectsPage from './pages/ProjectsPage';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleGetStarted = () => {
    setEditingProject(null);
    navigate('/editor');
  };

  const handleBackToLanding = () => {
    navigate('/');
  };

  const handleViewProjects = () => {
    navigate('/projects');
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    navigate('/editor');
  };

  const isLandingPage = location.pathname === '/';

  return (
    <>
      {isLandingPage && <Navbar onGetStarted={handleGetStarted} onViewProjects={handleViewProjects} />}
      {isLandingPage && <LandingPage onGetStarted={handleGetStarted} />}
      {location.pathname === '/editor' && (
        <EditorPage
          onBack={handleBackToLanding}
          onViewProjects={handleViewProjects}
          editingProject={editingProject}
        />
      )}
      {location.pathname === '/projects' && (
        <ProjectsPage onBack={handleBackToLanding} onEditProject={handleEditProject} />
      )}
    </>
  );
}

export default App;
