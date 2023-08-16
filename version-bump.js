// const jsonfile = require("jsonfile");
// const path = require("path");
// const execSync = require("child_process").execSync;
// const gitlog = require("gitlog").default;

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

execSync(`git commit -am "qwe"`);
execSync(`git push`);

console.log("Коммит и push выполнены");
