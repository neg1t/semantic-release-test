const jsonfile = require("jsonfile");
const path = require("path");
const gitlog = require("gitlog").default;
const { execSync } = require("child_process");

const KEY_WORD = "new version";

function updateVersion(type, version) {
  const types = {
    chore: 2,
    build: 2,
    ci: 2,
    docs: 2,
    fix: 2,
    perf: 2,
    refactor: 2,
    style: 2,
    test: 2,
    feat: 1,
    major: 0,
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
  chore: "patch", // related to maintenance tasks, build processes, or other non-user-facing changes
  build: "patch", // Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
  ci: "patch", // Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
  docs: "patch", // Documentation only changes
  fix: "patch", // A bug fix
  perf: "patch", // A code change that improves performance
  refactor: "patch", // A code change that neither fixes a bug nor adds a feature
  style: "patch", // Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
  test: "patch", // Adding missing tests or correcting existing tests
  feat: "minor", // A new feature
  major: "major", // Новая версия - увеличиваем минор-версию
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
    console.log("Найден коммит с последней версией");
    console.log(commit);
    break;
  }
  parsedCommits.unshift(commit);
}

for (const commit of parsedCommits) {
  const commitType = commit.subject.split(":")[0].trim();
  if (commitType.at(commitType.length - 1) === "!") {
    newVersion = updateVersion("major", newVersion);
  }
  if (commitTypes[commitType.split("(")[0]]) {
    newVersion = updateVersion(commitType.split("(")[0], newVersion);
  }
  // console.log(commit);
}

// Если версия изменилась, то обновляем ее в package.json и создаем коммит
if (newVersion !== currentVersion) {
  // Обновление версии в package.json asd
  packageJson.version = newVersion;
  jsonfile.writeFileSync(packageJsonPath, packageJson, { spaces: 2 });

  // execSync(`git config --local core.autocrlf false`);
  // execSync(`git config --local user.email "${{ github.actor }}@users.noreply.github.com"`);
  // execSync(`git add . && git add --renormalize .`);
  // execSync(`git pull origin master --autostash --rebase -X ours`);
  // Создание коммита с обновленной версией
  const commitCommand = `git commit -am "${KEY_WORD} ${newVersion}"`;

  execSync(commitCommand);
  // const status = execSync("git status");
  // console.log(commitCommand.toString());

  // const pullCommand = "git pull origin master --autostash --rebase -X ours";
  // execSync(pullCommand);

  // execSync("git checkout master");
  // execSync("git fetch");
  // execSync("rm -fr '.git/rebase-merge'");
  // execSync("git pull origin master --rebase");asd

  // execSync(`git rebase origin/master`);
  // Произведение git push
  const pushCommand = "git push";
  execSync(pushCommand);

  console.log(`Версия увеличена с ${currentVersion} до ${newVersion}`);
  console.log("Коммит и push выполнены");
} else {
  console.log("Версия не изменилась");
}
