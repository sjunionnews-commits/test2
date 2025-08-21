// SVG-заглушки для прототипа
const genIcons = {
  banya: `<svg width="48" height="48"><rect x="6" y="22" width="36" height="20" rx="4" fill="#e5e5e5"/><rect x="14" y="30" width="20" height="8" rx="2" fill="#ccc"/><rect x="19" y="12" width="10" height="12" fill="#bbb"/><rect x="21" y="7" width="6" height="6" fill="#aaa"/></svg>`,
  solid: `<svg width="48" height="48"><rect x="14" y="8" width="20" height="32" rx="4" fill="#e5e5e5"/><rect x="19" y="14" width="10" height="8" fill="#ccc"/><rect x="19" y="28" width="10" height="8" fill="#bbb"/></svg>`,
  gazNapol: `<svg width="48" height="48"><rect x="10" y="22" width="28" height="18" rx="4" fill="#e5e5e5"/><rect x="16" y="30" width="16" height="5" fill="#ccc"/><rect x="20" y="12" width="8" height="10" fill="#bbb"/></svg>`,
  gazWall: `<svg width="48" height="48"><rect x="15" y="10" width="18" height="28" rx="4" fill="#e5e5e5"/><rect x="20" y="18" width="8" height="12" fill="#ccc"/></svg>`
};
const adapterIcons = {
  mama: `<svg width="48" height="48"><rect x="10" y="24" width="28" height="12" rx="4" fill="#e5e5e5"/><rect x="16" y="16" width="16" height="8" rx="2" fill="#ccc"/></svg>`,
  start: `<svg width="48" height="48"><rect x="10" y="30" width="28" height="8" rx="4" fill="#e5e5e5"/><ellipse cx="24" cy="24" rx="14" ry="6" fill="#bbb"/></svg>`,
  none: `<svg width="48" height="48"><rect x="18" y="18" width="12" height="12" rx="3" fill="#ddd"/></svg>`
};

// Данные шагов (можно расширять под любые задачи)
const steps = [
  {
    key: "generator",
    title: "Выберите тип теплогенератора",
    type: "cards",
    options: [
      { value: "banya", icon: genIcons.banya, title: "Банная печь/камин", desc: "Дрова, до 600°C<br><span class='hint'>0,8 мм сталь</span>" },
      { value: "solid", icon: genIcons.solid, title: "Твердотопливный котёл", desc: "Дрова/уголь, до 600°C<br><span class='hint'>0,8 мм сталь</span>" },
      { value: "gaz-napol", icon: genIcons.gazNapol, title: "Газовый котёл напольный", desc: "Газ, до 200°C<br><span class='hint'>0,5 мм сталь</span>" },
      { value: "gaz-wall", icon: genIcons.gazWall, title: "Газовый котёл настенный", desc: "Газ, до 200°C<br><span class='hint'>0,5 мм сталь</span>" }
    ]
  },
  {
    key: "pipe_out",
    title: "Выберите выход трубы",
    type: "radio",
    options: [
      { value: "vertical", label: "Вертикальный" },
      { value: "horizontal", label: "Горизонтальный" }
    ]
  },
  {
    key: "adapter",
    title: "Выберите тип адаптера",
    type: "cards",
    options: [
      { value: "mama", icon: adapterIcons.mama, title: "Адаптер мама-мама", desc: "Для тёплых помещений" },
      { value: "start", icon: adapterIcons.start, title: "Адаптер стартовый", desc: "Для улицы/неотапливаемых" },
      { value: "none", icon: adapterIcons.none, title: "Без адаптера", desc: "Для бака или сборки по дыму" }
    ]
  },
  {
    key: "material_outer",
    title: "Материал внешней трубы",
    type: "radio",
    options: [
      { value: "steel", label: "Нержавеющая сталь" },
      { value: "galv", label: "Оцинкованная сталь" }
    ]
  },
  {
    key: "steel_thick",
    title: "Толщина стали внутренней трубы",
    type: "radio",
    options: [
      { value: "0.5", label: "0.5 мм" },
      { value: "0.8", label: "0.8 мм (рекомендуется)", highlight: true }
    ]
  },
  {
    key: "diameter",
    title: "Выберите диаметр сборки",
    type: "select",
    options: [
      "80","100","110","115","120","125","130","135","140","150","160","180","200","220","250","300"
    ]
  }
];

let state = {}; // для хранения выбранных значений
let activeStep = 0;

function renderSteps() {
  const step = steps[activeStep];
  let html = `<div class="step-title">${step.title}</div>`;
  if (step.type === "cards") {
    html += '<div class="card-grid">';
    step.options.forEach(opt => {
      const selected = state[step.key] === opt.value ? 'selected' : '';
      html += `<div class="option-card ${selected}" onclick="selectCard('${step.key}', '${opt.value}')">
        ${opt.icon ? opt.icon : ""}
        <div class="option-title">${opt.title}</div>
        <div class="option-desc">${opt.desc || ""}</div>
      </div>`;
    });
    html += '</div>';
  } else if (step.type === "radio") {
    html += `<div class="radio-group">`;
    step.options.forEach(opt => {
      const checked = state[step.key] === opt.value ? 'checked' : '';
      html += `<label class="radio-label"><input type="radio" name="${step.key}" value="${opt.value}" ${checked} onchange="selectRadio('${step.key}', '${opt.value}')"> ${opt.label} ${opt.highlight ? "<span class='hint'>рекомендуется</span>" : ""}</label>`;
    });
    html += `</div>`;
  } else if (step.type === "select") {
    html += `<select name="${step.key}" id="diameterSel" onchange="selectSelect('${step.key}')">`;
    html += `<option value="">Выберите...</option>`;
    step.options.forEach(val => {
      const sel = state[step.key] == val ? 'selected' : '';
      html += `<option value="${val}" ${sel}>ø ${val}</option>`;
    });
    html += `</select>`;
  }

  html += `<button class="btn-main" onclick="nextStep()" ${state[step.key] ? '' : 'disabled'}>${activeStep < steps.length - 1 ? 'Далее' : 'Показать итог'}</button>`;
  document.getElementById("steps").innerHTML = html;
  document.getElementById("summary").innerHTML = "";
}

function selectCard(key, value) {
  state[key] = value;
  renderSteps();
}
function selectRadio(key, value) {
  state[key] = value;
  renderSteps();
}
function selectSelect(key) {
  const val = document.getElementById("diameterSel").value;
  state[key] = val;
  renderSteps();
}
function nextStep() {
  if (activeStep < steps.length - 1) {
    activeStep++;
    renderSteps();
  } else {
    showSummary();
  }
}

function showSummary() {
  // Читаем выбранные значения и показываем итог
  let html = `<div class="summary-block"><h3>Вы выбрали:</h3><ul class="summary-list">`;
  html += `<li><b>Теплогенератор:</b> ${getTitle('generator', state.generator)}</li>`;
  html += `<li><b>Выход трубы:</b> ${getRadioLabel('pipe_out', state.pipe_out)}</li>`;
  html += `<li><b>Адаптер:</b> ${getTitle('adapter', state.adapter)}</li>`;
  html += `<li><b>Материал внешней трубы:</b> ${getRadioLabel('material_outer', state.material_outer)}</li>`;
  html += `<li><b>Толщина стали:</b> ${getRadioLabel('steel_thick', state.steel_thick)}</li>`;
  html += `<li><b>Диаметр сборки:</b> ø ${state.diameter} мм</li>`;
  html += `</ul><button class="btn-main" onclick="restart()">Начать заново</button>
  <a class="btn-main" style="background:#229ed9;text-align:center;display:block;text-decoration:none;margin-top:12px;" href="designer.html">Перейти к сборке</a>
  </div>`;
  document.getElementById("steps").innerHTML = "";
  document.getElementById("summary").innerHTML = html;
}

function getTitle(stepKey, value) {
  const step = steps.find(s => s.key === stepKey);
  if (!step) return value;
  const opt = (step.options || []).find(o => o.value === value);
  return opt ? opt.title : value;
}
function getRadioLabel(stepKey, value) {
  const step = steps.find(s => s.key === stepKey);
  if (!step) return value;
  const opt = (step.options || []).find(o => o.value === value);
  return opt ? opt.label : value;
}

function restart() {
  state = {}; activeStep = 0; renderSteps();
}

// Стартуем!
renderSteps();