let input = document.querySelector("input")
let autocompleteList = document.querySelector(".select-list")
let repositoriesList = document.querySelector(".repositories-list")
let data;

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
  return ul;
}

function addRepositories(index) {
  let card = document.createElement("div")
  card.className = "repositories-list__item"
  card.innerHTML = `<ul><li>Name: ${data[index].name}</li>
                    <li>Owner: ${data[index].owner.login}</li>
                    <li>Stars: ${data[index].stargazers_count}</li></ul>
                    <span></span>`
  repositoriesList.append(card)
  return card
}

function removeRepository(element) {
  element.addEventListener('click', function(e){
    e.currentTarget.childNodes.forEach(item => {
      if(item.children[1] === e.target) item.remove()
    })
  })
}

async function onChange(e) {
  if (document.querySelector(".autocomplete-list")) document.querySelectorAll(".autocomplete-list").forEach(i => i.remove())
  try {
    const result = fetch(
      `https://api.github.com/search/repositories?q=${e.target.value}`
    ).then((res) => res.json())
    data = await result.then(res => res.items.slice(0, 5))
    result
      .then(res => createAutocompleteList(res.items.slice(0, 5)))
      .then(res => select(res))
      .then(res => removeRepository(repositoriesList))
  } catch (error) {
    console.log(error)
  }
}

function select(element) {
  element.addEventListener('click', function(e) {
    e.currentTarget.childNodes.forEach((li, index) => {
      if(e.target === li) {
        addRepositories(index)
        element.remove();
        input.value = "";
      } 
    });
  })
}

input.addEventListener("keyup", debounce(onChange, 300));
