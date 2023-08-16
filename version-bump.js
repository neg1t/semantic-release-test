const jsonfile = require("jsonfile");
const path = require("path");
const { execSync } = require("child_process");
const gitlog = require("gitlog").default;

const packageJsonPath = path.join(__dirname, "package.json");

// Загрузка текущей версии из package.json
const packageJson = jsonfile.readFileSync(packageJsonPath);
const currentVersion = packageJson.version;

// Определение типов изменений и соответствующих ключевых слов
const commitTypes = {
  fix: "patch", // Исправления - увеличиваем патч-версию
  feat: "minor", // Новые функции - увеличиваем минор-версию
  chore: "patch", // Изменения без разрыва - также увеличиваем патч-версию
  // Другие типы изменений, если необходимо
};

// Получение всех коммитов с момента последнего тега версии
const options = {
  repo: __dirname,
  number: 100, // максимальное количество коммитов для анализа
  fields: ["hash", "subject", "files"],
  since: `${currentVersion}`,
};

const commits = gitlog(options);

// Проверяем, были ли изменения в package.json
const hasPackageJsonChanges = commits.some((commit) => {
  return commit.files.includes("package.json");
});

// Если были изменения, продолжаем процесс
if (hasPackageJsonChanges) {
  // Определение, какой тип версии увеличивать
  let versionType = "patch"; // По умолчанию, увеличиваем патч-версию

  for (const commit of commits) {
    const commitType = commit.subject.split(":")[0].trim();
    if (commitTypes[commitType]) {
      versionType = commitTypes[commitType];
      break; // Берем первый подходящий тип и выходим из цикла
    }
  }

  // Увеличение версии в соответствии с определенным типом
  const versionParts = currentVersion.split(".");
  versionParts[versionType === "patch" ? 2 : 1] = (
    parseInt(versionParts[versionType === "patch" ? 2 : 1], 10) + 1
  ).toString();
  const newVersion = versionParts.join(".");

  // Обновление версии в package.json
  packageJson.version = newVersion;
  jsonfile.writeFileSync(packageJsonPath, packageJson, { spaces: 2 });

  console.log(`Версия увеличена с ${currentVersion} до ${newVersion}`);

  // Создание коммита с обновленной версией
  const commitCommand = `git commit -am "new version ${newVersion}"`;
  execSync(commitCommand);

  // Произведение git push
  const pushCommand = "git push";
  execSync(pushCommand);

  console.log("Коммит и push выполнены");
} else {
  console.log("Изменений в package.json не обнаружено. Коммит не требуется.");
}
