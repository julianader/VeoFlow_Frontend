# VisionForge - AI Video Creation Platform

A modern, production-ready frontend for an AI-powered video creation platform built with React, TypeScript, and Tailwind CSS.

## Features

- **Modern Landing Page**: Beautiful hero section with gradient effects and smooth animations
- **Video Editor Dashboard**: Full-featured editor interface with:
  - Scene storyboard for managing multiple video clips
  - Style presets for different video types
  - AI voice-over settings
  - Video preview area
  - Export and sharing capabilities
- **Responsive Design**: Fully mobile-friendly and works across all devices
- **Smooth Animations**: Custom keyframe animations for a polished UX
- **Dark Theme**: Modern dark mode with cyan/blue gradient accents

## Tech Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for fast development and building

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Editor/
│   │   ├── EditorDashboard.tsx    # Main editor interface
│   │   ├── Storyboard.tsx         # Scene management
│   │   ├── SceneCard.tsx          # Individual scene card
│   │   ├── StylePresets.tsx       # Video style selector
│   │   ├── VideoSettings.tsx      # Voice-over and quality settings
│   │   └── NewSceneModal.tsx      # Add new scene dialog
│   ├── Navbar.tsx                 # Navigation header
│   ├── Hero.tsx                   # Landing page hero section
│   └── Features.tsx               # Features showcase
├── types/
│   └── index.ts                   # TypeScript interfaces
├── App.tsx                        # Main app component
├── main.tsx                       # Entry point
└── index.css                      # Global styles and animations
```

## Key Components

### Landing Page
- **Navbar**: Fixed navigation with branding and CTA buttons
- **Hero**: Eye-catching hero section with animated gradient text
- **Features**: Grid showcasing platform capabilities

### Editor Dashboard
- **Scene Management**: Add, delete, and reorder video scenes
- **Style Presets**: Choose from 6 pre-designed video styles
- **Video Settings**: Configure voice-overs and quality modes
- **Timeline**: Visual storyboard of all scenes

## Customization

### Colors
The project uses a cyan/blue color scheme. To customize:
- Edit gradient colors in component files
- Modify Tailwind theme in `tailwind.config.js`

### Animations
Custom animations are defined in `src/index.css`:
- `animate-fade-in`: Fade in effect
- `animate-fade-in-up`: Fade in with upward motion
- `animate-scale-in`: Scale up animation
- `animate-progress`: Progress bar animation

## Backend Integration

This is a frontend-only implementation. To connect to your backend:

1. Replace mock data in components with API calls
2. Add state management (Redux, Zustand, etc.) if needed
3. Implement actual video generation via Google Veo 3 API
4. Add authentication and user management
5. Connect to database for project saving

## License

MIT

## Notes

- The current implementation uses mock data for demonstration
- All video generation UI is ready for backend integration
- Supabase integration is available but not yet connected
- The design is inspired by modern SaaS platforms with a focus on usability
