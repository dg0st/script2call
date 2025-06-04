"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var scriptList = document.getElementById("scriptList");
var content = document.getElementById("scriptContent");
var title = document.getElementById("scriptTitle");
var text = document.getElementById("scriptText");
var form = document.getElementById("addScriptForm");
var categorySelect = document.getElementById("categorySelect");
var newCategoryInput = document.getElementById("newCategory");
var scripts = {}; // Загрузка из localStorage или установка начальных данных

function loadScripts() {
  var saved = localStorage.getItem("scripts");

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
} // Сохранение в localStorage


function saveScripts() {
  localStorage.setItem("scripts", JSON.stringify(scripts));
} // Обновление выпадающего списка категорий


function updateCategorySelect() {
  var categories = new Set();
  Object.values(scripts).forEach(function (script) {
    if (script.category) {
      categories.add(script.category);
    }
  });
  categorySelect.innerHTML = "<option value=\"\" disabled selected>\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044E</option>";

  _toConsumableArray(categories).sort().forEach(function (cat) {
    var option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });

  var other = document.createElement("option");
  other.value = "__custom__";
  other.textContent = "Другая...";
  categorySelect.appendChild(other);
} // Отображение всех скриптов в списке


function renderScripts() {
  scriptList.innerHTML = "";
  var grouped = {};
  Object.entries(scripts).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        script = _ref2[1];

    if (!grouped[script.category]) grouped[script.category] = [];
    grouped[script.category].push(_objectSpread({
      key: key
    }, script));
  });

  for (var _i2 = 0, _Object$entries = Object.entries(grouped); _i2 < _Object$entries.length; _i2++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2),
        category = _Object$entries$_i[0],
        items = _Object$entries$_i[1];

    var catHeader = document.createElement("h3");
    catHeader.textContent = category;
    catHeader.style.margin = "20px 0 10px";
    catHeader.style.fontWeight = "bold";
    scriptList.appendChild(catHeader);
    items.forEach(function (_ref3) {
      var key = _ref3.key,
          title = _ref3.title;
      var container = document.createElement("div");
      container.style.display = "flex";
      container.style.justifyContent = "space-between";
      container.style.alignItems = "center";
      container.style.gap = "10px";
      var btn = document.createElement("button");
      btn.className = "script-button";
      btn.dataset.script = key;
      btn.textContent = title;
      var delBtn = document.createElement("button");
      delBtn.textContent = "✕";
      delBtn.className = "delete-button";
      delBtn.style.color = "red";
      delBtn.style.border = "none";
      delBtn.style.background = "transparent";
      delBtn.style.cursor = "pointer";
      delBtn.title = "Удалить скрипт";
      delBtn.addEventListener("click", function (e) {
        e.stopPropagation(); // чтобы не срабатывал клик по кнопке скрипта

        if (confirm("\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0441\u043A\u0440\u0438\u043F\u0442 \"".concat(title, "\"?"))) {
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
} // Назначение обработчиков кнопок скриптов


function assignButtonHandlers() {
  var buttons = document.querySelectorAll(".script-button");
  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      buttons.forEach(function (b) {
        return b.classList.remove("active");
      });
      btn.classList.add("active");
      var key = btn.getAttribute("data-script");
      var script = scripts[key];
      content.classList.add("fade");
      setTimeout(function () {
        title.textContent = script.title;
        text.textContent = script.text;
        content.classList.remove("fade");
      }, 200);
    });
  }); // Активируем первый скрипт

  if (buttons.length > 0 && !document.querySelector(".script-button.active")) {
    buttons[0].click();
  }
} // Показ/скрытие поля для новой категории


categorySelect.addEventListener("change", function () {
  if (categorySelect.value === "__custom__") {
    newCategoryInput.style.display = "block";
    newCategoryInput.required = true;
  } else {
    newCategoryInput.style.display = "none";
    newCategoryInput.required = false;
  }
}); // Обработка формы добавления скрипта

form.addEventListener("submit", function (e) {
  e.preventDefault();
  var titleInput = document.getElementById("newTitle");
  var textInput = document.getElementById("newText");
  var key = "script_" + Date.now();
  var category = categorySelect.value === "__custom__" ? newCategoryInput.value.trim() : categorySelect.value;
  scripts[key] = {
    title: titleInput.value.trim(),
    category: category,
    text: textInput.value.trim()
  };
  saveScripts();
  renderScripts();
  updateCategorySelect();
  form.reset();
  newCategoryInput.style.display = "none";
  newCategoryInput.required = false;
}); // Инициализация

loadScripts();
renderScripts();
updateCategorySelect();