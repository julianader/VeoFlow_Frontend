import { Sparkles, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  onGetStarted?: () => void;
  onViewProjects?: () => void;
}

export default function Navbar({ onGetStarted, onViewProjects }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur opacity-75 animate-pulse"></div>
              <Sparkles className="relative w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Veo Flow
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <a href="#features" className="text-sm lg:text-base text-gray-300 hover:text-white transition-colors">
              Features
            </a>
            <a href="#examples" className="text-sm lg:text-base text-gray-300 hover:text-white transition-colors">
              Examples
            </a>
            <a href="#pricing" className="text-sm lg:text-base text-gray-300 hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#about" className="text-sm lg:text-base text-gray-300 hover:text-white transition-colors">
              About
            </a>
            {onViewProjects && (
              <button
                onClick={onViewProjects}
                className="px-3 lg:px-4 py-2 text-sm rounded-lg border border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400 transition-colors font-medium"
              >
                My Projects
              </button>
            )}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <button className="text-sm lg:text-base text-gray-300 hover:text-white transition-colors">
              Sign in
            </button>
            <button
              onClick={onGetStarted}
              className="relative group px-4 lg:px-6 py-2 rounded-lg overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-100 group-hover:opacity-90 transition-opacity"></div>
              <span className="relative text-white font-semibold text-sm lg:text-base">Get Started</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={onGetStarted}
              className="relative group px-4 py-2 rounded-lg overflow-hidden text-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-100 group-hover:opacity-90 transition-opacity"></div>
              <span className="relative text-white font-semibold">Start</span>
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col space-y-4">
              <a
                href="#features"
                className="text-gray-300 hover:text-white transition-colors px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#examples"
                className="text-gray-300 hover:text-white transition-colors px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Examples
              </a>
              <a
                href="#pricing"
                className="text-gray-300 hover:text-white transition-colors px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a
                href="#about"
                className="text-gray-300 hover:text-white transition-colors px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </a>
              {onViewProjects && (
                <button
                  onClick={() => {
                    onViewProjects();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left px-2 py-2 rounded-lg border border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400 transition-colors font-medium"
                >
                  My Projects
                </button>
              )}
              <button
                className="text-left text-gray-300 hover:text-white transition-colors px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign in
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
