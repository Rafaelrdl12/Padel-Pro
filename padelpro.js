/* Carrusel muy sencillo para 2º DAW: sin librerías */
const track = document.querySelector('.track');
const slides = Array.from(document.querySelectorAll('.slide'));
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
const dotsWrap = document.querySelector('.dots');

let index = 0;
const last = slides.length - 1;

/* Crear puntitos */
slides.forEach((_, i) => {
  const b = document.createElement('button');
  b.setAttribute('aria-label', `Ir a la diapositiva ${i+1}`);
  b.addEventListener('click', () => goTo(i));
  dotsWrap.appendChild(b);
});
const dots = Array.from(dotsWrap.children);

function updateUI(){
  track.style.transform = `translateX(-${index * 100}%)`;
  slides.forEach((s,i)=> s.classList.toggle('active', i===index));
  dots.forEach((d,i)=> d.classList.toggle('active', i===index));
}
function goTo(i){
  index = (i + slides.length) % slides.length;
  updateUI();
}

/* Controles */
prev.addEventListener('click', () => goTo(index - 1));
next.addEventListener('click', () => goTo(index + 1));

/* Auto-play (para de reproducir al pasar el ratón) */
let timer = setInterval(()=> goTo(index + 1), 4000);
const carousel = document.querySelector('.carousel');
carousel.addEventListener('mouseenter', ()=> clearInterval(timer));
carousel.addEventListener('mouseleave', ()=> timer = setInterval(()=> goTo(index + 1), 4000));

/* Arranque */
updateUI();
