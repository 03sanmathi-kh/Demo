/* ================================
   Module 4: Drone-based Field Monitoring
   Features:
   1. Field-wise Average Health Score
   2. Weakest Grid Identification
   3. Drone Coverage Report
   CSV-driven, rule-based, deterministic
================================ */

/* ---------- Load CSV ---------- */
fetch("prob4.csv")
  .then(response => response.text())
  .then(csvData => processCSV(csvData))
  .catch(error => console.error("CSV Load Error:", error));

/* ---------- CSV Processing ---------- */
function processCSV(csvText) {
  const rows = csvText.trim().split("\n");
  const headers = rows[0].split(",");

  const data = [];

  for (let i = 1; i < rows.length; i++) {
    const values = rows[i].split(",");
    const rowObj = {};

    headers.forEach((header, index) => {
      rowObj[header.trim()] = values[index].trim();
    });

    // Convert HealthScore to number
    rowObj.HealthScore = Number(rowObj.HealthScore);

    // Convert GridX, GridY to numbers
    rowObj.GridX = Number(rowObj.GridX);
    rowObj.GridY = Number(rowObj.GridY);

    data.push(rowObj);
  }

  calculateFieldAnalytics(data);
}

/* ---------- Core Analytics ---------- */
function calculateFieldAnalytics(data) {

  const fieldStats = {};

  /* Group data by FieldID */
  data.forEach(cell => {
    const field = cell.FieldID;

    if (!fieldStats[field]) {
      fieldStats[field] = {
        totalHealth: 0,
        cellCount: 0,
        weakestGrid: cell
      };
    }

    fieldStats[field].totalHealth += cell.HealthScore;
    fieldStats[field].cellCount += 1;

    // Track weakest grid
    if (cell.HealthScore < fieldStats[field].weakestGrid.HealthScore) {
      fieldStats[field].weakestGrid = cell;
    }
  });

  /* ---------- Output Results ---------- */
  console.log("📊 FIELD ANALYTICS REPORT\n");

  Object.keys(fieldStats).forEach(field => {
    const stats = fieldStats[field];

    const avgHealth = (stats.totalHealth / stats.cellCount).toFixed(1);
    const weakest = stats.weakestGrid;

    console.log(`Field ${field}`);
    console.log(`➡ Average Health Score: ${avgHealth}`);
    console.log(
      `➡ Worst Grid: (${weakest.GridX}, ${weakest.GridY}), ` +
      `${weakest.CropType}, Health = ${weakest.HealthScore}`
    );
    console.log(`➡ Drone Coverage: ${stats.cellCount} grid cells`);
    console.log("--------------------------------------------------");
  });
}
