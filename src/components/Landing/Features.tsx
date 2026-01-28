import { Video, Mic, Layers, Sparkles, Zap, Download } from 'lucide-react';

const features = [
  {
    icon: Video,
    title: 'Text-to-Video Magic',
    description: 'Transform your scripts into stunning videos using Google Veo 3. Choose between quality or speed modes.',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Mic,
    title: 'AI Voice-Over',
    description: 'Add professional narration with AI-powered text-to-speech. Multiple voices and languages supported.',
    gradient: 'from-blue-500 to-purple-500',
  },
  {
    icon: Layers,
    title: 'Multi-Scene Storyboard',
    description: 'Create complex explainers with multiple scenes. Add, reorder, and trim clips with simple drag-and-drop.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Sparkles,
    title: 'Style Presets',
    description: 'Choose from professional templates designed for explainer videos. Consistent branding made easy.',
    gradient: 'from-pink-500 to-cyan-500',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Generate videos in minutes, not hours. Our optimized pipeline ensures quick turnaround times.',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Download,
    title: 'Export & Share',
    description: 'Download in HD MP4 or share directly to social media. Your content, ready for the world.',
    gradient: 'from-blue-500 to-purple-500',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-gray-950 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 px-2">
            Everything You Need to Create
            <span className="block mt-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Professional Explainer Videos
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto px-4">
            Powerful AI tools designed for creators who want speed, quality, and ease of use.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-5 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-cyan-500/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/5 group-hover:to-blue-500/5 rounded-xl sm:rounded-2xl transition-all duration-300"></div>

              <div className="relative">
                <div className={`inline-flex p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r ${feature.gradient} mb-3 sm:mb-4`}>
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>

                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">
                  {feature.title}
                </h3>

                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
