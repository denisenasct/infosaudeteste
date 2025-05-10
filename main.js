
async function carregarPostos() {
  const url = "https://dados.recife.pe.gov.br/api/3/action/datastore_search?resource_id=54232db8-ed15-4f1f-90b0-2b5a20eef4cf&limit=1000";
  const response = await fetch(url);
  const data = await response.json();
  return data.result.records;
}

async function inicializarMapa() {
  const mapa = L.map('mapa').setView([-8.0476, -34.877], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(mapa);

  const postos = await carregarPostos();
  postos.forEach(p => {
    const lat = parseFloat(p.latitude);
    const lng = parseFloat(p.longitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      L.marker([lat, lng]).addTo(mapa).bindPopup(
        `<strong>${p.nome}</strong><br>${p.endereco}<br>${p.horario}`
      );
    }
  });

  window.buscarEndereco = function () {
    const endereco = document.getElementById('endereco').value;
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}`)
      .then(r => r.json()).then(data => {
        if (data.length) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          mapa.setView([lat, lon], 15);
          L.marker([lat, lon]).addTo(mapa).bindPopup('Você está aqui').openPopup();
        } else {
          alert('Endereço não encontrado.');
        }
      });
  };
}

window.onload = inicializarMapa;
