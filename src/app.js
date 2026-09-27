const app = {
    data: { version: 0, items: [] },

    // --- Íconos (Lucide inline) ---
    ICONS: {
        check: '<polyline points="20 6 9 17 4 12"/>',
        cart: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
        trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>'
    },
    CAT_ICONS: {
        'Proteínas': '<circle cx="12.5" cy="8.5" r="2.5"/><path d="M12.5 2a6.5 6.5 0 0 0-6.22 4.6c-1.1 3.13-.78 3.9-3.18 6.08A3 3 0 0 0 5 18c4 0 8.4-1.8 11.4-4.3A6.5 6.5 0 0 0 12.5 2Z"/><path d="m18.5 6 2.19 4.5a6.48 6.48 0 0 1 .31 2 6.49 6.49 0 0 1-2.6 5.2C15.4 20.2 11 22 7 22a3 3 0 0 1-2.68-1.66L2.4 16.5"/>',
        'Lácteos/Huevos': '<path d="M12 22c6.23-.05 7.87-5.57 7.5-10-.36-4.34-3.95-9.96-7.5-10-3.55.04-7.14 5.66-7.5 10-.37 4.43 1.27 9.95 7.5 10z"/>',
        'Frutas/Verduras': '<path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/>',
        'Panadería': '<path d="m4.6 13.11 5.79-3.21c1.89-1.05 4.79 1.78 3.71 3.71l-3.22 5.81C8.8 23.16.79 15.23 4.6 13.11Z"/><path d="m10.5 9.5-1-2.29C9.2 6.48 8.8 6 8 6H4.5C2.79 6 2 6.5 2 8.5a7.71 7.71 0 0 0 2 4.83"/><path d="M8 6c0-1.55.24-4-2-4-2 0-2.5 2.17-2.5 4"/><path d="m14.5 13.5 2.29 1c.73.3 1.21.7 1.21 1.5v3.5c0 1.71-.5 2.5-2.5 2.5a7.71 7.71 0 0 1-4.83-2"/><path d="M18 16c1.55 0 4-.24 4 2 0 2-2.17 2.5-4 2.5"/>',
        'Bebidas': '<path d="m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8"/><path d="M5 8h14"/><path d="M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0"/><path d="m12 8-1-6h2"/>',
        'Limpieza': '<path d="M3 3h.01"/><path d="M7 5h.01"/><path d="M11 7h.01"/><path d="M3 7h.01"/><path d="M7 9h.01"/><path d="M3 11h.01"/><rect width="4" height="4" x="15" y="5"/><path d="m19 9 2 2v10c0 .6-.4 1-1 1h-6c-.6 0-1-.4-1-1V11l2-2"/><path d="M13 14h8"/>',
        'Despensa': '<path d="m5 11 4-7"/><path d="m19 11-4-7"/><path d="M2 11h20"/><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"/><path d="M4.5 15.5h15"/><path d="m9 11 1 9"/><path d="m15 11-1 9"/>',
        'Higiene': '<path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/>',
        'Otros': '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>'
    },
    svgIcon: (name, cls = 'lucide') =>
        `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${app.ICONS[name] || ''}</svg>`,
    catIcon: (cat) =>
        `<svg class="lucide" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${app.CAT_ICONS[cat] || app.CAT_ICONS['Otros']}</svg>`,

    esc: (s) => String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;'),

    // --- DATOS Y SINCRONIZACIÓN ---
    // Cada toque se aplica al instante en pantalla y se guarda en cola: los
    // guardados van de uno en uno (dos toques rápidos no chocan entre sí).
    // Si otro dispositivo guardó antes (409), los cambios pendientes se vuelven
    // a aplicar sobre la lista más reciente y se reintenta. Por eso cada cambio
    // es una función de la lista que expresa la intención ("poner Leche en el
    // carrito"), no un "alternar" que al reaplicarse desharía el cambio del otro.
    pending: [],       // cambios locales aún no confirmados por el servidor
    flushing: null,    // promesa del guardado en curso
    changeSeq: 0,      // sube con cada cambio local: descarta respuestas de poll obsoletas
    POLL_MS: 10000,

    init: async () => {
        const shopping = document.getElementById('shopping-list-render');
        const inventory = document.getElementById('inventory-list-render');
        shopping.addEventListener('click', app.onShoppingClick);
        inventory.addEventListener('click', app.onInventoryClick);
        // Enter / Espacio en los elementos con role="button" (filas editables)
        [shopping, inventory].forEach(el => el.addEventListener('keydown', (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[role="button"]')) {
                e.preventDefault();
                e.target.click();
            }
        }));
        document.addEventListener('keydown', app.onSheetKeydown);
        await app.fetchData({ poll: false });
        // El poll se pausa con la pestaña en segundo plano y se pone al día al volver.
        setInterval(() => { if (!document.hidden) app.fetchData(); }, app.POLL_MS);
        document.addEventListener('visibilitychange', () => { if (!document.hidden) app.fetchData(); });
    },

    // Lee la lista del servidor. poll = consulta automática (no cuenta como uso
    // para la caducidad de la sesión). Se ignora si hay cambios propios en vuelo
    // o si llegó tarde (hubo un cambio local mientras se pedía).
    fetchData: async ({ poll = true } = {}) => {
        if (app.pending.length || app.flushing) return;
        const seq = app.changeSeq;
        try {
            const res = await fetch(`api.php?${poll ? 'poll=1&' : ''}t=${Date.now()}`);
            if (res.status === 401) { location.reload(); return; }
            if (!res.ok) return;
            const json = await res.json();
            if (!Array.isArray(json.items)) return;
            if (seq !== app.changeSeq || app.pending.length || app.flushing) return;
            const changed = JSON.stringify(app.data.items) !== JSON.stringify(json.items);
            app.data = { version: json.version, items: json.items };
            if (changed) app.render();
        } catch (e) { console.error("Error conexión:", e); }
    },

    // Aplica un cambio (función items → items) y lo guarda. Devuelve true si se guardó.
    change: (mutate) => {
        app.changeSeq++;
        app.pending.push(mutate);
        app.data.items = mutate(app.data.items);
        app.render();
        if (!app.flushing) app.flushing = app.flush().finally(() => { app.flushing = null; });
        return app.flushing;
    },

    flush: async () => {
        let conflicts = 0;
        while (app.pending.length) {
            const sent = app.pending.length;
            let res, json;
            try {
                res = await fetch('api.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ version: app.data.version, items: app.data.items })
                });
                json = await res.json().catch(() => ({}));
            } catch (e) {
                return app.saveFailed('Sin conexión: no se guardó el cambio');
            }
            if (res.status === 401) { location.reload(); return false; }
            if (res.status === 409 && json.latest && conflicts < 3) {
                conflicts++;
                app.data = {
                    version: json.latest.version,
                    items: app.pending.reduce((items, m) => m(items), json.latest.items)
                };
                app.render();
                continue;
            }
            if (!res.ok) return app.saveFailed(json.error || 'Error al guardar');
            app.data.version = json.newVersion;
            app.pending.splice(0, sent);
            // Sin más cambios pendientes: adoptar la lista tal como la guardó el servidor.
            if (!app.pending.length && Array.isArray(json.items)
                && JSON.stringify(json.items) !== JSON.stringify(app.data.items)) {
                app.data.items = json.items;
                app.render();
            }
        }
        return true;
    },

    // El guardado falló: se descartan los cambios pendientes y se vuelve a
    // cargar la lista real (en cuanto termine este guardado).
    saveFailed: (msg) => {
        app.pending = [];
        app.showToast(msg);
        setTimeout(() => app.fetchData({ poll: false }), 0);
        return false;
    },

    render: () => {
        app.renderShopping();
        app.renderInventory();
        app.updateTotal();
    },

    // --- TOTALES Y CHECKOUT ---
    updateTotal: () => {
        const activeItems = app.data.items.filter(i => i.status === 'needed' || i.status === 'in_cart');
        const totalList = activeItems.reduce((s, i) => s + (parseFloat(i.price) || 0), 0);

        const cartItems = app.data.items.filter(i => i.status === 'in_cart');
        const totalCart = cartItems.reduce((s, i) => s + (parseFloat(i.price) || 0), 0);

        document.getElementById('total-amount').innerText = '$' + totalList.toFixed(2);

        const cartSubtotal = document.getElementById('cart-subtotal');
        if (totalCart > 0) {
            cartSubtotal.innerText = `En carrito: $${totalCart.toFixed(2)}`;
            cartSubtotal.style.display = 'block';
        } else {
            cartSubtotal.style.display = 'none';
        }

        const btnCheckout = document.getElementById('btn-checkout');
        if (cartItems.length > 0) {
            btnCheckout.style.display = 'inline-flex';
            document.getElementById('checkout-label').innerText = `Finalizar (${cartItems.length})`;
        } else {
            btnCheckout.style.display = 'none';
        }

        // La barra de total solo se ve en la pestaña Lista
        const onShopping = !document.getElementById('view-shopping').classList.contains('hidden');
        document.getElementById('total-bar').style.display = onShopping ? 'flex' : 'none';
    },

    checkout: async () => {
        if (!confirm("¿Ya pagaste? Los artículos del carrito pasan al inventario.")) return;
        const ok = await app.change(items => items.map(i => i.status === 'in_cart' ? { ...i, status: 'stocked' } : i));
        if (ok) app.showToast("¡Compra finalizada!");
    },

    // --- LISTA DE COMPRA ---
    renderShopping: () => {
        const container = document.getElementById('shopping-list-render');
        const activeItems = app.data.items.filter(i => i.status === 'needed' || i.status === 'in_cart');

        if (activeItems.length === 0) {
            container.innerHTML = '<div class="view-empty">🎉 Todo comprado</div>';
            return;
        }

        const groups = activeItems.reduce((acc, item) => {
            (acc[item.category] = acc[item.category] || []).push(item);
            return acc;
        }, {});

        let html = '';
        for (const [cat, items] of Object.entries(groups)) {
            html += `<div class="category-group">
                <div class="cat-header">${app.catIcon(cat)}<span>${app.esc(cat)}</span><span class="cat-count">· ${items.length}</span></div>`;

            // Los que están en el carrito van al final de su categoría
            items.sort((a, b) => (a.status === b.status ? 0 : (a.status === 'in_cart' ? 1 : -1)));

            items.forEach(item => {
                const isInCart = item.status === 'in_cart';
                const name = app.esc(item.name);
                const price = item.price > 0 ? `<span class="item-price">$${parseFloat(item.price).toFixed(2)}</span>` : '';
                html += `
                <div class="item-row ${isInCart ? 'in-cart' : ''}" data-name="${name}">
                    <div class="item-main" role="button" tabindex="0" aria-label="Editar ${name}">
                        <div class="item-name">${name}${price}</div>
                        ${item.note ? `<div class="item-note">${app.esc(item.note)}</div>` : ''}
                    </div>
                    <button type="button" class="check-circle ${isInCart ? 'in-cart' : ''}" aria-pressed="${isInCart}" aria-label="${isInCart ? 'Sacar del carrito' : 'Poner en el carrito'}: ${name}">${app.svgIcon('check')}</button>
                </div>`;
            });
            html += `</div>`;
        }
        container.innerHTML = html;
    },

    onShoppingClick: (e) => {
        const row = e.target.closest('.item-row');
        if (!row) return;
        const name = row.dataset.name;
        if (e.target.closest('.check-circle')) app.toggleShoppingStatus(name);
        else if (e.target.closest('.item-main')) app.openEditSheet(name);
    },

    // --- INVENTARIO ---
    renderInventory: () => {
        const container = document.getElementById('inventory-list-render');
        if (app.data.items.length === 0) {
            container.innerHTML = '<div class="view-empty">Sin artículos aún</div>';
            return;
        }
        const sorted = [...app.data.items].sort((a, b) => {
            const aActive = (a.status === 'needed' || a.status === 'in_cart');
            const bActive = (b.status === 'needed' || b.status === 'in_cart');
            if (aActive === bActive) return a.name.localeCompare(b.name);
            return aActive ? -1 : 1;
        });

        let html = '';
        sorted.forEach(item => {
            const isNeeded = (item.status === 'needed' || item.status === 'in_cart');
            const name = app.esc(item.name);
            const price = item.price > 0 ? `<span class="inv-price">$${parseFloat(item.price).toFixed(2)}</span>` : '';
            html += `
            <div class="inv-item ${item.status === 'stocked' ? 'stocked' : 'needed'}" data-name="${name}">
                <span class="inv-status"></span>
                <div class="inv-main" role="button" tabindex="0" aria-label="Editar ${name}">
                    <div class="inv-name">${name}${price}</div>
                    <div class="inv-cat">${app.esc(item.category)}</div>
                </div>
                <div class="inv-actions">
                    <button type="button" class="inv-toggle ${isNeeded ? 'tengo' : 'pedir'}" aria-label="${isNeeded ? 'Ya tengo' : 'Pedir'}: ${name}">${isNeeded ? 'Ya tengo' : '+ Pedir'}</button>
                    <button type="button" class="inv-del" title="Eliminar" aria-label="Eliminar ${name}">${app.svgIcon('trash')}</button>
                </div>
            </div>`;
        });
        container.innerHTML = html;
    },

    onInventoryClick: (e) => {
        const item = e.target.closest('.inv-item');
        if (!item) return;
        const name = item.dataset.name;
        if (e.target.closest('.inv-del')) app.deleteItem(name);
        else if (e.target.closest('.inv-toggle')) app.toggleInventoryStatus(name);
        else if (e.target.closest('.inv-main')) app.openEditSheet(name);
    },

    // Cambia el estado de un artículo a un valor concreto (intención explícita).
    setStatus: (name, status) =>
        app.change(items => items.map(i => i.name === name ? { ...i, status } : i)),

    // ACCIÓN: en la Lista (Necesito <-> En Carrito)
    toggleShoppingStatus: (name) => {
        const item = app.data.items.find(i => i.name === name);
        if (item) app.setStatus(name, item.status === 'in_cart' ? 'needed' : 'in_cart');
    },

    // ACCIÓN: en Inventario (Stocked <-> Needed)
    toggleInventoryStatus: (name) => {
        const item = app.data.items.find(i => i.name === name);
        if (!item) return;
        const isActive = (item.status === 'needed' || item.status === 'in_cart');
        app.setStatus(name, isActive ? 'stocked' : 'needed');
    },

    addItem: (e) => {
        e.preventDefault();
        const name = document.getElementById('new-name').value.trim();
        if (!name) return;
        const exists = (items) => items.some(i => i.name.toLowerCase() === name.toLowerCase());
        if (exists(app.data.items)) {
            app.showToast('Ya existe ese artículo');
            return;
        }
        const newItem = {
            name: name,
            category: document.getElementById('new-cat').value,
            note: document.getElementById('new-note').value.trim(),
            price: parseFloat(document.getElementById('new-price').value) || 0,
            status: 'needed'
        };
        document.getElementById('new-name').value = '';
        document.getElementById('new-note').value = '';
        document.getElementById('new-price').value = '';
        app.change(items => exists(items) ? items : [...items, newItem]);
        app.closeSheets();
        app.showToast('Agregado a la lista');
    },

    deleteItem: (name) => {
        if (!confirm(`¿Eliminar "${name}"?`)) return;
        app.change(items => items.filter(i => i.name !== name));
    },

    // --- EDICIÓN ---
    openEditSheet: (name) => {
        const item = app.data.items.find(i => i.name === name);
        if (!item) return;
        document.getElementById('edit-original-name').value = item.name;
        document.getElementById('edit-name').value = item.name;
        document.getElementById('edit-cat').value = item.category;
        document.getElementById('edit-note').value = item.note || '';
        document.getElementById('edit-price').value = item.price || '';
        app.openSheet('edit-sheet');
    },

    saveEdit: (e) => {
        e.preventDefault();
        const originalName = document.getElementById('edit-original-name').value;
        const newName = document.getElementById('edit-name').value.trim();
        if (!newName) return;
        const clashes = (items) => newName.toLowerCase() !== originalName.toLowerCase() &&
            items.some(i => i.name.toLowerCase() === newName.toLowerCase());
        if (clashes(app.data.items)) {
            app.showToast('Ya existe otro con ese nombre');
            return;
        }
        const fields = {
            name: newName,
            category: document.getElementById('edit-cat').value,
            note: document.getElementById('edit-note').value.trim(),
            price: parseFloat(document.getElementById('edit-price').value) || 0
        };
        app.change(items => clashes(items) ? items
            : items.map(item => item.name === originalName ? { ...item, ...fields } : item));
        app.closeSheets();
    },

    // --- SHEETS ---
    // Accesibles: foco al primer campo, Tab atrapado dentro, Escape para
    // cerrar y el foco vuelve al elemento que abrió la hoja.
    sheetOpener: null,
    openSheet: (id) => {
        const sheet = document.getElementById(id);
        app.sheetOpener = document.activeElement;
        document.getElementById('sheet-backdrop').classList.add('open');
        sheet.classList.add('open');
        setTimeout(() => { const f = sheet.querySelector('input:not([type=hidden]), select'); if (f) f.focus(); }, 320);
    },
    openAddSheet: () => {
        document.getElementById('new-name').value = '';
        document.getElementById('new-price').value = '';
        document.getElementById('new-note').value = '';
        app.openSheet('add-sheet');
    },
    closeSheets: () => {
        const wasOpen = document.querySelector('.sheet.open');
        document.getElementById('sheet-backdrop').classList.remove('open');
        document.querySelectorAll('.sheet').forEach(s => s.classList.remove('open'));
        if (wasOpen && app.sheetOpener && document.contains(app.sheetOpener)) app.sheetOpener.focus({ preventScroll: true });
        app.sheetOpener = null;
    },
    onSheetKeydown: (e) => {
        const open = document.querySelector('.sheet.open');
        if (!open) return;
        if (e.key === 'Escape') { e.preventDefault(); app.closeSheets(); return; }
        if (e.key !== 'Tab') return;
        const f = [...open.querySelectorAll('button, input:not([type=hidden]), select, textarea')].filter(el => !el.disabled && el.offsetParent !== null);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (!open.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
        else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    },

    // --- NAVEGACIÓN ---
    setTab: (tabName) => {
        document.querySelectorAll('.bn-item[data-view]').forEach(b =>
            b.classList.toggle('active', b.dataset.view === tabName));
        document.getElementById('view-shopping').classList.toggle('hidden', tabName !== 'shopping');
        document.getElementById('view-inventory').classList.toggle('hidden', tabName !== 'inventory');
        app.updateTotal();
    },

    showToast: (msg) => {
        const t = document.getElementById('toast');
        t.innerText = msg;
        t.style.opacity = 1;
        clearTimeout(app._toastTimer);
        app._toastTimer = setTimeout(() => t.style.opacity = 0, 2200);
    }
};

document.addEventListener('DOMContentLoaded', app.init);
