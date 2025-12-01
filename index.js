const FILE_PATH = "./data.json";
const simpleGit = require("simple-git");
const jsonfile = require("jsonfile");
const moment = require("moment");
const random = require("random");

// Change the working directory to where your local repository is located
const git = simpleGit(".");

const makeCommitsForDateRange = async (start, end) => {
  // Set your GitHub user.name and user.email here
  await git.addConfig('user.name', 'fk0u');
  await git.addConfig('user.email', 'kou.real@outlook.com');

  let current = moment(start);
  const last = moment(end);
  while (current.isSameOrBefore(last)) {
    const DATE = current.format();
    // Add a random value to ensure file changes
    const data = { date: DATE, value: Math.random() };
    console.log(DATE);
    await new Promise((resolve) => {
      jsonfile.writeFile(FILE_PATH, data, () => {
        // Set GIT_AUTHOR_DATE and GIT_COMMITTER_DATE for this commit
        const env = Object.assign({}, process.env, {
          GIT_AUTHOR_DATE: DATE,
          GIT_COMMITTER_DATE: DATE
        });
        git
          .add([FILE_PATH])
          .commit(DATE, { "--date": DATE }, { env }, () => {
            resolve();
          });
      });
    });
    current.add(1, 'days');
  }
  // Push all commits at once at the end
  git.push(["-u", "origin", "master"], (err, result) => {
    if (err) {
      console.error("Error pushing to remote:", err);
    } else {
      console.log("Pushed all changes to remote repository");
    }
  });
};

// Set the date range: September 1, 2023 to November 30, 2025
makeCommitsForDateRange('2023-09-01', '2025-11-30');
