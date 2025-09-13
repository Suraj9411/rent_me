import { useState } from "react";

function Slider({ images }) {
  const [imageIndex, setImageIndex] = useState(null);

  const changeSlide = (direction) => {
    if (direction === "left") {
      if (imageIndex === 0) {
        setImageIndex(images.length - 1);
      } else {
        setImageIndex(imageIndex - 1);
      }
    } else {
      if (imageIndex === images.length - 1) {
        setImageIndex(0);
      } else {
        setImageIndex(imageIndex + 1);
      }
    }
  };

  return (
    <div className="relative">
      {imageIndex !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <div 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-3 cursor-pointer transition-colors duration-200 z-10"
              onClick={() => changeSlide("left")}
            >
              <img src="/arrow.png" alt="Previous" className="w-6 h-6" />
            </div>
            <div className="max-h-[80vh] flex items-center justify-center">
              <img 
                src={images[imageIndex]} 
                alt="" 
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
            <div 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-3 cursor-pointer transition-colors duration-200 z-10"
              onClick={() => changeSlide("right")}
            >
              <img src="/arrow.png" alt="Next" className="w-6 h-6 rotate-180" />
            </div>
            <div 
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white text-2xl font-bold w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200 z-10"
              onClick={() => setImageIndex(null)}
            >
              ×
            </div>
          </div>
        </div>
      )}
      <div className="mb-4">
        <img 
          src={images[0]} 
          alt="" 
          onClick={() => setImageIndex(0)}
          className="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity duration-200"
        />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {images.slice(1).map((image, index) => (
          <img
            src={image}
            alt=""
            key={index}
            onClick={() => setImageIndex(index + 1)}
            className="w-full h-16 object-cover rounded cursor-pointer hover:opacity-90 transition-opacity duration-200"
          />
        ))}
      </div>
    </div>
  );
}

export default Slider;
