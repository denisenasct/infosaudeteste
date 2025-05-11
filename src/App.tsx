import { useEffect, useState } from "react";
import FiltroBairro from "./components/FiltroBairro";
import FiltroEspecialidade from "./components/FiltroEspecialidade";
import MapaPostos from "./components/MapaPostos";
import fallbackData from "./data/postos.json";

export default function App() {
  const [postos, setPostos] = useState([]);
  const [filtro, setFiltro] = useState(null);

  useEffect(() => {
    async function carregarDados() {
      try {
        const res = await fetch("https://dados.recife.pe.gov.br/api/3/action/datastore_search?resource_id=7d898ab9-611e-405d-9f64-f5d09dc7b3e1&limit=1000");
        const data = await res.json();
        const convertidos = data.result.records.map(p => ({
          nome: p.nome || p.unidade,
          bairro: p.bairro,
          especialidades: [p.especialidade_1, p.especialidade_2, p.especialidade_3].filter(Boolean),
          horario: p.horario,
          distrito: p.distrito,
          latitude: parseFloat(p.latitude),
          longitude: parseFloat(p.longitude)
        }));
        setPostos(convertidos);
      } catch (e) {
        console.warn('API falhou, usando mock local');
        setPostos(fallbackData);
      }
    }
    carregarDados();
  }, []);

  const filtrados = filtro
    ? postos.filter(p =>
        p.bairro === filtro || p.especialidades?.includes(filtro)
      )
    : postos;

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-blue-800">InfoSaúde Recife</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FiltroBairro postos={postos} onSelect={setFiltro} />
        <FiltroEspecialidade postos={postos} onSelect={setFiltro} />
      </div>
      <MapaPostos postos={filtrados} />
    </div>
  );
}
