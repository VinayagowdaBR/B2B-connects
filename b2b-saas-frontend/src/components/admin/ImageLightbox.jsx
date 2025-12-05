import { X, ChevronLeft, ChevronRight, Download, ExternalLink } from 'lucide-react';
import { useEffect, useCallback } from 'react';

const ImageLightbox = ({ isOpen, onClose, images, currentIndex, onNavigate }) => {
  const currentImage = images[currentIndex];

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    }
  }, [currentIndex, onNavigate]);

  const handleNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      onNavigate(currentIndex + 1);
    }
  }, [currentIndex, images.length, onNavigate]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrevious, handleNext]);

  if (!isOpen || !currentImage) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-lg transition-colors z-10"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Image Counter */}
      <div className="absolute top-4 left-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white text-sm z-10">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Navigation Buttons */}
      {currentIndex > 0 && (
        <button
          onClick={handlePrevious}
          className="absolute left-4 p-3 text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}

      {currentIndex < images.length - 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 p-3 text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}

      {/* Image Container */}
      <div className="max-w-7xl max-h-[90vh] p-4">
        <img
          src={currentImage.image_url}
          alt={currentImage.image_title}
          className="max-w-full max-h-[80vh] object-contain rounded-lg"
        />
        
        {/* Image Info */}
        <div className="mt-4 text-center space-y-2">
          <h3 className="text-xl font-bold text-white">{currentImage.image_title}</h3>
          {currentImage.category && (
            <span className="inline-block px-3 py-1 bg-indigo-600 text-white rounded-full text-sm">
              {currentImage.category}
            </span>
          )}
          <div className="flex items-center justify-center space-x-4 mt-4">
            <a
              href={currentImage.image_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open Original</span>
            </a>
            <a
              href={currentImage.image_url}
              download
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </a>
          </div>
        </div>
      </div>

      {/* Click outside to close */}
      <div
        className="absolute inset-0 -z-10"
        onClick={onClose}
      />
    </div>
  );
};

export default ImageLightbox;
