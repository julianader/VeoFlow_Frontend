import { useState } from 'react';
import { Sun, Droplet, Palette, Zap, Volume2, Sparkles } from 'lucide-react';

interface VideoControlsProps {
  onControlChange: (control: string, value: number) => void;
}

export default function VideoControls({ onControlChange }: VideoControlsProps) {
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [hue, setHue] = useState(0);
  const [volume, setVolume] = useState(100);
  const [sharpness, setSharpness] = useState(100);

  const controls = [
    { 
      name: 'Brightness', 
      icon: Sun, 
      value: brightness, 
      setValue: setBrightness,
      min: 0,
      max: 200,
      unit: '%'
    },
    { 
      name: 'Contrast', 
      icon: Zap, 
      value: contrast, 
      setValue: setContrast,
      min: 0,
      max: 200,
      unit: '%'
    },
    { 
      name: 'Saturation', 
      icon: Droplet, 
      value: saturation, 
      setValue: setSaturation,
      min: 0,
      max: 200,
      unit: '%'
    },
    { 
      name: 'Hue', 
      icon: Palette, 
      value: hue, 
      setValue: setHue,
      min: -180,
      max: 180,
      unit: '°'
    },
    { 
      name: 'Sharpness', 
      icon: Sparkles, 
      value: sharpness, 
      setValue: setSharpness,
      min: 0,
      max: 200,
      unit: '%'
    },
    { 
      name: 'Volume', 
      icon: Volume2, 
      value: volume, 
      setValue: setVolume,
      min: 0,
      max: 200,
      unit: '%'
    },
  ];

  return (
    <div className="bg-gray-900 rounded-lg p-3 sm:p-4 space-y-3 sm:space-y-4">
      <h3 className="text-xs sm:text-sm font-semibold text-gray-300 mb-3 sm:mb-4">Video Adjustments</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {controls.map((control) => (
          <div key={control.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <control.icon className="w-4 h-4 text-gray-400" />
                <label className="text-xs text-gray-400">{control.name}</label>
              </div>
              <span className="text-xs font-mono text-cyan-400">
                {control.value}{control.unit}
              </span>
            </div>
            <input
              type="range"
              min={control.min}
              max={control.max}
              value={control.value}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                control.setValue(val);
                onControlChange(control.name.toLowerCase(), val);
              }}
              className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${((control.value - control.min) / (control.max - control.min)) * 100}%, #374151 ${((control.value - control.min) / (control.max - control.min)) * 100}%, #374151 100%)`
              }}
            />
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          setBrightness(100);
          setContrast(100);
          setSaturation(100);
          setHue(0);
          setSharpness(100);
          setVolume(100);
        }}
        className="w-full mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors"
      >
        Reset All
      </button>
    </div>
  );
}
