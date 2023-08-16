const jsonfile = require("jsonfile");
const path = require("path");
const gitlog = require("gitlog").default;

// const packageJsonPath = path.join(__dirname, "package.json");

// // Загрузка текущей версии из package.json
// const packageJson = jsonfile.readFileSync(packageJsonPath);
// const currentVersion = packageJson.version;

// // Определение типов изменений и соответствующих ключевых слов
// const commitTypes = {
//   fix: "patch", // Исправления - увеличиваем патч-версию
//   feat: "minor", // Новые функции - увеличиваем минор-версию
//   chore: "patch", // Изменения без разрыва - также увеличиваем патч-версию
//   // Другие типы изменений, если необходимо
// };

// // Получение всех коммитов с момента последнего тега версии
// const options = {
//   repo: __dirname,
//   number: 100, // максимальное количество коммитов для анализа
//   fields: ["hash", "subject"],
// };

// const commits = gitlog(options);

// // Считаем количество коммитов с разными типами изменений
// const commitCountByType = {};

// for (const commit of commits) {
//   const commitType = commit.subject.split(":")[0].trim();
//   if (commitTypes[commitType]) {
//     commitCountByType[commitTypes[commitType]] =
//       (commitCountByType[commitTypes[commitType]] || 0) + 1;
//   }
// }

// // Определение, какой тип версии увеличивать
// let versionType = "patch"; // По умолчанию, увеличиваем патч-версию

// if (commitCountByType.minor > 0) {
//   versionType = "minor"; // Если есть коммиты с новыми функциями, увеличиваем минор-версию
// } else if (commitCountByType.patch > 0) {
//   versionType = "patch"; // В противном случае, увеличиваем патч-версию
// }

// // Увеличение версии в соответствии с определенным типом
// const versionParts = currentVersion.split(".");
// versionParts[versionType === "patch" ? 2 : 1] = (
//   parseInt(versionParts[versionType === "patch" ? 2 : 1], 10) + 1
// ).toString();
// const newVersion = versionParts.join(".");

// // Обновление версии в package.json
// packageJson.version = newVersion;
// jsonfile.writeFileSync(packageJsonPath, packageJson, { spaces: 2 });

// console.log(`Версия увеличена с ${currentVersion} до ${newVersion}`);

// // Создание коммита с обновленной версией
// const commitCommand = `git commit -am "new version ${newVersion}"`;
// execSync(commitCommand);

// // Произведение git push
// const pushCommand = "git push";
// execSync(pushCommand);

// console.log("Коммит и push выполнены");

// const pushCommand = "git push";
const { execSync } = require("child_process");

const KEY_WORD = "new version";

function updateVersion(type, version) {
  const types = {
    fix: 2,
    feat: 1,
    update: 0,
  };
  return version
    .split(".")
    .map((item, index) => (index === types[type] ? +item + 1 : item))
    .join(".");
}

const packageJsonPath = path.join(__dirname, "package.json");

// Загрузка текущей версии из package.json
const packageJson = jsonfile.readFileSync(packageJsonPath);
const currentVersion = packageJson.version;
let newVersion = currentVersion;

// Определение типов изменений и соответствующих ключевых слов
const commitTypes = {
  fix: "patch", // Исправления - увеличиваем патч-версию
  feat: "minor", // Новые функции - увеличиваем минор-версию
  update: "major", // Новая версия - увеличиваем минор-версию
  // Другие типы изменений, если необходимо
};

const options = {
  repo: __dirname,
  number: 100, // максимальное количество коммитов для анализа
  fields: ["hash", "subject"],
};
const commits = gitlog(options);

for (const commit of commits) {
  const isNewVersion = commit.subject.includes(KEY_WORD);
  if (isNewVersion) {
    console.log("Найден коммит с новой версией");
    break;
  }
  const commitType = commit.subject.split(":")[0].trim();
  if (commitTypes[commitType]) {
    newVersion = updateVersion(commitType, newVersion);
  }
  console.log(commit);
}

// Если версия изменилась, то обновляем ее в package.json и создаем коммит
if (newVersion !== currentVersion) {
  // Обновление версии в package.json
  packageJson.version = newVersion;
  jsonfile.writeFileSync(packageJsonPath, packageJson, { spaces: 2 });

  // Создание коммита с обновленной версией
  const commitCommand = `git commit -am "${KEY_WORD} ${newVersion}"`;
  execSync(commitCommand);

  console.log(`Версия увеличена с ${currentVersion} до ${newVersion}`);
} else {
  console.log("Версия не изменилась");
}

console.log("Коммит и push выполнены");
