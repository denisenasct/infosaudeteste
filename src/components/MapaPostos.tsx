import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapaPostos({ postos }) {
  const position = [-8.0476, -34.877]; // Recife centro

  const customIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/854/854878.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  return (
    <MapContainer center={position} zoom={12} className="h-[500px] w-full my-4 rounded-xl shadow">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {postos.map((posto, idx) => (
        <Marker key={idx} position={[posto.latitude, posto.longitude]} icon={customIcon}>
          <Popup>
            <strong>{posto.nome}</strong><br />
            Bairro: {posto.bairro}<br />
            Horário: {posto.horario}<br />
            Especialidades: {posto.especialidades?.join(', ')}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
