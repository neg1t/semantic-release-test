const jsonfile = require("jsonfile");
const path = require("path");

const packageJsonPath = path.join(__dirname, "package.json");

// Загрузка package.json
const packageJson = jsonfile.readFileSync(packageJsonPath);

// Определение типов изменений и соответствующих ключевых слов
const commitTypes = {
  fix: "patch", // Исправления - увеличиваем патч-версию
  feat: "minor", // Новые функции - увеличиваем минор-версию
  chore: "patch", // Изменения без разрыва - также увеличиваем патч-версию
  // Другие типы изменений, если необходимо
};

// Здесь предполагается, что вы получаете тип изменения из аргументов скрипта или как-то иначе

const commitMessage = "feat: добавлена возможность Y"; // Пример сообщения коммита

const commitType = commitMessage.split(":")[0].trim(); // Извлечение типа изменения из сообщения

if (commitTypes[commitType]) {
  // Увеличение версии в соответствии с типом изменения
  const versionParts = packageJson.version.split(".");
  versionParts[commitTypes[commitType] === "patch" ? 2 : 1] = (
    parseInt(versionParts[commitTypes[commitType] === "patch" ? 2 : 1], 10) + 1
  ).toString();
  packageJson.version = versionParts.join(".");

  // Запись обновленной версии в package.json
  jsonfile.writeFileSync(packageJsonPath, packageJson, { spaces: 2 });

  console.log(`Версия увеличена до: ${packageJson.version}`);
} else {
  console.log(`Неизвестный тип изменения: ${commitType}`);
}
