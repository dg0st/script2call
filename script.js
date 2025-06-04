const scriptList = document.getElementById("scriptList");
const content = document.getElementById("scriptContent");
const title = document.getElementById("scriptTitle");
const text = document.getElementById("scriptText");
const form = document.getElementById("addScriptForm");

const categorySelect = document.getElementById("categorySelect");
const newCategoryInput = document.getElementById("newCategory");

let scripts = {};

// Загрузка из localStorage или установка начальных данных
function loadScripts() {
  const saved = localStorage.getItem("scripts");
  if (saved) {
    scripts = JSON.parse(saved);
  } else {
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

// Сохранение в localStorage
function saveScripts() {
  localStorage.setItem("scripts", JSON.stringify(scripts));
}

// Обновление выпадающего списка категорий
function updateCategorySelect() {
  const categories = new Set();

  Object.values(scripts).forEach(script => {
    if (script.category) {
      categories.add(script.category);
    }
  });

  categorySelect.innerHTML = `<option value="" disabled selected>Выберите категорию</option>`;

  [...categories].sort().forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });

  const other = document.createElement("option");
  other.value = "__custom__";
  other.textContent = "Другая...";
  categorySelect.appendChild(other);
}

// Отображение всех скриптов в списке
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
      const container = document.createElement("div");
      container.style.display = "flex";
      container.style.justifyContent = "space-between";
      container.style.alignItems = "center";
      container.style.gap = "10px";
    
      const btn = document.createElement("button");
      btn.className = "script-button";
      btn.dataset.script = key;
      btn.textContent = title;
    
      const delBtn = document.createElement("button");
      delBtn.textContent = "✕";
      delBtn.className = "delete-button";
      delBtn.style.color = "red";
      delBtn.style.border = "none";
      delBtn.style.background = "transparent";
      delBtn.style.cursor = "pointer";
      delBtn.title = "Удалить скрипт";
    
      delBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // чтобы не срабатывал клик по кнопке скрипта
        if (confirm(`Удалить скрипт "${title}"?`)) {
          delete scripts[key];
          saveScripts();
          renderScripts();
          updateCategorySelect();
        }
      });
    
      container.appendChild(btn);
      container.appendChild(delBtn);
      scriptList.appendChild(container);
    });
    
  }

  assignButtonHandlers();
}

// Назначение обработчиков кнопок скриптов
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

// Показ/скрытие поля для новой категории
categorySelect.addEventListener("change", () => {
  if (categorySelect.value === "__custom__") {
    newCategoryInput.style.display = "block";
    newCategoryInput.required = true;
  } else {
    newCategoryInput.style.display = "none";
    newCategoryInput.required = false;
  }
});

// Обработка формы добавления скрипта
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
  newCategoryInput.style.display = "none";
  newCategoryInput.required = false;
});

// Инициализация
loadScripts();
renderScripts();
updateCategorySelect();
