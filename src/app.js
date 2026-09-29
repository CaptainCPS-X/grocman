const app = {
    data: { version: 0, items: [], lists: [] },

    // --- Íconos (Lucide inline) ---
    ICONS: {
        check: '<polyline points="20 6 9 17 4 12"/>',
        cart: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
        image: '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
        chevron: '<path d="m6 9 6 6 6-6"/>',
        plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
        dots: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
        collapse: '<path d="m7 20 5-5 5 5"/><path d="m7 4 5 5 5-5"/>',
        expand: '<path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/>',
        flashlight: '<path d="M18 6c0 2-2 2-2 4v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V10c0-2-2-2-2-4V2h12z"/><line x1="6" x2="18" y1="6" y2="6"/><line x1="12" x2="12" y1="12" y2="12"/>',
        barcode: '<path d="M3 5v14"/><path d="M8 5v14"/><path d="M12 5v14"/><path d="M17 5v14"/><path d="M21 5v14"/>',
        x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
        copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
        grid: '<rect width="7" height="10" x="3" y="3" rx="1"/><rect width="7" height="10" x="14" y="3" rx="1"/><path d="M3 17h7M14 17h7M3 21h5M14 21h5"/>',
        rows: '<rect width="5" height="7" x="3" y="3" rx="1"/><rect width="5" height="7" x="3" y="14" rx="1"/><path d="M11 5h10M11 8h6M11 16h10M11 19h6"/>',
        search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
        pencil: '<path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/>',
        trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>'
    },
    CAT_ICONS: {
        'Frutas y Verduras': '<path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/>',
        'Carnes y Mariscos': '<circle cx="12.5" cy="8.5" r="2.5"/><path d="M12.5 2a6.5 6.5 0 0 0-6.22 4.6c-1.1 3.13-.78 3.9-3.18 6.08A3 3 0 0 0 5 18c4 0 8.4-1.8 11.4-4.3A6.5 6.5 0 0 0 12.5 2Z"/><path d="m18.5 6 2.19 4.5a6.48 6.48 0 0 1 .31 2 6.49 6.49 0 0 1-2.6 5.2C15.4 20.2 11 22 7 22a3 3 0 0 1-2.68-1.66L2.4 16.5"/>',
        'Lácteos y Huevos': '<path d="M12 22c6.23-.05 7.87-5.57 7.5-10-.36-4.34-3.95-9.96-7.5-10-3.55.04-7.14 5.66-7.5 10-.37 4.43 1.27 9.95 7.5 10z"/>',
        'Panadería': '<path d="m4.6 13.11 5.79-3.21c1.89-1.05 4.79 1.78 3.71 3.71l-3.22 5.81C8.8 23.16.79 15.23 4.6 13.11Z"/><path d="m10.5 9.5-1-2.29C9.2 6.48 8.8 6 8 6H4.5C2.79 6 2 6.5 2 8.5a7.71 7.71 0 0 0 2 4.83"/><path d="M8 6c0-1.55.24-4-2-4-2 0-2.5 2.17-2.5 4"/><path d="m14.5 13.5 2.29 1c.73.3 1.21.7 1.21 1.5v3.5c0 1.71-.5 2.5-2.5 2.5a7.71 7.71 0 0 1-4.83-2"/><path d="M18 16c1.55 0 4-.24 4 2 0 2-2.17 2.5-4 2.5"/>',
        'Congelados': '<line x1="2" x2="22" y1="12" y2="12"/><line x1="12" x2="12" y1="2" y2="22"/><path d="m20 16-4-4 4-4"/><path d="m4 8 4 4-4 4"/><path d="m16 4-4 4-4-4"/><path d="m8 20 4-4 4 4"/>',
        'Granos y Pastas': '<path d="M2 22 16 8"/><path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z"/>',
        'Desayuno y Cereales': '<path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/><path d="M6 2v2"/>',
        'Bebidas': '<path d="m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8"/><path d="M5 8h14"/><path d="M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0"/><path d="m12 8-1-6h2"/>',
        'Especias y Condimentos': '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
        'Salsas y Aderezos': '<path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"/><path d="M7 21h10"/><path d="M19.5 12 22 6"/><path d="M16.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.73 1.62"/><path d="M11.25 3c.27.1.8.53.74 1.36-.05.83-.93 1.2-.98 2.02-.06.78.33 1.24.72 1.62"/><path d="M6.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.74 1.62"/>',
        'Despensa': '<path d="m5 11 4-7"/><path d="m19 11-4-7"/><path d="M2 11h20"/><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"/><path d="M4.5 15.5h15"/><path d="m9 11 1 9"/><path d="m15 11-1 9"/>',
        'Cuidado Personal': '<path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/>',
        'Salud y Farmacia': '<path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/>',
        'Limpieza y Hogar': '<path d="M3 3h.01"/><path d="M7 5h.01"/><path d="M11 7h.01"/><path d="M3 7h.01"/><path d="M7 9h.01"/><path d="M3 11h.01"/><rect width="4" height="4" x="15" y="5"/><path d="m19 9 2 2v10c0 .6-.4 1-1 1h-6c-.6 0-1-.4-1-1V11l2-2"/><path d="M13 14h8"/>',
        'Libros': '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
        'Otros': '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
    },
    svgIcon: (name, cls = 'lucide') =>
        `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${app.ICONS[name] || ''}</svg>`,
    LEGACY_CATS: { 'Proteínas': 'Carnes y Mariscos', 'Lácteos/Huevos': 'Lácteos y Huevos', 'Frutas/Verduras': 'Frutas y Verduras', 'Higiene': 'Cuidado Personal', 'Limpieza': 'Limpieza y Hogar' },
    catIcon: (cat) =>
        `<svg class="lucide" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${app.CAT_ICONS[cat] || app.CAT_ICONS[app.LEGACY_CATS[cat]] || app.CAT_ICONS['Otros']}</svg>`,

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
        const basket = document.getElementById('basket-list-render');
        const inventory = document.getElementById('inventory-list-render');
        const lists = document.getElementById('lists-render');
        shopping.addEventListener('click', app.onShoppingClick);
        basket.addEventListener('click', app.onBasketClick);
        inventory.addEventListener('click', app.onInventoryClick);
        lists.addEventListener('click', app.onListsClick);
        document.addEventListener('click', (e) => {
            const cp = e.target.closest('.isbn-copy');
            if (cp) { e.preventDefault(); e.stopPropagation(); app.copyText(cp.dataset.copy); }
        }, true);
        // Portadas grandes de los libros: si la imagen no tiene versión grande, la miniatura.
        lists.addEventListener('error', (e) => {
            const img = e.target;
            if (img.tagName === 'IMG' && img.dataset.fallback) { img.src = img.dataset.fallback; img.dataset.fallback = ''; }
        }, true);
        document.getElementById('falta-filter').addEventListener('click', (e) => {
            const chip = e.target.closest('.chip');
            if (chip) app.setFaltaFilter(chip.dataset.filter);
        });
        app.initListSheets();
        // Enter / Espacio en los elementos con role="button" (filas editables)
        [shopping, basket, inventory, lists].forEach(el => el.addEventListener('keydown', (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[role="button"]')) {
                e.preventDefault();
                e.target.click();
            }
        }));
        document.addEventListener('keydown', app.onSheetKeydown);
        document.querySelector('.scanner-view').addEventListener('click', app.focusAt);
        app.iconPickers = { new: app.makeIconPicker('new'), edit: app.makeIconPicker('edit') };
        ['shopping-list-render', 'basket-list-render', 'inventory-list-render', 'lists-render'].forEach(id => document.getElementById(id).addEventListener('toggle', app.onGroupToggle, true));
        app.initCropper();
        // Selectores de lista (Regular / Una vez / Libro)
        ['new', 'edit'].forEach(p => document.getElementById(`${p}-list`).addEventListener('click', (e) => {
            const opt = e.target.closest('.seg-opt');
            if (!opt) return;
            app.setSeg(`${p}-list`, opt.dataset.list);
            app.updateListFields(p);
        }));
        // Nivel en Editar: interruptor + slider
        document.getElementById('edit-level-on').addEventListener('change', app.updateLevelField);
        document.getElementById('edit-level').addEventListener('input', (e) => { document.getElementById('edit-level-out').textContent = e.target.value + '%'; });
        document.getElementById('level-range').addEventListener('input', (e) => app.showLevel(+e.target.value));
        // Portada de la vista previa → visor. Se detecta el toque con pointer
        // events: tras un gesto (p. ej. deslizar para cerrar el visor) Chrome a
        // veces no genera el click del siguiente toque.
        const lbImg = document.getElementById('lightbox-img');
        lbImg.addEventListener('pointerdown', (e) => { app.lbTap = { x: e.clientX, y: e.clientY, t: Date.now() }; });
        lbImg.addEventListener('pointerup', (e) => {
            const t = app.lbTap; app.lbTap = null;
            if (t && Date.now() - t.t < 600 && Math.hypot(e.clientX - t.x, e.clientY - t.y) < 12) app.openCoverViewer();
        });
        lbImg.addEventListener('click', () => app.openCoverViewer());
        lbImg.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); app.openCoverViewer(); } });
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
            const lists = Array.isArray(json.lists) ? json.lists : app.data.lists;
            const changed = JSON.stringify([app.data.items, app.data.lists]) !== JSON.stringify([json.items, lists]);
            app.data = { version: json.version, items: json.items, lists };
            if (changed) app.render();
        } catch (e) { console.error("Error conexión:", e); }
    },

    // Aplica un cambio a los artículos (función items → items) y lo guarda.
    change: (mutate) => app.changeDoc(d => ({ ...d, items: mutate(d.items) })),
    // Aplica un cambio al documento completo ({ items, lists } → { items, lists }).
    // Devuelve true si se guardó.
    changeDoc: (mutate) => {
        app.changeSeq++;
        app.pending.push(mutate);
        const d = mutate({ items: app.data.items, lists: app.data.lists });
        app.data.items = d.items;
        app.data.lists = d.lists;
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
                    body: JSON.stringify({ version: app.data.version, items: app.data.items, lists: app.data.lists })
                });
                json = await res.json().catch(() => ({}));
            } catch (e) {
                return app.saveFailed('Sin conexión: no se guardó el cambio');
            }
            if (res.status === 401) { location.reload(); return false; }
            if (res.status === 409 && json.latest && conflicts < 3) {
                conflicts++;
                const d = app.pending.reduce((doc, m) => m(doc), { items: json.latest.items, lists: json.latest.lists || app.data.lists });
                app.data = { version: json.latest.version, items: d.items, lists: d.lists };
                app.render();
                continue;
            }
            if (!res.ok) return app.saveFailed(json.error || 'Error al guardar');
            app.data.version = json.newVersion;
            app.pending.splice(0, sent);
            // Sin más cambios pendientes: adoptar la lista tal como la guardó el servidor.
            if (!app.pending.length && Array.isArray(json.items)
                && JSON.stringify([json.items, json.lists]) !== JSON.stringify([app.data.items, app.data.lists])) {
                app.data.items = json.items;
                if (Array.isArray(json.lists)) app.data.lists = json.lists;
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
        app.renderBasket();
        app.renderInventory();
        app.renderLists();
        app.renderFaltaChips();
        app.updateTotal();
    },

    // --- LISTAS (las define el usuario) ---
    // Tipos: restock (se repone: Falta + Inventario + nivel), single (compra
    // única: Falta y luego guardada), collection (colección: lo quiero / lo tengo).
    listById: (id) => app.data.lists.find(l => l.id === id),
    listOf: (item) => app.listById(item.list || 'regular') || app.listById('regular') || { id: 'regular', name: 'Hogar', type: 'restock', icon: 'house', color: '#3b82f6' },
    typeOf: (item) => app.listOf(item).type,
    isOnce: (item) => app.typeOf(item) === 'single',
    isBook: (item) => app.typeOf(item) === 'collection',
    isRestock: (item) => app.typeOf(item) === 'restock',
    // Etiqueta de la lista (en Falta y Canasta, para las que no son Hogar).
    listBadge: (item) => {
        const l = app.listOf(item);
        return l.id === 'regular' ? '' : `<span class="once-badge" style="--lc:${l.color}">${app.esc(l.name)}</span>`;
    },
    // Canasta: elegido para esta compra (por comprar con marca, o ya en el carrito).
    inBasket: (item) => item.status === 'in_cart' || (item.status === 'needed' && !!item.basket),
    // Cambiar estado manteniendo la canasta coherente (en casa ⇒ fuera de la canasta).
    withStatus: (item, status) => {
        const out = { ...item, status };
        if (status === 'stocked') delete out.basket;
        return status === 'stocked' ? app.restocked(out) : out;
    },
    // Al volver a tener el artículo en casa, su nivel vuelve a 100%.
    restocked: (item) => (Number.isInteger(item.level) && app.isRestock(item)) ? { ...item, level: 100 } : item,

    // Barrita de cuánto queda (solo artículos regulares con nivel medido).
    levelBarHTML: (item) => {
        if (!app.isRestock(item) || !Number.isInteger(item.level)) return '';
        const lv = item.level, cls = lv >= 60 ? 'ok' : lv >= 30 ? 'mid' : 'low';
        return `<button type="button" class="level-bar lv-${cls}" style="--lv:${lv}%" aria-label="Queda ${lv}% de ${app.esc(item.name)}. Ajustar">
            <span class="lv-track"><span class="lv-fill"></span></span><span class="lv-text">${lv === 0 ? 'Agotado' : lv + '%'}</span>
        </button>`;
    },

    // --- TOTALES Y CHECKOUT ---
    updateTotal: () => {
        // Total de la canasta (lo elegido para esta compra) y lo ya en el carrito.
        const basket = app.data.items.filter(app.inBasket);
        const cart = basket.filter(i => i.status === 'in_cart');
        const sum = (list) => list.reduce((s, i) => s + (parseFloat(i.price) || 0), 0);
        document.getElementById('total-amount').innerText = '$' + sum(basket).toFixed(2);
        const cartSubtotal = document.getElementById('cart-subtotal');
        cartSubtotal.innerText = `En carrito: $${sum(cart).toFixed(2)} · ${cart.length} de ${basket.length}`;
        cartSubtotal.style.display = cart.length ? 'block' : 'none';
        const btnCheckout = document.getElementById('btn-checkout');
        btnCheckout.style.display = cart.length ? 'inline-flex' : 'none';
        document.getElementById('checkout-label').innerText = `Finalizar (${cart.length})`;
        document.getElementById('total-bar').style.display = app.currentTab === 'basket' && basket.length ? 'flex' : 'none';
        const badge = document.getElementById('basket-count');
        badge.hidden = !basket.length;
        badge.textContent = basket.length;
    },

    checkout: async () => {
        if (!confirm("¿Ya pagaste? Lo marcado pasa a \"en casa\"; lo demás se queda en la canasta.")) return;
        // Lo marcado pasa a "en casa"; lo que no se encontró se queda en la canasta.
        const ok = await app.change(items => items.map(i => i.status === 'in_cart' ? app.withStatus(i, 'stocked') : i));
        if (ok) app.showToast("¡Compra finalizada!");
    },

    // --- LISTA DE COMPRA ---
    // --- FALTA: lo que se acabó o falta comprar (se vigila; no todo se compra) ---
    // Cada fila tiene "+ Canasta" para elegir lo que se compra esta vez.
    // Filtro: Todo / Regular / Una vez (con las compras de una vez ya guardadas).
    FILTER_KEY: 'grocman.faltaFilter',
    faltaFilter: (() => { try { return localStorage.getItem('grocman.faltaFilter') || 'all'; } catch (e) { return 'all'; } })(),
    // Pastillas: Todo + cada lista que aparece en Falta (se repone / compra única).
    renderFaltaChips: () => {
        const el = document.getElementById('falta-filter');
        const lists = app.data.lists.filter(l => l.type !== 'collection');
        if (app.faltaFilter !== 'all' && !lists.some(l => l.id === app.faltaFilter)) app.faltaFilter = 'all';
        const chip = (id, name, color) => `<button type="button" class="chip ${app.faltaFilter === id ? 'active' : ''}" role="radio" aria-checked="${app.faltaFilter === id}" data-filter="${id}"${color ? ` style="--lc:${color}"` : ''}>${app.esc(name)}</button>`;
        const html = chip('all', 'Todo') + lists.map(l => chip(l.id, l.name, l.color)).join('');
        if (el.innerHTML !== html) el.innerHTML = html;
    },
    setFaltaFilter: (f, redraw = true) => {
        app.faltaFilter = (f === 'all' || app.listById(f)) ? f : 'all';
        try { localStorage.setItem(app.FILTER_KEY, app.faltaFilter); } catch (e) { }
        app.renderFaltaChips();
        if (redraw) app.renderShopping();
    },
    basketBtnHTML: (item) => {
        const on = app.inBasket(item), name = app.esc(item.name);
        return `<button type="button" class="basket-btn ${on ? 'on' : ''}" aria-pressed="${on}" aria-label="${on ? 'Sacar de la canasta' : 'Agregar a la canasta'}: ${name}">${on ? app.svgIcon('check') + 'Canasta' : '+ Canasta'}</button>`;
    },
    renderShopping: () => {
        const container = document.getElementById('shopping-list-render');
        const f = app.faltaFilter;
        const inFilter = (i) => f === 'all' || (i.list || 'regular') === f;
        const pending = app.data.items.filter(i => !app.isBook(i) && (i.status === 'needed' || i.status === 'in_cart') && inFilter(i));
        const fl = f !== 'all' ? app.listById(f) : null;
        // Filtrando una lista de compra única: también sus artículos ya guardados.
        const saved = fl && fl.type === 'single' ? app.data.items.filter(i => inFilter(i) && i.status === 'stocked').sort((a, b) => a.name.localeCompare(b.name)) : [];

        if (!pending.length && !saved.length) {
            container.innerHTML = fl
                ? `<div class="view-empty">Nada pendiente en "${app.esc(fl.name)}".</div>`
                : '<div class="view-empty">🎉 No falta nada</div>';
            return;
        }
        const groups = app.byCategory(pending);
        let html = pending.length ? app.toolsHTML('shopping', groups.map(g => g.cat)) : '';
        for (const { cat, items } of groups) {
            items.sort((a, b) => a.name.localeCompare(b.name));
            html += app.groupHTML('shopping', cat, items.length, items.map(item => {
                const detail = (item.note ? `<div class="item-note">${app.esc(item.note)}</div>` : '') + app.levelBarHTML(item);
                return `
                <div class="item-row ${app.inBasket(item) ? 'in-basket' : ''}" data-name="${app.esc(item.name)}">
                    ${app.rowMainHTML(item, 'item-main', detail, f === 'all' ? app.listBadge(item) : '')}
                    ${app.basketBtnHTML(item)}
                </div>`;
            }).join(''));
        }
        if (saved.length) {
            html += `<div class="cat-header once-saved">Guardadas<span class="cat-count">· ${saved.length}</span></div>` + saved.map(item => `
                <div class="inv-item stocked" data-name="${app.esc(item.name)}">
                    ${app.rowMainHTML(item, 'inv-main', `<div class="inv-cat">${app.esc(item.category)}</div>`)}
                    <div class="inv-actions">
                        <button type="button" class="inv-toggle pedir" aria-label="Pedir: ${app.esc(item.name)}">+ Pedir</button>
                        <button type="button" class="inv-del" title="Eliminar" aria-label="Eliminar ${app.esc(item.name)}">${app.svgIcon('trash')}</button>
                    </div>
                </div>`).join('');
        }
        container.innerHTML = html;
    },

    // --- CANASTA: lo elegido para esta compra; en la tienda se marca ✓ ---
    renderBasket: () => {
        const container = document.getElementById('basket-list-render');
        const items = app.data.items.filter(app.inBasket);
        if (!items.length) {
            container.innerHTML = '<div class="view-empty">La canasta está vacía.<br><span class="view-empty-sub">En "Falta", toca "+ Canasta" en lo que vas a comprar esta vez.</span></div>';
            return;
        }
        const groups = app.byCategory(items);
        let html = app.toolsHTML('basket', groups.map(g => g.cat));
        for (const { cat, items: list } of groups) {
            // Lo que ya está en el carrito va al final de su categoría.
            list.sort((a, b) => (a.status === b.status ? a.name.localeCompare(b.name) : (a.status === 'in_cart' ? 1 : -1)));
            html += app.groupHTML('basket', cat, list.length, list.map(item => {
                const inCart = item.status === 'in_cart', name = app.esc(item.name);
                const detail = item.note ? `<div class="item-note">${app.esc(item.note)}</div>` : '';
                return `
                <div class="item-row ${inCart ? 'in-cart' : ''}" data-name="${name}">
                    ${app.rowMainHTML(item, 'item-main', detail, app.listBadge(item))}
                    <div class="basket-actions">
                        <button type="button" class="check-circle ${inCart ? 'in-cart' : ''}" aria-pressed="${inCart}" aria-label="${inCart ? 'Sacar del carrito' : 'Poner en el carrito'}: ${name}">${app.svgIcon('check')}</button>
                        <button type="button" class="basket-remove" title="Sacar de la canasta" aria-label="Sacar de la canasta: ${name}">${app.svgIcon('x')}</button>
                    </div>
                </div>`;
            }).join(''));
        }
        container.innerHTML = html;
    },
    onBasketClick: (e) => {
        const all = e.target.closest('.collapse-all');
        if (all) { app.toggleAll(all); return; }
        const row = e.target.closest('.item-row');
        if (!row) return;
        const name = row.dataset.name;
        if (e.target.closest('.check-circle')) app.toggleShoppingStatus(name);
        else if (e.target.closest('.basket-remove')) app.setBasket(name, false);
        else if (e.target.closest('.item-thumb')) app.openLightbox(name);
        else if (e.target.closest('.item-main')) app.openLightbox(name);
    },
    // Elegir / quitar de la canasta (intención explícita, segura al reintentar).
    setBasket: (name, on) => app.change(items => items.map(i => {
        if (i.name !== name || i.status === 'stocked') return i;
        const out = { ...i, status: 'needed' };
        if (on) out.basket = true; else delete out.basket;
        return out;
    })),

    // --- LISTAS: tarjetas con todas las listas y el detalle de cada una ---
    LIST_ICONS: {
        house: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
        tag: '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',
        book: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
        gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>',
        plane: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
        heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
        star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
        pill: '<path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/>',
        shirt: '<path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>',
        wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
        paw: '<circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/>',
        sprout: '<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>',
        briefcase: '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
        gamepad: '<line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="11" y2="11"/><rect width="20" height="12" x="2" y="6" rx="2"/>',
        cart: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
        utensils: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 3 2h3Zm0 0v7"/>',
    },
    listIcon: (key) => `<svg class="lucide" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${app.LIST_ICONS[key] || app.LIST_ICONS.tag}</svg>`,
    TYPE_LABEL: { restock: 'Se repone', single: 'Compra única', collection: 'Colección' },
    openListId: null,   // lista abierta en la pestaña Listas (null = tarjetas)
    itemsOf: (id) => app.data.items.filter(i => (i.list || 'regular') === id),
    // Resumen de una tarjeta, según el tipo de lista.
    listStats: (l) => {
        const its = app.itemsOf(l.id);
        const pend = its.filter(i => i.status !== 'stocked').length, have = its.length - pend;
        if (l.type === 'collection') return [`${pend} lo quiero`, `${have} lo tengo`];
        if (l.type === 'single') return [`${pend} por comprar`, `${have} guardada${have === 1 ? '' : 's'}`];
        return [`${pend} falta${pend === 1 ? '' : 'n'}`, `${have} en casa`];
    },
    // Vista de una colección: 'cards' (portadas) o 'list'. Se recuerda por lista.
    LIST_VIEW_KEY: 'grocman.listView',
    listViews: (() => { try { return JSON.parse(localStorage.getItem('grocman.listView')) || {}; } catch (e) { return {}; } })(),
    listView: (id) => app.listViews[id] === 'list' ? 'list' : 'cards',
    setListView: (id, v) => {
        app.listViews[id] = v;
        try { localStorage.setItem(app.LIST_VIEW_KEY, JSON.stringify(app.listViews)); } catch (e) { }
        app.renderLists();
    },
    // Portada vertical: la imagen grande completa (la miniatura es un cuadrado recortado).
    coverHTML: (item, cls) => item.icon
        ? `<span class="${cls} has-img"><img src="${app.iconURL(item.icon)}&size=l" data-fallback="${app.iconURL(item.icon)}" alt="" loading="lazy" decoding="async"></span>`
        : `<span class="${cls} no-img" style="--lc:${(app.listOf(item) || {}).color || '#f59e0b'}" aria-hidden="true">${app.catIcon('Libros')}<span class="cv-title">${app.esc(item.name)}</span></span>`,
    renderLists: () => {
        const c = document.getElementById('lists-render');
        const open = app.openListId && app.listById(app.openListId);
        if (!open) {
            app.openListId = null;
            c.innerHTML = `<div class="list-cards">${app.data.lists.map(l => {
                const [a, b] = app.listStats(l);
                return `<button type="button" class="list-card" data-list="${l.id}" style="--lc:${l.color}" aria-label="Abrir ${app.esc(l.name)}">
                    <span class="lc-icon">${app.listIcon(l.icon)}</span>
                    <span class="lc-name">${app.esc(l.name)}</span>
                    <span class="lc-type">${app.TYPE_LABEL[l.type]}</span>
                    <span class="lc-stats"><span>${a}</span><span>${b}</span></span>
                </button>`;
            }).join('')}
                <button type="button" class="list-card list-new" data-action="new-list"><span class="lc-icon">${app.svgIcon('plus')}</span><span class="lc-name">Nueva lista</span></button>
            </div>`;
            return;
        }
        const l = open, its = app.itemsOf(l.id).sort((a, b) => a.name.localeCompare(b.name));
        const head = `<div class="list-head" style="--lc:${l.color}">
            <button type="button" class="lh-back" data-action="back" aria-label="Volver a las listas">${app.svgIcon('chevron', 'lucide lh-chev')}</button>
            <span class="lc-icon">${app.listIcon(l.icon)}</span>
            <div class="lh-title"><h2>${app.esc(l.name)}</h2><span>${app.TYPE_LABEL[l.type]} · ${its.length} artículo${its.length === 1 ? '' : 's'}</span></div>
            <button type="button" class="lh-menu" data-action="menu" aria-label="Opciones de la lista">${app.svgIcon('dots')}</button>
        </div>
        <div class="list-actions">
            <button type="button" class="list-add" data-action="add">${app.svgIcon('plus')}Agregar a ${app.esc(l.name)}</button>
            ${l.type === 'collection' ? `<button type="button" class="list-add list-search" data-action="search">${app.svgIcon('search')}Buscar libro</button>` : ''}
        </div>`;
        if (!its.length) { c.innerHTML = head + '<div class="view-empty">Esta lista está vacía.</div>'; return; }
        const isCol = l.type === 'collection', view = isCol ? app.listView(l.id) : 'list';
        const toggle = isCol ? `<div class="view-toggle" role="radiogroup" aria-label="Vista">
            ${[['cards', 'grid', 'Portadas'], ['list', 'rows', 'Lista']].map(([v, ic, t]) => `<button type="button" class="vt-opt${view === v ? ' active' : ''}" role="radio" aria-checked="${view === v}" data-action="view" data-view="${v}">${app.svgIcon(ic)}<span>${t}</span></button>`).join('')}
        </div>` : '';
        const card = (item, labels) => {
            const pending = item.status !== 'stocked', name = app.esc(item.name), b = item.book || {};
            const label = pending ? labels[0] : labels[1];
            return `<div class="book-card ${pending ? 'needed' : 'stocked'}" data-name="${name}">
                <div class="bk-frame">
                    <button type="button" class="bk-open" aria-label="Ver ${name}">${app.coverHTML(item, 'bk-cover')}</button>
                    <button type="button" class="bk-toggle${pending ? '' : ' on'}" aria-label="${label}: ${name}" title="${label}">${app.svgIcon('check')}</button>
                </div>
                <div class="bk-title">${name}</div>
                ${(b.authors || []).length ? `<div class="bk-author">${app.esc(b.authors.join(', '))}</div>` : ''}
            </div>`;
        };
        const row = (item, labels) => {
            if (view === 'cards') return card(item, labels);
            const pending = item.status !== 'stocked', name = app.esc(item.name), b = item.book || {};
            const detail = l.type === 'collection' && (b.authors || b.year)
                ? `<div class="inv-cat">${app.esc([(b.authors || []).join(', '), b.year].filter(Boolean).join(' · '))}</div>`
                : (l.type === 'restock' ? app.levelBarHTML(item) : `<div class="inv-cat">${app.esc(item.category)}</div>`);
            return `<div class="inv-item ${pending ? 'needed' : 'stocked'}${isCol ? ' book-row' : ''}" data-name="${name}">
                ${app.rowMainHTML(item, 'inv-main', detail, '', isCol ? app.coverHTML(item, 'item-thumb book-thumb') : null)}
                <div class="inv-actions">
                    <button type="button" class="inv-toggle ${pending ? 'tengo' : 'pedir'}" aria-label="${pending ? labels[0] : labels[1]}: ${name}">${pending ? labels[0] : labels[1]}</button>
                    <button type="button" class="inv-del" title="Eliminar" aria-label="Eliminar ${name}">${app.svgIcon('trash')}</button>
                </div>
            </div>`;
        };
        const labels = l.type === 'collection' ? ['Lo tengo', 'Lo quiero'] : l.type === 'single' ? ['Ya lo tengo', '+ Pedir'] : ['Ya tengo', '+ Pedir'];
        const section = (title, list) => !list.length ? '' : `<div class="cat-header">${title}<span class="cat-count">· ${list.length}</span></div>`
            + (view === 'cards' ? `<div class="book-grid">${list.map(i => row(i, labels)).join('')}</div>` : list.map(i => row(i, labels)).join(''));
        const pend = its.filter(i => i.status !== 'stocked'), have = its.filter(i => i.status === 'stocked');
        const [t1, t2] = l.type === 'collection' ? ['Lo quiero', 'Lo tengo'] : l.type === 'single' ? ['Por comprar', 'Guardadas'] : ['Falta', 'En casa'];
        c.innerHTML = head + toggle + section(t1, pend) + section(t2, have);
    },
    onListsClick: (e) => {
        const card = e.target.closest('.list-card');
        if (card) {
            if (card.dataset.action === 'new-list') app.openListSheet(null);
            else { app.openListId = card.dataset.list; app.renderLists(); window.scrollTo(0, 0); }
            return;
        }
        const act = e.target.closest('[data-action]');
        if (act) {
            const a = act.dataset.action;
            if (a === 'back') { app.openListId = null; app.renderLists(); }
            else if (a === 'menu') app.openListMenu(app.openListId);
            else if (a === 'add') app.openAddSheet(app.openListId);
            else if (a === 'search') app.openBookSearch(app.openListId);
            else if (a === 'view') app.setListView(app.openListId, act.dataset.view);
            return;
        }
        const bk = e.target.closest('.book-card');
        if (bk) {
            const it = app.data.items.find(i => i.name === bk.dataset.name);
            if (!it) return;
            if (e.target.closest('.bk-toggle')) app.setStatus(it.name, it.status === 'stocked' ? 'needed' : 'stocked');
            else if (e.target.closest('.bk-open')) app.openLightbox(it.name);
            return;
        }
        const el = e.target.closest('.inv-item');
        if (!el) return;
        const name = el.dataset.name, item = app.data.items.find(i => i.name === name);
        if (!item) return;
        if (e.target.closest('.inv-del')) app.deleteItem(name);
        else if (e.target.closest('.inv-toggle')) app.setStatus(name, item.status === 'stocked' ? 'needed' : 'stocked');
        else if (e.target.closest('.item-thumb')) app.openLightbox(name);
        else if (e.target.closest('.level-bar')) app.openLevelSheet(name);
        else if (e.target.closest('.inv-main')) app.openLightbox(name);
    },

    // --- CREAR / EDITAR / BORRAR LISTAS ---
    initListSheets: () => {
        const pick = (gridId, attr) => document.getElementById(gridId).addEventListener('click', (e) => {
            const b = e.target.closest(`[data-${attr}]`);
            if (!b || b.disabled) return;
            app.markPick(gridId, attr, b.dataset[attr]);
        });
        pick('list-type', 'type'); pick('list-icon', 'icon'); pick('list-color', 'color');
        document.querySelectorAll('#list-icon .icon-opt').forEach(b => { b.innerHTML = app.listIcon(b.dataset.icon); });
        const confirmInput = document.getElementById('list-delete-confirm');
        confirmInput.addEventListener('input', app.updateDeleteButton);
        document.querySelectorAll('input[name="list-delete-mode"]').forEach(r => r.addEventListener('change', app.updateDeleteButton));
    },
    markPick: (gridId, attr, value) => {
        document.querySelectorAll(`#${gridId} [data-${attr}]`).forEach(b => {
            const on = b.dataset[attr] === value;
            b.classList.toggle('active', on);
            b.setAttribute('aria-checked', String(on));
        });
    },
    pickValue: (gridId, attr) => document.querySelector(`#${gridId} [data-${attr}].active`)?.dataset[attr],
    openListSheet: (id) => {
        const l = id ? app.listById(id) : null;
        document.getElementById('list-sheet-title').textContent = l ? 'Editar lista' : 'Nueva lista';
        document.getElementById('list-id').value = l ? l.id : '';
        document.getElementById('list-name').value = l ? l.name : '';
        app.markPick('list-type', 'type', l ? l.type : 'single');
        app.markPick('list-icon', 'icon', l ? l.icon : 'tag');
        app.markPick('list-color', 'color', l ? l.color : '#8b5cf6');
        const base = !!l && l.id === 'regular';
        document.querySelectorAll('#list-type .type-opt').forEach(b => { b.disabled = base && b.dataset.type !== 'restock'; });
        document.getElementById('list-type-hint').hidden = !base;
        app.openSheet('list-sheet', { focusField: !l });
    },
    saveList: (e) => {
        e.preventDefault();
        const id = document.getElementById('list-id').value;
        const name = document.getElementById('list-name').value.trim();
        if (!name) return;
        if (app.data.lists.some(l => l.id !== id && l.name.toLowerCase() === name.toLowerCase())) { app.showToast('Ya hay una lista con ese nombre'); return; }
        const fields = {
            name, type: id === 'regular' ? 'restock' : (app.pickValue('list-type', 'type') || 'single'),
            icon: app.pickValue('list-icon', 'icon') || 'tag', color: app.pickValue('list-color', 'color') || '#64748b',
        };
        if (id) {
            app.changeDoc(d => ({ ...d, lists: d.lists.map(l => l.id === id ? { ...l, ...fields } : l) }));
            app.showToast('Lista guardada');
        } else {
            const newId = 'l-' + Math.random().toString(36).slice(2, 10);
            app.openListId = newId; // antes del cambio: el redibujo ya muestra la lista nueva
            app.changeDoc(d => d.lists.some(l => l.name.toLowerCase() === name.toLowerCase()) ? d : ({ ...d, lists: [...d.lists, { id: newId, ...fields }] }));
            app.setTab('lists');
            app.renderLists();
            window.scrollTo(0, 0);
            app.showToast('Lista creada');
        }
        app.closeSheets();
    },
    openListMenu: (id) => {
        const l = app.listById(id);
        if (!l) return;
        app.menuListId = id;
        document.getElementById('list-menu-title').textContent = l.name;
        document.getElementById('list-menu-delete').hidden = id === 'regular';
        document.getElementById('list-menu-note').hidden = id !== 'regular';
        app.openSheet('list-menu-sheet', { focusField: false });
    },
    // Borrar: explica qué pasará, por defecto mueve los artículos a otra lista
    // y exige escribir el nombre de la lista.
    openDeleteList: (id) => {
        const l = app.listById(id);
        if (!l || id === 'regular') return;
        const n = app.itemsOf(id).length;
        app.deleteListId = id;
        document.getElementById('list-delete-title').textContent = `Borrar "${l.name}"`;
        document.getElementById('list-delete-summary').innerHTML = n
            ? `Esta lista tiene <strong>${n} artículo${n === 1 ? '' : 's'}</strong>. La lista se borra; elige qué hacer con ellos.`
            : 'Esta lista está vacía. Solo se borrará la lista.';
        document.getElementById('list-delete-items').hidden = !n;
        document.getElementById('list-delete-count').textContent = `${n} artículo${n === 1 ? '' : 's'}`;
        document.getElementById('list-delete-target').innerHTML = app.data.lists.filter(x => x.id !== id)
            .map(x => `<option value="${x.id}" ${x.id === 'regular' ? 'selected' : ''}>${app.esc(x.name)}</option>`).join('');
        document.querySelector('input[name="list-delete-mode"][value="move"]').checked = true;
        document.getElementById('list-delete-name').textContent = l.name;
        document.getElementById('list-delete-confirm').value = '';
        app.updateDeleteButton();
        app.openSheet('list-delete-sheet', { focusField: false });
    },
    updateDeleteButton: () => {
        const l = app.listById(app.deleteListId);
        const typed = document.getElementById('list-delete-confirm').value.trim();
        const del = document.querySelector('input[name="list-delete-mode"]:checked').value === 'delete';
        const n = l ? app.itemsOf(l.id).length : 0;
        const btn = document.getElementById('list-delete-btn');
        btn.disabled = !l || typed !== l.name;
        btn.textContent = del && n ? `Borrar lista y ${n} artículo${n === 1 ? '' : 's'}` : 'Borrar lista';
    },
    // Pasar un artículo a otra lista respetando el tipo de destino.
    moveToList: (item, target) => {
        const t = app.listById(target), out = { ...item };
        if (target === 'regular') delete out.list; else out.list = target;
        if (!t || t.type !== 'restock') delete out.level;
        if (t && t.type === 'collection') { delete out.basket; if (out.status === 'in_cart') out.status = 'needed'; }
        if (target === 'books') out.category = 'Libros'; else if (out.category === 'Libros') out.category = 'Otros';
        return out;
    },
    confirmDeleteList: async (e) => {
        e.preventDefault();
        const l = app.listById(app.deleteListId);
        if (!l || l.id === 'regular' || document.getElementById('list-delete-confirm').value.trim() !== l.name) return;
        const del = document.querySelector('input[name="list-delete-mode"]:checked').value === 'delete';
        const target = document.getElementById('list-delete-target').value || 'regular';
        const n = app.itemsOf(l.id).length;
        // Última confirmación si también se borran artículos.
        if (del && n && !confirm(`Se borrarán la lista "${l.name}" y sus ${n} artículo${n === 1 ? '' : 's'}. Esto no se puede deshacer desde la app. ¿Continuar?`)) return;
        const id = l.id;
        app.closeSheets();
        app.openListId = null;
        const ok = await app.changeDoc(d => ({
            lists: d.lists.filter(x => x.id !== id),
            items: del ? d.items.filter(i => (i.list || 'regular') !== id)
                : d.items.map(i => (i.list || 'regular') === id ? app.moveToList(i, target) : i),
        }));
        if (ok) app.showToast(del ? `Lista "${l.name}" borrada` : `Lista borrada; artículos movidos a ${app.listById(target)?.name || 'Hogar'}`);
    },

    // --- FILAS Y CATEGORÍAS (compartido por Lista, Inventario y Una vez) ---
    // Área editable de una fila: rejilla con el nombre arriba a todo el ancho
    // (empieza encima de la miniatura, hasta 2 líneas) y debajo miniatura +
    // detalle (nota, productos, nivel) + precio en su propia columna, así un
    // nombre largo nunca se monta sobre el precio.
    rowMainHTML: (item, cls, detail, badge = '', thumb = null) => {
        const name = app.esc(item.name);
        const price = item.price > 0 ? `<span class="row-price">$${parseFloat(item.price).toFixed(2)}</span>` : '';
        return `<div class="row-main ${cls}" role="button" tabindex="0" aria-label="Ver ${name}">
                        <div class="row-name"><span class="row-name-text">${name}</span>${badge}</div>
                        ${thumb || app.thumbHTML(item)}
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
        const saved = e.target.closest('.inv-item');   // compras de una vez guardadas
        if (saved) {
            const n = saved.dataset.name;
            if (e.target.closest('.inv-del')) app.deleteItem(n);
            else if (e.target.closest('.inv-toggle')) app.setStatus(n, 'needed');
            else if (e.target.closest('.item-thumb')) app.openLightbox(n);
            else if (e.target.closest('.inv-main')) app.openLightbox(n);
            return;
        }
        const row = e.target.closest('.item-row');
        if (!row) return;
        const name = row.dataset.name;
        const item = app.data.items.find(i => i.name === name);
        if (e.target.closest('.basket-btn')) { if (item) app.setBasket(name, !app.inBasket(item)); }
        else if (e.target.closest('.item-thumb')) app.openLightbox(name);
        else if (e.target.closest('.level-bar')) app.openLevelSheet(name);
        else if (e.target.closest('.item-main')) app.openLightbox(name);
    },

    // --- INVENTARIO ---
    renderInventory: () => {
        const container = document.getElementById('inventory-list-render');
        const regular = app.data.items.filter(app.isRestock);
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
        else if (e.target.closest('.item-thumb')) app.openLightbox(name);
        else if (e.target.closest('.level-bar')) app.openLevelSheet(name);
        else if (e.target.closest('.inv-main')) app.openLightbox(name);
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
    renderListPicker: (p, selected) => {
        const el = document.getElementById(`${p}-list`);
        el.innerHTML = app.data.lists.map(l => `<button type="button" class="seg-opt" role="radio" data-list="${l.id}" style="--lc:${l.color}">${app.listIcon(l.icon)}${app.esc(l.name)}</button>`).join('');
        app.setSeg(`${p}-list`, app.listById(selected) ? selected : 'regular');
    },

    // --- NIVEL (cuánto queda en casa) ---
    // En Editar: interruptor "Medir" + slider; no aplica a compras de una vez.
    // Campos según la lista: los libros no tienen categoría ni nivel (sí autor);
    // "Una vez" no tiene nivel.
    updateListFields: (p) => {
        const list = app.segValue(`${p}-list`), type = (app.listById(list) || {}).type;
        document.getElementById(`${p}-cat-field`).hidden = list === 'books';
        document.getElementById(`${p}-author-field`).hidden = type !== 'collection';
        if (p === 'new') {
            document.getElementById('new-booksearch').hidden = type !== 'collection';
            document.querySelector('#add-sheet .scan-row .btn-scan span').textContent = type === 'collection' ? 'Escanear' : 'Escanear producto';
        }
        if (p === 'edit') app.updateLevelField();
    },
    updateLevelField: () => {
        const type = (app.listById(app.segValue('edit-list')) || {}).type;
        const on = document.getElementById('edit-level-on').checked;
        document.getElementById('edit-level-field').hidden = type !== 'restock';
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
        if (!item) return;
        const box = document.getElementById('lightbox');
        const img = document.getElementById('lightbox-img');
        const noimg = document.getElementById('lightbox-noimg');
        if (item.icon) {
            img.hidden = false; noimg.hidden = true;
            img.dataset.fallback = app.iconURL(item.icon);
            img.src = app.iconURL(item.icon) + '&size=l';
            img.alt = item.name;
        } else {
            img.hidden = true; img.removeAttribute('src');
            noimg.hidden = false;
            noimg.innerHTML = app.catIcon(item.category);
        }
        app.lightboxName = item.name;
        document.getElementById('lightbox-caption').textContent = item.name;
        const b = item.book || {};
        document.getElementById('lightbox-sub').textContent = app.isBook(item)
            ? [(b.authors || []).join(', '), b.year].filter(Boolean).join(' · ')
            : [item.category, item.price > 0 ? '$' + parseFloat(item.price).toFixed(2) : '', item.note].filter(Boolean).join(' · ');
        const info = document.getElementById('lightbox-info');
        info.innerHTML = (item.barcodes || []).length ? '<p class="lb-loading">Buscando información…</p>' : '';
        app.lightboxOpener = document.activeElement;
        box.hidden = false;
        box.querySelector('.lightbox-close').focus({ preventScroll: true });
        const seq = app.lightboxSeq = (app.lightboxSeq || 0) + 1;
        app.productDetailsHTML(item).then(html => {
            if (seq === app.lightboxSeq && !box.hidden) info.innerHTML = html;
        });
    },

    // Información del producto para la vista previa, según su primer código:
    // libro (Open Library), comida (Open Food Facts) u otro (UPCitemdb vía servidor).
    productDetailsHTML: async (item) => {
        const codes = (item.barcodes || []).map(b => b.code);
        if (!codes.length) return '';
        const row = (k, v) => v ? `<div class="lb-row"><span class="lb-k">${k}</span><span class="lb-v">${app.esc(String(v))}</span></div>` : '';
        const para = (t) => t ? `<p class="lb-desc">${app.esc(t)}</p>` : '';
        const tags = (list) => list && list.length ? `<div class="lb-tags">${list.map(t => `<span>${app.esc(t)}</span>`).join('')}</div>` : '';
        const code = codes[0];
        if (app.isISBN(code)) {
            const b = await app.lookupBook(code);
            const isbnRow = `<div class="lb-row lb-isbn"><span class="lb-k">ISBN</span><span class="lb-v">${app.esc(code)}</span>${app.isbnActionsHTML(code)}</div>`;
            if (!b) return isbnRow + '<p class="lb-empty">Sin más información de este libro en Google Books ni en Open Library.</p>';
            return row('Autor', (b.authors || []).join(', ')) + row('Año', b.year) + row('Páginas', b.pages) + row('Editorial', b.publisher)
                + isbnRow + para(b.description) + tags(b.subjects) + `<p class="lb-src">Fuente: ${app.esc(b.source || 'Open Library')}</p>`;
        }
        const off = await app.foodDetails(code);
        if (off) {
            const p = off.product, n = p.nutriments || {};
            const num = (v, u) => (v === undefined || v === null || v === '') ? '' : `${Math.round(v * 10) / 10} ${u}`;
            const per = p.nutrition_data_per === 'serving' ? 'por porción' : 'por 100 g/ml';
            const nutri = p.nutriscore_grade && /^[a-e]$/.test(p.nutriscore_grade) ? `<span class="nutri nutri-${p.nutriscore_grade}">Nutri-Score ${p.nutriscore_grade.toUpperCase()}</span>` : '';
            const nova = p.nova_group ? `<span class="nova">NOVA ${p.nova_group}</span>` : '';
            const nut = [['Energía', num(n['energy-kcal_100g'], 'kcal')], ['Proteína', num(n.proteins_100g, 'g')], ['Grasa', num(n.fat_100g, 'g')], ['Carbohidratos', num(n.carbohydrates_100g, 'g')], ['Azúcares', num(n.sugars_100g, 'g')], ['Sal', num(n.salt_100g, 'g')]].filter(x => x[1]);
            const allergens = (p.allergens_tags || []).map(a => a.replace(/^\\w+:/, '').replace(/-/g, ' '));
            return (nutri || nova ? `<div class="lb-badges">${nutri}${nova}</div>` : '')
                + row('Marca', p.brands) + row('Cantidad', p.quantity)
                + (nut.length ? `<div class="lb-nutri"><div class="lb-k">Nutrición ${per}</div>${nut.map(([k, v]) => `<div class="lb-nrow"><span>${k}</span><span>${v}</span></div>`).join('')}</div>` : '')
                + (p.ingredients_text_es || p.ingredients_text_en || p.ingredients_text ? `<div class="lb-k">Ingredientes</div>${para(p.ingredients_text_es || p.ingredients_text_en || p.ingredients_text)}` : '')
                + (allergens.length ? row('Alérgenos', allergens.join(', ')) : '')
                + `<p class="lb-src">Fuente: Open ${off.db} Facts</p>`;
        }
        try {
            const r = await fetch(`api.php?lookup=${code}`);
            const j = r.ok ? await r.json() : {};
            if (j.found) return row('Producto', j.name) + row('Marca', j.brand) + row('Tamaño', j.size) + para(j.description) + '<p class="lb-src">Fuente: UPCitemdb</p>';
        } catch (e) { }
        return '<p class="lb-empty">Sin información adicional de este producto.</p>';
    },
    foodCache: {},
    foodDetails: async (code) => {
        if (code in app.foodCache) return app.foodCache[code];
        const fields = 'brands,quantity,nutriscore_grade,nova_group,nutriments,nutrition_data_per,ingredients_text_es,ingredients_text_en,ingredients_text,allergens_tags';
        for (const [host, db] of [['world.openfoodfacts.org', 'Food'], ['world.openbeautyfacts.org', 'Beauty'], ['world.openproductsfacts.org', 'Products']]) {
            try {
                const r = await fetch(`https://${host}/api/v2/product/${code}.json?fields=${fields}`);
                if (!r.ok) continue;
                const j = await r.json();
                if (j.status === 1 && j.product) return (app.foodCache[code] = { product: j.product, db });
            } catch (e) { }
        }
        return (app.foodCache[code] = null);
    },
    // --- VISOR DE LA IMAGEN (desde la vista previa) ---
    // Solo la imagen a pantalla completa. Pellizcar / rueda para acercar (hasta
    // 4×), arrastrar para recorrerla, doble toque para acercar donde se toca.
    // Se cierra con ✕, Escape, un toque sin zoom o deslizando hacia abajo.
    openCoverViewer: () => {
        const src = document.getElementById('lightbox-img');
        const box = document.getElementById('cover-viewer'), img = document.getElementById('cover-viewer-img');
        if (src.hidden || !src.currentSrc || !box.hidden) return;
        img.src = src.currentSrc;
        img.alt = src.alt;
        box.hidden = false;
        box.style.background = '';
        app.cv = { s: 1, x: 0, y: 0, pts: new Map(), lastTap: 0, drag: 0 };
        app.cvApply();
        box.querySelector('.cv-close').focus({ preventScroll: true });
        if (!app.cvInit) app.initCoverViewer();
    },
    closeCoverViewer: () => {
        const box = document.getElementById('cover-viewer');
        if (box.hidden) return;
        box.hidden = true;
        document.getElementById('cover-viewer-img').removeAttribute('src');
        document.querySelector('#lightbox .lightbox-close').focus({ preventScroll: true });
    },
    cvApply: (anim) => {
        const img = document.getElementById('cover-viewer-img'), v = app.cv;
        img.style.transition = anim ? 'transform 0.22s ease' : 'none';
        img.style.transform = `translate(${v.x}px, ${v.y + v.drag}px) scale(${v.s})`;
        const box = document.getElementById('cover-viewer');
        box.style.background = v.drag > 0 ? `rgba(0, 0, 0, ${Math.max(0.3, 0.96 - v.drag / 400)})` : '';
        document.getElementById('cover-viewer-hint').classList.toggle('gone', v.s > 1 || v.drag > 0);
    },
    // Mantiene la imagen dentro de la pantalla según el zoom.
    cvClamp: () => {
        const v = app.cv, img = document.getElementById('cover-viewer-img');
        if (v.s <= 1) { v.s = 1; v.x = 0; v.y = 0; return; }
        const mx = Math.max(0, (img.offsetWidth * v.s - innerWidth) / 2), my = Math.max(0, (img.offsetHeight * v.s - innerHeight) / 2);
        v.x = Math.min(mx, Math.max(-mx, v.x)); v.y = Math.min(my, Math.max(-my, v.y));
    },
    // Zoom a escala s manteniendo quieto el punto (px, py) de la pantalla.
    cvZoomAt: (s, px, py) => {
        const v = app.cv;
        s = Math.min(4, Math.max(1, s));
        const cx = px - innerWidth / 2, cy = py - innerHeight / 2;
        v.x = cx - (cx - v.x) * (s / v.s); v.y = cy - (cy - v.y) * (s / v.s);
        v.s = s;
        app.cvClamp();
    },
    initCoverViewer: () => {
        app.cvInit = true;
        const box = document.getElementById('cover-viewer');
        const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
        box.addEventListener('pointerdown', (e) => {
            if (e.target.closest('.cv-close')) return;
            const v = app.cv;
            box.setPointerCapture(e.pointerId);
            v.pts.set(e.pointerId, { x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY });
            if (v.pts.size === 2) {
                const [a, b] = [...v.pts.values()];
                v.pinch = { d: dist(a, b), s: v.s }; v.drag = 0;
            }
            v.moved = false;
        });
        box.addEventListener('pointermove', (e) => {
            const v = app.cv, p = v.pts.get(e.pointerId);
            if (!p) return;
            const dx = e.clientX - p.x, dy = e.clientY - p.y;
            p.x = e.clientX; p.y = e.clientY;
            if (Math.hypot(p.x - p.x0, p.y - p.y0) > 8) v.moved = true;
            if (v.pts.size === 2 && v.pinch) {
                const [a, b] = [...v.pts.values()];
                app.cvZoomAt(v.pinch.s * dist(a, b) / v.pinch.d, (a.x + b.x) / 2, (a.y + b.y) / 2);
            } else if (v.pts.size === 1) {
                if (v.s > 1) { v.x += dx; v.y += dy; app.cvClamp(); }
                else if (v.moved) v.drag = Math.max(0, v.drag + dy); // deslizar hacia abajo para cerrar
            }
            app.cvApply();
        });
        const up = (e) => {
            const v = app.cv;
            if (!v.pts.has(e.pointerId)) return;
            v.pts.delete(e.pointerId);
            if (v.pts.size < 2) v.pinch = null;
            if (v.pts.size) return;
            if (v.drag > 0) {
                if (v.drag > 110) { app.closeCoverViewer(); return; }
                v.drag = 0; app.cvApply(true); return;
            }
            if (v.moved || e.type === 'pointercancel') return;
            // Toque: doble toque = zoom; un toque sin zoom (fuera de la imagen) cierra.
            const now = Date.now();
            if (now - v.lastTap < 300) {
                v.lastTap = 0; clearTimeout(v.tapTimer);
                if (v.s > 1) { v.s = 1; app.cvClamp(); } else app.cvZoomAt(2.5, e.clientX, e.clientY);
                app.cvApply(true);
            } else {
                v.lastTap = now;
                const r = document.getElementById('cover-viewer-img').getBoundingClientRect();
                const onImg = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
                clearTimeout(v.tapTimer);
                if (!onImg && v.s === 1) v.tapTimer = setTimeout(() => { if (v.lastTap === now) app.closeCoverViewer(); }, 300);
            }
        };
        box.addEventListener('pointerup', up);
        box.addEventListener('pointercancel', up);
        box.addEventListener('wheel', (e) => {
            e.preventDefault();
            app.cvZoomAt(app.cv.s * (e.deltaY < 0 ? 1.2 : 1 / 1.2), e.clientX, e.clientY);
            app.cvApply();
        }, { passive: false });
        window.addEventListener('resize', () => { if (!box.hidden) { app.cvClamp(); app.cvApply(); } });
    },

    // Botón ✎ de la vista previa: cierra y abre Editar.
    editFromLightbox: () => {
        const name = app.lightboxName;
        app.closeLightbox();
        if (name) app.openEditSheet(name);
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
        app.change(items => items.map(i => i.name === name ? app.withStatus(i, status) : i)),

    // ACCIÓN: en la Lista (Necesito <-> En Carrito)
    toggleShoppingStatus: (name) => {
        const item = app.data.items.find(i => i.name === name);
        // En la canasta: marcar / desmarcar "en el carrito" (sigue en la canasta).
        if (item) app.change(items => items.map(i => i.name !== name ? i
            : (i.status === 'in_cart' ? { ...i, status: 'needed', basket: true } : { ...i, status: 'in_cart' })));
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
        const list = app.segValue('new-list'), ltype = (app.listById(list) || {}).type;
        if (list !== 'regular') newItem.list = list;
        if (list === 'books') newItem.category = 'Libros';
        if (ltype === 'collection') {
            const authors = document.getElementById('new-author').value.split(',').map(a => a.trim()).filter(Boolean);
            const book = { ...(app.addBook || {}) };
            if (authors.length) book.authors = authors; else delete book.authors;
            if (Object.keys(book).length) newItem.book = book;
        }
        const barcodes = app.addBarcodes.filter(b => b.code).map(({ code, label }) => ({ code, label }));
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
        app.addBook = null;
        document.getElementById('new-author').value = '';
        const dest = app.listById(list) || { name: 'Hogar', type: 'restock' };
        app.showToast(dest.type === 'collection' ? `Agregado a ${dest.name}` : `Agregado a Falta (${dest.name})`);
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
        app.renderListPicker('edit', item.list || 'regular');
        document.getElementById('edit-author').value = ((item.book || {}).authors || []).join(', ');
        app.updateListFields('edit');
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
        const list = app.segValue('edit-list'), ltype = (app.listById(list) || {}).type;
        const level = ltype === 'restock' && document.getElementById('edit-level-on').checked ? +document.getElementById('edit-level').value : null;
        const authors = document.getElementById('edit-author').value.split(',').map(a => a.trim()).filter(Boolean);
        const edited = (item) => {
            const out = app.moveToList({ ...item, ...fields }, list);
            if (icon) out.icon = icon; else delete out.icon;
            if (level !== null) out.level = level; else delete out.level;
            if (ltype === 'collection') {
                const book = { ...(item.book || {}) };
                if (authors.length) book.authors = authors; else delete book.authors;
                if (Object.keys(book).length) out.book = book; else delete out.book;
            } else {
                delete out.book;
            }
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
        // Libros: Open Library (no gasta consultas de UPCitemdb).
        if (app.isISBN(code)) {
            const b = await app.lookupBook(code);
            if (!b) return null;
            return (app.productCache[code] = {
                name: b.title, brand: '', quantity: '',
                label: [b.title, (b.authors || []).join(', ')].filter(Boolean).join(' · '),
                image: (await app.imageExists(b.cover)) ? b.cover : '',
                category: null,
            });
        }
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
                    <div class="bc-code">${app.esc(b.code)}${app.isISBN(b.code) ? app.isbnActionsHTML(b.code) : ''}</div>
                </div>
                <button type="button" class="bc-remove" data-i="${i}" aria-label="Quitar ${app.esc(b.label || b.code)}">${app.svgIcon('x')}</button>
            </div>`).join('');
    },

    // Libro: título, autor y portada de Open Library; lista "Libro".
    scanBookForAdd: async (isbn) => {
        const owner = app.data.items.find(i => (i.barcodes || []).some(b => b.code === isbn));
        if (owner) { app.showToast(`Ese libro ya está como "${owner.name}"`); return; }
        const entry = { code: isbn, label: '', loading: true };
        app.addBarcodes.push(entry);
        app.renderBarcodes('add');
        const booksList = app.listById('books') || app.data.lists.find(l => l.type === 'collection');
        if (booksList) app.setSeg('new-list', booksList.id);
        app.updateListFields('new');
        const b = await app.lookupBook(isbn);
        entry.loading = false;
        if (b) {
            entry.label = [b.title, (b.authors || []).join(', ')].filter(Boolean).join(' · ');
            const nameEl = document.getElementById('new-name');
            if (!nameEl.value.trim() && b.title) nameEl.value = b.title;
            if (b.authors && b.authors.length) document.getElementById('new-author').value = b.authors.join(', ');
            app.addBook = { year: b.year || undefined, pages: b.pages || undefined, publisher: b.publisher || undefined };
            Object.keys(app.addBook).forEach(k => app.addBook[k] === undefined && delete app.addBook[k]);
            if (!app.iconPickers.new.get()) {
                if (b.cover && await app.imageExists(b.cover)) app.iconPickers.new.fromURL(b.cover);
                else if (b.coverAlt) app.iconPickers.new.fromURL(b.coverAlt);
            }
        } else {
            app.showToast('Libro no encontrado: escribe el título');
        }
        app.renderBarcodes('add');
    },

    // --- BUSCAR UN LIBRO POR TÍTULO / AUTOR ---
    // Fuentes: Google Books (principal, vía el servidor, que guarda la clave) y
    // Open Library (secundaria, directo). Se combinan sin repetir y con las que
    // tienen portada primero. Sin Google (sin clave o sin cuota) queda Open Library.
    // from: 'add' (desde la hoja Agregar, se vuelve a ella) o el id de la lista
    // de colección donde se agregará.
    openBookSearch: (from) => {
        app.bookSearch = { from, q: '', page: 1, docs: [], seen: new Set(), more: false, seq: 0 };
        document.getElementById('book-search-input').value = '';
        document.getElementById('book-results').innerHTML = '<p class="bs-hint">Escribe el título o el autor (o ambos).</p>';
        app.fitToViewport(document.getElementById('book-search-sheet'));
        app.openSheet('book-search-sheet', { focusField: true });
    },
    // Hoja a pantalla completa que se ajusta al área visible: con el teclado
    // del teléfono abierto, el buscador y los resultados quedan encima de él.
    fitToViewport: (sheet) => {
        const vv = window.visualViewport;
        const fit = () => {
            if (!sheet.classList.contains('open') && app.fitSheet === sheet && sheet.dataset.fitted) { unfit(); return; }
            sheet.style.setProperty('--vv-top', (vv ? vv.offsetTop : 0) + 'px');
            sheet.style.setProperty('--vv-h', (vv ? vv.height : innerHeight) + 'px');
            sheet.dataset.fitted = '1';
        };
        const unfit = () => {
            if (vv) { vv.removeEventListener('resize', fit); vv.removeEventListener('scroll', fit); }
            window.removeEventListener('resize', fit);
            delete sheet.dataset.fitted;
            app.fitSheet = null;
        };
        if (app.fitSheet === sheet) { fit(); return; }
        app.fitSheet = sheet;
        fit();
        if (vv) { vv.addEventListener('resize', fit); vv.addEventListener('scroll', fit); }
        window.addEventListener('resize', fit);
    },
    closeBookSearch: () => {
        clearTimeout(app.bookSearchTimer);
        if (app.bookSearch) app.bookSearch.seq++;
        if (app.bookSearch && app.bookSearch.from === 'add') app.openSheet('add-sheet', { focusField: false });
        else app.closeSheets();
    },
    onBookSearchInput: () => {
        clearTimeout(app.bookSearchTimer);
        const q = document.getElementById('book-search-input').value.trim();
        if (q.length < 3) {
            app.bookSearch.seq++;
            document.getElementById('book-results').innerHTML = '<p class="bs-hint">Escribe el título o el autor (o ambos).</p>';
            return;
        }
        app.bookSearchTimer = setTimeout(() => app.runBookSearch(q, 1), 450);
    },
    // Google Books a través del servidor: { available, results, total }.
    googleBooks: async (q, page = 1) => {
        try {
            const r = await fetch(`api.php?books=${encodeURIComponent(q)}&page=${page}`);
            if (r.ok) return await r.json();
        } catch (e) { }
        return { available: false, results: [], total: 0 };
    },
    fromGoogle: (g) => ({
        src: 'g', key: 'g:' + g.id, title: g.title, authors: g.authors || [], year: g.year || '',
        pages: g.pages || null, publisher: g.publisher || '', isbns: g.isbn ? [g.isbn] : [],
        thumb: g.cover ? `api.php?bookCover=${encodeURIComponent(g.id)}` : '',
        large: g.cover ? `api.php?bookCover=${encodeURIComponent(g.id)}&size=l` : '',
    }),
    fromOpenLibrary: (d) => ({
        src: 'ol', key: 'ol:' + d.key, title: d.title, authors: (d.author_name || []).slice(0, 3),
        year: d.first_publish_year ? String(d.first_publish_year) : '', pages: d.number_of_pages_median || null,
        publisher: '', isbns: d.isbn || [], editionKey: d.cover_edition_key || '',
        thumb: d.cover_i ? `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg` : '',
        large: d.cover_i ? `https://covers.openlibrary.org/b/id/${d.cover_i}-L.jpg` : '',
    }),
    // Clave para no repetir el mismo libro (título + apellido del primer autor).
    bookKey: (b) => {
        const norm = (t) => (t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
        return norm(b.title.split(/[:(]/)[0]) + '|' + norm((b.authors[0] || '').split(/\s+/).pop());
    },
    runBookSearch: async (q, page) => {
        const bs = app.bookSearch, seq = ++bs.seq, box = document.getElementById('book-results');
        if (page === 1) box.innerHTML = '<p class="bs-hint">Buscando…</p>';
        else { const m = box.querySelector('.bs-more'); if (m) { m.disabled = true; m.textContent = 'Cargando…'; } }
        // ¿Es un ISBN? (13 o 10 dígitos, con o sin guiones) → se busca como ISBN.
        const isbn = app.queryISBN(q);
        bs.isbn = isbn || '';
        if (isbn === false) { box.innerHTML = '<p class="bs-hint">Ese ISBN no es válido: revisa los dígitos.</p>'; return; }
        if (isbn) page = 1;
        const fields = 'key,title,author_name,first_publish_year,cover_i,cover_edition_key,isbn,number_of_pages_median';
        const olQ = isbn ? `isbn=${isbn}` : `q=${encodeURIComponent(q)}`;
        const olP = fetch(`https://openlibrary.org/search.json?${olQ}&fields=${fields}&limit=10&page=${page}`)
            .then(r => r.ok ? r.json() : null).catch(() => null);
        const [g, ol] = await Promise.all([app.googleBooks(isbn ? 'isbn:' + isbn : q, page), olP]);
        if (seq !== bs.seq) return; // llegó una búsqueda más nueva (o se cerró)
        if (!g.available && !ol) { box.innerHTML = '<p class="bs-hint">No se pudo buscar. Revisa la conexión e intenta otra vez.</p>'; return; }
        if (page === 1) { bs.docs = []; bs.seen = new Set(); }
        const isbnSeen = new Set(bs.docs.flatMap(d => d.isbns));
        const fresh = [];
        const add = (b) => {
            const k = app.bookKey(b);
            if (bs.seen.has(k) || b.isbns.some(c => isbnSeen.has(c))) {
                // Repetido: si el guardado no tiene portada y este sí, se queda con esta.
                const old = fresh.find(x => app.bookKey(x) === k);
                if (old && !old.thumb && b.thumb) fresh[fresh.indexOf(old)] = b;
                return;
            }
            bs.seen.add(k); b.isbns.forEach(c => isbnSeen.add(c)); fresh.push(b);
        };
        // Intercaladas (Google, Open Library, Google…) para que ninguna fuente tape a la otra.
        const gs = (g.results || []).map(app.fromGoogle);
        const os = ((ol && ol.docs) || []).filter(d => d.title).map(app.fromOpenLibrary);
        for (let i = 0; i < Math.max(gs.length, os.length); i++) { if (gs[i]) add(gs[i]); if (os[i]) add(os[i]); }
        app.rankBooks(q, fresh);
        bs.q = q; bs.page = page;
        bs.docs = bs.docs.concat(fresh);
        bs.more = !isbn && page < 5 && (page * 10 < (g.total || 0) || page * 10 < ((ol && ol.numFound) || 0));
        app.renderBookResults();
    },
    // Ordena por relevancia: cuánto del texto buscado está en el título (y en el
    // autor), título exacto, con portada, y abajo cuadernos / libros para colorear
    // / resúmenes (salvo que se busquen). Empates: el orden intercalado original.
    rankBooks: (q, list) => {
        const norm = (t) => (t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
        const compact = (t) => norm(t).replace(/ /g, '');
        const words = norm(q).split(' ').filter(w => w.length > 1);
        const junk = /\b(coloring|colouring|journal|notebook|summary|resumen|study guide|sparknotes|cuaderno|colorear|workbook|trivia|quiz)\b/;
        const junkOk = junk.test(norm(q));
        const hits = (text, w) => {
            const n = norm(text);
            return (' ' + n + ' ').includes(' ' + w + ' ') || (w.length >= 4 && compact(text).includes(w));
        };
        const score = (b) => {
            if (!words.length) return 0;
            const inTitle = words.filter(w => hits(b.title, w)).length;
            const inAuthor = words.filter(w => !hits(b.title, w) && hits(b.authors.join(' '), w)).length;
            let s = 3 * inTitle / words.length + 1.5 * inAuthor / words.length;
            const ct = compact(b.title), cq = compact(q);
            if (ct === cq) s += 2; else if (ct.startsWith(cq) || cq.startsWith(ct)) s += 1;
            if (b.thumb) s += 1.5;
            if (!junkOk && junk.test(norm(b.title))) s -= 2.5;
            return s;
        };
        list.forEach((b, i) => { b._s = score(b) - i * 0.01; });
        list.sort((a, b) => b._s - a._s);
    },
    // ISBN escrito en la búsqueda: su ISBN-13, false si parece un ISBN pero sus
    // dígitos no cuadran, o null si no es un ISBN.
    queryISBN: (q) => {
        const c = q.replace(/[\s-]/g, '').toUpperCase();
        if (/^97[89]\d{10}$/.test(c)) return app.gtinValid(c) ? c : false;
        if (/^\d{9}[\dX]$/.test(c)) {
            const sum = [...c].reduce((s, ch, i) => s + (ch === 'X' ? 10 : +ch) * (10 - i), 0);
            return sum % 11 === 0 ? app.toISBN13([c]) : false;
        }
        return /^\d{10,13}$/.test(c) ? false : null;
    },
    // Botón "Agregar con este ISBN": Agregar con el código asociado y la lista de libros.
    addManualISBN: (isbn) => {
        const bs = app.bookSearch;
        if (!isbn) return;
        bs.seq++;
        if (bs.from === 'add') app.openSheet('add-sheet', { focusField: false });
        else app.openAddSheet(bs.from);
        const list = app.listById(app.segValue('new-list'));
        if (!list || list.type !== 'collection') {
            const books = app.listById('books') || app.data.lists.find(l => l.type === 'collection');
            if (books) app.setSeg('new-list', books.id);
        }
        app.updateListFields('new');
        app.addBarcodes = app.addBarcodes.filter(b => !app.isISBN(b.code));
        app.addBarcodes.push({ code: isbn, label: '' });
        app.renderBarcodes('add');
        app.showToast('ISBN asociado: escribe el título y el autor');
    },
    // ISBN-13 de una lista de códigos (uno de 10 dígitos se convierte).
    toISBN13: (all) => {
        // Solo ISBN con dígito de control correcto (uno malo impediría guardar).
        const x = (all || []).find(c => app.isISBN(c) && app.gtinValid(c));
        if (x) return x;
        const ten = (all || []).find(c => /^\d{9}[\dX]$/.test(c));
        if (!ten) return '';
        const b = '978' + ten.slice(0, 9);
        const sum = [...b].reduce((s, ch, i) => s + (+ch) * (i % 2 ? 3 : 1), 0);
        return b + ((10 - sum % 10) % 10);
    },
    // ¿Ya está este libro? (algún ISBN suyo, o el mismo título en una colección)
    bookOwner: (b) => {
        const isbns = new Set(b.isbns);
        const title = b.title.toLowerCase();
        return app.data.items.find(i => (i.barcodes || []).some(c => isbns.has(c.code))
            || (i.name.toLowerCase() === title && app.isBook(i)));
    },
    renderBookResults: () => {
        const bs = app.bookSearch, box = document.getElementById('book-results');
        if (!bs.docs.length && bs.isbn) {
            // ISBN que no está en ninguna base: se agrega a mano con el código ya asociado.
            const owner = app.data.items.find(i => (i.barcodes || []).some(b => b.code === bs.isbn));
            box.innerHTML = owner
                ? `<p class="bs-hint">Ese ISBN ya está en tus listas como "${app.esc(owner.name)}".</p>`
                : `<div class="bs-manual-box">
                    <p class="bs-hint">No encontramos el ISBN <strong>${bs.isbn}</strong> en Google Books ni en Open Library.</p>
                    <button type="button" class="btn-primary bs-manual">${app.svgIcon('plus')}Agregar con este ISBN</button>
                    <p class="bs-sub">Se abre Agregar con el código ya asociado: solo pon el título, el autor y la portada.</p>
                </div>`;
            return;
        }
        if (!bs.docs.length) { box.innerHTML = '<p class="bs-hint">Sin resultados. Prueba con otras palabras.</p>'; return; }
        box.innerHTML = bs.docs.map((d, i) => {
            const owner = app.bookOwner(d);
            const cover = d.thumb ? `<img src="${app.esc(d.thumb)}" alt="" loading="lazy" decoding="async">` : app.catIcon('Libros');
            const meta = [d.authors.slice(0, 2).join(', '), d.year].filter(Boolean).join(' · ');
            return `<button type="button" class="bs-row${owner ? ' owned' : ''}" data-i="${i}">
                <span class="bs-cover">${cover}</span>
                <span class="bs-text"><strong>${app.esc(d.title)}</strong><span>${app.esc(meta)}</span>${owner ? `<em>Ya está en ${app.esc((app.listOf(owner) || {}).name || 'tus listas')}</em>` : ''}</span>
            </button>`;
        }).join('') + (bs.more ? '<button type="button" class="btn-secondary bs-more">Ver más</button>' : '');
        // Portada que no carga → icono de libro.
        box.querySelectorAll('.bs-cover img').forEach(img => img.addEventListener('error', () => { img.parentElement.innerHTML = app.catIcon('Libros'); }, { once: true }));
    },
    onBookResultsClick: (e) => {
        const bs = app.bookSearch;
        if (e.target.closest('.bs-more')) { app.runBookSearch(bs.q, bs.page + 1); return; }
        if (e.target.closest('.bs-manual')) { app.addManualISBN(bs.isbn); return; }
        const row = e.target.closest('.bs-row');
        if (!row) return;
        const d = bs.docs[+row.dataset.i];
        const owner = d && app.bookOwner(d);
        if (owner) { app.showToast(`Ese libro ya está como "${owner.name}"`); return; }
        if (d) app.pickBook(d);
    },
    // Rellena la hoja Agregar con el libro elegido (se revisa antes de guardar).
    // En Open Library, ISBN / editorial / páginas salen de la edición de la portada.
    pickBook: async (d) => {
        const bs = app.bookSearch;
        bs.seq++;
        if (bs.from === 'add') app.openSheet('add-sheet', { focusField: false });
        else app.openAddSheet(bs.from);
        const list = app.listById(app.segValue('new-list'));
        if (!list || list.type !== 'collection') {
            const books = app.listById('books') || app.data.lists.find(l => l.type === 'collection');
            if (books) app.setSeg('new-list', books.id);
        }
        app.updateListFields('new');
        document.getElementById('new-name').value = d.title;
        document.getElementById('new-author').value = d.authors.join(', ');
        app.iconPickers.new.set(null);
        if (d.large) app.iconPickers.new.fromURL(d.large);
        const label = [d.title, d.authors.join(', ')].filter(Boolean).join(' · ');
        app.addBarcodes = app.addBarcodes.filter(b => !app.isISBN(b.code));
        app.addBook = { year: d.year || undefined, pages: d.pages || undefined, publisher: d.publisher || undefined };
        const pick = app.pickSeq = (app.pickSeq || 0) + 1;
        let isbn = app.toISBN13(d.isbns);
        if (d.src === 'ol' && d.editionKey) {
            const entry = { code: '', label, loading: true };
            app.addBarcodes.push(entry);
            app.renderBarcodes('add');
            let ed = null;
            try {
                const r = await fetch(`https://openlibrary.org/books/${encodeURIComponent(d.editionKey)}.json`);
                if (r.ok) ed = await r.json();
            } catch (e) { }
            if (pick !== app.pickSeq) return; // se eligió otro libro mientras tanto
            app.addBarcodes = app.addBarcodes.filter(b => b !== entry);
            if (ed) {
                isbn = app.toISBN13([...(ed.isbn_13 || []), ...(ed.isbn_10 || [])]) || isbn;
                if (ed.number_of_pages) app.addBook.pages = ed.number_of_pages;
                if ((ed.publishers || [])[0]) app.addBook.publisher = ed.publishers[0];
            }
        }
        Object.keys(app.addBook).forEach(k => app.addBook[k] === undefined && delete app.addBook[k]);
        const owner = isbn && app.data.items.find(i => (i.barcodes || []).some(b => b.code === isbn));
        if (owner) app.showToast(`Ese libro ya está como "${owner.name}"`);
        else if (isbn) app.addBarcodes.push({ code: isbn, label });
        app.renderBarcodes('add');
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

    // Botones junto a un ISBN: copiarlo y buscarlo en Google o Amazon (libros).
    // En Google se busca como "978-1957290584" (sin la palabra ISBN): da resultados más precisos.
    isbnActionsHTML: (code) => {
        const c = app.esc(code);
        return `<span class="isbn-actions">
            <button type="button" class="isbn-act isbn-copy" data-copy="${c}" title="Copiar ISBN" aria-label="Copiar ISBN ${c}">${app.svgIcon('copy')}</button>
            <a class="isbn-act isbn-google" href="https://www.google.com/search?q=${encodeURIComponent(code.length === 13 ? code.slice(0, 3) + '-' + code.slice(3) : code)}" target="_blank" rel="noopener noreferrer" title="Buscar en Google" aria-label="Buscar ISBN ${c} en Google"><span class="g-mark">G</span></a>
            <a class="isbn-act isbn-amazon" href="https://www.amazon.com/s?k=${encodeURIComponent(code)}&i=stripbooks" target="_blank" rel="noopener noreferrer" title="Buscar en Amazon" aria-label="Buscar ISBN ${c} en Amazon">a</a>
        </span>`;
    },
    copyText: async (text) => {
        let ok = false;
        try { await navigator.clipboard.writeText(text); ok = true; } catch (e) {
            // Respaldo (navegadores sin permiso de portapapeles)
            const t = document.createElement('textarea');
            t.value = text; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
            document.body.appendChild(t); t.select();
            try { ok = document.execCommand('copy'); } catch (e2) { }
            t.remove();
        }
        app.showToast(ok ? 'ISBN copiado' : 'No se pudo copiar');
    },

    // ISBN-13 (978/979): el código de barras de un libro.
    isISBN: (code) => /^97[89]\d{10}$/.test(code),

    // Datos de un libro en Open Library (sin clave, permite CORS).
    lookupBook: async (isbn) => {
        if (isbn in app.bookCache) return app.bookCache[isbn];
        const ol = await app.lookupBookOL(isbn);
        if (ol && ol.description && await app.imageExists(ol.cover)) return (app.bookCache[isbn] = ol);
        // Falta sinopsis o portada (o no está): se completa con Google Books.
        const g = ((await app.googleBooks('isbn:' + isbn)).results || [])[0];
        if (!g) return (app.bookCache[isbn] = ol);
        const gb = app.fromGoogle(g);
        const base = ol || { title: [g.title, g.subtitle].filter(Boolean).join(': '), authors: g.authors || [], year: g.year || '', pages: g.pages, publisher: g.publisher || '', description: '', subjects: [], cover: '' };
        return (app.bookCache[isbn] = {
            ...base,
            description: base.description || g.description || '',
            coverAlt: gb.large,
            source: ol ? (base.description ? 'Open Library' : 'Open Library · Google Books') : 'Google Books',
        });
    },
    lookupBookOL: async (isbn) => {
        const get = async (url) => { const r = await fetch(url); if (!r.ok) throw new Error(r.status); return r.json(); };
        try {
            const ed = await get(`https://openlibrary.org/isbn/${isbn}.json`);
            const authors = [];
            for (const a of (ed.authors || []).slice(0, 3)) { try { authors.push((await get(`https://openlibrary.org${a.key}.json`)).name); } catch (e) { } }
            let work = {};
            if (ed.works && ed.works[0]) { try { work = await get(`https://openlibrary.org${ed.works[0].key}.json`); } catch (e) { } }
            const desc = typeof work.description === 'string' ? work.description : (work.description || {}).value || '';
            const year = (String(ed.publish_date || '').match(/\d{4}/) || [])[0] || '';
            return {
                title: [ed.title, ed.subtitle].filter(Boolean).join(': '),
                authors: authors.filter(Boolean), year,
                pages: ed.number_of_pages || null,
                publisher: (ed.publishers || [])[0] || '',
                description: desc.replace(/\s+/g, ' ').trim().slice(0, 1200),
                subjects: (work.subjects || []).slice(0, 6),
                cover: `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`,
                source: 'Open Library',
            };
        } catch (e) {
            return null;
        }
    },
    bookCache: {},
    // ¿Existe la portada? (Open Library responde 404 si no la tiene)
    imageExists: (url) => new Promise(res => { const i = new Image(); i.crossOrigin = 'anonymous'; i.onload = () => res(true); i.onerror = () => res(false); i.src = url; }),

    // Agregar un artículo → escanear el producto: rellena nombre y categoría.
    scanForAdd: async () => {
        const code = await app.openScanner(document.querySelector('#add-sheet .btn-scan'));
        if (!code) return;
        if (app.isISBN(code)) return app.scanBookForAdd(code);
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
    // v=3: cambiar la versión obliga al navegador a pedirlas de nuevo pese a su
    // caché "immutable" (v2: miniaturas que llenan el cuadro; v3: portadas de
    // libros en alta resolución, con el mismo id).
    iconURL: (id) => `api.php?icon=${encodeURIComponent(id)}&v=3`,

    // Miniatura de un artículo: su imagen o, si no tiene, el icono de su categoría.
    thumbHTML: (item) => item.icon
        ? `<span class="item-thumb has-img"><img src="${app.iconURL(item.icon)}" alt="" loading="lazy" decoding="async"></span>`
        : `<span class="item-thumb" aria-hidden="true">${app.catIcon(item.category)}</span>`,

    // src: archivo elegido (File) o URL de una foto de producto (Open Food Facts
    // con CORS, o api.php?productImage= del propio servidor). Devuelve
    // { thumb: PNG 128×128 transparente, large: JPEG de hasta 640px }.
    ICON_LARGE: 1600,
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
                // Versión grande (vista previa y visor): la imagen completa, hasta 1600px.
                const L = Math.min(1, app.ICON_LARGE / Math.max(iw, ih));
                const l = document.createElement('canvas');
                l.width = Math.max(1, Math.round(iw * L)); l.height = Math.max(1, Math.round(ih * L));
                const lc = l.getContext('2d');
                lc.fillStyle = '#fff'; // JPEG sin transparencia
                lc.fillRect(0, 0, l.width, l.height);
                lc.imageSmoothingQuality = 'high';
                lc.drawImage(img, 0, 0, l.width, l.height);
                // Fotos muy detalladas: se baja la calidad hasta caber en el límite del servidor (1.5 MB).
                let large = '';
                for (const q of [0.9, 0.82, 0.72, 0.6]) { large = l.toDataURL('image/jpeg', q); if (large.length * 0.75 < 1.3e6) break; }
                resolve({ thumb: t.toDataURL('image/png'), large });
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
        // Abrir una hoja desde otra (p. ej. "Editar lista" desde su menú) cierra la anterior.
        const prev = document.querySelector('.sheet.open');
        if (prev && prev !== sheet) prev.classList.remove('open');
        else app.sheetOpener = document.activeElement;
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
    // listId: lista preseleccionada (desde el detalle de una lista o el filtro de Falta).
    openAddSheet: (listId) => {
        app.iconPickers.new.set(null);
        const pre = typeof listId === 'string' ? listId
            : app.currentTab === 'lists' && app.openListId ? app.openListId
            : app.currentTab === 'shopping' && app.faltaFilter !== 'all' ? app.faltaFilter : 'regular';
        app.renderListPicker('new', pre);
        document.getElementById('new-cat').value = 'Otros'; // la elige el usuario (el escaneo la propone)
        app.addBook = null;
        document.getElementById('new-author').value = '';
        app.updateListFields('new');
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
        if (!document.getElementById('cover-viewer').hidden) {
            if (e.key === 'Escape' || e.key === 'Tab') { e.preventDefault(); if (e.key === 'Escape') app.closeCoverViewer(); }
            return;
        }
        if (!document.getElementById('lightbox').hidden) {
            if (e.key === 'Escape') { e.preventDefault(); app.closeLightbox(); }
            else if (e.key === 'Tab') app.trapTab(document.getElementById('lightbox'), e);
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
        const f = [...open.querySelectorAll('button, input:not([type=hidden]), select, textarea, [tabindex="0"]')].filter(el => !el.disabled && el.getClientRects().length > 0);
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
        ['shopping', 'basket', 'inventory', 'lists'].forEach(v =>
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
