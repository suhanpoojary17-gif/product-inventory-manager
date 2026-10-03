// 1. Interfaces
interface Product {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
  tags?: string[];
}

interface DiscountedProduct extends Product {
  discountPercent: number;
  discountedPrice: number;
}

// 2. Initial Sample Inventory State
let inventory: Product[] = [
  { id: 1, name: "Mechanical Keyboard", price: 120, inStock: true, tags: ["electronics", "peripherals"] },
  { id: 2, name: "Wireless Mouse", price: 45, inStock: false, tags: ["electronics"] },
  { id: 3, name: "USB-C Hub", price: 30, inStock: true, tags: ["accessories"] },
  { id: 4, name: "Gaming Monitor", price: 300, inStock: true, tags: ["displays"] }
];

// 3. Core Logic Functions
function getAvailableProducts(products: Product[]): Product[] {
  return products.filter(product => product.inStock);
}

function calculateDiscountedPrice(price: number, discountPercent: number = 10): number {
  return price - (price * discountPercent) / 100;
}

function applyDiscountToProducts(products: Product[], discountPercent: number = 10): DiscountedProduct[] {
  return products.map(product => ({
    ...product,
    discountPercent,
    discountedPrice: calculateDiscountedPrice(product.price, discountPercent)
  }));
}

// 4. UI Rendering Engine
function renderProducts(productsToDisplay: Product[] | DiscountedProduct[]): void {
  const tableBody = document.getElementById("productTableBody") as HTMLTableSectionElement;
  tableBody.innerHTML = "";

  if (productsToDisplay.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No products found.</td></tr>`;
    return;
  }

  productsToDisplay.forEach(p => {
    const row = document.createElement("tr");

    const isDiscounted = "discountedPrice" in p;
    const finalPrice = isDiscounted 
      ? `<span class="original-price">$${p.price.toFixed(2)}</span> $${(p as DiscountedProduct).discountedPrice.toFixed(2)} (${(p as DiscountedProduct).discountPercent}% off)`
      : `$${p.price.toFixed(2)}`;

    const tagsList = p.tags && p.tags.length > 0 ? p.tags.join(", ") : "None";

    row.innerHTML = `
      <td>${p.id}</td>
      <td><strong>${p.name}</strong></td>
      <td>${finalPrice}</td>
      <td><span class="badge ${p.inStock ? "in-stock" : "out-of-stock"}">${p.inStock ? "In Stock" : "Out of Stock"}</span></td>
      <td>${tagsList}</td>
      <td><button class="toggle-btn" onclick="toggleStock(${p.id})">Toggle Stock</button></td>
    `;

    tableBody.appendChild(row);
  });
}

// 5. Event Handlers
function handleAddProduct(event: Event): void {
  event.preventDefault();

  const nameInput = document.getElementById("productName") as HTMLInputElement;
  const priceInput = document.getElementById("productPrice") as HTMLInputElement;
  const stockInput = document.getElementById("productStock") as HTMLInputElement;
  const tagsInput = document.getElementById("productTags") as HTMLInputElement;

  const newProduct: Product = {
    id: inventory.length > 0 ? Math.max(...inventory.map(p => p.id)) + 1 : 1,
    name: nameInput.value,
    price: parseFloat(priceInput.value),
    inStock: stockInput.checked,
    tags: tagsInput.value ? tagsInput.value.split(",").map(t => t.trim()) : []
  };

  inventory.push(newProduct);
  renderProducts(inventory);

  // Reset form
  (event.target as HTMLFormElement).reset();
}

function toggleStock(id: number): void {
  inventory = inventory.map(p => {
    if (p.id === id) {
      return { ...p, inStock: !p.inStock };
    }
    return p;
  });
  renderProducts(inventory);
}

// Expose toggleStock to window scope for inline HTML onclick handler
(window as any).toggleStock = toggleStock;

// 6. Initialization & Filter Listeners
document.addEventListener("DOMContentLoaded", () => {
  renderProducts(inventory);

  const addProductForm = document.getElementById("addProductForm") as HTMLFormElement;
  addProductForm.addEventListener("submit", handleAddProduct);

  const showAllBtn = document.getElementById("showAllBtn") as HTMLButtonElement;
  const showAvailableBtn = document.getElementById("showAvailableBtn") as HTMLButtonElement;
  const applyDiscountBtn = document.getElementById("applyDiscountBtn") as HTMLButtonElement;

  showAllBtn.addEventListener("click", () => renderProducts(inventory));
  showAvailableBtn.addEventListener("click", () => renderProducts(getAvailableProducts(inventory)));
  applyDiscountBtn.addEventListener("click", () => renderProducts(applyDiscountToProducts(inventory, 15)));
});