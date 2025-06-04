const scriptList = document.getElementById("scriptList");
const content = document.getElementById("scriptContent");
const title = document.getElementById("scriptTitle");
const text = document.getElementById("scriptText");
const form = document.getElementById("addScriptForm");

let scripts = {};

const categorySelect = document.getElementById("categorySelect");
const newCategoryInput = document.getElementById("newCategory");

// Загрузка из localStorage
function loadScripts() {
  const saved = localStorage.getItem("scripts");
  if (saved) {
    scripts = JSON.parse(saved);
  } else {
    // Начальные скрипты
    scripts = {
      greeting: {
        title: "Приветствие",
        text: "Здравствуйте! Меня зовут [Имя]...",
        category: "Приветствие"
      },
      support: {
        title: "Поддержка",
        text: "Могу ли я узнать, в чём заключается проблема?",
        category: "Возражения"
      }
    };
  }
}

function saveScripts() {
  localStorage.setItem("scripts", JSON.stringify(scripts));
}

function renderScripts() {
  scriptList.innerHTML = "";

  const grouped = {};
  Object.entries(scripts).forEach(([key, script]) => {
    if (!grouped[script.category]) grouped[script.category] = [];
    grouped[script.category].push({ key, ...script });
  });

  for (const [category, items] of Object.entries(grouped)) {
    const catHeader = document.createElement("h3");
    catHeader.textContent = category;
    catHeader.style.margin = "20px 0 10px";
    catHeader.style.fontWeight = "bold";
    scriptList.appendChild(catHeader);

    items.forEach(({ key, title }) => {
      const btn = document.createElement("button");
      btn.className = "script-button";
      btn.dataset.script = key;
      btn.textContent = title;
      scriptList.appendChild(btn);
    });
  }

  assignButtonHandlers();
}

function assignButtonHandlers() {
  const buttons = document.querySelectorAll(".script-button");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const key = btn.getAttribute("data-script");
      const script = scripts[key];

      content.classList.add("fade");
      setTimeout(() => {
        title.textContent = script.title;
        text.textContent = script.text;
        content.classList.remove("fade");
      }, 200);
    });
  });

  // Активируем первый скрипт
  if (buttons.length > 0 && !document.querySelector(".script-button.active")) {
    buttons[0].click();
  }
}

// Обработка формы добавления
let category =
  categorySelect.value === "__custom__"
    ? newCategoryInput.value.trim()
    : categorySelect.value;

    scripts[key] = {
      title: titleInput.value,
      category,
      text: textInput.value
    };    


// Инициализация
loadScripts();
renderScripts();

function updateCategorySelect() {
  const categories = new Set();

  Object.values(scripts).forEach(script => {
    if (script.category) {
      categories.add(script.category);
    }
  });

  // Очистка select
  categorySelect.innerHTML = `<option value="" disabled selected>Выберите категорию</option>`;

  // Добавляем существующие категории
  [...categories].sort().forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });

  // Добавляем пункт "Другая..."
  const other = document.createElement("option");
  other.value = "__custom__";
  other.textContent = "Другая...";
  categorySelect.appendChild(other);
}

categorySelect.addEventListener("change", () => {
  if (categorySelect.value === "__custom__") {
    newCategoryInput.style.display = "block";
    newCategoryInput.required = true;
  } else {
    newCategoryInput.style.display = "none";
    newCategoryInput.required = false;
  }
});

form.addEventListener("submit", e => {
  e.preventDefault();

  const titleInput = document.getElementById("newTitle");
  const textInput = document.getElementById("newText");

  const key = "script_" + Date.now();
  const category =
    categorySelect.value === "__custom__"
      ? newCategoryInput.value.trim()
      : categorySelect.value;

  scripts[key] = {
    title: titleInput.value.trim(),
    category,
    text: textInput.value.trim()
  };

  saveScripts();
  renderScripts();
  updateCategorySelect();

  form.reset();
  newCategoryInput.style.display = "none"; // скрыть вручную введённую категорию
  newCategoryInput.required = false;
});
