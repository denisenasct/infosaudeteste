import { useState } from 'react';

export default function FiltroBairro({ postos, onSelect }) {
  const [bairro, setBairro] = useState('');

  const bairrosUnicos = [...new Set(postos.map(p => p.bairro))];

  return (
    <div className="p-4">
      <label className="block mb-2 font-bold">Buscar por Bairro:</label>
      <select
        className="border p-2 rounded w-full"
        value={bairro}
        onChange={e => {
          setBairro(e.target.value);
          onSelect(e.target.value);
        }}
      >
        <option value="">Selecione um bairro</option>
        {bairrosUnicos.map(b => (
          <option key={b} value={b}>{b}</option>
        ))}
      </select>
    </div>
  );
}
