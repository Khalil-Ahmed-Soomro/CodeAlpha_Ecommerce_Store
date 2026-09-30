// Initialization logic fix
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  updateUserUI();
  // Direct default products load karne ke liye
  fetchProducts();
});

// Updated fetchProducts function (Github Pages friendly)
async function fetchProducts() {
  try {
    const res = await fetch('/api/products');
    if (res.ok) {
      const data = await res.json();
      rawProducts = (data && data.length > 0) ? data : defaultProducts;
    } else {
      rawProducts = defaultProducts;
    }
  } catch (err) {
    // Live GitHub host par Backend fetch fail hone par local default products load honge
    console.log("Backend not detected, loading static products.");
    rawProducts = defaultProducts;
  }
  
  // Products set hone ke baad filter aur render call karein
  applyFilters();
}
