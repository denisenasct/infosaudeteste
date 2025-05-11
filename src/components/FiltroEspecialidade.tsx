import { useState } from 'react';

export default function FiltroEspecialidade({ postos, onSelect }) {
  const [especialidade, setEspecialidade] = useState('');

  const todas = postos.flatMap(p => p.especialidades || []);
  const especialidadesUnicas = [...new Set(todas)].sort();

  return (
    <div className="p-4">
      <label className="block mb-2 font-bold">Buscar por Especialidade:</label>
      <select
        className="border p-2 rounded w-full"
        value={especialidade}
        onChange={e => {
          setEspecialidade(e.target.value);
          onSelect(e.target.value);
        }}
      >
        <option value="">Selecione uma especialidade</option>
        {especialidadesUnicas.map(e => (
          <option key={e} value={e}>{e}</option>
        ))}
      </select>
    </div>
  );
}
