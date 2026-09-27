const app = {
    data: { version: 0, items: [] },

    // --- Íconos (Lucide inline) ---
    ICONS: {
        check: '<polyline points="20 6 9 17 4 12"/>',
        cart: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
        image: '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
        chevron: '<path d="m6 9 6 6 6-6"/>',
        collapse: '<path d="m7 20 5-5 5 5"/><path d="m7 4 5 5 5-5"/>',
        expand: '<path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/>',
        flashlight: '<path d="M18 6c0 2-2 2-2 4v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V10c0-2-2-2-2-4V2h12z"/><line x1="6" x2="18" y1="6" y2="6"/><line x1="12" x2="12" y1="12" y2="12"/>',
        barcode: '<path d="M3 5v14"/><path d="M8 5v14"/><path d="M12 5v14"/><path d="M17 5v14"/><path d="M21 5v14"/>',
        x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
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
    currentTab: 'shopping',

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
        document.querySelector('.scanner-view').addEventListener('click', app.focusAt);
        app.iconPickers = { new: app.makeIconPicker('new'), edit: app.makeIconPicker('edit') };
        ['shopping-list-render', 'inventory-list-render'].forEach(id => document.getElementById(id).addEventListener('toggle', app.onGroupToggle, true));
        app.initCropper();
        document.getElementById('once-list-render').addEventListener('click', app.onOnceClick);
        document.getElementById('once-list-render').addEventListener('keydown', (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[role="button"]')) { e.preventDefault(); e.target.click(); }
        });
        // Selectores de lista (Regular / Una vez)
        ['new-list', 'edit-list'].forEach(id => document.getElementById(id).addEventListener('click', (e) => {
            const opt = e.target.closest('.seg-opt');
            if (!opt) return;
            app.setSeg(id, opt.dataset.list);
            if (id === 'edit-list') app.updateLevelField();
        }));
        // Nivel en Editar: interruptor + slider
        document.getElementById('edit-level-on').addEventListener('change', app.updateLevelField);
        document.getElementById('edit-level').addEventListener('input', (e) => { document.getElementById('edit-level-out').textContent = e.target.value + '%'; });
        document.getElementById('level-range').addEventListener('input', (e) => app.showLevel(+e.target.value));
        document.getElementById('lightbox-img').addEventListener('error', (e) => {
            // Imágenes subidas antes de la vista previa: solo tienen la miniatura.
            const img = e.target;
            if (img.dataset.fallback) { img.src = img.dataset.fallback; img.dataset.fallback = ''; }
        });
        ['add', 'edit'].forEach(which => document.getElementById(`${which === 'add' ? 'new' : 'edit'}-barcodes`).addEventListener('click', (e) => {
            const btn = e.target.closest('.bc-remove');
            if (!btn) return;
            (which === 'add' ? app.addBarcodes : app.editBarcodes).splice(+btn.dataset.i, 1);
            app.renderBarcodes(which);
        }));
        ['add', 'edit'].forEach(which => document.getElementById(`${which === 'add' ? 'new' : 'edit'}-barcodes`).addEventListener('input', (e) => {
            if (!e.target.classList.contains('bc-label-input')) return;
            const entry = (which === 'add' ? app.addBarcodes : app.editBarcodes)[+e.target.dataset.i];
            if (entry) entry.label = e.target.value.trim();
        }));
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
        app.renderOnce();
        app.updateTotal();
    },

    isOnce: (item) => item.list === 'once',
    // Al volver a tener el artículo en casa, su nivel vuelve a 100%.
    restocked: (item) => (Number.isInteger(item.level) && !app.isOnce(item)) ? { ...item, level: 100 } : item,

    // Barrita de cuánto queda (solo artículos regulares con nivel medido).
    levelBarHTML: (item) => {
        if (app.isOnce(item) || !Number.isInteger(item.level)) return '';
        const lv = item.level, cls = lv >= 60 ? 'ok' : lv >= 30 ? 'mid' : 'low';
        return `<button type="button" class="level-bar lv-${cls}" style="--lv:${lv}%" aria-label="Queda ${lv}% de ${app.esc(item.name)}. Ajustar">
            <span class="lv-track"><span class="lv-fill"></span></span><span class="lv-text">${lv === 0 ? 'Agotado' : lv + '%'}</span>
        </button>`;
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
        const ok = await app.change(items => items.map(i => i.status === 'in_cart' ? app.restocked({ ...i, status: 'stocked' }) : i));
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

        const groups = app.byCategory(activeItems);
        let html = app.toolsHTML('shopping', groups.map(g => g.cat));
        for (const { cat, items } of groups) {
            // Los que están en el carrito van al final de su categoría
            items.sort((a, b) => (a.status === b.status ? 0 : (a.status === 'in_cart' ? 1 : -1)));
            html += app.groupHTML('shopping', cat, items.length, items.map(item => {
                const isInCart = item.status === 'in_cart';
                const name = app.esc(item.name);
                const detail = (item.note ? `<div class="item-note">${app.esc(item.note)}</div>` : '') + app.levelBarHTML(item);
                return `
                <div class="item-row ${isInCart ? 'in-cart' : ''}" data-name="${name}">
                    ${app.rowMainHTML(item, 'item-main', detail, app.isOnce(item) ? '<span class="once-badge">Una vez</span>' : '')}
                    <button type="button" class="check-circle ${isInCart ? 'in-cart' : ''}" aria-pressed="${isInCart}" aria-label="${isInCart ? 'Sacar del carrito' : 'Poner en el carrito'}: ${name}">${app.svgIcon('check')}</button>
                </div>`;
            }).join(''));
        }
        container.innerHTML = html;
    },

    // --- FILAS Y CATEGORÍAS (compartido por Lista, Inventario y Una vez) ---
    // Área editable de una fila: rejilla con el nombre arriba a todo el ancho
    // (empieza encima de la miniatura, hasta 2 líneas) y debajo miniatura +
    // detalle (nota, productos, nivel) + precio en su propia columna, así un
    // nombre largo nunca se monta sobre el precio.
    rowMainHTML: (item, cls, detail, badge = '') => {
        const name = app.esc(item.name);
        const price = item.price > 0 ? `<span class="row-price">$${parseFloat(item.price).toFixed(2)}</span>` : '';
        return `<div class="row-main ${cls}" role="button" tabindex="0" aria-label="Editar ${name}">
                        <div class="row-name"><span class="row-name-text">${name}</span>${badge}</div>
                        ${app.thumbHTML(item)}
                        <div class="row-detail">${detail}</div>
                        ${price}
                    </div>`;
    },

    // Categorías en el orden del selector (el de config.php); las desconocidas al final.
    catOrder: () => app._catOrder || (app._catOrder = [...document.querySelectorAll('#new-cat option')].map(o => o.value)),
    byCategory: (items) => {
        const map = new Map();
        for (const it of items) { if (!map.has(it.category)) map.set(it.category, []); map.get(it.category).push(it); }
        const order = app.catOrder();
        const rank = (c) => { const i = order.indexOf(c); return i < 0 ? order.length : i; };
        return [...map.entries()].sort((a, b) => rank(a[0]) - rank(b[0])).map(([cat, items]) => ({ cat, items }));
    },

    // Categorías plegadas, por vista ({ 'shopping|Despensa': true }). Se recuerdan
    // en el teléfono y sobreviven a los redibujos del poll.
    COLLAPSE_KEY: 'grocman.collapsed',
    collapsed: (() => { try { return JSON.parse(localStorage.getItem('grocman.collapsed')) || {}; } catch (e) { return {}; } })(),
    saveCollapsed: () => { try { localStorage.setItem(app.COLLAPSE_KEY, JSON.stringify(app.collapsed)); } catch (e) { } },
    groupHTML: (view, cat, count, inner) => `
        <details class="category-group" data-view="${view}" data-cat="${app.esc(cat)}" ${app.collapsed[view + '|' + cat] ? '' : 'open'}>
            <summary class="cat-header">${app.catIcon(cat)}<span>${app.esc(cat)}</span><span class="cat-count">· ${count}</span>${app.svgIcon('chevron', 'lucide cat-chevron')}</summary>
            <div class="cat-items">${inner}</div>
        </details>`,
    // "Contraer todo" / "Expandir todo" según el estado actual de la vista.
    toolsHTML: (view, cats) => {
        const allClosed = cats.length > 0 && cats.every(c => app.collapsed[view + '|' + c]);
        return `<div class="view-tools"><button type="button" class="collapse-all" data-view="${view}" data-open="${allClosed}">${app.svgIcon(allClosed ? 'expand' : 'collapse')}${allClosed ? 'Expandir todo' : 'Contraer todo'}</button></div>`;
    },
    // Abrir/cerrar una categoría (evento toggle, que no burbujea: se escucha en captura).
    onGroupToggle: (e) => {
        const d = e.target;
        if (!d.matches || !d.matches('details.category-group')) return;
        const k = d.dataset.view + '|' + d.dataset.cat;
        if (d.open) delete app.collapsed[k]; else app.collapsed[k] = true;
        app.saveCollapsed();
        const btn = d.closest('[id$="-list-render"]').querySelector('.collapse-all');
        const groups = [...d.parentElement.querySelectorAll('details.category-group')];
        if (btn) {
            const allClosed = groups.every(g => !g.open);
            btn.dataset.open = String(allClosed);
            btn.innerHTML = app.svgIcon(allClosed ? 'expand' : 'collapse') + (allClosed ? 'Expandir todo' : 'Contraer todo');
        }
    },
    toggleAll: (btn) => {
        const open = btn.dataset.open === 'true';
        const container = btn.closest('[id$="-list-render"]');
        container.querySelectorAll('details.category-group').forEach(d => {
            const k = d.dataset.view + '|' + d.dataset.cat;
            if (open) delete app.collapsed[k]; else app.collapsed[k] = true;
        });
        app.saveCollapsed();
        app.render();
    },

    onShoppingClick: (e) => {
        const all = e.target.closest('.collapse-all');
        if (all) { app.toggleAll(all); return; }
        const row = e.target.closest('.item-row');
        if (!row) return;
        const name = row.dataset.name;
        if (e.target.closest('.check-circle')) app.toggleShoppingStatus(name);
        else if (e.target.closest('.item-thumb.has-img')) app.openLightbox(name);
        else if (e.target.closest('.level-bar')) app.openLevelSheet(name);
        else if (e.target.closest('.item-main')) app.openEditSheet(name);
    },

    // --- INVENTARIO ---
    renderInventory: () => {
        const container = document.getElementById('inventory-list-render');
        const regular = app.data.items.filter(i => !app.isOnce(i));
        if (regular.length === 0) {
            container.innerHTML = '<div class="view-empty">Sin artículos aún</div>';
            return;
        }
        const groups = app.byCategory(regular);
        let html = app.toolsHTML('inventory', groups.map(g => g.cat));
        for (const { cat, items } of groups) {
            // Por comprar primero, luego en casa; alfabético dentro de cada uno.
            items.sort((a, b) => {
                const aActive = (a.status === 'needed' || a.status === 'in_cart');
                const bActive = (b.status === 'needed' || b.status === 'in_cart');
                if (aActive === bActive) return a.name.localeCompare(b.name);
                return aActive ? -1 : 1;
            });
            html += app.groupHTML('inventory', cat, items.length, items.map(item => {
                const isNeeded = (item.status === 'needed' || item.status === 'in_cart');
                const name = app.esc(item.name);
                const n = (item.barcodes || []).length;
                // El estado (por comprar / en casa) ya lo dicen el punto de color y el botón.
                const detail = (n ? `<div class="inv-cat">${n} producto${n === 1 ? '' : 's'}</div>` : '') + app.levelBarHTML(item);
                return `
                <div class="inv-item ${isNeeded ? 'needed' : 'stocked'}" data-name="${name}">
                    ${app.rowMainHTML(item, 'inv-main', detail)}
                    <div class="inv-actions">
                        <button type="button" class="inv-toggle ${isNeeded ? 'tengo' : 'pedir'}" aria-label="${isNeeded ? 'Ya tengo' : 'Pedir'}: ${name}">${isNeeded ? 'Ya tengo' : '+ Pedir'}</button>
                        <button type="button" class="inv-del" title="Eliminar" aria-label="Eliminar ${name}">${app.svgIcon('trash')}</button>
                    </div>
                </div>`;
            }).join(''));
        }
        container.innerHTML = html;
    },

    onInventoryClick: (e) => {
        const all = e.target.closest('.collapse-all');
        if (all) { app.toggleAll(all); return; }
        const item = e.target.closest('.inv-item');
        if (!item) return;
        const name = item.dataset.name;
        if (e.target.closest('.inv-del')) app.deleteItem(name);
        else if (e.target.closest('.inv-toggle')) app.toggleInventoryStatus(name);
        else if (e.target.closest('.item-thumb.has-img')) app.openLightbox(name);
        else if (e.target.closest('.level-bar')) app.openLevelSheet(name);
        else if (e.target.closest('.inv-main')) app.openEditSheet(name);
    },

    // --- UNA VEZ (compras que no se reponen: escurridor, etc.) ---
    // Aparecen en la lista normal mientras están por comprar; al comprarlas
    // quedan guardadas aquí para volver a pedirlas algún día.
    renderOnce: () => {
        const container = document.getElementById('once-list-render');
        const once = app.data.items.filter(app.isOnce).sort((a, b) => a.name.localeCompare(b.name));
        if (!once.length) {
            container.innerHTML = '<div class="view-empty">Sin compras de una vez.<br><span class="view-empty-sub">Al agregar o editar un artículo, elige la lista "Una vez".</span></div>';
            return;
        }
        const row = (item) => {
            const pending = item.status !== 'stocked';
            const name = app.esc(item.name);
            return `
            <div class="inv-item ${pending ? 'needed' : 'stocked'}" data-name="${name}">
                ${app.rowMainHTML(item, 'inv-main', `<div class="inv-cat">${app.esc(item.category)}${item.status === 'in_cart' ? ' · en el carrito' : ''}</div>`)}
                <div class="inv-actions">
                    <button type="button" class="inv-toggle ${pending ? 'tengo' : 'pedir'}" aria-label="${pending ? 'Ya lo tengo' : 'Pedir'}: ${name}">${pending ? 'Ya lo tengo' : '+ Pedir'}</button>
                    <button type="button" class="inv-del" title="Eliminar" aria-label="Eliminar ${name}">${app.svgIcon('trash')}</button>
                </div>
            </div>`;
        };
        const pending = once.filter(i => i.status !== 'stocked'), saved = once.filter(i => i.status === 'stocked');
        container.innerHTML =
            (pending.length ? `<div class="cat-header">Por comprar<span class="cat-count">· ${pending.length}</span></div>${pending.map(row).join('')}` : '') +
            (saved.length ? `<div class="cat-header once-saved">Guardadas<span class="cat-count">· ${saved.length}</span></div>${saved.map(row).join('')}` : '');
    },

    onOnceClick: (e) => {
        const el = e.target.closest('.inv-item');
        if (!el) return;
        const name = el.dataset.name;
        const item = app.data.items.find(i => i.name === name);
        if (!item) return;
        if (e.target.closest('.inv-del')) app.deleteItem(name);
        else if (e.target.closest('.inv-toggle')) app.setStatus(name, item.status === 'stocked' ? 'needed' : 'stocked');
        else if (e.target.closest('.item-thumb.has-img')) app.openLightbox(name);
        else if (e.target.closest('.inv-main')) app.openEditSheet(name);
    },

    // --- SELECTOR DE LISTA (Regular / Una vez) ---
    setSeg: (id, value) => {
        document.querySelectorAll(`#${id} .seg-opt`).forEach(o => {
            const on = o.dataset.list === value;
            o.classList.toggle('active', on);
            o.setAttribute('aria-checked', String(on));
        });
    },
    segValue: (id) => document.querySelector(`#${id} .seg-opt.active`)?.dataset.list || 'regular',

    // --- NIVEL (cuánto queda en casa) ---
    // En Editar: interruptor "Medir" + slider; no aplica a compras de una vez.
    updateLevelField: () => {
        const once = app.segValue('edit-list') === 'once';
        const on = document.getElementById('edit-level-on').checked;
        document.getElementById('edit-level-field').hidden = once;
        document.getElementById('edit-level-control').hidden = !on;
    },
    showLevel: (lv) => {
        const out = document.getElementById('level-out');
        out.textContent = lv === 0 ? 'Agotado' : lv + '%';
        out.className = 'level-big lv-' + (lv >= 60 ? 'ok' : lv >= 30 ? 'mid' : 'low');
    },
    // Tocar la barrita: hoja rápida para ajustar cuánto queda.
    openLevelSheet: (name) => {
        const item = app.data.items.find(i => i.name === name);
        if (!item) return;
        document.getElementById('level-name').value = item.name;
        document.getElementById('level-sheet-title').textContent = `¿Cuánto queda de ${item.name}?`;
        const lv = Number.isInteger(item.level) ? item.level : 100;
        document.getElementById('level-range').value = lv;
        app.showLevel(lv);
        app.openSheet('level-sheet', { focusField: false });
    },
    saveLevel: (e) => {
        e.preventDefault();
        const name = document.getElementById('level-name').value;
        const level = +document.getElementById('level-range').value;
        app.change(items => items.map(i => i.name === name ? { ...i, level } : i));
        app.closeSheets();
    },

    // --- VISTA PREVIA DE LA IMAGEN ---
    openLightbox: (name) => {
        const item = app.data.items.find(i => i.name === name);
        if (!item || !item.icon) return;
        const box = document.getElementById('lightbox');
        const img = document.getElementById('lightbox-img');
        img.dataset.fallback = app.iconURL(item.icon);
        img.src = app.iconURL(item.icon) + '&size=l';
        img.alt = item.name;
        document.getElementById('lightbox-caption').textContent = item.name;
        app.lightboxOpener = document.activeElement;
        box.hidden = false;
        box.querySelector('.lightbox-close').focus({ preventScroll: true });
    },
    closeLightbox: () => {
        const box = document.getElementById('lightbox');
        if (box.hidden) return;
        box.hidden = true;
        document.getElementById('lightbox-img').removeAttribute('src');
        if (app.lightboxOpener && document.contains(app.lightboxOpener)) app.lightboxOpener.focus({ preventScroll: true });
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
        if (isActive) app.change(items => items.map(i => i.name === name ? app.restocked({ ...i, status: 'stocked' }) : i));
        else app.setStatus(name, 'needed');
    },

    addItem: (e) => {
        e.preventDefault();
        if (app.pickerBusy(app.iconPickers.new)) return;
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
        if (app.segValue('new-list') === 'once') newItem.list = 'once';
        const barcodes = app.addBarcodes.map(({ code, label }) => ({ code, label }));
        if (barcodes.length) newItem.barcodes = barcodes;
        if (app.iconPickers.new.get()) newItem.icon = app.iconPickers.new.get();
        const codes = new Set(barcodes.map(b => b.code));
        document.getElementById('new-name').value = '';
        document.getElementById('new-note').value = '';
        document.getElementById('new-price').value = '';
        app.addBarcodes = [];
        app.renderBarcodes('add');
        app.iconPickers.new.set(null);
        app.change(items => exists(items) ? items : [...items.map(i => app.withoutCodes(i, codes)), newItem]);
        app.closeSheets();
        app.showToast(newItem.list === 'once' ? 'Agregado (una vez)' : 'Agregado a la lista');
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
        app.editBarcodes = (item.barcodes || []).map(b => ({ ...b }));
        app.renderBarcodes('edit');
        app.iconPickers.edit.set(item.icon);
        app.setSeg('edit-list', app.isOnce(item) ? 'once' : 'regular');
        const measured = Number.isInteger(item.level);
        document.getElementById('edit-level-on').checked = measured;
        document.getElementById('edit-level').value = measured ? item.level : 100;
        document.getElementById('edit-level-out').textContent = (measured ? item.level : 100) + '%';
        app.updateLevelField();
        // Sin enfocar ningún campo: en el teléfono el teclado taparía la hoja.
        app.openSheet('edit-sheet', { focusField: false });
    },

    saveEdit: (e) => {
        e.preventDefault();
        if (app.pickerBusy(app.iconPickers.edit)) return;
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
            price: parseFloat(document.getElementById('edit-price').value) || 0,
            barcodes: app.editBarcodes.map(({ code, label }) => ({ code, label }))
        };
        const codes = new Set(fields.barcodes.map(b => b.code));
        const icon = app.iconPickers.edit.get();
        const once = app.segValue('edit-list') === 'once';
        const level = !once && document.getElementById('edit-level-on').checked ? +document.getElementById('edit-level').value : null;
        const edited = (item) => {
            const out = { ...item, ...fields };
            if (icon) out.icon = icon; else delete out.icon;
            if (once) out.list = 'once'; else delete out.list;
            if (level !== null) out.level = level; else delete out.level;
            return out;
        };
        app.change(items => clashes(items) ? items
            : items.map(item => item.name === originalName ? edited(item) : app.withoutCodes(item, codes)));
        app.closeSheets();
    },

    // --- ESCÁNER Y PRODUCTOS (códigos de barras) ---
    // Cada artículo puede tener varios productos equivalentes (p. ej. "Leche" →
    // galón Horizon, galón Great Value). El código se lee con la cámara: con el
    // lector nativo del navegador (BarcodeDetector: Android/Chrome) o, si no lo
    // hay (iPhone), con ZXing, que se carga solo al abrir el escáner. El nombre
    // del producto se busca en Open Food/Beauty/Products Facts (solo se envía el
    // número del código).
    addBarcodes: [],
    editBarcodes: [],
    scan: null,
    SCAN_FORMATS: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'itf'],
    PRODUCT_DBS: ['world.openfoodfacts.org', 'world.openbeautyfacts.org', 'world.openproductsfacts.org'],
    ZXING_SRC: 'vendor/zxing-library-0.23.0.min.js',
    productCache: {},

    // GTIN (EAN/UPC): dígito de control correcto.
    gtinValid: (code) => {
        let sum = 0;
        for (let i = code.length - 2, w = 3; i >= 0; i--, w = 4 - w) sum += +code[i] * w;
        return (10 - sum % 10) % 10 === +code[code.length - 1];
    },
    // UPC-E (8 dígitos) → UPC-A (12), para que el mismo producto dé el mismo código.
    expandUPCE: (e) => {
        const d = e.slice(1, 7), last = d[5];
        const m = '012'.includes(last) ? d[0] + d[1] + last + '0000' + d[2] + d[3] + d[4]
            : last === '3' ? d[0] + d[1] + d[2] + '00000' + d[3] + d[4]
            : last === '4' ? d[0] + d[1] + d[2] + d[3] + '00000' + d[4]
            : d.slice(0, 5) + '0000' + last;
        return e[0] + m + e[7];
    },
    // Igual que en el servidor: UPC-A → EAN-13 (0 delante), GTIN-14 con 0 → 13.
    normalizeBarcode: (raw, format = '') => {
        let code = String(raw || '').replace(/\D/g, '');
        if (format === 'upc_e' && code.length === 8) code = app.expandUPCE(code);
        if (code.length === 12) code = '0' + code;
        if (code.length === 14 && code[0] === '0') code = code.slice(1);
        return [8, 13, 14].includes(code.length) && app.gtinValid(code) ? code : null;
    },

    loadZXing: () => app._zxing || (app._zxing = new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = app.ZXING_SRC;
        s.onload = resolve;
        s.onerror = () => { app._zxing = null; reject(new Error('No se pudo cargar el lector de códigos.')); };
        document.head.appendChild(s);
    })),

    // Devuelve una función video → { text, format } | null.
    getDecoder: async () => {
        if ('BarcodeDetector' in window) {
            try {
                const supported = await BarcodeDetector.getSupportedFormats();
                const formats = app.SCAN_FORMATS.filter(f => supported.includes(f));
                if (formats.length) {
                    const detector = new BarcodeDetector({ formats });
                    return async (video) => {
                        const r = await detector.detect(video);
                        return r.length ? { text: r[0].rawValue, format: r[0].format } : null;
                    };
                }
            } catch (e) { /* lector nativo no utilizable: se usa ZXing */ }
        }
        await app.loadZXing();
        const Z = window.ZXing, F = Z.BarcodeFormat;
        const names = { [F.EAN_13]: 'ean_13', [F.EAN_8]: 'ean_8', [F.UPC_A]: 'upc_a', [F.UPC_E]: 'upc_e', [F.ITF]: 'itf' };
        const reader = new Z.MultiFormatReader();
        reader.setHints(new Map([
            [Z.DecodeHintType.POSSIBLE_FORMATS, [F.EAN_13, F.EAN_8, F.UPC_A, F.UPC_E, F.ITF]],
            [Z.DecodeHintType.TRY_HARDER, true]
        ]));
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        return async (video) => {
            const vw = video.videoWidth, vh = video.videoHeight;
            if (!vw || !vh) return null;
            // Solo la franja central (la de la guía), a 960px de ancho como máximo.
            const scale = Math.min(1, 960 / vw), sy = Math.round(vh * 0.25), sh = Math.round(vh * 0.5);
            canvas.width = Math.round(vw * scale);
            canvas.height = Math.round(sh * scale);
            ctx.drawImage(video, 0, sy, vw, sh, 0, 0, canvas.width, canvas.height);
            try {
                const r = reader.decodeWithState(new Z.BinaryBitmap(new Z.HybridBinarizer(new Z.HTMLCanvasElementLuminanceSource(canvas))));
                return { text: r.getText(), format: names[r.getBarcodeFormat()] || '' };
            } catch (e) { return null; } // ningún código en este cuadro
        };
    },

    // --- Cámara ---
    // En teléfonos con varias cámaras traseras, facingMode puede elegir la gran
    // angular o la macro, que no enfocan de cerca (imagen borrosa, lectura lenta).
    // Se busca una trasera con enfoque automático continuo y se recuerda en el
    // teléfono; se activa el enfoque continuo y un poco de zoom, para sostener el
    // teléfono más lejos (por encima de la distancia mínima de enfoque).
    CAMERA_KEY: 'grocman.camera',
    CAMERA_ZOOM: 1.8,
    trackCaps: (track) => { try { return (track && track.getCapabilities && track.getCapabilities()) || {}; } catch (e) { return {}; } },
    canAutofocus: (track) => (app.trackCaps(track).focusMode || []).includes('continuous'),
    stopStream: (stream) => { if (stream) stream.getTracks().forEach(t => t.stop()); },

    // Abre la mejor cámara trasera. alive() = el escáner sigue abierto.
    startCamera: async (alive) => {
        const open = (video) => navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 1920 }, height: { ideal: 1080 }, ...video }, audio: false
        });
        let saved = null;
        try { saved = localStorage.getItem(app.CAMERA_KEY); } catch (e) { }
        if (saved) {
            try { return await open({ deviceId: { exact: saved } }); }
            catch (e) { try { localStorage.removeItem(app.CAMERA_KEY); } catch (e2) { } } // ya no existe
        }
        let stream = await open({ facingMode: { ideal: 'environment' } });
        const first = stream.getVideoTracks()[0];
        const firstId = first.getSettings().deviceId;
        if (!app.canAutofocus(first) && alive()) {
            // Probar las otras cámaras traseras (de una en una: algunos teléfonos no
            // abren dos a la vez) y quedarse con la primera que enfoque sola.
            const others = (await navigator.mediaDevices.enumerateDevices())
                .filter(d => d.kind === 'videoinput' && d.deviceId && d.deviceId !== firstId && !/front|user|frontal|delanter/i.test(d.label));
            let found = null;
            for (const d of others) {
                if (!alive()) break;
                app.stopStream(stream);
                stream = null;
                try { stream = await open({ deviceId: { exact: d.deviceId } }); } catch (e) { continue; }
                const t = stream.getVideoTracks()[0];
                if (t.getSettings().facingMode !== 'user' && app.canAutofocus(t)) { found = stream; break; }
            }
            if (!found) { // ninguna enfoca sola: volver a la primera
                app.stopStream(stream);
                stream = await open({ deviceId: { exact: firstId } });
            } else {
                stream = found;
            }
        }
        const chosen = stream.getVideoTracks()[0];
        if (app.canAutofocus(chosen)) { try { localStorage.setItem(app.CAMERA_KEY, chosen.getSettings().deviceId); } catch (e) { } }
        return stream;
    },

    // Enfoque continuo + zoom moderado (si la cámara lo permite).
    tuneCamera: async (track) => {
        const caps = app.trackCaps(track);
        const adv = {};
        if ((caps.focusMode || []).includes('continuous')) adv.focusMode = 'continuous';
        if (caps.zoom && caps.zoom.max > 1) adv.zoom = Math.min(caps.zoom.max, Math.max(caps.zoom.min || 1, app.CAMERA_ZOOM));
        if (Object.keys(adv).length) { try { await track.applyConstraints({ advanced: [adv] }); } catch (e) { } }
    },

    // Tocar la imagen: enfocar en ese punto (si la cámara lo permite).
    focusAt: async (e) => {
        const scan = app.scan;
        const track = scan && scan.stream && scan.stream.getVideoTracks()[0];
        if (!track) return;
        const caps = app.trackCaps(track);
        if (!(caps.focusMode || []).includes('single-shot')) return;
        const r = e.currentTarget.getBoundingClientRect();
        const point = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
        try {
            await track.applyConstraints({ advanced: [{ focusMode: 'single-shot', pointsOfInterest: [point] }] });
            setTimeout(() => { if (app.scan === scan) app.tuneCamera(track); }, 1500); // y de vuelta al continuo
        } catch (e2) { }
    },

    toggleTorch: async () => {
        const scan = app.scan;
        const track = scan && scan.stream && scan.stream.getVideoTracks()[0];
        if (!track) return;
        scan.torch = !scan.torch;
        try { await track.applyConstraints({ advanced: [{ torch: scan.torch }] }); } catch (e) { scan.torch = false; }
        const btn = document.getElementById('scanner-torch');
        btn.setAttribute('aria-pressed', String(!!scan.torch));
        btn.classList.toggle('on', !!scan.torch);
    },

    // Abre el escáner; se resuelve con el código normalizado o null si se cancela.
    // opener: el botón que lo abrió, que recupera el foco al cerrar (no un campo
    // de texto: en el teléfono eso abriría el teclado justo después de escanear).
    openScanner: (opener) => new Promise((resolve) => {
        const el = document.getElementById('scanner');
        const video = document.getElementById('scanner-video');
        const status = document.getElementById('scanner-status');
        const scan = { resolve, stream: null, timer: 0, hintTimer: 0, last: '', hits: 0, opener, torch: false };
        app.scan = scan;
        const alive = () => app.scan === scan;
        const torchBtn = document.getElementById('scanner-torch');
        torchBtn.hidden = true;
        torchBtn.classList.remove('on');
        torchBtn.setAttribute('aria-pressed', 'false');
        document.getElementById('scanner-code').value = '';
        status.textContent = 'Abriendo la cámara…';
        el.hidden = false;
        setTimeout(() => { if (app.scan === scan) document.querySelector('.scanner-close').focus(); }, 50);
        (async () => {
            try {
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error('sin cámara');
                const stream = await app.startCamera(alive);
                if (!alive()) { app.stopStream(stream); return; }
                scan.stream = stream;
                const track = stream.getVideoTracks()[0];
                await app.tuneCamera(track);
                torchBtn.hidden = !app.trackCaps(track).torch;
                video.srcObject = stream;
                await video.play();
                const decode = await app.getDecoder();
                if (!alive()) return;
                status.textContent = 'Apunta al código de barras';
                scan.hintTimer = setTimeout(() => {
                    if (alive()) status.textContent = 'Aleja un poco el teléfono hasta que el código se vea nítido. Toca la imagen para enfocar.';
                }, 6000);
                // Análisis continuo: cada cuadro en cuanto termina el anterior.
                const tick = async () => {
                    if (!alive()) return;
                    try {
                        const r = await decode(video);
                        if (r && alive()) app.onScanRead(r);
                    } catch (e) { }
                    if (alive()) scan.timer = setTimeout(tick, 40);
                };
                tick();
            } catch (e) {
                if (app.scan !== scan) return;
                status.textContent = e && e.name === 'NotAllowedError'
                    ? 'Sin permiso para usar la cámara. Escribe el número abajo.'
                    : 'No se pudo abrir la cámara. Escribe el número abajo.';
            }
        })();
    }),

    // Se acepta un código con dígito de control válido leído dos veces seguidas
    // (descarta lecturas parciales o dudosas).
    onScanRead: ({ text, format }) => {
        const code = app.normalizeBarcode(text, format);
        if (!code) return;
        const scan = app.scan;
        if (scan.last === code) scan.hits++; else { scan.last = code; scan.hits = 1; }
        if (scan.hits >= 2) {
            if (navigator.vibrate) navigator.vibrate(60);
            app.closeScanner(code);
        }
    },

    scanManual: (e) => {
        e.preventDefault();
        const code = app.normalizeBarcode(document.getElementById('scanner-code').value);
        if (!code) {
            document.getElementById('scanner-status').textContent = 'Ese número no es un código de barras válido. Revísalo.';
            return;
        }
        app.closeScanner(code);
    },

    closeScanner: (code) => {
        const scan = app.scan;
        if (!scan) return;
        app.scan = null;
        clearTimeout(scan.timer);
        clearTimeout(scan.hintTimer);
        app.stopStream(scan.stream);
        const video = document.getElementById('scanner-video');
        video.pause();
        video.srcObject = null;
        document.getElementById('scanner').hidden = true;
        if (scan.opener && document.contains(scan.opener)) scan.opener.focus({ preventScroll: true });
        scan.resolve(code);
    },

    // Busca el producto en Open Food Facts y, si no está, en Open Beauty Facts
    // y Open Products Facts. Devuelve { name, brand, quantity, label, category } o null.
    lookupProduct: async (code) => {
        if (code in app.productCache) return app.productCache[code];
        let failed = false;
        for (const host of app.PRODUCT_DBS) {
            try {
                const ctrl = new AbortController();
                const timer = setTimeout(() => ctrl.abort(), 6000);
                const res = await fetch(`https://${host}/api/v2/product/${code}.json?fields=product_name,product_name_es,product_name_en,brands,quantity,categories_tags,image_front_url,image_front_small_url`, { signal: ctrl.signal });
                clearTimeout(timer);
                if (!res.ok) continue; // 404: no está en esta base
                const j = await res.json();
                if (j.status !== 1 || !j.product) continue;
                const p = j.product;
                const name = String(p.product_name_es || p.product_name || p.product_name_en || '').trim();
                const brand = String(p.brands || '').split(',')[0].trim();
                const quantity = String(p.quantity || '').trim();
                return (app.productCache[code] = {
                    name, brand, quantity,
                    label: [brand, name, quantity].filter(Boolean).join(' · '),
                    image: String(p.image_front_url || p.image_front_small_url || ''),
                    category: app.categoryFromTags(p.categories_tags || [], host)
                });
            } catch (e) { failed = true; } // sin conexión o sin respuesta: probar la siguiente
        }
        // No está en Open *Facts (casi siempre: limpieza y cuidado personal):
        // se pregunta al servidor, que consulta UPCitemdb y guarda la respuesta.
        try {
            const res = await fetch(`api.php?lookup=${code}`);
            if (res.status === 401) { location.reload(); return null; }
            const j = await res.json().catch(() => ({}));
            if (res.ok && j.found) {
                return (app.productCache[code] = {
                    name: j.name, brand: j.brand || '', quantity: '',
                    label: j.name,
                    image: j.hasImage ? `api.php?productImage=${code}` : '',
                    category: j.category || null
                });
            }
            if (res.ok && !failed) app.productCache[code] = null; // "no encontrado" solo si todas respondieron
            if (res.status === 503) app.showToast(j.error || 'Búsqueda ocupada; intenta en un momento');
        } catch (e) { }
        return null;
    },

    // Categoría de grocman a partir de las categorías de Open Food Facts.
    CATEGORY_RULES: [
        ['Lácteos/Huevos', /en:(dairies|dairy|milks|cheeses|yogurts|eggs|butters|creams)/],
        ['Proteínas', /en:(meats|poultr|fishes|seafood|sausages|hams|chickens|beef|pork)/],
        ['Panadería', /en:(breads|bakery|pastries|viennoiseries|tortillas|cakes)/],
        ['Bebidas', /en:(beverages|waters|juices|sodas|coffees|teas|drinks)/],
        ['Frutas/Verduras', /en:(fruits|vegetables|fresh-vegetables|fresh-fruits|salads)/],
        ['Higiene', /en:(cosmetics|hygiene|shampoos|toothpastes|soaps|deodorants)/],
        ['Limpieza', /en:(cleaning|household|detergents|laundry|dishwashing)/],
    ],
    categoryFromTags: (tags, host) => {
        const all = tags.join(' ');
        for (const [cat, re] of app.CATEGORY_RULES) if (re.test(all)) return cat;
        if (host.includes('beauty')) return 'Higiene';
        return tags.length ? (host.includes('food') ? 'Despensa' : 'Otros') : null;
    },

    // Quita de un artículo los códigos que pasan a otro (un código, un artículo).
    withoutCodes: (item, codes) => {
        if (!codes.size || !(item.barcodes || []).some(b => codes.has(b.code))) return item;
        return { ...item, barcodes: item.barcodes.filter(b => !codes.has(b.code)) };
    },

    renderBarcodes: (which) => {
        const list = which === 'add' ? app.addBarcodes : app.editBarcodes;
        document.getElementById(`${which === 'add' ? 'new' : 'edit'}-barcodes`).innerHTML = list.map((b, i) => `
            <div class="barcode-chip">
                ${app.svgIcon('barcode', 'lucide bc-ico')}
                <div class="bc-info">
                    ${b.loading ? '<div class="bc-label">Buscando producto…</div>'
                        : `<input class="bc-label-input" data-i="${i}" value="${app.esc(b.label)}" placeholder="Nombre del producto" aria-label="Nombre del producto ${app.esc(b.code)}" maxlength="200">`}
                    <div class="bc-code">${app.esc(b.code)}</div>
                </div>
                <button type="button" class="bc-remove" data-i="${i}" aria-label="Quitar ${app.esc(b.label || b.code)}">${app.svgIcon('x')}</button>
            </div>`).join('');
    },

    // Editar un artículo → escanear un producto y asociarlo.
    scanForEdit: async () => {
        const code = await app.openScanner(document.querySelector('#edit-sheet .btn-scan'));
        if (!code) return;
        const target = document.getElementById('edit-original-name').value;
        if (app.editBarcodes.some(b => b.code === code)) { app.showToast('Ese producto ya está asociado'); return; }
        const owner = app.data.items.find(i => i.name !== target && (i.barcodes || []).some(b => b.code === code));
        if (owner && !confirm(`Este producto está asociado a "${owner.name}". ¿Asociarlo a "${target}" en su lugar?`)) return;
        const known = owner && owner.barcodes.find(b => b.code === code);
        const entry = { code, label: known ? known.label : '', loading: !known };
        app.editBarcodes.push(entry);
        app.renderBarcodes('edit');
        if (known) return;
        const info = await app.lookupProduct(code);
        entry.loading = false;
        entry.label = info ? info.label : '';
        app.renderBarcodes('edit');
        app.useProductPhoto(app.iconPickers.edit, info);
    },

    // Agregar un artículo → escanear el producto: rellena nombre y categoría.
    scanForAdd: async () => {
        const code = await app.openScanner(document.querySelector('#add-sheet .btn-scan'));
        if (!code) return;
        const owner = app.data.items.find(i => (i.barcodes || []).some(b => b.code === code));
        if (owner) { app.showToast(`Ese producto ya está en la lista como "${owner.name}"`); return; }
        if (app.addBarcodes.some(b => b.code === code)) return;
        const entry = { code, label: '', loading: true };
        app.addBarcodes.push(entry);
        app.renderBarcodes('add');
        const info = await app.lookupProduct(code);
        entry.loading = false;
        if (info) {
            entry.label = info.label;
            const nameEl = document.getElementById('new-name');
            if (!nameEl.value.trim() && info.name) nameEl.value = info.name;
            if (info.category) document.getElementById('new-cat').value = info.category;
            app.useProductPhoto(app.iconPickers.new, info);
        } else {
            app.showToast('Producto no encontrado: escribe el nombre');
        }
        app.renderBarcodes('add');
    },

    // --- IMÁGENES DE LOS ARTÍCULOS ---
    // Se ajustan en el teléfono a 128×128 (completas, centradas, fondo
    // transparente) y se suben como PNG; el artículo guarda solo el id que
    // devuelve el servidor (data/icons/, visible solo con sesión).
    ICON_SIZE: 128,
    // v=2: las miniaturas pasaron a llenar el cuadro (recorte centrado); cambiar la
    // versión obliga al navegador a pedirlas de nuevo pese a su caché "immutable".
    iconURL: (id) => `api.php?icon=${encodeURIComponent(id)}&v=2`,

    // Miniatura de un artículo: su imagen o, si no tiene, el icono de su categoría.
    thumbHTML: (item) => item.icon
        ? `<span class="item-thumb has-img"><img src="${app.iconURL(item.icon)}" alt="" loading="lazy" decoding="async"></span>`
        : `<span class="item-thumb" aria-hidden="true">${app.catIcon(item.category)}</span>`,

    // src: archivo elegido (File) o URL de una foto de producto (Open Food Facts
    // con CORS, o api.php?productImage= del propio servidor). Devuelve
    // { thumb: PNG 128×128 transparente, large: JPEG de hasta 640px }.
    ICON_LARGE: 640,
    toIconImages: (src, crop = null) => new Promise((resolve, reject) => {
        const isFile = src instanceof Blob;
        if (isFile && !/^image\//.test(src.type)) { reject(new Error('Elige una imagen.')); return; }
        if (isFile && src.size > 25e6) { reject(new Error('La imagen es demasiado grande (máx. 25 MB).')); return; }
        const url = isFile ? URL.createObjectURL(src) : src;
        const img = new Image();
        if (!isFile && /^https?:/.test(url)) img.crossOrigin = 'anonymous';
        img.onload = () => {
            if (isFile) URL.revokeObjectURL(url);
            const iw = img.naturalWidth, ih = img.naturalHeight;
            try {
                // Miniatura: llena el cuadro. Sin recorte elegido, el cuadrado central.
                const side = Math.min(iw, ih);
                const r = crop || { sx: (iw - side) / 2, sy: (ih - side) / 2, sw: side, sh: side };
                const S = app.ICON_SIZE;
                const t = document.createElement('canvas');
                t.width = S; t.height = S;
                const tc = t.getContext('2d');
                tc.imageSmoothingQuality = 'high';
                tc.drawImage(img, r.sx, r.sy, r.sw, r.sh, 0, 0, S, S);
                // Versión grande (vista previa): la imagen completa, hasta 640px.
                const L = Math.min(1, app.ICON_LARGE / Math.max(iw, ih));
                const l = document.createElement('canvas');
                l.width = Math.max(1, Math.round(iw * L)); l.height = Math.max(1, Math.round(ih * L));
                const lc = l.getContext('2d');
                lc.fillStyle = '#fff'; // JPEG sin transparencia
                lc.fillRect(0, 0, l.width, l.height);
                lc.imageSmoothingQuality = 'high';
                lc.drawImage(img, 0, 0, l.width, l.height);
                resolve({ thumb: t.toDataURL('image/png'), large: l.toDataURL('image/jpeg', 0.85) });
            } catch (e) { reject(new Error('No se pudo usar esa imagen.')); }
        };
        img.onerror = () => { if (isFile) URL.revokeObjectURL(url); reject(new Error('No se pudo leer la imagen.')); };
        img.src = url;
    }),

    // Selector de imagen de un formulario (prefix: 'new' | 'edit').
    makeIconPicker: (prefix) => {
        const root = document.getElementById(`${prefix}-icon-picker`);
        const inputs = root.querySelectorAll('input[type=file]');
        const preview = root.querySelector('.ip-preview');
        const uploadText = root.querySelector('.ip-upload-text');
        const cropBtn = root.querySelector('.ip-crop');
        const removeBtn = root.querySelector('.ip-remove');
        const status = root.querySelector('.ip-status');
        // source: la imagen original (archivo o URL) para poder recortarla de nuevo.
        let value = null, busy = false, seq = 0, source = null;
        const render = () => {
            preview.innerHTML = value ? `<img src="${app.iconURL(value)}" alt="">` : app.svgIcon('image');
            preview.classList.toggle('has-img', !!value);
            uploadText.textContent = busy ? 'Subiendo…' : (value ? 'Cambiar' : 'Subir');
            // Visibles pero inactivos mientras sube: ocultarlos le quitaría el foco.
            removeBtn.hidden = !value;
            cropBtn.hidden = !value;
            removeBtn.setAttribute('aria-disabled', String(busy));
            cropBtn.setAttribute('aria-disabled', String(busy));
        };
        // Sube una imagen; si mientras tanto se eligió otra o se quitó, se ignora.
        const load = async (src, failMsg, crop = null) => {
            const my = ++seq;
            busy = true; status.textContent = ''; render();
            try {
                const imgs = await app.toIconImages(src, crop);
                const res = await fetch('api.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ iconUpload: imgs.thumb, iconLarge: imgs.large }) });
                if (res.status === 401) { location.reload(); return; }
                const json = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(json.error || failMsg);
                if (my === seq) { value = json.icon; source = src; }
            } catch (e) { if (my === seq) status.textContent = e.message || failMsg; }
            if (my === seq) { busy = false; render(); }
        };
        inputs.forEach(input => input.addEventListener('change', () => {
            const file = input.files[0];
            input.value = '';
            if (file) load(file, 'No se pudo subir la imagen.');
        }));
        // Recortar: con la imagen original si se acaba de elegir; si no, con la
        // versión grande guardada (o la miniatura, en imágenes antiguas).
        cropBtn.addEventListener('click', async () => {
            if (!value || busy) return;
            const src = source || await app.bestImageURL(value);
            const crop = await app.openCropper(src, cropBtn);
            if (crop) load(src, 'No se pudo recortar la imagen.', crop);
        });
        removeBtn.addEventListener('click', () => { if (busy) return; seq++; value = null; source = null; status.textContent = ''; render(); });
        render();
        return {
            get: () => value,
            busy: () => busy,
            set: (v) => { seq++; busy = false; value = v || null; source = null; status.textContent = ''; render(); },
            fromURL: (url) => load(url, 'No se pudo usar la foto del producto.'),
        };
    },
    // URL de la versión grande de una imagen guardada, o de la miniatura si no la tiene.
    bestImageURL: (id) => new Promise((resolve) => {
        const large = app.iconURL(id) + '&size=l';
        const probe = new Image();
        probe.onload = () => resolve(large);
        probe.onerror = () => resolve(app.iconURL(id));
        probe.src = large;
    }),

    // --- RECORTAR IMAGEN ---
    // Cuadro fijo; la imagen se arrastra (dedo o ratón) y se acerca con
    // pellizco, rueda, la barra de zoom o las teclas + / −. Siempre cubre el
    // cuadro. Devuelve el recorte en píxeles de la imagen original.
    initCropper: () => {
        const stage = document.getElementById('crop-stage');
        const zoom = document.getElementById('crop-zoom');
        const pts = new Map();
        let pinch = null;
        stage.addEventListener('pointerdown', (e) => {
            stage.setPointerCapture(e.pointerId);
            pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
            if (pts.size === 2) { const [a, b] = [...pts.values()]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), z: app.crop.zoom }; }
        });
        stage.addEventListener('pointermove', (e) => {
            const c = app.crop, p = pts.get(e.pointerId);
            if (!c || !p) return;
            if (pts.size === 1) { c.tx += e.clientX - p.x; c.ty += e.clientY - p.y; app.cropApply(); }
            pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
            if (pts.size === 2 && pinch) {
                const [a, b] = [...pts.values()];
                const r = stage.getBoundingClientRect();
                app.cropZoomTo(pinch.z * Math.hypot(a.x - b.x, a.y - b.y) / pinch.d, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top);
            }
        });
        const up = (e) => { pts.delete(e.pointerId); if (pts.size < 2) pinch = null; };
        stage.addEventListener('pointerup', up);
        stage.addEventListener('pointercancel', up);
        stage.addEventListener('wheel', (e) => {
            if (!app.crop) return;
            e.preventDefault();
            const r = stage.getBoundingClientRect();
            app.cropZoomTo(app.crop.zoom * (e.deltaY < 0 ? 1.1 : 1 / 1.1), e.clientX - r.left, e.clientY - r.top);
        }, { passive: false });
        zoom.addEventListener('input', () => app.cropZoomTo(+zoom.value));
        stage.addEventListener('keydown', (e) => {
            const c = app.crop;
            if (!c) return;
            const step = 12, moves = { ArrowLeft: [step, 0], ArrowRight: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
            if (moves[e.key]) { c.tx += moves[e.key][0]; c.ty += moves[e.key][1]; app.cropApply(); e.preventDefault(); }
            else if (e.key === '+' || e.key === '=') { app.cropZoomTo(c.zoom * 1.1); e.preventDefault(); }
            else if (e.key === '-') { app.cropZoomTo(c.zoom / 1.1); e.preventDefault(); }
        });
    },
    openCropper: (src, opener) => new Promise((resolve) => {
        const box = document.getElementById('cropper');
        const img = document.getElementById('crop-img');
        const stage = document.getElementById('crop-stage');
        const isFile = src instanceof Blob;
        const url = isFile ? URL.createObjectURL(src) : src;
        img.removeAttribute('style');
        if (!isFile && /^https?:/.test(url)) img.crossOrigin = 'anonymous'; else img.removeAttribute('crossorigin');
        box.hidden = false;
        app.crop = null;
        img.onload = () => {
            const S = stage.clientWidth, w = img.naturalWidth, h = img.naturalHeight;
            const base = S / Math.min(w, h); // escala mínima: la imagen cubre el cuadro
            app.crop = { resolve, url, isFile, opener, S, w, h, base, zoom: 1, tx: (S - w * base) / 2, ty: (S - h * base) / 2 };
            img.style.width = w + 'px';
            img.style.height = h + 'px';
            document.getElementById('crop-zoom').value = 1;
            app.cropApply();
            stage.focus({ preventScroll: true });
        };
        img.onerror = () => { app.crop = { resolve, url, isFile, opener }; app.closeCropper(null); app.showToast('No se pudo abrir la imagen'); };
        img.src = url;
    }),
    // Mantiene la imagen cubriendo el cuadro y aplica la transformación.
    cropApply: () => {
        const c = app.crop;
        const sc = c.base * c.zoom;
        c.tx = Math.min(0, Math.max(c.S - c.w * sc, c.tx));
        c.ty = Math.min(0, Math.max(c.S - c.h * sc, c.ty));
        document.getElementById('crop-img').style.transform = `translate(${c.tx}px, ${c.ty}px) scale(${sc})`;
    },
    // Zoom alrededor de un punto del cuadro (por defecto, el centro).
    cropZoomTo: (z, cx, cy) => {
        const c = app.crop;
        if (!c) return;
        z = Math.min(4, Math.max(1, z));
        if (cx === undefined) { cx = c.S / 2; cy = c.S / 2; }
        const old = c.base * c.zoom, next = c.base * z;
        c.tx = cx - (cx - c.tx) * next / old;
        c.ty = cy - (cy - c.ty) * next / old;
        c.zoom = z;
        document.getElementById('crop-zoom').value = z;
        app.cropApply();
    },
    useCrop: () => {
        const c = app.crop;
        if (!c || !c.S) return;
        const sc = c.base * c.zoom;
        app.closeCropper({ sx: -c.tx / sc, sy: -c.ty / sc, sw: c.S / sc, sh: c.S / sc });
    },
    closeCropper: (result) => {
        const c = app.crop;
        document.getElementById('cropper').hidden = true;
        document.getElementById('crop-img').removeAttribute('src');
        app.crop = null;
        if (!c) return;
        if (c.isFile) URL.revokeObjectURL(c.url);
        if (c.opener && document.contains(c.opener)) c.opener.focus({ preventScroll: true });
        c.resolve(result);
    },
    pickerBusy: (picker) => {
        if (!picker.busy()) return false;
        app.showToast('Espera a que termine de subir la imagen');
        return true;
    },
    // Al escanear: si el artículo aún no tiene imagen, usar la foto del producto.
    useProductPhoto: (picker, info) => {
        if (info && info.image && !picker.get() && !picker.busy()) picker.fromURL(info.image);
    },

    // --- SHEETS ---
    // Accesibles: foco al primer campo, Tab atrapado dentro, Escape para
    // cerrar y el foco vuelve al elemento que abrió la hoja.
    sheetOpener: null,
    // focusField: enfocar el primer campo (Agregar) o solo la hoja (Editar, para
    // que no aparezca el teclado; con teclado físico se sigue navegando con Tab).
    openSheet: (id, { focusField = true } = {}) => {
        const sheet = document.getElementById(id);
        app.sheetOpener = document.activeElement;
        document.getElementById('sheet-backdrop').classList.add('open');
        sheet.classList.add('open');
        // Enfocar al terminar de subir la hoja; se cancela si antes se cierra o se
        // abre otra (si no, el foco saltaba a una hoja ya cerrada).
        clearTimeout(app.sheetFocusTimer);
        app.sheetFocusTimer = setTimeout(() => {
            if (!sheet.classList.contains('open')) return;
            const f = focusField && sheet.querySelector('input:not([type=hidden]):not([type=file]), select');
            (f || sheet).focus({ preventScroll: true });
        }, 320);
    },
    openAddSheet: () => {
        app.iconPickers.new.set(null);
        app.setSeg('new-list', app.currentTab === 'once' ? 'once' : 'regular');
        app.addBarcodes = [];
        app.renderBarcodes('add');
        document.getElementById('new-name').value = '';
        document.getElementById('new-price').value = '';
        document.getElementById('new-note').value = '';
        // Sin enfocar el nombre: el teclado taparía la hoja (y a veces se escanea primero).
        app.openSheet('add-sheet', { focusField: false });
    },
    closeSheets: () => {
        clearTimeout(app.sheetFocusTimer);
        const wasOpen = document.querySelector('.sheet.open');
        document.getElementById('sheet-backdrop').classList.remove('open');
        document.querySelectorAll('.sheet').forEach(s => s.classList.remove('open'));
        if (wasOpen && app.sheetOpener && document.contains(app.sheetOpener)) app.sheetOpener.focus({ preventScroll: true });
        app.sheetOpener = null;
    },
    onSheetKeydown: (e) => {
        if (!document.getElementById('cropper').hidden) {
            if (e.key === 'Escape') { e.preventDefault(); app.closeCropper(null); }
            else if (e.key === 'Tab') app.trapTab(document.getElementById('cropper'), e);
            return;
        }
        if (!document.getElementById('lightbox').hidden) {
            if (e.key === 'Escape' || e.key === 'Tab') { e.preventDefault(); if (e.key === 'Escape') app.closeLightbox(); }
            return;
        }
        if (app.scan) {
            if (e.key === 'Escape') { e.preventDefault(); app.closeScanner(null); }
            else if (e.key === 'Tab') app.trapTab(document.getElementById('scanner'), e);
            return;
        }
        const open = document.querySelector('.sheet.open');
        if (!open) return;
        if (e.key === 'Escape') { e.preventDefault(); app.closeSheets(); return; }
        if (e.key === 'Tab') app.trapTab(open, e);
    },
    trapTab: (open, e) => {
        // getClientRects: visible (offsetParent no sirve dentro de contenedores fixed)
        const f = [...open.querySelectorAll('button, input:not([type=hidden]), select, textarea')].filter(el => !el.disabled && el.getClientRects().length > 0);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (!open.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
        else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    },

    // --- NAVEGACIÓN ---
    setTab: (tabName) => {
        app.currentTab = tabName;
        document.querySelectorAll('.bn-item[data-view]').forEach(b =>
            b.classList.toggle('active', b.dataset.view === tabName));
        ['shopping', 'inventory', 'once'].forEach(v =>
            document.getElementById(`view-${v}`).classList.toggle('hidden', tabName !== v));
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
