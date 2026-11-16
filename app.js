// --- ESTADO GLOBAL DEL CARRITO (Karaoke Green) ---
let karaokeCart = JSON.parse(localStorage.getItem('karaokeCart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    initCartSystem();
    initGlobalModals();
});

function initCartSystem() {
    updateCartUI();

    // Delegación de eventos para añadir canciones o promos al carrito desde cualquier sección
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.promo-add-btn');
        if (btn) {
            const itemName = btn.getAttribute('data-item');
            const itemPrice = parseFloat(btn.getAttribute('data-price')) || 0;
            
            addItemToCart(itemName, itemPrice);
        }
    });

    // Botón de WhatsApp dentro del modal del carrito
    const enviarWpBtn = document.getElementById('enviarWhatsAppBtn');
    if (enviarWpBtn) {
        enviarWpBtn.addEventListener('click', sendCartToWhatsApp);
    }
}

function addItemToCart(name, price) {
    const existing = karaokeCart.find(item => item.name === name);
    if (existing) {
        existing.qty += 1;
    } else {
        karaokeCart.push({ name, price, qty: 1 });
    }
    saveAndRefreshCart();
    showToast(`¡${name} añadido a la cola! 🎤`);
}

function removeItemFromCart(name) {
    karaokeCart = karaokeCart.filter(item => item.name !== name);
    saveAndRefreshCart();
}

function saveAndRefreshCart() {
    localStorage.setItem('karaokeCart', JSON.stringify(karaokeCart));
    updateCartUI();
}

function updateCartUI() {
    const totalItems = karaokeCart.reduce((sum, i) => sum + i.qty, 0);
    
    // Actualizar insignias de cantidad si existen en la interfaz
    const cartBadges = document.querySelectorAll('.cart-badge-count, [data-cart-count]');
    cartBadges.forEach(b => b.textContent = totalItems);

    // Renderizar lista en el modal del carrito
    const itemsListContainer = document.getElementById('carritoItemsList');
    const totalContainer = document.getElementById('carritoTotal');

    if (itemsListContainer) {
        if (karaokeCart.length === 0) {
            itemsListContainer.innerHTML = '<p style="color: var(--text-muted); text-align: center; margin: 15px 0; font-size: 0.75rem;">Tu carrito está vacío</p>';
        } else {
            itemsListContainer.innerHTML = '';
            karaokeCart.forEach(item => {
                const subtotal = item.price * item.qty;
                const row = document.createElement('div');
                row.style.cssText = 'display: flex; justify-content: space-between; align-items: center; background: rgba(255,0,127,0.08); padding: 6px 8px; border-radius: 4px; font-size: 0.7srem;';
                
                const infoSpan = document.createElement('span');
                infoSpan.style.cssText = 'color: #fceee9; font-size: 0.7rem; flex: 1;';
                infoSpan.textContent = `${item.name} (x${item.qty}) - Bs. ${subtotal.toFixed(2)}`;

                const delBtn = document.createElement('button');
                delBtn.type = 'button';
                delBtn.style.cssText = 'background: #ff007f; color: #fff; border: none; border-radius: 4px; padding: 2px 6px; cursor: pointer; font-size: 0.6rem;';
                delBtn.textContent = '✕';
                delBtn.onclick = () => removeItemFromCart(item.name);

                row.appendChild(infoSpan);
                row.appendChild(delBtn);
                itemsListContainer.appendChild(row);
            });
        }
    }

    if (totalContainer) {
        const grandTotal = karaokeCart.reduce((sum, i) => sum + (i.price * i.qty), 0);
        totalContainer.textContent = `Bs. ${grandTotal.toFixed(2)}`;
    }
}

function sendCartToWhatsApp() {
    if (karaokeCart.length === 0) {
        alert('Tu carrito está vacío. Agrega canciones o productos antes de enviar el pedido.');
        return;
    }

    let detalle = 'Hola Karaoke Green! 🎤 Deseo confirmar el siguiente pedido/cola:\n\n';
    let total = 0;

    karaokeCart.forEach(i => {
        const sub = i.price * i.qty;
        total += sub;
        detalle += `- ${i.name} (x${i.qty}) : Bs. ${sub.toFixed(2)}\n`;
    });

    detalle += `\nTOTAL ESTIMADO: Bs. ${total.toFixed(2)}`;

    const url = `https://wa.me/59175273771?text=${encodeURIComponent(detalle)}`;
    window.open(url, '_blank');
}

function initGlobalModals() {
    document.addEventListener('click', function(e) {
        const trigger = e.target.closest('[data-modal]');
        if (trigger) {
            const modalId = trigger.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'flex';
                updateCartUI();
            }
        }
        const closeBtn = e.target.closest('.close-modal-btn');
        if (closeBtn) {
            const modal = closeBtn.closest('.rpg-modal');
            if (modal) modal.style.display = 'none';
        }
    });
}

function showToast(text) {
    const toast = document.createElement('div');
    toast.style.cssText = 'position: fixed; bottom: 70px; left: 50%; transform: translateX(-50%); background: #ff007f; color: #fff; padding: 6px 14px; border-radius: 20px; font-size: 0.7rem; z-index: 2000; font-family: var(--font-title); box-shadow: 0 4px 10px rgba(0,0,0,0.5);';
    toast.textContent = text;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}