#include <iostream>
#include <queue>
#include <vector>
using namespace std;

// Factory info
struct Factory {
    int id;       
    int demand;   
    int urgency;  
    float eff;    
};

// Comparator for priority queue (higher urgency first, then efficiency)
struct Compare {
    bool operator()(Factory const& a, Factory const& b) {
        if (a.urgency == b.urgency) return a.eff < b.eff;
        return a.urgency < b.urgency;
    }
};

// Simple sliding window forecast: average of last k arrivals
int forecast(vector<int>& arrivals, int k) {
    int n = arrivals.size();
    if (n < k) k = n;
    int sum = 0;
    for (int i = n-k; i < n; i++) sum += arrivals[i];
    return sum / k; // average
}

int main() {
   vector<Factory> f = {
        {1, 50, 5, 1.2},
        {2, 30, 8, 1.5},
        {3, 40, 3, 1.1}
    };

   
    vector<int> arrivals = {40, 20, 50, 30}; // units arriving each step
    int nextForecast = forecast(arrivals, 2);
    cout << "Forecast next arrival (sliding window avg) = " << nextForecast << " units\n\n";

    // Priority queue allocation for current batch
    int materials = arrivals.back(); // latest arrival
    priority_queue<Factory, vector<Factory>, Compare> pq(f.begin(), f.end());

    cout << "=== Priority Queue Allocation ===\n";
    while (materials > 0 && !pq.empty()) {
        Factory x = pq.top(); pq.pop();
        int alloc = (materials >= x.demand) ? x.demand : materials;
        materials -= alloc;
        x.demand -= alloc;
        cout << "Allocated " << alloc << " units to Factory " << x.id << endl;
        if (x.demand > 0) pq.push(x); // reinsert if still needs material
    }

    cout << "\nRemaining materials: " << materials << endl;
    return 0;
}
