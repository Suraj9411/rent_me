import { Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";

function Pin({ item }) {
  // Safely parse coordinates
  const lat = parseFloat(item.latitude);
  const lng = parseFloat(item.longitude);
  
  // Only render if coordinates are valid
  if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return null;
  }

  // Check if this is a selected location pin (not a real post)
  const isSelectedLocation = item.id === 'selected';

  return (
    <Marker position={[lat, lng]}>
      <Popup>
        <div className="p-2 min-w-48">
          {isSelectedLocation ? (
            // Selected location popup
            <div className="text-center">
              <span className="text-lg">📍 Selected Location</span>
              <p className="text-sm text-gray-600 mt-1">Lat: {lat.toFixed(6)}</p>
              <p className="text-sm text-gray-600">Lng: {lng.toFixed(6)}</p>
            </div>
          ) : (
            // Real post popup
            <div className="flex gap-3">
              <img 
                src={item.images?.[0] || '/home1.jpg'} 
                alt={item.title} 
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex flex-col justify-center min-w-0">
                <Link 
                  to={`/${item.id}`}
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 truncate"
                >
                  {item.title}
                </Link>
                <span className="text-xs text-gray-500 mt-1">{item.bedroom} bedroom</span>
                <b className="text-sm text-blue-600 mt-1">$ {item.price}</b>
              </div>
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
}

export default Pin;