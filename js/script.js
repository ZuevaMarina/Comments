const TEXTAREA_INITIAL_HEIGHT = 30;

const form = document.querySelector('.form');
console.log(form);
const facts = form.querySelectorAll('input, textarea');
console.log(facts);
const list = document.querySelector('.comment__list');
console.log(list);

form.elements.date.valueAsDate = new Date();
form.elements.date.max = new Date().toISOString().split("T")[0];
form.addEventListener('submit', onSubmit);

// Удаляем предупреждение о длинне 
for (const fact of facts) {
  fact.addEventListener('input', event => {
    removeInvalidComment(event.currentTarget);
  });
}

// Обработка события нажатия кнопки
function onSubmit(event) {
  event.preventDefault();       //отключить html
  removeInvalidComments();      //удалить предупреждения

  if (!validForm()) return;     //проверка что всё введено

  const newCommentItem = createCommentItem(getFormData());
  list.append(newCommentItem);

  clearForm();
}

// Обработка события нажатия enter
document.onkeydown = () => {
  if (e.key == 13) {
    searchForm.submit();
  }
}


// Проверка формы
function validForm() {
  let isValid = true;

  for (const fact of facts) {
    if (fact.dataset.required !== undefined && !fact.value.trim()) {
      printInvalid(fact, 'Обязательное поле');
      isValid = false;
    }
    else if (fact.name !== 'date' && fact.value.trim().length < 3) {
      printInvalid(fact, 'Необходимо ввести не менее 3 символов');
      isValid = false;
    }
  }

  return isValid;
}

// Функция вывода сообщения предупреждения ошибки
function printInvalid(element, comment) {
  const valid = element.closest('.form__label');
  console.log(valid);

  const invalidComment = document.createElement('span');
  invalidComment.classList.add('invalid__comment');
  invalidComment.textContent = comment;

  valid.append(invalidComment);
}

// Удаление ВСЕХ сообщений об ошибке (поиск по классу)
function removeInvalidComments() {
  for (const comment of form.querySelectorAll('.invalid__comment')) {
    comment.remove();
  }
}

// Удаление сообщения об ошибке в конкретном элементе
function removeInvalidComment(element) {
  element.closest('.form__label')?.querySelector('.invalid__comment')?.remove?.();
}

// Создание комментария его вид и лайк
function createCommentItem({ name, date, text }) {
  const item = document.createElement('li');
  item.className = 'comment';
  item.innerHTML = `
  <div class="comment__top">
    <span class="comment__name">${name}</span>
    <span class="comment__date">${createDateTimeString(date)}</span>
  </div>

  <div class="comment__text">${text}</div>

  <button class="comment__delete">
  <img src="./img/delete.svg">
  </button>

  <button class="comment__like">
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve">
  <g><path d="M682,175c114.7,0,208,93.3,208,208c0,71-29.3,107.6-60.4,146.3l-1.8,2l-257.3,260C550,811.7,527.4,825,500,825s-50-13.3-70.4-33.6L172.2,531.3C143.5,500.2,110,450,110,383c0-114.7,93.3-208,208-208c53.8,0,104.9,20.5,143.8,57.7l38.5,38.3c15.2-15.4,34.7-35.2,38.5-38.7C577.5,195.4,628.4,175,682,175 M682,75c-66.1,0-129.4,20.9-182,59.5C447.5,95.9,384.2,75,318,75C148.2,75,10,213.2,10,383c0,78.6,30.7,153.3,88.7,216.1l1.2,1.3l1.2,1.2l257.5,260.1l0.2,0.2l0.2,0.2c18.6,18.5,37.6,32.6,58.2,43c26.2,13.2,54,19.9,82.8,19.9c28.8,0,56.7-6.7,82.9-19.9c20.7-10.4,39.7-24.5,58.3-43.1l0.2-0.2l0.2-0.2l257.3-260l1.7-1.7l1.6-1.8l1.8-2l1.8-2.1l1.7-2.2C942.4,548.5,990,489.2,990,383C990,213.2,851.8,75,682,75L682,75z" fill='transparent' stroke='#A9A9A9' stroke-width='50'></path></g>
  </svg>
  </button>
  `;

  item.querySelector('.comment__delete').addEventListener('click', () => {
    item.remove();
  });

  item.querySelector('.comment__like').addEventListener('click', event => {
    const likeElement = event.currentTarget;
    const isLiked = !(likeElement.dataset.liked === 'true');

    likeElement.classList.toggle('liked', isLiked);
    likeElement.dataset.liked = isLiked;
  });

  return item;
}

function getFormData() {
  const formDate = form.elements.date.valueAsDate || new Date();
  const now = new Date();

  formDate.setHours(now.getHours());
  formDate.setMinutes(now.getMinutes());
  formDate.setSeconds(now.getSeconds());

  return {
    name: form.elements.name.value.trim(),
    date: formDate,
    text: form.elements.text.value
  };
}

function clearForm() {
  form.elements.name.value = '';
  form.elements.date.valueAsDate = new Date();
  form.elements.text.value = '';
}

function createDateTimeString(date) {
  const elapsedDays = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));

  let dateString;
  if (elapsedDays === 0) dateString = 'сегодня';
  if (elapsedDays === 1) dateString = 'вчера';
  if (elapsedDays > 1) dateString = elapsedDays + ' ' + inflectWord(elapsedDays, ['день', 'дня', 'дней']) + ' назад';
  if (elapsedDays > 10) dateString = date.toLocaleDateString();

  let timeString = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

  return dateString + ', ' + timeString;
}

function inflectWord(number, inflectedWords) {
  if (number % 100 >= 10 && number % 100 <= 19) return inflectedWords[2];
  const lastDigit = number % 10;
  if (lastDigit == 1) return inflectedWords[0];
  if (lastDigit >= 2 && lastDigit <= 4) return inflectedWords[1];
  return inflectedWords[2];
}

const examples = [
  { name: 'Марина', date: new Date('2022-12-24T12:34'), text: 'Нефть самая симпатичная!' },
  { name: 'Женя', date: new Date('2023-03-13T15:00'), text: 'Заверните мне всех <3' },
  { name: 'Вороб', date: new Date('2023-03-15T13:30'), text: "Почему так мало Бипа?" },
];
list.append(...examples.map(createCommentItem));

const examples_time = [
  { name: 'Саша', date: new Date(), text: 'Как можно добавить фото своих кошек?' },
];

setTimeout(() => list.append(...examples_time.map(createCommentItem)), 4000);

const examples_time_cat = [
  { name: 'Снежа', date: new Date(), text: 'Я не давала своего согласия на публикацию фото!' },
];

setTimeout(() => list.append(...examples_time_cat.map(createCommentItem)), 8000);