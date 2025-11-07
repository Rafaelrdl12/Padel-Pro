/* Carrusel sencillo (2º DAW) */
const pista = document.querySelector('.pista');
const diapositivas = Array.from(document.querySelectorAll('.diapositiva'));
const anterior = document.querySelector('.anterior');
const siguiente = document.querySelector('.siguiente');
const puntosWrap = document.querySelector('.puntos');

let indice = 0;

/* Crear puntitos */
diapositivas.forEach((_, i) => {
  const b = document.createElement('button');
  b.setAttribute('aria-label', `Ir a la diapositiva ${i+1}`);
  b.addEventListener('click', () => irA(i));
  puntosWrap.appendChild(b);
});
const puntos = Array.from(puntosWrap.children);

function actualizarUI(){
  pista.style.transform = `translateX(-${indice * 100}%)`;
  diapositivas.forEach((s,i)=> s.classList.toggle('activa', i===indice));
  puntos.forEach((d,i)=> d.classList.toggle('activa', i===indice));
}
function irA(i){
  indice = (i + diapositivas.length) % diapositivas.length;
  actualizarUI();
}

/* Controles */
if (anterior) anterior.addEventListener('click', () => irA(indice - 1));
if (siguiente) siguiente.addEventListener('click', () => irA(indice + 1));

/* Auto-play (pausa al pasar el ratón) */
let temporizador = setInterval(()=> irA(indice + 1), 4000);
const carrusel = document.querySelector('.carrusel');
if (carrusel){
  carrusel.addEventListener('mouseenter', ()=> clearInterval(temporizador));
  carrusel.addEventListener('mouseleave', ()=> temporizador = setInterval(()=> irA(indice + 1), 4000));
}

/* Arranque */
actualizarUI();



