const jsonfile = require("jsonfile");
const path = require("path");
const gitlog = require("gitlog").default;
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
    .map((item, index) => {
      if (types[type] === 1 && index === 2) {
        return 0;
      }
      if (types[type] === 0 && (index === 2 || index === 1)) {
        return 0;
      }
      return item;
    })
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

const parsedCommits = [];
for (const commit of commits) {
  const isNewVersion = commit.subject.includes(KEY_WORD);
  if (isNewVersion) {
    console.log("Найден коммит с новой версией");
    break;
  }
  parsedCommits.unshift(commit);
}

for (const commit of parsedCommits) {
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

  const status = execSync("git status");
  console.log(status.toString());

  const pullCommand = "git pull origin master --rebase";
  execSync(pullCommand);
  console.log("Коммит и push выполнены");

  // Произведение git push
  setTimeout(() => {
    const pushCommand = "git push";
    execSync(pushCommand);
  }, 1000);

  console.log(`Версия увеличена с ${currentVersion} до ${newVersion}`);
} else {
  console.log("Версия не изменилась");
}
