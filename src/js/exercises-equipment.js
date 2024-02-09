import axios from 'axios';
const BASE_URL = 'https://energyflow.b.goit.study/api/exercises';

const searchCategoryMZ = document.querySelector('.placeholder-container');
const placeholder = document.querySelector('.placeholder-container');
searchCategoryMZ.addEventListener('click', showTrainingsMZ);

async function showTrainingsMZ(event) {
  if (event.target.nodeName === 'UL') return;
  let query;
  if (
    event.target.nodeName === 'DIV' &&
    (event.target.classList.value === '' ||
      event.target.classList.value === 'list-history')
  )
    query = event.target;
  if (
    event.target.nodeName === 'SPAN' &&
    (event.target.classList.value === '' ||
      event.target.classList.value === 'list-history')
  )
    query = event.target.parentNode;
  if (!query) return;

  const { data: resultExercises } = await getExercisesMZ(
    query.firstChild.textContent,
    query.lastElementChild.textContent
  );
  if (!resultExercises.results) {
    placeholder.innerHTML =
      '<p>Unfortunately, <span>no results</span> were found. You may want to consider other search options to find the exercise you are looking for.Our range is wide and you have the opportunity to find more options that suit your needs.</p>';
    return;
  }
  const resList = document.createElement('ul');
  resList.classList.add('search-result-list');
  resList.innerHTML = resultSearchMakrUp(resultExercises);
  placeholder.innerHTML = '';
  placeholder.appendChild(resList);
  pageConter(resList, resultExercises);
  console.log(resultExercises);
}

async function getExercisesMZ(searchItemName, searchGroupName, page = 1) {
  searchGroupName = searchGroupName.toLowerCase();
  if (searchGroupName === 'body parts') {
    searchGroupName = searchGroupName
      .slice(0, searchGroupName.length - 1)
      .replace(/\s/g, '');
  }

  try {
    const exerciseSearchResult = await axios.get(
      `${BASE_URL}?${searchGroupName.toLowerCase()}=${searchItemName.toLowerCase()}&page=${page}&limit=12`
    );
    return exerciseSearchResult;
  } catch (error) {
    window.alert('something goes wrong');
    console.log(error);
  }
}

function resultSearchMakrUp({ results }) {
  return results
    .map(({ bodyPart, rating, name, target, burnedCalories, time, _id }) => {
      return `<li class=exercises-serch-result>
      <div class="rating-start-container">
        <div class="rating">
            <p class="workout">Workout</p>
            <div class="rating-cont">
                <p class="rating-num">${rating.toFixed(1)}</p>
                <svg class="rating-star-svg" width="16" height="16">
                    <use href="./img/sprite.svg#rating-star"></use>
                </svg>
            </div>
        </div>
        <div class="start-button-container">
            <button type="button" data-id=${_id} data-modal-open>Start
                <svg class="start-svg" width="18" height="18">
                    <use href="./img/sprite.svg#icon-arrow-right"></use>
                </svg>
            </button>
        </div>
      </div>
      <div class="info-about-exercise">
        <div class="exercise-name">
            <svg class="runnig-svg" width="24" height="24">
                <use href="./img/sprite.svg#running-man"></use>
            </svg>
            <h2>${name[0].toUpperCase() + name.slice(1)}</h2>
        </div>
        <div class="additional-information">
            <p class=>Burned calories: <span class="info-from-back">${burnedCalories} / ${time} min</span></p>
            <p class=>Body part: <span class="info-from-back">${
              bodyPart[0].toUpperCase() + bodyPart.slice(1)
            }</span></p>
            <p class=>Target: <span class="info-from-back">${
              target[0].toUpperCase() + target.slice(1)
            }</span></p>
        </div>
     
          </li>`;
    })
    .join('');
}

// pagination

function pageConter(resList, { totalPages }) {
  if (totalPages === 1) return;
  const counter = document.createElement('ul');
  counter.classList.add('pagination-counter');
  counter.addEventListener('click', changePage);
  for (let i = 0; i < totalPages; i++) {
    const oneCounter = document.createElement('li');
    oneCounter.textContent = i + 1;
    oneCounter.classList.add('one-count');
    counter.append(oneCounter);
    if (i === 0) {
      oneCounter.classList.add('active-count');
    }
  }
  resList.after(counter);
  resList.classList.add('exercises-margin-for-pagin');
}

function changePage(event) {
  if (event.target.nodeName === 'UL') return;
  console.log('click');
}
