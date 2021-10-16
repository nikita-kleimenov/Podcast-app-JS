import { createModal, isValid } from './utils';
import { Question } from './question';
import './styles.css';
import { authWithEmailAndPassword, getAuthForm } from './auth';
const form = document.getElementById('form');
const input = form.querySelector('#question-input');
const btn = form.querySelector('#btn');

const modal_btn = document.getElementById('modal-btn');

window.addEventListener('load', Question.renderList)

form.addEventListener('submit', submitFormHandler);
modal_btn.addEventListener('click', openModal);
input.addEventListener('input', () => {
  btn.disabled = !isValid(input.value)
})
function submitFormHandler(event) {
  event.preventDefault();
  if (isValid(input.value)) {
    const question = {
      text: input.value.trim(),
      date: new Date().toJSON(),
    }
    btn.disabled = true
    Question.create(question).then(() => {
      input.value = '';
      input.className = '';
      btn.disabled = false;
    })
    
  }
}


function openModal(){
  createModal('Авторизация', getAuthForm());
  document.getElementById('auth-form')
  .addEventListener('submit', authFormHandler, {once: true})
}
function authFormHandler(event) {
  event.preventDefault();
  const btn = event.target.querySelector('button')
  const email = event.target.querySelector('#email').value;
  const password = event.target.querySelector('#password').value;
  btn.disabled = true;
  authWithEmailAndPassword(email, password)
  .then(token => {
    return Question.fetch(token)
  })
  .then(renderModalAfterAuth)
  .then(() => btn.disabled = false)
}


function renderModalAfterAuth(content) {
    createModal('Вопросы', Question.listToHTML(content))
  
}