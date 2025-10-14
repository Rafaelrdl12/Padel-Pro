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

/* ====== Listado de productos ====== */
const rejilla = document.querySelector('#rejilla');
const tarjetas = rejilla ? Array.from(rejilla.querySelectorAll('.tarjeta')) : [];
const pildoras = document.querySelectorAll('.pildora');
const buscar = document.querySelector('#buscar');
const rango = document.querySelector('#rango');
const salidaRango = document.querySelector('#salidaRango');
const limpiar = document.querySelector('#limpiar');
const checks = document.querySelectorAll('.filtro-check');

function normalizarPrecio(txt){
  // "339,90 €" -> 339.90 (número)
  return parseFloat(txt.replace(/[€.]/g,'').replace(',', '.'));
}
function getPrecio(card){
  const data = card.dataset.precio;
  return data ? parseFloat(data) : normalizarPrecio(card.querySelector('.precio').textContent);
}

function aplicarRango(){
  if (!salidaRango) return;
  salidaRango.textContent = `0–${rango.value} €`;
  tarjetas.forEach(c=>{
    const ok = getPrecio(c) <= parseFloat(rango.value);
    if (c.dataset._hideByFilters !== '1' && c.dataset._hideBySearch !== '1') {
      c.style.display = ok ? '' : 'none';
    }
  });
}

function ordenar(tipo){
  const visibles = tarjetas.slice().filter(c=>c.style.display !== 'none');
  if (tipo === 'asc') visibles.sort((a,b)=> getPrecio(a)-getPrecio(b));
  if (tipo === 'desc') visibles.sort((a,b)=> getPrecio(b)-getPrecio(a));
  if (tipo === 'stock') visibles.sort((a,b)=> (b.dataset.stock||'0') - (a.dataset.stock||'0'));
  // "nuevo" no cambia el orden
  visibles.forEach(el=> rejilla.appendChild(el));
}
function setPildoraActiva(btn){
  pildoras.forEach(p=>p.classList.remove('activa'));
  btn.classList.add('activa');
}
function aplicarChecks(){
  const marcados = {};
  checks.forEach(ch=>{
    if (ch.checked){
      const k = ch.dataset.filter;
      (marcados[k] ||= []).push(ch.value.toLowerCase());
    }
  });

  tarjetas.forEach(c=>{
    let visible = true;
    for (const k in marcados){
      const valor = (c.dataset[k] || '').toLowerCase();
      const lista = marcados[k];
      if (lista.length && !lista.includes(valor)) { visible = false; break; }
    }
    c.dataset._hideByFilters = visible ? '0' : '1';
    c.style.display = visible ? '' : 'none';
  });
  aplicarRango();
}

/* Eventos */
if (buscar) buscar.addEventListener('input', ()=>{
  tarjetas.forEach(c=>{
    const t = c.querySelector('h3').textContent.toLowerCase();
    const ok = t.includes(buscar.value.toLowerCase());
    c.dataset._hideBySearch = ok ? '0' : '1';
    c.style.display = (ok && c.dataset._hideByFilters!=='1' && getPrecio(c)<=parseFloat(rango.value)) ? '' : 'none';
  });
});

if (rango) rango.addEventListener('input', aplicarRango);

pildoras.forEach(p=>{
  p.addEventListener('click', ()=>{
    setPildoraActiva(p);
    ordenar(p.dataset.sort);
  });
});

checks.forEach(ch=> ch.addEventListener('change', aplicarChecks));

if (limpiar){
  limpiar.addEventListener('click', ()=>{
    if (buscar) buscar.value = '';
    if (rango){ rango.value = 1000; rango.dispatchEvent(new Event('input')); }
    checks.forEach(ch=> ch.checked = false);
    tarjetas.forEach(c=>{
      c.dataset._hideByFilters='0';
      c.dataset._hideBySearch='0';
      c.style.display='';
    });
    const p = document.querySelector('.pildora[data-sort="nuevo"]');
    if (p) setPildoraActiva(p);
  });
}

/* Estado inicial */
if (rango) rango.dispatchEvent(new Event('input'));

/* ====== Acciones de FICHA ====== */
(function(){
  const add = document.querySelector('#btnAnadir');
  const buy = document.querySelector('#btnComprar');
  const qty = document.querySelector('#cantidad');

  const PRODUCTO = {
    id: 'bullpadel-wonder',
    nombre: 'Pala BullPadel Wonder',
    precio: 249.99,
    imagen: 'images/Captura5.PNG'
  };

  function leerCarrito(){ return JSON.parse(localStorage.getItem('carrito') || '[]'); }
  function guardarCarrito(arr){ localStorage.setItem('carrito', JSON.stringify(arr)); }

  function anyadirAlCarrito(){
    let carrito = leerCarrito();
    let item = carrito.find(p => p.id === PRODUCTO.id);
    if (item){
      item.cantidad += parseInt(qty.value);
    } else {
      carrito.push({...PRODUCTO, cantidad: parseInt(qty.value)});
    }
    guardarCarrito(carrito);
    alert('Añadido al carrito ✅');
  }

  if (add) add.addEventListener('click', anyadirAlCarrito);
  if (buy) buy.addEventListener('click', ()=>{
    anyadirAlCarrito();
    location.href = 'cesta.html';
  });
})();

/* ====== CONTACTO (solo front) ====== */
(function(){
  const form = document.querySelector('#formContacto');
  if (!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const lista = JSON.parse(localStorage.getItem('mensajesContacto') || '[]');
    lista.push({...data, fecha: new Date().toISOString()});
    localStorage.setItem('mensajesContacto', JSON.stringify(lista));
    alert('¡Mensaje enviado! Nos pondremos en contacto pronto.');
    form.reset();
  });
})();

/* ====== Helpers carrito ====== */
function leerCarrito(){ return JSON.parse(localStorage.getItem('carrito') || '[]'); }
function guardarCarrito(arr){ localStorage.setItem('carrito', JSON.stringify(arr)); }
function euros(n){ return (Math.round(n*100)/100).toFixed(2).replace('.',',') + ' €'; }

/* ====== CARRITO ====== */
(function(){
  const lista = document.querySelector('#listaCarrito');
  const totalNode = document.querySelector('#totalCarrito');
  const btnPagar = document.querySelector('#btnPagar');
  if (!lista) return;

  function pintar(){
    const carrito = leerCarrito();
    lista.innerHTML = '';
    let total = 0;

    if (carrito.length === 0){
      lista.innerHTML = '<li style="padding:10px">Tu cesta está vacía.</li>';
    }

    carrito.forEach(p=>{
      const li = document.createElement('li');
      li.className = 'item-carrito';
      li.dataset.id = p.id;

      const linea = p.precio * p.cantidad;
      total += linea;

      li.innerHTML = `
        <img class="miniatura-carrito" src="${p.imagen}" alt="${p.nombre}">
        <div>
          <div class="titulo-carrito">${p.nombre}</div>
          <div class="meta-carrito">Clasificación <strong>8.5</strong></div>
          <div class="cantidad">
            <button class="btn-cant menos" aria-label="Restar">−</button>
            <span class="cantidad-num">${p.cantidad}</span>
            <button class="btn-cant mas" aria-label="Sumar">+</button>
            <button class="eliminar">Eliminar</button>
          </div>
        </div>
        <div class="precio-carrito">${euros(p.precio)}</div>
      `;
      lista.appendChild(li);
    });

    totalNode.textContent = euros(total);
  }

  // Delegación de eventos
  lista.addEventListener('click', function(e){
    const btn = e.target;
    const li = btn.closest('.item-carrito'); if(!li) return;
    const id = li.dataset.id;
    let carrito = leerCarrito();
    let item = carrito.find(p=>p.id === id);
    if (!item) return;

    if (btn.classList.contains('mas')) item.cantidad++;
    if (btn.classList.contains('menos')) item.cantidad = Math.max(1, item.cantidad-1);
    if (btn.classList.contains('eliminar')) carrito = carrito.filter(p=>p.id !== id);

    guardarCarrito(carrito);
    pintar();
  });

  if (btnPagar){
    btnPagar.addEventListener('click', ()=>{
      const total = totalNode.textContent;
      alert('Pago simulado por un total de ' + total + '. ¡Gracias por tu compra!');
      localStorage.removeItem('carrito');
      pintar();
    });
  }

  pintar();
})();
