# JS com integração à API de postos e mapa
js = """
async function carregarPostos() {
  const url = "https://dados.recife.pe.gov.br/api/3/action/datastore_search?resource_id=54232db8-ed15-4f1f-90b0-2b5a20eef4cf&limit=1000";
  const response = await fetch(url);
  const data = await response.json();
  return data.result.records;
}

async function inicializarMapa() {
  const mapa = L.map('mapa-container').setView([-8.0476, -34.877], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(mapa);

  const postos = await carregarPostos();
  const distritos = {};

  postos.forEach(p => {
    const lat = parseFloat(p.latitude);
    const lon = parseFloat(p.longitude);
    if (!isNaN(lat) && !isNaN(lon)) {
      L.marker([lat, lon]).addTo(mapa)
        .bindPopup(`<strong>${p.nome}</strong><br>${p.endereco}<br>${p.distrito_sanitario || ''}`);
      
      if (!distritos[p.distrito_sanitario]) {
        distritos[p.distrito_sanitario] = [];
      }
      distritos[p.distrito_sanitario].push(p.nome);
    }
  });

  const lista = document.getElementById('lista-postos');
  for (const distrito in distritos) {
    const div = document.createElement('div');
    div.innerHTML = `<h3>${distrito}</h3><ul>${distritos[distrito].map(n => `<li>${n}</li>`).join('')}</ul>`;
    lista.appendChild(div);
  }
}

function buscarEndereco() {
  const endereco = document.getElementById('endereco').value;
  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}`)
    .then(r => r.json()).then(data => {
      if (data.length) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        const mapa = L.map('mapa-container');
        mapa.setView([lat, lon], 15);
        L.marker([lat, lon]).addTo(mapa).bindPopup('Você está aqui').openPopup();
      } else {
        alert('Endereço não encontrado');
      }
    });
}

window.onload = inicializarMapa;
"""

# Imagem fictícia de posto de saúde (placeholder)
image_content = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01...'

# Criar arquivos
with open(f"{base_dir}/index.html", "w") as f: f.write(html)
with open(f"{base_dir}/assets/css/style.css", "w") as f: f.write(css)
with open(f"{base_dir}/assets/js/main.js", "w") as f: f.write(js)
with open(f"{base_dir}/assets/img/posto.png", "wb") as f: f.write(image_content)
