import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom red pin icon
const createCustomIcon = () => {
  return L.divIcon({
    className: 'custom-pin',
    html: `
      <div class="pin-container">
        <div class="pin-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
};

const Map = ({ items }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([20.5937, 78.9629], 5); // Default to India center

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    mapInstanceRef.current = map;

    // Add markers for each property
    items.forEach((item, index) => {
      // Use coordinates if available, otherwise use default positions
      const lat = item.latitude || (20.5937 + (index * 0.1));
      const lng = item.longitude || (78.9629 + (index * 0.1));

      const marker = L.marker([lat, lng], { icon: createCustomIcon() }).addTo(map);

      // Create simple popup content with just title
      const popupContent = `
        <div class="simple-popup">
          <a href="/${item.id}" class="popup-link">
            <h4 class="popup-title">${item.title}</h4>
          </a>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 200,
        className: 'simple-popup-wrapper'
      });

      // Fit map to show all markers
      if (index === items.length - 1) {
        const group = new L.featureGroup(items.map((_, i) => 
          L.marker([item.latitude || (20.5937 + (i * 0.1)), item.longitude || (78.9629 + (i * 0.1))])
        ));
        map.fitBounds(group.getBounds().pad(0.1));
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [items]);

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-xl">
      <div ref={mapRef} className="w-full h-full min-h-72"></div>
      <style jsx>{`
        .custom-pin .pin-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: #ff4757;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 2px 10px rgba(255, 71, 87, 0.4);
          border: 3px solid white;
          position: relative;
          animation: bounce 1s ease-in-out infinite;
        }
        
        .custom-pin .pin-icon {
          transform: rotate(45deg);
          font-size: 20px;
          color: white;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }
        
        .custom-pin .pin-container::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 8px solid #ff4757;
        }
        
        .simple-popup-wrapper .leaflet-popup-content-wrapper {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(102, 126, 234, 0.1);
          padding: 0;
          overflow: hidden;
        }
        
        .simple-popup-wrapper .leaflet-popup-content {
          margin: 0;
          padding: 0;
          min-width: 150px;
          max-width: 200px;
        }
        
        .simple-popup-wrapper .leaflet-popup-tip {
          background: white;
          border: 1px solid rgba(102, 126, 234, 0.1);
        }
        
        .simple-popup {
          padding: 12px 16px;
          text-align: center;
        }
        
        .simple-popup .popup-link {
          text-decoration: none;
          color: inherit;
          display: block;
        }
        
        .simple-popup .popup-link:hover {
          text-decoration: none;
        }
        
        .simple-popup .popup-title {
          font-size: 14px;
          font-weight: 600;
          color: #333;
          margin: 0;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: color 0.2s ease;
        }
        
        .simple-popup .popup-link:hover .popup-title {
          color: #667eea;
        }
        
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
          border-radius: 10px !important;
          overflow: hidden;
        }
        
        .leaflet-control-zoom a {
          background: white !important;
          color: #333 !important;
          border: none !important;
          font-weight: 600 !important;
          font-size: 16px !important;
          width: 35px !important;
          height: 35px !important;
          line-height: 35px !important;
          transition: all 0.3s ease !important;
        }
        
        .leaflet-control-zoom a:hover {
          background: #f8f9fa !important;
          color: #ff4757 !important;
        }
        
        .leaflet-control-zoom a:first-child {
          border-bottom: 1px solid #eee !important;
        }
        
        .leaflet-control-attribution {
          background: rgba(255, 255, 255, 0.9) !important;
          color: #666 !important;
          font-size: 11px !important;
          padding: 5px 10px !important;
          border-radius: 8px !important;
          margin: 10px !important;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important;
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: rotate(-45deg) translateY(0);
          }
          40% {
            transform: rotate(-45deg) translateY(-5px);
          }
          60% {
            transform: rotate(-45deg) translateY(-3px);
          }
        }
        
        .custom-pin:hover .pin-container {
          transform: rotate(-45deg) scale(1.1);
          box-shadow: 0 4px 20px rgba(255, 71, 87, 0.6);
        }
        
        
        @media (max-width: 768px) {
          .simple-popup-wrapper .leaflet-popup-content {
            min-width: 120px;
            max-width: 180px;
          }
          
          .simple-popup {
            padding: 10px 12px;
          }
          
          .simple-popup .popup-title {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
};

export default Map;