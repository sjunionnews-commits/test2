const ELEMENTS = [
  { type: "pipe1", name: "Труба 1м", len: 1000, icon: `<rect x="13" y="5" width="10" height="28" rx="3" fill="#b0bec5"/><rect x="13" y="5" width="10" height="5" fill="#e0e0e0"/>` },
  { type: "pipe05", name: "Труба 0.5м", len: 500, icon: `<rect x="13" y="10" width="10" height="14" rx="3" fill="#b0bec5"/><rect x="13" y="10" width="10" height="5" fill="#e0e0e0"/>` },
  { type: "elbow45", name: "Колено 45°", len: 70, icon: `<polygon points="18,20 26,28 22,32 14,24" fill="#e0e0e0"/><polygon points="20,18 28,26 24,30 16,22" fill="#b0bec5"/>` },
  { type: "elbow90", name: "Колено 90°", len: 90, icon: `<rect x="16" y="16" width="12" height="6" rx="2" fill="#b0bec5"/><rect x="22" y="18" width="6" height="12" rx="2" fill="#b0bec5"/>` },
  { type: "tee", name: "Тройник", len: 110, icon: `<rect x="13" y="10" width="10" height="18" rx="3" fill="#b0bec5"/><rect x="10" y="17" width="16" height="6" rx="2" fill="#e0e0e0"/>` },
  { type: "cap", name: "Оголовок", len: 50, icon: `<ellipse cx="18" cy="8" rx="8" ry="4" fill="#b0bec5"/><rect x="10" y="8" width="16" height="7" fill="#e0e0e0"/>` },
];
let assembly = [];

function renderElements() {
  const list = document.getElementById("elements-list");
  list.innerHTML = "";
  ELEMENTS.forEach(el => {
    list.innerHTML += `<div class="elem-btn" onclick="addElem('${el.type}')">
      <span class="elem-icon"><svg width="36" height="36">${el.icon}</svg></span>
      <span class="elem-name">${el.name}</span>
    </div>`;
  });
}

function addElem(type) {
  assembly.push(type);
  renderScheme();
  renderSpec();
}

function removeLast() {
  assembly.pop();
  renderScheme();
  renderSpec();
}

function renderScheme() {
  const blockH = 30, blockW = 36, margin = 8;
  let svg = `<svg width="60" height="${assembly.length * (blockH+margin) + 30}" style="background: #fafbfc; border-radius: 7px;">`;
  let y = 10;
  assembly.forEach((type,i) => {
    const el = ELEMENTS.find(e=>e.type===type);
    svg += `<g transform="translate(12,${y})">${el.icon}</g>`;
    y += blockH + margin;
  });
  svg += `</svg>`;
  document.getElementById("svg-scheme").innerHTML = svg;
}

function renderSpec() {
  let html = "";
  let totalLen = 0;
  let spec = {};
  assembly.forEach(type => {
    const el = ELEMENTS.find(e=>e.type===type);
    spec[el.name] = (spec[el.name]||0) + 1;
    totalLen += el.len;
  });
  for (let name in spec) {
    html += `<li>${name}: <b>${spec[name]}</b></li>`;
  }
  document.getElementById("spec-list").innerHTML = html;
  document.getElementById("spec-total").innerHTML = `Общая длина: <b>${totalLen} мм</b>`;
}

// Инициализация
renderElements();
renderScheme();
renderSpec();