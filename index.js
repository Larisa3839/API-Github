let input = document.querySelector("input");
let autocompleteList = document.querySelector(".select-list");
let repositoriesList = document.querySelector(".repositories-list");

const debounce = (fn, ms) => {
  let timeout;
  return function () {
    const fnCall = () => {
      fn.apply(this, arguments);
    };
    clearTimeout(timeout);
    timeout = setTimeout(fnCall, ms);
  };
};

function createAutocompleteList(arrRepo) {
  let ul = document.createElement("ul");
  ul.className = "autocomplete-list";
  for (item of arrRepo) {
    let li = document.createElement("li");
    li.innerHTML = `${item.name}`;
    ul.append(li);
  }
  autocompleteList.append(ul);
  return [ul, arrRepo];
}

function addRepositories(index, arrRepo) {
  let card = document.createElement("div");
  card.className = "repositories-list__item";
  card.innerHTML = `<ul><li>Name: ${arrRepo[index].name}</li>
                    <li>Owner: ${arrRepo[index].owner.login}</li>
                    <li>Stars: ${arrRepo[index].stargazers_count}</li></ul>
                    <span></span>`;
  repositoriesList.append(card);
  return card;
}

function removeRepository(element) {
  element.addEventListener("click", function (e) {
    e.currentTarget.childNodes.forEach((item) => {
      if (item.children[1] === e.target) item.remove();
    });
  });
}

function clearAutocompleteList(){
  if (document.querySelector(".autocomplete-list")) 
    document.querySelector(".autocomplete-list").remove()
}

function onChange(e) {
  if (!e.target.value) { 
    clearAutocompleteList()
    return
  };
  fetch(`https://api.github.com/search/repositories?q=${e.target.value}`)
    .then((data) => {
      clearAutocompleteList()
      return data.json();
    })
    .then((res) => createAutocompleteList(res.items.slice(0, 5)))
    .then((res) => select(res))
    .then(() => removeRepository(repositoriesList))
    .catch((err) => console.log(err));
}

function select(arr) {
  const [element, arrRepo] = arr;
  element.addEventListener("click", function (e) {
    e.currentTarget.childNodes.forEach((li, index) => {
      if (e.target === li) {
        addRepositories(index, arrRepo);
        element.remove();
        input.value = "";
      }
    });
  });
}

input.addEventListener("input", debounce(onChange, 200));
