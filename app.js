// BioConnect - funciones de la interfaz
document.addEventListener('DOMContentLoaded', () => {
  // Menú adaptable para celular
  const btnMenu = document.querySelector('.btn-menu');
  const menu = document.querySelector('.menu');
  if (btnMenu) btnMenu.addEventListener('click', () => menu.classList.toggle('abierto'));

  // Validación de formularios (ingreso y registro)
  document.querySelectorAll('form.validar').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      let valido = true;
      form.querySelectorAll('[required]').forEach(campo => {
        const error = campo.parentElement.querySelector('.error');
        let msg = '';
        if (!campo.value.trim()) msg = 'Este campo es obligatorio';
        else if (campo.type === 'email' && !/^\S+@\S+\.\S+$/.test(campo.value)) msg = 'Escribe un correo válido';
        else if (campo.type === 'password' && campo.value.length < 8) msg = 'Mínimo 8 caracteres';
        if (error) error.textContent = msg;
        if (msg) valido = false;
      });
      if (valido) window.location.href = form.dataset.destino || 'inicio.html';
    });
  });

  // Botón "Me interesa"
  function activarReacciones(raiz) {
    raiz.querySelectorAll('.me-interesa').forEach(b => b.addEventListener('click', () => {
      const n = parseInt(b.textContent.match(/\d+/)[0], 10);
      const activo = b.classList.toggle('activo');
      b.textContent = `💚 ${activo ? n + 1 : n - 1} Me interesa`;
    }));
  }
  activarReacciones(document);

  // Publicar en el muro
  const formPub = document.getElementById('form-publicar');
  if (formPub) formPub.addEventListener('submit', e => {
    e.preventDefault();
    const texto = document.getElementById('texto-pub').value.trim();
    const tipo = document.getElementById('tipo-pub').value;
    if (!texto) return;
    const art = document.createElement('article');
    art.className = 'tarjeta publicacion';
    art.innerHTML = `<h3>Jimena Serna · <span class="muted">ahora</span></h3>
      <span class="etiqueta">${tipo}</span><p></p>
      <div class="acciones"><button class="me-interesa">💚 0 Me interesa</button><button>💬 Comentar</button></div>`;
    art.querySelector('p').textContent = texto;
    document.getElementById('muro').prepend(art);
    activarReacciones(art);
    formPub.reset();
  });

  // Postularse a una oferta
  document.querySelectorAll('.btn-postular').forEach(b => b.addEventListener('click', () => {
    b.textContent = '✓ Postulada'; b.classList.add('borde'); b.disabled = true;
    const lista = document.getElementById('mis-postulaciones');
    if (lista) {
      const li = document.createElement('li');
      li.textContent = b.dataset.cargo + ' ';
      const tag = document.createElement('span'); tag.className = 'etiqueta'; tag.textContent = 'En revisión';
      li.appendChild(tag); lista.prepend(li);
    }
  }));

  // Filtrar ofertas por texto y municipio
  const buscar = document.getElementById('buscar');
  const muni = document.getElementById('municipio');
  function filtrar() {
    document.querySelectorAll('.oferta').forEach(o => {
      const okTexto = o.textContent.toLowerCase().includes(buscar.value.toLowerCase());
      const okMuni = !muni.value || o.dataset.municipio === muni.value;
      o.style.display = okTexto && okMuni ? '' : 'none';
    });
  }
  if (buscar && muni) { buscar.addEventListener('input', filtrar); muni.addEventListener('change', filtrar); }

  // Registrar especie
  const formEsp = document.getElementById('form-especie');
  if (formEsp) formEsp.addEventListener('submit', e => {
    e.preventDefault();
    const esp = document.getElementById('especie').value;
    const cant = Number(document.getElementById('cantidad').value);
    const err = document.getElementById('error-cantidad');
    if (!cant || cant <= 0) { err.textContent = 'La cantidad debe ser mayor que 0'; return; }
    err.textContent = '';
    const li = document.createElement('li');
    li.textContent = `${esp} · ${cant} individuo(s) · pendiente de validación`;
    document.getElementById('lista-registros').prepend(li);
    formEsp.reset();
  });
});
