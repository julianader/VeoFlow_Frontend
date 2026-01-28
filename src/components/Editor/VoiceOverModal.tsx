import { X, Mic } from 'lucide-react';
import { useState, useEffect } from 'react';

interface VoiceOverModalProps {
  isOpen: boolean;
  sceneId: string | null;
  existingVoiceOver?: {
    text: string;
    voiceType: string;
  };
  onClose: () => void;
  onSave: (sceneId: string, text: string, voiceType: string) => void;
}

export default function VoiceOverModal({ 
  isOpen, 
  sceneId, 
  existingVoiceOver,
  onClose, 
  onSave 
}: VoiceOverModalProps) {
  const [text, setText] = useState('');
  const [voiceType, setVoiceType] = useState('male-professional');

  useEffect(() => {
    if (existingVoiceOver) {
      setText(existingVoiceOver.text || '');
      setVoiceType(existingVoiceOver.voiceType || 'male-professional');
    } else {
      setText('');
      setVoiceType('male-professional');
    }
  }, [existingVoiceOver, isOpen]);

  if (!isOpen || !sceneId) return null;

  const handleSubmit = () => {
    if (text.trim()) {
      onSave(sceneId, text, voiceType);
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
          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Add AI Voice-Over</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Narration Text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-purple-500 resize-none"
              rows={6}
              placeholder="Enter the narration text for this scene... This will be converted to AI voice-over."
            />
            <p className="mt-2 text-xs text-gray-500">
              Characters: {text.length} | Estimated duration: ~{Math.ceil(text.length / 15)} seconds
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Voice Type
            </label>
            <select
              value={voiceType}
              onChange={(e) => setVoiceType(e.target.value)}
              className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="male-professional">Professional Male</option>
              <option value="female-professional">Professional Female</option>
              <option value="male-casual">Casual Male</option>
              <option value="female-casual">Casual Female</option>
            </select>
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
              disabled={!text.trim()}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate Voice-Over
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
