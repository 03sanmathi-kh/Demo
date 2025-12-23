// ===== CONFIG =====
const CSV_URL = "prob6.csv";
const LOW_STOCK = 50;
const ESSENTIAL = ["Vegetable", "Dairy"];

// ===== CSV PARSER =====
function parseCSV(text) {
  const [h, ...r] = text.trim().split("\n");
  const k = h.split(",");
  return r.map(l => {
    const o = {};
    l.split(",").forEach((v, i) => o[k[i]] = isNaN(v) ? v : +v);
    return o;
  });
}

// ===== MERGE SORT (LOW QTY = HIGH DEMAND) =====
function mergeSort(a) {
  if (a.length < 2) return a;
  const m = Math.floor(a.length / 2);
  const l = mergeSort(a.slice(0, m));
  const r = mergeSort(a.slice(m));
  return merge(l, r);
}
function merge(l, r) {
  let o = [];
  while (l.length && r.length)
    o.push(l[0].Quantity <= r[0].Quantity ? l.shift() : r.shift());
  return [...o, ...l, ...r];
}

// ===== MAIN LOGIC =====
fetch(CSV_URL)
  .then(r => r.text())
  .then(t => {
    const data = parseCSV(t);

    // 1️⃣ Category-wise grouping
    const byCat = {};
    data.forEach(i => (byCat[i.Category] ||= []).push(i));

    // 2️⃣ Low quantity = High demand
    data.forEach(i => i.demand = i.Quantity < LOW_STOCK);

    // 3️⃣ Price/Demand ranking (Merge Sort)
    const ranked = mergeSort([...data]);

    // 4️⃣ Top Deal (Essential + Lowest Quantity)
    const topDeal = mergeSort(
      data.filter(i => ESSENTIAL.includes(i.Category))
    )[0];

    // 5️⃣ Freshness indicator
    data.forEach(i => {
      const hrs = (Date.now() - new Date(i.LastChecked)) / 36e5;
      i.fresh = hrs < 1 ? "Fresh" : hrs < 6 ? "Normal" : "Old";
    });

    // 6️⃣ Buyer recommendation
    data.forEach(i =>
      i.buyer = i.Quantity > 150 ? "Bulk Buyer" : "Retail Buyer"
    );

    // 7️⃣ Analytics
    const totalQty = data.reduce((s, i) => s + i.Quantity, 0);

    // ===== OUTPUT (console / DOM-ready) =====
    console.log("Category View:", byCat);
    console.log("Ranked Crops:", ranked);
    console.log("🔥 High Demand:", data.filter(i => i.demand));
    console.log("⭐ Top Deal:", topDeal);
    console.log("📊 Total Quantity:", totalQty);
  });
