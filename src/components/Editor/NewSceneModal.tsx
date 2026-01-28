import { X, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface NewSceneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddScene: (prompt: string, duration: number, style: string) => void;
}

export default function NewSceneModal({ isOpen, onClose, onAddScene }: NewSceneModalProps) {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(10);
  const [style, setStyle] = useState('professional');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (prompt.trim()) {
      onAddScene(prompt, duration, style);
      setPrompt('');
      setDuration(10);
      setStyle('professional');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-gray-900 rounded-2xl border border-gray-800 p-6 animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Create New Scene</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Scene Description
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-cyan-500 resize-none"
              rows={4}
              placeholder="Describe what you want to see in this scene... Be specific and descriptive for best results."
            />
            <p className="mt-2 text-xs text-gray-500">
              Tip: Include details about setting, mood, camera angles, and actions for better results.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Duration
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-white font-medium w-12 text-right">{duration}s</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Style
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="professional">Professional</option>
                <option value="minimal">Minimal</option>
                <option value="corporate">Corporate</option>
                <option value="playful">Playful</option>
                <option value="tech">Tech</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg border border-gray-700 text-white font-medium hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:opacity-90 transition-opacity"
            >
              Create Scene
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
