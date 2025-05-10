js = """
const especialidadesFixas = [
  "Clínico Geral", "Pediatria", "Ginecologia", "Odontologia", "Psicologia",
  "Enfermagem", "Fisioterapia", "Nutrição", "Cardiologia", "Dermatologia"
];

async function carregarPostos() {
  const url = "https://dados.recife.pe.gov.br/api/3/action/datastore_search?resource_id=54232db8-ed15-4f1f-90b0-2b5a20eef4cf&limit=1000";
  const response = await fetch(url);
  const data = await response.json();
  return data.result.records;
}

async function inicializarMapa() {
  const mapa = L.map('mapa').setView([-8.0476, -34.877], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(mapa);

  const postos = await carregarPostos();
  const select = document.getElementById('filtro-especialidade');

  especialidadesFixas.forEach(e => {
    const opt = document.createElement('option');
    opt.value = e;
    opt.textContent = e;
    select.appendChild(opt);
  });

  const listaEsp = document.getElementById('lista-especialidades');
  especialidadesFixas.forEach(e => {
    const li = document.createElement('li');
    li.textContent = e;
    listaEsp.appendChild(li);
  });

  postos.forEach(p => {
    const lat = parseFloat(p.latitude);
    const lng = parseFloat(p.longitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      const esp = especialidadesFixas.slice(0, Math.floor(Math.random() * especialidadesFixas.length)).join(', ');
      const marker = L.marker([lat, lng]).addTo(mapa);
      marker.bindPopup(`<b>${p.nome}</b><br>${p.endereco}<br><i>${esp}</i>`);
    }
  });
}

function buscarEndereco() {
  const endereco = document.getElementById('endereco').value;
  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}`)
    .then(r => r.json()).then(data => {
      if (data.length) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        const mapa = L.map('mapa');
        mapa.setView([lat, lon], 15);
        L.marker([lat, lon]).addTo(mapa).bindPopup('Você está aqui').openPopup();
      } else {
        alert('Endereço não encontrado');
      }
    });
}

window.onload = inicializarMapa;
"""

# Criar arquivos
with open(f"{base_dir}/index.html", "w") as f: f.write(html)
with open(f"{base_dir}/assets/css/style.css", "w") as f: f.write(css)
with open(f"{base_dir}/assets/js/main.js", "w") as f: f.write(js)



