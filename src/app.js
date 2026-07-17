const app = {
    data: { version: 0, items: [] },

    init: async () => {
        await app.fetchData();
        setInterval(app.fetchData, 10000); 
    },

    fetchData: async () => {
        try {
            const res = await fetch('api.php?t=' + Date.now());
            const json = await res.json();
            if (JSON.stringify(app.data.items) !== JSON.stringify(json.items)) {
                app.data = json;
                app.render();
            }
        } catch (e) { console.error("Error conexión:", e); }
    },

    saveData: async (newItems) => {
        const oldItems = app.data.items;
        app.data.items = newItems;
        app.render(); // Render optimista
        
        try {
            const res = await fetch('api.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ version: app.data.version, items: newItems })
            });
            if (res.status === 409) {
                alert('⚠️ Alguien más modificó la lista. Recargando.');
                await app.fetchData();
            } else if (res.status === 401) location.reload();
            else {
                const json = await res.json();
                app.data.version = json.newVersion;
                // No mostramos toast constante para no saturar
            }
        } catch (e) {
            alert('Error al guardar.');
            app.data.items = oldItems;
            app.render();
        }
    },

    render: () => { 
        app.renderShopping(); 
        app.renderInventory();
        app.updateTotal();
    },
    
    // --- LÓGICA DE TOTALES Y CHECKOUT ---
    updateTotal: () => {
        // Total de la lista completa (necesario + en carrito)
        const activeItems = app.data.items.filter(i => i.status === 'needed' || i.status === 'in_cart');
        const totalList = activeItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
        
        // Total solo de lo que ya está en el carrito
        const cartItems = app.data.items.filter(i => i.status === 'in_cart');
        const totalCart = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);

        // Actualizar UI
        document.getElementById('total-amount').innerText = '$' + totalList.toFixed(2);
        
        const cartSubtotal = document.getElementById('cart-subtotal');
        if (totalCart > 0) {
            cartSubtotal.innerText = `En carrito: $${totalCart.toFixed(2)}`;
            cartSubtotal.style.display = 'block';
        } else {
            cartSubtotal.style.display = 'none';
        }

        // Mostrar botón Checkout si hay algo en el carrito
        const btnCheckout = document.getElementById('btn-checkout');
        if (cartItems.length > 0) {
            btnCheckout.style.display = 'block';
            btnCheckout.innerText = `Finalizar (${cartItems.length})`;
        } else {
            btnCheckout.style.display = 'none';
        }
        
        // Ocultar barra en la pestaña de inventario
        const totalBar = document.getElementById('total-bar');
        if (document.getElementById('view-shopping').classList.contains('hidden')) {
            totalBar.style.display = 'none';
        } else {
            totalBar.style.display = 'flex';
        }
    },

    checkout: () => {
        if (!confirm("¿Ya pagaste? Los artículos del carrito se moverán al inventario.")) return;
        
        const newItems = app.data.items.map(i => {
            if (i.status === 'in_cart') {
                return { ...i, status: 'stocked' };
            }
            return i;
        });
        app.saveData(newItems);
        app.showToast("¡Compra finalizada!");
    },

    // --- RENDERIZADO DE LISTA DE COMPRA ---
    renderShopping: () => {
        const container = document.getElementById('shopping-list-render');
        // Filtramos items que se necesitan O que están en el carrito
        const activeItems = app.data.items.filter(i => i.status === 'needed' || i.status === 'in_cart');
        
        if (activeItems.length === 0) { container.innerHTML = '<div class="empty-state">🎉 Todo comprado</div>'; return; }
        
        const groups = activeItems.reduce((acc, item) => {
            (acc[item.category] = acc[item.category] || []).push(item); return acc;
        }, {});
        
        let html = '';
        for (const [cat, items] of Object.entries(groups)) {
            html += `<div class="category-group"><div class="cat-header">${cat}</div>`;
            
            // Ordenar: Los que están en el carrito van al final de su categoría visualmente
            items.sort((a, b) => {
                if (a.status === b.status) return 0;
                return a.status === 'in_cart' ? 1 : -1;
            });

            items.forEach(item => {
                const isInCart = item.status === 'in_cart';
                const priceDisplay = item.price > 0 ? `<span class="item-price">$${parseFloat(item.price).toFixed(2)}</span>` : '';
                
                // NOTA: Usamos 'toggleShoppingStatus' al tocar
                html += `
                <div class="item-row ${isInCart ? 'in-cart' : ''}">
                    <div onclick="app.openEditModal('${item.name}')" style="flex-grow:1; cursor:pointer;">
                        <div class="item-name">${item.name} ${priceDisplay}</div>
                        ${item.note ? `<small class="item-note">${item.note}</small>` : ''}
                    </div>
                    <div class="check-circle ${isInCart ? 'in-cart' : ''}" onclick="app.toggleShoppingStatus('${item.name}')"></div>
                </div>`;
            });
            html += `</div>`;
        }
        container.innerHTML = html;
    },

    // --- RENDERIZADO DE INVENTARIO ---
    renderInventory: () => {
        const container = document.getElementById('inventory-list-render');
        const sorted = [...app.data.items].sort((a,b) => {
            // Needed e in_cart van primero, stocked despues
            const aActive = (a.status === 'needed' || a.status === 'in_cart');
            const bActive = (b.status === 'needed' || b.status === 'in_cart');
            if (aActive === bActive) return a.name.localeCompare(b.name);
            return aActive ? -1 : 1;
        });

        let html = '';
        sorted.forEach(item => {
            // Consideramos 'needed' o 'in_cart' como que NO lo tengo en casa aun
            const isNeeded = (item.status === 'needed' || item.status === 'in_cart');
            const priceDisplay = item.price > 0 ? ` - $${parseFloat(item.price).toFixed(2)}` : '';
            html += `
            <div class="inv-item ${item.status === 'stocked' ? 'stocked' : 'needed'}">
                <div onclick="app.openEditModal('${item.name}')" style="flex-grow:1; cursor:pointer;">
                    <strong>${item.name}</strong><span style="color:#28a745; font-size:0.8rem">${priceDisplay}</span>
                    <div style="font-size:0.8rem; color:#666">${item.category}</div>
                </div>
                <div>
                    <button class="btn-action btn-edit" onclick="app.openEditModal('${item.name}')">✏️</button>
                    <button class="btn-action ${isNeeded ? 'btn-have' : 'btn-add'}" onclick="app.toggleInventoryStatus('${item.name}')">
                        ${isNeeded ? 'Ya tengo' : '+ Pedir'}
                    </button>
                    <button class="btn-action btn-del" onclick="app.deleteItem('${item.name}')">🗑</button>
                </div>
            </div>`;
        });
        container.innerHTML = html;
    },

    // ACCIÓN 1: Click en la Lista de Compra (Cambia entre Necesito <-> En Carrito)
    toggleShoppingStatus: (name) => {
        const newItems = app.data.items.map(i => {
            if (i.name === name) {
                return { ...i, status: (i.status === 'needed' ? 'in_cart' : 'needed') };
            }
            return i;
        });
        app.saveData(newItems);
    },

    // ACCIÓN 2: Click en el Inventario (Cambia entre Stocked <-> Needed)
    toggleInventoryStatus: (name) => {
        const newItems = app.data.items.map(i => {
            if (i.name === name) {
                // Si está stocked pasa a needed. Si es needed/in_cart pasa a stocked.
                const isActive = (i.status === 'needed' || i.status === 'in_cart');
                return { ...i, status: (isActive ? 'stocked' : 'needed') };
            }
            return i;
        });
        app.saveData(newItems);
    },

    addItem: (e) => {
        e.preventDefault();
        const name = document.getElementById('new-name').value.trim();
        if (!name) return;
        if (app.data.items.find(i => i.name.toLowerCase() === name.toLowerCase())) { alert('Ya existe.'); return; }
        
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
        app.saveData([...app.data.items, newItem]);
    },

    deleteItem: (name) => {
        if(!confirm(`¿Eliminar "${name}"?`)) return;
        app.saveData(app.data.items.filter(i => i.name !== name));
    },

    // ... FUNCIONES DE EDICIÓN Y AUXILIARES ...
    openEditModal: (name) => {
        const item = app.data.items.find(i => i.name === name);
        if (!item) return;
        document.getElementById('edit-original-name').value = item.name;
        document.getElementById('edit-name').value = item.name;
        document.getElementById('edit-cat').value = item.category;
        document.getElementById('edit-note').value = item.note || '';
        document.getElementById('edit-price').value = item.price || '';
        document.getElementById('modal-overlay').classList.remove('hidden');
        document.getElementById('edit-modal').classList.remove('hidden');
    },

    closeModal: () => {
        document.getElementById('modal-overlay').classList.add('hidden');
        document.getElementById('edit-modal').classList.add('hidden');
    },

    saveEdit: (e) => {
        e.preventDefault();
        const originalName = document.getElementById('edit-original-name').value;
        const newName = document.getElementById('edit-name').value.trim();
        if (newName.toLowerCase() !== originalName.toLowerCase()) {
            if (app.data.items.find(i => i.name.toLowerCase() === newName.toLowerCase())) {
                alert('Ya existe otro artículo con ese nombre.'); return;
            }
        }
        const newItems = app.data.items.map(item => {
            if (item.name === originalName) {
                return {
                    ...item, 
                    name: newName, 
                    category: document.getElementById('edit-cat').value, 
                    note: document.getElementById('edit-note').value.trim(),
                    price: parseFloat(document.getElementById('edit-price').value) || 0
                };
            }
            return item;
        });
        app.saveData(newItems);
        app.closeModal();
    },

    setTab: (tabName) => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.container').forEach(c => c.classList.add('hidden'));
        const btns = document.querySelectorAll('.tab-btn');
        if(tabName === 'shopping') btns[0].classList.add('active'); else btns[1].classList.add('active');
        document.getElementById(`view-${tabName}`).classList.remove('hidden');
        app.updateTotal();
    },
    
    showToast: (msg) => {
        const t = document.getElementById('toast'); t.innerText = msg; t.style.opacity = 1;
        setTimeout(() => t.style.opacity = 0, 2000);
    }
};

document.addEventListener('DOMContentLoaded', app.init);