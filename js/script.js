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

    items.forEach(({ key, title, text, category }) => {
      const container = document.createElement("div");
      container.style.display = "flex";
      container.style.flexDirection = "column";
      container.style.marginBottom = "10px";
    
      const header = document.createElement("div");
      header.style.display = "flex";
      header.style.justifyContent = "space-between";
      header.style.alignItems = "center";
    
      const btn = document.createElement("button");
      btn.className = "script-button";
      btn.dataset.script = key;
      btn.textContent = title;
    
      const actions = document.createElement("div");
      actions.style.display = "flex";
      actions.style.gap = "8px";
    
      const editBtn = document.createElement("button");
      editBtn.textContent = "✎";
      editBtn.title = "Редактировать";
      editBtn.style.cursor = "pointer";
    
      const delBtn = document.createElement("button");
      delBtn.textContent = "✕";
      delBtn.title = "Удалить";
      delBtn.style.color = "red";
      delBtn.style.cursor = "pointer";
    
      // Удаление
      delBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (confirm(`Удалить скрипт "${title}"?`)) {
          delete scripts[key];
          saveScripts();
          renderScripts();
          updateCategorySelect();
        }
      });
    
      // Редактирование
      editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        showEditForm(key);
      });
    
      actions.appendChild(editBtn);
      actions.appendChild(delBtn);
    
      header.appendChild(btn);
      header.appendChild(actions);
      container.appendChild(header);
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

// Редактирование

function showEditForm(key) {
  const script = scripts[key];
  const container = document.querySelector(`button[data-script="${key}"]`).closest("div");

  const form = document.createElement("form");
  form.style.marginTop = "10px";

  form.innerHTML = `
    <input type="text" name="title" value="${script.title}" placeholder="Заголовок" style="width: 100%; margin-bottom: 5px;" required>
    <textarea name="text" placeholder="Текст скрипта" rows="4" style="width: 100%; margin-bottom: 5px;" required>${script.text}</textarea>
    <button type="submit">💾 Сохранить</button>
    <button type="button" id="cancelEdit">Отмена</button>
  `;

  container.appendChild(form);

  const cancelBtn = form.querySelector("#cancelEdit");
  cancelBtn.addEventListener("click", () => {
    renderScripts();
    updateCategorySelect();
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    const title = form.title.value.trim();
    const text = form.text.value.trim();

    scripts[key].title = title;
    scripts[key].text = text;

    saveScripts();
    renderScripts();
    updateCategorySelect();
  });
}
