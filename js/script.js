// Github profile info
const profileOverview = document.querySelector(".overview");
const username = "mbuchyn";
const repoList = document.querySelector(".repo-list");
const repoInfoElement = document.querySelector(".repos");
const repoDataElement = document.querySelector(".repo-data");
const backButton = document.querySelector(".view-repos");
const filterInput = document.querySelector(".filter-repos");

// grab my profile info from Git API
const retrieveProfileInfo = async function () {
    const userInfo = await fetch(`https://api.github.com/users/${username}`);
    const data = await userInfo.json();
    //console.log(data);
    displayUserInfo(data);
};

retrieveProfileInfo();

// fill in my bio info from the Git API data retrieved by async function
const displayUserInfo = function (data) {
    const div = document.createElement("div");
    div.classList.add("user-info");
    div.innerHTML = `
    <figure>
    <img alt="user avatar" src=${data.avatar_url} />
  </figure>
  <div>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Bio:</strong> ${data.bio}</p>
    <p><strong>Location:</strong> ${data.location}</p>
    <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
  </div>
   `;

profileOverview.append(div);  

gitRepos();
};

// fetch my repos from Git API
const gitRepos = async function () {
    const fetchRepos = await fetch (`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    const repoData = await fetchRepos.json();

    displayRepos(repoData);
};

// list my repos fetched by gitRepos async function
const displayRepos = function (repos) {
    for (const repo of repos) {
        filterInput.classList.remove("hide");
        const repoListItem = document.createElement("li");
        repoListItem.classList.add("repo");
        repoListItem.innerHTML = `<h3>${repo.name}</h3>`;
        repoList.append(repoListItem);
    }
};

// display info about each repo when the h3 of the list item is clicked
repoList.addEventListener("click", function (e) {
    if (e.target.matches("h3")) {
        const repoName = e.target.innerText;
        getRepoInfo(repoName);
    }
});

// grabs info for specific repo
const getRepoInfo = async function (repoName) {
    const fetchInfo = await fetch (`https://api.github.com/repos/${username}/${repoName}`);
    const repoInfo = await fetchInfo.json();
    console.log(repoInfo);

    // grab coding languages
    const fetchLanguages = await fetch (repoInfo.languages_url);
    const languageData = await fetchLanguages.json();
   // console.log(languageData);


// create list of coding languages used in repos
    const languages = [];
    for (const language in languageData) {
        languages.push(language);
    }
    //console.log(languages);

    displayRepoInfo(repoInfo, languages);
};

//displays specific repo info on webpage when title is clicked
const displayRepoInfo = function (repoInfo, languages) {
    repoDataElement.innerHTML = "";
    const div = document.createElement("div");
    repoDataElement.classList.remove("hide");
    repoInfoElement.classList.add("hide");
    div.innerHTML = `
    <h3>Name: ${repoInfo.name}</h3>
        <p>Description: ${repoInfo.description}</p>
        <p>Default Branch: ${repoInfo.default_branch}</p>
        <p>Languages: ${languages.join(", ")}</p>
        <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>`
    repoDataElement.append(div);

    backButton.classList.remove("hide");
    };

    backButton.addEventListener("click", function () {
        repoInfoElement.classList.remove("hide");
        repoDataElement.classList.add("hide");
        backButton.classList.add("hide");
    });

    filterInput.addEventListener("input", function(e) {
        const inputText = e.target.value ;
        const repos = document.querySelectorAll(".repo");
        const lowerCaseInput = inputText.toLowerCase();

        for (const repo of repos) {
            const lowerCaseRepo = repo.innerText.toLowerCase();

            if (lowerCaseRepo.includes(lowerCaseInput)) {
                repo.classList.remove("hide");
            } else {
                repo.classList.add("hide");
            }
        }
    });