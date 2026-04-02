// Debug script para verificar el menú de usuario
console.log('=== DEBUG MENÚ DE USUARIO ===');

// Verificar elementos
const userBtn = document.getElementById('userBtn');
const userDropdown = document.getElementById('userDropdown');

console.log('userBtn:', userBtn);
console.log('userDropdown:', userDropdown);

if (userBtn && userDropdown) {
    console.log('✅ Elementos encontrados');
    
    // Test manual del toggle
    console.log('Antes del toggle, dropdown classes:', userDropdown.className);
    userDropdown.classList.toggle('active');
    console.log('Después del toggle, dropdown classes:', userDropdown.className);
    
    // Verificar estilos CSS
    const computedStyle = window.getComputedStyle(userDropdown);
    console.log('Opacity:', computedStyle.opacity);
    console.log('Visibility:', computedStyle.visibility);
    console.log('Transform:', computedStyle.transform);
    
} else {
    console.log('❌ Elementos NO encontrados');
    console.log('Verificando si existen en el DOM...');
    console.log('userBtn por querySelector:', document.querySelector('#userBtn'));
    console.log('userDropdown por querySelector:', document.querySelector('#userDropdown'));
}

// Agregar event listener temporal para debug
if (userBtn) {
    userBtn.addEventListener('click', function(e) {
        console.log('🖱️ Click en userBtn detectado');
        e.preventDefault();
        e.stopPropagation();
        userDropdown.classList.toggle('active');
        console.log('Estado después del click:', userDropdown.classList.contains('active'));
    });
}
