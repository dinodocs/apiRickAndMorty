const charContainer = document.querySelector("#charContainer");

async function loadApi() {
  const randomNumber = Math.floor(Math.random() * 42) + 1;
  const response = await fetch(
    `https://rickandmortyapi.com/api/character/?page=${randomNumber}`
  );
  const data = await response.json();
  const characters = data.results;
  const newArray = characters.slice(0, 8);
  newArray.forEach((character) => {
    createCharsBox(character);
  });
}

const pagination = document.querySelector("#pagesSection");
const input = document.querySelector("#charName");
document.querySelector("#charName").addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    getAllChars();
    createControls();
  }
});

async function paginateApi() {
  const charName = document.querySelector("#charName").value;
  const response = await fetch(
    `https://rickandmortyapi.com/api/character/?name=${charName}`
  );
  const data = await response.json();
  const numOfChars = data.info.count;
  var pages = numOfChars / 8;
  if (pages % 1 != 0) {
    pages++;
  }
  const firstPage = document.createElement("p");
  firstPage.setAttribute("class", `first`);
  firstPage.innerText = "«";
  pagination.appendChild(firstPage);
  const prev = document.createElement("p");
  prev.setAttribute("class", `prev`);
  prev.innerText = "<";
  pagination.appendChild(prev);
  for (let index = 1; index <= pages; index++) {
    const numberOfPages = document.createElement("button");
    numberOfPages.setAttribute("class", `charPage`);
    numberOfPages.setAttribute("id", `${index}`);
    numberOfPages.innerText = index;
    pagination.appendChild(numberOfPages);
  }
  const next = document.createElement("p");
  next.setAttribute("class", `next`);
  next.innerText = ">";
  pagination.appendChild(next);
  const lastPage = document.createElement("p");
  lastPage.setAttribute("class", `last`);
  lastPage.innerText = "»";
  pagination.appendChild(lastPage);
  return pages;
}

function clearCharContainer() {
  charContainer.innerHTML = "";
}

function clearPageContainer() {
  pagination.innerHTML = "";
}

async function getAllChars() {
  const charName = document.querySelector("#charName").value;
  const allChars = [];
  const response = await fetch(
    `https://rickandmortyapi.com/api/character/?name=${charName}`
  );
  const data = await response.json();
  const charNumOfPages = data.info.pages;
  for (let index = 1; index <= charNumOfPages; index++) {
    const responseChar = await fetch(
      `https://rickandmortyapi.com/api/character/?page=${index}&name=${charName}`
    );
    const dataChar = await responseChar.json();
    allChars.push(...dataChar.results);
  }
  return allChars;
}

function createCharsBox(character) {
  const div = document.createElement("div");
  div.setAttribute("class", "charBox");
  const img = document.createElement("img");
  img.setAttribute("class", "zcharImg");
  const divCharInfo = document.createElement("div");
  divCharInfo.setAttribute("class", "charInfo");
  const name = document.createElement("p");
  name.setAttribute("class", "name");
  const statusSection = document.createElement("div");
  statusSection.setAttribute("class", "statusSection");
  const statusIcon = document.createElement("div");
  statusIcon.setAttribute("class", "statusIcon");
  const status = document.createElement("p");
  status.setAttribute("class", "status");
  const lastLocation = document.createElement("p");
  lastLocation.setAttribute("class", "lastLocation");
  const location = document.createElement("p");
  location.setAttribute("class", "location");
  const firstEpisode = document.createElement("p");
  firstEpisode.setAttribute("class", "firstEpisode");
  const episode = document.createElement("p");
  episode.setAttribute("class", "episode");

  const episodesArray = character.episode;

  fetch(episodesArray[0])
    .then((response) => response.json())
    .then((data) => {
      const firstEpisodeName = data.name;
      episode.innerText = `${firstEpisodeName}`;
    });

  img.src = character.image;
  name.innerText = `${character.name}`;

  if (character.status == "Alive") {
    statusIcon.style.backgroundColor = "rgb(85, 204, 68)";
  } else if (character.status == "Dead") {
    statusIcon.style.backgroundColor = "rgb(255, 40, 0)";
  } else {
    character.status = "Unknown";
    statusIcon.style.backgroundColor = "rgb(200,200, 200)";
  }
  status.innerText = `${character.status} - ${character.species}`;
  lastLocation.innerText = "Last know location:";
  location.innerText = character.location.name;
  firstEpisode.innerText = "First seen in:";
  if (character.name.length > 29) {
    name.style.fontSize = "1rem";
    name.style.marginBottom = "30px";
  } else if (character.name.length > 27) {
    name.style.fontSize = "1.05rem";
    name.style.marginBottom = "30px";
  } else if (character.name.length > 20) {
    name.style.fontSize = "1.3rem";
  }

  div.appendChild(img);
  div.appendChild(divCharInfo);
  divCharInfo.appendChild(name);
  statusSection.appendChild(statusIcon);
  statusSection.appendChild(status);
  divCharInfo.appendChild(statusSection);
  divCharInfo.appendChild(lastLocation);
  divCharInfo.appendChild(location);
  divCharInfo.appendChild(firstEpisode);
  divCharInfo.appendChild(episode);
  charContainer.appendChild(div);
}

async function createControls() {
  clearPageContainer();
  const state = {
    page: 1,
    perPage: 8,
    totalPage: Math.floor(await paginateApi()),
  };

  const controls = {
    next() {
      state.page++;
      const lastPage = state.page > state.totalPage;
      if (lastPage) {
        state.page--;
      }
    },
    prev() {
      state.page--;
      if (state.page < 1) {
        state.page++;
      }
    },
    goTo(page) {
      state.page = page;

      if (page > state.totalPage) {
        state.page = state.totalPage;
      }
    },
    createListeners() {
      document.querySelector(".first").addEventListener("click", () => {
        controls.goTo(1);
        clearCharContainer();
        sliceChars();
      });
      document.querySelector(".last").addEventListener("click", () => {
        controls.goTo(state.totalPage);
        clearCharContainer();
        sliceChars();
      });
      document.querySelector(".next").addEventListener("click", () => {
        controls.next();
        clearCharContainer();
        sliceChars();
      });
      document.querySelector(".prev").addEventListener("click", () => {
        controls.prev();
        clearCharContainer();
        sliceChars();
      });
    },
  };
  async function sliceChars() {
    const allChars = await getAllChars();
    const slicedArray = allChars.slice(
      state.perPage * (state.page - 1),
      state.perPage * state.page
    );
    slicedArray.forEach((character) => {
      createCharsBox(character);
    });
  }
  function getId() {
    const charPageButtons = document.getElementsByClassName("charPage");
    for (let index = 0; index < charPageButtons.length; index++) {
      charPageButtons[index].addEventListener("click", (e) => {
        const setPage = e.target.innerText;
        controls.goTo(setPage);
        clearCharContainer();
        sliceChars();
      });
    }
  }
  getId();
  controls.createListeners();
  controls.goTo(1);
  clearCharContainer();
  sliceChars();
}
