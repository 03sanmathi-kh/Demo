#include <iostream>
using namespace std;

int main() {
    int n = 3; // Number of factories

    // Each factory has demand, urgency, and efficiency
    int demand[3] = {50, 30, 40};
    int urgency[3] = {5, 8, 3};
    float efficiency[3] = {1.2, 1.5, 1.1};

    // Store original demands for throughput calculation
    int original_demand[3];
    for (int i = 0; i < n; i++) original_demand[i] = demand[i];

    int materials = 70; // Incoming raw material

    cout << "=== Greedy Allocation ===\n";

    // Allocate materials to factories based on urgency (tie-breaker: efficiency)
    for (int round = 0; round < n; round++) {
        int idx = -1;
        for (int i = 0; i < n; i++) {
            if (demand[i] > 0) {
                if (idx == -1 || urgency[i] > urgency[idx] ||
                    (urgency[i] == urgency[idx] && efficiency[i] > efficiency[idx])) {
                    idx = i;
                }
            }
        }

        if (idx != -1 && materials > 0) {
            int alloc = (materials >= demand[idx]) ? demand[idx] : materials;
            materials -= alloc;
            demand[idx] -= alloc;
            cout << "Allocated " << alloc << " units to Factory " << (idx + 1) << endl;
        }
    }

    // Calculate throughput based on allocated materials
    float throughput = 0;
    for (int i = 0; i < n; i++)
        throughput += (original_demand[i] - demand[i]) * efficiency[i];

    cout << "\n=== Result ===\n";
    cout << "Remaining materials: " << materials << endl;
    cout << "Throughput: " << throughput << endl;

    return 0;
}
