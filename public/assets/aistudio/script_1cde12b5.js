const API = "http://localhost:8080/products";
const AUTH_API = "http://localhost:8080/auth";
const HISTORY_API = "http://localhost:8080/stock-history";

let editId = null;
let deleteId = null;
let allProducts = [];
let currentPage = 1;
const PAGE_SIZE = 8;

// ─── INIT ───────────────────────────────────────────────────────────────────

window.addEventListener("DOMContentLoaded", () => {
    const user = localStorage.getItem("user");
    if (user) {
        document.getElementById("username-display").textContent = user;
        document.getElementById("dash-user").textContent = user;
    }
    showView("dashboard");
    load();
});

// ─── VIEW SWITCHING ──────────────────────────────────────────────────────────

function showView(view) {
    document.querySelectorAll(".view-section").forEach(el => el.classList.add("hidden"));
    document.querySelectorAll(".nav-link").forEach(el => el.classList.remove("active"));
    document.getElementById("view-" + view).classList.remove("hidden");

    const links = document.querySelectorAll(".nav-link");
    const map = { dashboard: 0, products: 1, history: 2 };
    if (map[view] !== undefined) links[map[view]].classList.add("active");

    if (view === "dashboard") renderDashboard();
    if (view === "products") renderTable(currentPage);
    if (view === "history") loadHistory();
}

// ─── LOAD ALL PRODUCTS ───────────────────────────────────────────────────────

function load() {
    fetch(API)
        .then(res => {
            if (!res.ok) return res.json().then(d => { throw new Error(d.message); });
            return res.json();
        })
        .then(data => {
            allProducts = data;
            populateCategoryFilter(data);
            renderDashboard();
            renderTable(1);
        })
        .catch(err => showToast(err.message || "Failed to load products", "error"));
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────

function renderDashboard() {
    const total = allProducts.length;
    const low = allProducts.filter(p => p.status === "LOW_STOCK").length;
    const available = allProducts.filter(p => p.status === "AVAILABLE").length;
    const totalValue = allProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);

    document.getElementById("dash-total").textContent = total;
    document.getElementById("dash-low").textContent = low;
    document.getElementById("dash-available").textContent = available;
    document.getElementById("dash-value").textContent = "₹" + totalValue.toLocaleString("en-IN", { maximumFractionDigits: 2 });

    // Category breakdown bars
    const catMap = {};
    allProducts.forEach(p => { catMap[p.category] = (catMap[p.category] || 0) + 1; });
    const maxCount = Math.max(...Object.values(catMap), 1);
    const colors = ["#007bff", "#28a745", "#fd7e14", "#6f42c1", "#dc3545", "#17a2b8"];
    let barsHtml = "";
    Object.entries(catMap).sort((a, b) => b[1] - a[1]).forEach(([cat, count], i) => {
        const pct = Math.round((count / maxCount) * 100);
        barsHtml += `
            <div class="cat-bar-row">
                <span class="cat-label">${cat}</span>
                <div class="cat-bar-track">
                    <div class="cat-bar-fill" style="width:${pct}%; background:${colors[i % colors.length]}"></div>
                </div>
                <span class="cat-count">${count}</span>
            </div>`;
    });
    document.getElementById("category-bars").innerHTML = barsHtml || "<p class='text-muted'>No data</p>";

    // Low stock alerts
    const lowItems = allProducts.filter(p => p.status === "LOW_STOCK");
    const alertHtml = lowItems.length === 0
        ? "<p class='text-muted'>✅ No low stock alerts!</p>"
        : lowItems.map(p => `
            <div class="alert-item">
                <span class="alert-name">${p.name}</span>
                <span class="alert-badge">${p.quantity} left</span>
            </div>`).join("");
    document.getElementById("low-stock-list").innerHTML = alertHtml;
}

// ─── TABLE RENDER WITH PAGINATION ────────────────────────────────────────────

function getFilteredProducts() {
    const search = (document.getElementById("search")?.value || "").toLowerCase();
    const catFilter = document.getElementById("filter-category")?.value || "";
    const statusFilter = document.getElementById("filter-status")?.value || "";
    const sort = document.getElementById("sort-select")?.value || "";

    let filtered = allProducts.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(search);
        const matchCat = !catFilter || p.category === catFilter;
        const matchStatus = !statusFilter || p.status === statusFilter;
        return matchSearch && matchCat && matchStatus;
    });

    if (sort === "price_asc") filtered.sort((a, b) => a.price - b.price);
    else if (sort === "price_desc") filtered.sort((a, b) => b.price - a.price);
    else if (sort === "name_asc") filtered.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "qty_asc") filtered.sort((a, b) => a.quantity - b.quantity);

    return filtered;
}

function renderTable(page) {
    currentPage = page;
    const filtered = getFilteredProducts();
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    if (page > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * PAGE_SIZE;
    const paginated = filtered.slice(start, start + PAGE_SIZE);

    const tbody = document.getElementById("table");
    const emptyState = document.getElementById("empty-state");

    if (paginated.length === 0) {
        tbody.innerHTML = "";
        emptyState.classList.remove("hidden");
    } else {
        emptyState.classList.add("hidden");
        tbody.innerHTML = paginated.map((p, i) => {
            const isLow = p.status === "LOW_STOCK";
            const date = p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-IN") : "-";
            const threshold = p.lowStockThreshold ?? 10;
            return `
            <tr class="${isLow ? 'low-row' : ''}">
                <td class="text-muted">${start + i + 1}</td>
                <td><strong>${escapeHtml(p.name)}</strong></td>
                <td><span class="cat-chip">${escapeHtml(p.category)}</span></td>
                <td>₹${p.price.toLocaleString("en-IN")}</td>
                <td>${p.quantity}</td>
                <td class="text-muted">&lt; ${threshold}</td>
                <td><span class="status-badge ${isLow ? 'badge-low' : 'badge-ok'}">${isLow ? "Low Stock" : "Available"}</span></td>
                <td class="text-muted">${date}</td>
                <td>
                    <button class="btn-edit" onclick="openEditModal(${p.id})">✏ Edit</button>
                    <button class="btn-del" onclick="openDeleteModal(${p.id}, '${escapeHtml(p.name)}')">🗑</button>
                </td>
            </tr>`;
        }).join("");
    }

    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const pg = document.getElementById("pagination");
    if (totalPages <= 1) { pg.innerHTML = ""; return; }

    let html = `<button ${currentPage === 1 ? 'disabled' : ''} onclick="renderTable(${currentPage - 1})">‹ Prev</button>`;
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="${i === currentPage ? 'pg-active' : ''}" onclick="renderTable(${i})">${i}</button>`;
    }
    html += `<button ${currentPage === totalPages ? 'disabled' : ''} onclick="renderTable(${currentPage + 1})">Next ›</button>`;
    pg.innerHTML = html;
}

// ─── FILTERS ─────────────────────────────────────────────────────────────────

function populateCategoryFilter(data) {
    const cats = [...new Set(data.map(p => p.category))].sort();
    const sel = document.getElementById("filter-category");
    const current = sel.value;
    sel.innerHTML = '<option value="">All Categories</option>' +
        cats.map(c => `<option value="${c}" ${c === current ? 'selected' : ''}>${c}</option>`).join("");
}

let searchDebounce;
function handleSearch() {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => renderTable(1), 200);
}

function applyFilters() { renderTable(1); }

// ─── MODAL ───────────────────────────────────────────────────────────────────

function openModal() {
    editId = null;
    clearModalForm();
    document.getElementById("modal-title").textContent = "Add Product";
    document.getElementById("modal-save-btn").textContent = "Add Product";
    document.getElementById("modal-overlay").classList.remove("hidden");
}

function openEditModal(id) {
    const p = allProducts.find(p => p.id === id);
    if (!p) return;
    editId = id;
    clearModalForm();
    document.getElementById("m-name").value = p.name;
    document.getElementById("m-category").value = p.category;
    document.getElementById("m-price").value = p.price;
    document.getElementById("m-quantity").value = p.quantity;
    document.getElementById("m-threshold").value = p.lowStockThreshold ?? "";
    document.getElementById("modal-title").textContent = "Edit Product";
    document.getElementById("modal-save-btn").textContent = "Update Product";
    document.getElementById("modal-overlay").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("modal-overlay").classList.add("hidden");
    clearModalForm();
}

function closeModalOnOverlay(e) {
    if (e.target.id === "modal-overlay") closeModal();
}

function clearModalForm() {
    ["m-name", "m-category", "m-price", "m-quantity", "m-threshold"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });
    ["err-name", "err-category", "err-price", "err-quantity"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = "";
    });
}

// ─── SAVE PRODUCT ────────────────────────────────────────────────────────────

function saveProduct() {
    const name = document.getElementById("m-name").value.trim();
    const category = document.getElementById("m-category").value;
    const price = document.getElementById("m-price").value;
    const quantity = document.getElementById("m-quantity").value;
    const threshold = document.getElementById("m-threshold").value;

    let valid = true;
    if (!name) { document.getElementById("err-name").textContent = "Name is required"; valid = false; }
    else document.getElementById("err-name").textContent = "";
    if (!category) { document.getElementById("err-category").textContent = "Category is required"; valid = false; }
    else document.getElementById("err-category").textContent = "";
    if (!price || parseFloat(price) < 0) { document.getElementById("err-price").textContent = "Enter a valid price"; valid = false; }
    else document.getElementById("err-price").textContent = "";
    if (!quantity || parseInt(quantity) < 0) { document.getElementById("err-quantity").textContent = "Enter a valid quantity"; valid = false; }
    else document.getElementById("err-quantity").textContent = "";
    if (!valid) return;

    const product = {
        name,
        category,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        lowStockThreshold: threshold ? parseInt(threshold) : 10
    };

    const url = editId !== null ? `${API}/${editId}` : API;
    const method = editId !== null ? "PUT" : "POST";
    const user = localStorage.getItem("user");

    fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "X-Username": user },
        body: JSON.stringify(product)
    })
    .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    })
    .then(() => {
        closeModal();
        showToast(editId ? "Product updated successfully!" : "Product added successfully!", "success");
        load();
    })
    .catch(err => showToast(err.message || "Failed to save product", "error"));
}

// ─── DELETE ──────────────────────────────────────────────────────────────────

function openDeleteModal(id, name) {
    deleteId = id;
    document.getElementById("delete-product-name").textContent = name;
    document.getElementById("delete-overlay").classList.remove("hidden");
}

function closeDeleteModal() {
    deleteId = null;
    document.getElementById("delete-overlay").classList.add("hidden");
}

function closeDeleteOnOverlay(e) {
    if (e.target.id === "delete-overlay") closeDeleteModal();
}

function confirmDelete() {
    if (deleteId === null) return;
    fetch(`${API}/${deleteId}`, { method: "DELETE" })
        .then(async res => {
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message);
            }
            closeDeleteModal();
            showToast("Product deleted successfully!", "success");
            load();
        })
        .catch(err => {
            closeDeleteModal();
            showToast(err.message || "Delete failed", "error");
        });
}

// ─── STOCK HISTORY ───────────────────────────────────────────────────────────

function loadHistory() {
    fetch(HISTORY_API)
        .then(res => {
            if (!res.ok) return res.json().then(d => { throw new Error(d.message); });
            return res.json();
        })
        .then(data => {
            const tbody = document.getElementById("history-table");
            const empty = document.getElementById("history-empty");
            if (!data.length) {
                tbody.innerHTML = "";
                empty.classList.remove("hidden");
                return;
            }
            empty.classList.add("hidden");
            tbody.innerHTML = data.map(h => {
                const dt = new Date(h.changedAt).toLocaleString("en-IN");
                const changeClass = h.changeType === "ADDED" ? "badge-ok" : h.changeType === "DELETED" ? "badge-low" : "badge-edit";
                return `
                <tr>
                    <td><strong>${escapeHtml(h.productName)}</strong></td>
                    <td><span class="status-badge ${changeClass}">${h.changeType}</span></td>
                    <td>${h.oldQuantity ?? "-"}</td>
                    <td>${h.newQuantity ?? "-"}</td>
                    <td>${escapeHtml(h.changedBy)}</td>
                    <td class="text-muted">${dt}</td>
                </tr>`;
            }).join("");
        })
        .catch(err => showToast(err.message || "Failed to load history", "error"));
}

// ─── EXPORT CSV ──────────────────────────────────────────────────────────────

function exportCSV() {
    const filtered = getFilteredProducts();
    if (!filtered.length) { showToast("No products to export", "info"); return; }
    let csv = "Name,Category,Price,Quantity,Low Stock At,Status\n";
    filtered.forEach(p => {
        csv += `"${p.name}","${p.category}",${p.price},${p.quantity},${p.lowStockThreshold ?? 10},${p.status}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "inventory_export.csv";
    link.click();
    showToast("CSV exported!", "success");
}

// ─── TOAST ───────────────────────────────────────────────────────────────────

function showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    const icons = { success: "✅", error: "❌", info: "ℹ️" };
    toast.innerHTML = `<span>${icons[type] || ""} ${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add("toast-show"), 10);
    setTimeout(() => {
        toast.classList.remove("toast-show");
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

// ─── LOGOUT ──────────────────────────────────────────────────────────────────

function logout() {
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

// ─── UTIL ─────────────────────────────────────────────────────────────────────

function escapeHtml(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
