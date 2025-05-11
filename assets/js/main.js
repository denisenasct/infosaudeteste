# JS com mapa, busca por endereço, filtro por bairro e especialidade
js = """
let mapa;
let marcadores = [];
let dadosPostos = [];

async function carregarPostos() {
  const url = "https://dados.recife.pe.gov.br/api/3/action/datastore_search?resource_id=54232db8-ed15-4f1f-90b0-2b5a20eef4cf&limit=1000";
  const response = await fetch(url);
  const data = await response.json();
  dadosPostos = data.result.records;
  atualizarFiltros();
  mostrarPostos(dadosPostos);
}

function atualizarFiltros() {
  const bairros = new Set();
  const especialidades = new Set();
  dadosPostos.forEach(p => {
    if (p.bairro) bairros.add(p.bairro.trim());
    if (p.especialidades) {
      p.especialidades.split(',').forEach(e => especialidades.add(e.trim()));
    }
  });
  const selBairro = document.getElementById("bairro");
  bairros.forEach(b => {
    const opt = document.createElement("option");
    opt.value = b;
    opt.textContent = b;
    selBairro.appendChild(opt);
  });
  const selEsp = document.getElementById("especialidade");
  especialidades.forEach(e => {
    const opt = document.createElement("option");
    opt.value = e;
    opt.textContent = e;
    selEsp.appendChild(opt);
  });
}

function mostrarPostos(lista) {
  const listaDiv = document.getElementById("lista-postos");
  listaDiv.innerHTML = "";
  if (!mapa) return;

  marcadores.forEach(m => mapa.removeLayer(m));
  marcadores = [];

  lista.forEach(p => {
    const lat = parseFloat(p.latitude);
    const lng = parseFloat(p.longitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      const marcador = L.marker([lat, lng]).addTo(mapa)
        .bindPopup(`<strong>${p.nome}</strong><br>${p.endereco}<br>${p.especialidades || ''}`);
      marcadores.push(marcador);

      const card = document.createElement("div");
      card.innerHTML = `<strong>${p.nome}</strong><br>${p.bairro} - ${p.distrito_sanitario}<br><em>${p.especialidades || ''}</em><hr>`;
      listaDiv.appendChild(card);
    }
  });
}

function aplicarFiltros() {
  const bairro = document.getElementById("bairro").value;
  const esp = document.getElementById("especialidade").value;
  const filtrado = dadosPostos.filter(p => {
    const condBairro = bairro ? (p.bairro && p.bairro === bairro) : true;
    const condEsp = esp ? (p.especialidades && p.especialidades.includes(esp)) : true;
    return condBairro && condEsp;
  });
  mostrarPostos(filtrado);
}

function buscarEndereco() {
  const valor = document.getElementById("cep").value;
  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(valor)}`)
    .then(r => r.json()).then(data => {
      if (data.length) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        mapa.setView([lat, lon], 15);
        L.marker([lat, lon]).addTo(mapa).bindPopup("Você está aqui").openPopup();
        aplicarFiltros();
      }
    });
}

function inicializarMapa() {
  mapa = L.map("mapa-container").setView([-8.0476, -34.877], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(mapa);
}

window.onload = () => {
  inicializarMapa();
  carregarPostos();
  document.getElementById("bairro").addEventListener("change", aplicarFiltros);
  document.getElementById("especialidade").addEventListener("change", aplicarFiltros);
};
"""

# Gravar arquivos
with open(f"{base_dir}/index.html", "w") as f: f.write(html)
with open(f"{base_dir}/assets/css/style.css", "w") as f: f.write(css)
with open(f"{base_dir}/assets/js/main.js", "w") as f: f.write(js)
