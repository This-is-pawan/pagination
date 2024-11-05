const url = 'https://api.github.com/users/john-smilga/followers?per_page=100';

const fetchFollowers = async () => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const title = document.querySelector('.section-title h1');
const btnContainer = document.querySelector('.btn-container');
const container = document.querySelector('.container');

let index = 0;
let pages = [];

// Initialize pagination UI setup
const setupUI = () => {
  displayFollowers(pages[index]);
  displayButtons(btnContainer, pages, index);
};

// Fetch followers and set up the initial UI
const init = async () => {
  const followers = await fetchFollowers();
  title.textContent = 'pagination';
  pages = paginate(followers);
  setupUI();
};

window.addEventListener('load', init);

btnContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('page-btn')) {
    index = parseInt(e.target.dataset.index);
  } else if (e.target.classList.contains('next-btn')) {
    index = (index + 1) % pages.length;
  } else if (e.target.classList.contains('prev-btn')) {
    index = (index - 1 + pages.length) % pages.length;
  }
  setupUI();
});



const displayButtons = (container, pages, activeIndex) => {
  const btns = pages.map((_, pageIndex) => {
    return `<button class="page-btn ${activeIndex === pageIndex ? 'active-btn' : ''}" data-index="${pageIndex}">
      ${pageIndex + 1}
    </button>`;
  });
  btns.push(`<button class="next-btn">next</button>`);
  btns.unshift(`<button class="prev-btn">prev</button>`);
  container.innerHTML = btns.join('');
};

// Display followers on the current page
const displayFollowers = (followers) => {
  const newFollowers = followers.map((person) => {
    const { avatar_url, login, html_url } = person;
    return `
      <article class='card'>
        <img src="${avatar_url}" alt='person' />
        <h4>${login}</h4>
        <a href="${html_url}" class="btn">view profile</a>
      </article>
    `;
  }).join('');
  container.innerHTML = newFollowers;
};

// Paginate followers into chunks of 10 items
const paginate = (followers) => {
  const itemsPerPage = 10;
  const numberOfPages = Math.ceil(followers.length / itemsPerPage);
  
  return Array.from({ length: numberOfPages }, (_, index) => {
    const start = index * itemsPerPage;
    return followers.slice(start, start + itemsPerPage);
  });
};
