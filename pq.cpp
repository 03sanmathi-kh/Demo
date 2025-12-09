#include <iostream>
#include <queue>
#include <vector>
#include <iomanip>
using namespace std;

struct F { int id, d, u; double e; }; // Factory: id, demand, urgency, efficiency

struct C {
    bool operator()(const F& a, const F& b) {
        return (a.u == b.u) ? a.e < b.e : a.u < b.u;
    }
};

double fcst(const vector<int>& arr, int k) {
    int n = arr.size();
    if (n == 0) return 0;
    if (n < k) k = n;
    int s = 0;
    for (int i = n - k; i < n; ++i) s += arr[i];
    return static_cast<double>(s) / k;
}

int alloc(vector<F>& fac, int m) {
    priority_queue<F, vector<F>, C> pq(fac.begin(), fac.end());
    cout << "=== Allocation ===\n";
    while (m > 0 && !pq.empty()) {
        F x = pq.top(); pq.pop();
        int a = min(m, x.d);
        m -= a;
        x.d -= a;
        cout << "Allocated " << a << " to Factory " << x.id 
             << " (Remaining: " << x.d << ")\n";
        if (x.d > 0) pq.push(x);
    }
    return m;
}

int main() {
    vector<F> fac = {{1,50,5,1.2},{2,30,8,1.5},{3,40,3,1.1}};
    vector<int> arr = {40,20,50,30};

    cout << fixed << setprecision(2);
    cout << "Forecast next arrival = " << fcst(arr,2) << " units\n\n";

    int rem = alloc(fac, arr.back());
    cout << "\nRemaining materials: " << rem << " units\n";
}
