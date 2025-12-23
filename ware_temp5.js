/* ==================================================
   Module 5: Smart Warehouse & Cold Storage
   Rule-Based Inventory Analytics (NO AI / NO LLM)
================================================== */

/* -------- CONFIGURATION -------- */
const LOW_STOCK_THRESHOLD = 100;
const COLD_STORAGE_TEMP = "4°C";
const COLD_REQUIRED_CATEGORIES = ["Fruit", "Dairy", "Meat", "Poultry"];

/* -------- LOAD CSV -------- */
fetch("prob5.csv")
  .then(response => response.text())
  .then(csv => analyzeInventory(csv))
  .catch(error => console.error("Error loading CSV:", error));

/* -------- MAIN LOGIC -------- */
function analyzeInventory(csvText) {
  const lines = csvText.trim().split("\n");
  const headers = lines[0].split(",");

  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",");
    const item = {};

    headers.forEach((h, index) => {
      item[h.trim()] = values[index].trim();
    });

    item.Quantity = Number(item.Quantity);
    data.push(item);
  }

  processInventory(data);
}

/* -------- PROCESS INVENTORY -------- */
function processInventory(items) {

  const categorySummary = {};
  const lowStockItems = [];
  const temperatureViolations = [];
  let totalQuantity = 0;
  let latestInspection = "";

  items.forEach(item => {

    /* 1. Category-wise Inventory Summary */
    if (!categorySummary[item.Category]) {
      categorySummary[item.Category] = 0;
    }
    categorySummary[item.Category] += item.Quantity;

    /* 2. Cold Storage Temperature Compliance */
    if (
      COLD_REQUIRED_CATEGORIES.includes(item.Category) &&
      item.StorageTemperature !== COLD_STORAGE_TEMP
    ) {
      temperatureViolations.push(item.ItemName);
    }

    /* 3. Low Stock Alert System */
    if (item.Quantity < LOW_STOCK_THRESHOLD) {
      lowStockItems.push(item.ItemName);
    }

    /* 4. Total Inventory Count */
    totalQuantity += item.Quantity;

    /* 5. Last Inspection Report */
    if (item.LastChecked > latestInspection) {
      latestInspection = item.LastChecked;
    }
  });

  displayResults(
    categorySummary,
    temperatureViolations,
    lowStockItems,
    totalQuantity,
    latestInspection
  );
}

/* -------- OUTPUT -------- */
function displayResults(
  categorySummary,
  tempIssues,
  lowStock,
  totalQty,
  lastCheck
) {

  console.log("🏬 SMART WAREHOUSE INVENTORY REPORT\n");

  console.log("1️⃣ Category-wise Inventory Summary:");
  for (let category in categorySummary) {
    console.log(`   ${category}: ${categorySummary[category]} units`);
  }

  console.log("\n2️⃣ Cold Storage Temperature Compliance:");
  console.log(
    tempIssues.length === 0
      ? "   All cold-storage items stored correctly at 4°C"
      : "   Temperature issue in: " + tempIssues.join(", ")
  );

  console.log("\n3️⃣ Low Stock Alert System:");
  console.log(
    lowStock.length === 0
      ? "   No low stock items"
      : "   Low stock items: " + lowStock.join(", ")
  );

  console.log("\n4️⃣ Total Inventory Count:");
  console.log(`   ${totalQty} total units in warehouse`);

  console.log("\n5️⃣ Last Inspection Report:");
  console.log(`   Most recent inspection: ${lastCheck}`);

  console.log("\n-----------------------------------------");
}
