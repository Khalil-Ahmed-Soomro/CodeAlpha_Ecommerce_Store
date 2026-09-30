document.addEventListener('DOMContentLoaded', () => {
  loadAdminData();
});

async function loadAdminData() {
  let products = rawProducts.length > 0 ? rawProducts : defaultProducts;
  renderAdminTable(products);
  updateMetrics(products);
}

function renderAdminTable(products) {
  const tbody = document.getElementById('admin-product-table');
  if (!tbody) return;
  tbody.innerHTML = '';

  products.forEach(p => {
    tbody.innerHTML += `
      <tr>
        <td><img src="${p.image}" width="40" height="40" style="object-fit:cover; border-radius:4px; background:#fff;"></td>
        <td><strong>${p.name}</strong></td>
        <td>${p.category || 'General'}</td>
        <td>$${parseFloat(p.price).toFixed(2)}</td>
        <td>
          <button class="btn-edit" onclick="editProduct(${p.id})">Edit</button>
          <button class="btn-delete" onclick="deleteProduct(${p.id})">Delete</button>
        </td>
      </tr>
    `;
  });
}

function updateMetrics(products) {
  const statProd = document.getElementById('stat-products');
  if (statProd) statProd.innerText = products.length;
}

function handleProductSubmit(e) {
  e.preventDefault();
  
  const id = document.getElementById('p-id').value;
  const newProduct = {
    name: document.getElementById('p-name').value,
    category: document.getElementById('p-category').value,
    price: parseFloat(document.getElementById('p-price').value),
    image: document.getElementById('p-image').value,
    description: document.getElementById('p-desc').value
  };

  if (id) {
    const idx = defaultProducts.findIndex(p => p.id == id);
    if (idx !== -1) defaultProducts[idx] = { id: parseInt(id), ...newProduct };
    showToast('Product Updated!');
  } else {
    const created = { id: Date.now(), ...newProduct };
    defaultProducts.unshift(created);
    showToast('New Product Added!');
  }

  document.getElementById('product-form').reset();
  document.getElementById('p-id').value = '';
  document.getElementById('form-title').innerText = 'Add New Product';
  
  rawProducts = defaultProducts;
  applyFilters();
  loadAdminData();
}

function editProduct(id) {
  const p = defaultProducts.find(item => item.id == id);
  if (!p) return;

  document.getElementById('p-id').value = p.id;
  document.getElementById('p-name').value = p.name;
  document.getElementById('p-category').value = p.category;
  document.getElementById('p-price').value = p.price;
  document.getElementById('p-image').value = p.image;
  document.getElementById('p-desc').value = p.description || '';
  
  document.getElementById('form-title').innerText = 'Edit Product #' + p.id;
}

function deleteProduct(id) {
  if (confirm('Are you sure you want to delete this product?')) {
    const idx = defaultProducts.findIndex(p => p.id == id);
    if (idx !== -1) {
      defaultProducts.splice(idx, 1);
      showToast('Product Deleted!');
      rawProducts = defaultProducts;
      applyFilters();
      loadAdminData();
    }
  }
}