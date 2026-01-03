const avatarBtn = document.getElementById('avatar-btn');
const avatarDropdown = document.getElementById('avatar-dropdown');

// Abrir/cerrar al click en el botón
avatarBtn.addEventListener('click', (e) => {
  e.stopPropagation(); // evita que el click burbujee al document
  avatarDropdown.classList.toggle('hidden');
});

// Cerrar al click fuera
document.addEventListener('click', (e) => {
  // Si el click no está dentro del dropdown ni del botón
  if (!avatarDropdown.contains(e.target) && !avatarBtn.contains(e.target)) {
    avatarDropdown.classList.add('hidden');
  }
});
