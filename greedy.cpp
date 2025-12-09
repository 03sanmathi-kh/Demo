#include <iostream>
using namespace std;
int main() {
    // Number of factories
    int n = 3;
    // Each factory has demand (units of material needed),
    // urgency (higher means more critical), and efficiency (output per unit).
    int demand[3] = {50, 30, 40};
    int urgency[3] = {5, 8, 3};
    float efficiency[3] = {1.2, 1.5, 1.1};

    // Incoming raw materials (example: lithium units)
    int materials = 70;
    cout << "Greedy Allocation\n";

    // Step 1: Allocate materials to factories with highest urgency first
    // (Beginner approach: just loop and pick manually)
    for (int round = 0; round < n; round++) {
        // Find factory with highest urgency still needing material
        int idx = -1, maxUrg = -1;
        for (int i = 0; i < n; i++) {
            if (demand[i] > 0 && urgency[i] > maxUrg) {
                maxUrg = urgency[i];
                idx = i;
            }
        }
    if (idx != -1 && materials > 0) {
            int alloc = (materials >= demand[idx]) ? demand[idx] : materials;
            materials -= alloc;
            demand[idx] -= alloc;
            cout << "Allocated " << alloc << " units to Factory " << (idx+1) << endl;
        }
    }

    // Step 2: Simple throughput calculation
    // (how much output we got from allocated materials)
    float throughput = 0;
    for (int i = 0; i < n; i++) {
        int used = (demand[i] == 0) ? 1 : 0; // just check if factory got something
        throughput += efficiency[i] * (used);
    }

    cout << "\n=== Result ===\n";
    cout << "Remaining materials: " << materials << endl;
    cout << "Approx throughput score: " << throughput << endl;

    return 0;
}
