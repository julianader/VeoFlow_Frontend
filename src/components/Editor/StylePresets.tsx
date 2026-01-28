import { Check } from 'lucide-react';
import { StylePreset } from '../../types';

interface StylePresetsProps {
  presets: StylePreset[];
  selectedPreset: string;
  onSelectPreset: (id: string) => void;
}

export default function StylePresets({ presets, selectedPreset, onSelectPreset }: StylePresetsProps) {
  return (
    <div className="bg-gray-950 rounded-xl sm:rounded-2xl border border-gray-800 p-4 sm:p-5 lg:p-6">
      <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Style Presets</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelectPreset(preset.id)}
            className={`relative group text-left p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-300 ${
              selectedPreset === preset.id
                ? 'border-cyan-500 bg-cyan-500/10'
                : 'border-gray-800 bg-gray-900 hover:border-gray-700'
            }`}
          >
            <div className="aspect-video rounded-lg bg-gradient-to-br from-cyan-900/30 via-blue-900/30 to-purple-900/30 mb-2 sm:mb-3 flex items-center justify-center overflow-hidden">
              <div className="text-3xl sm:text-4xl">{preset.thumbnail}</div>
            </div>

            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-white text-xs sm:text-sm mb-0.5 sm:mb-1 truncate">{preset.name}</h4>
                <p className="text-xs text-gray-400 line-clamp-2">{preset.description}</p>
              </div>

              {selectedPreset === preset.id && (
                <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-cyan-500 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
