package backend;

import java.util.*;

public class Prims {

    int v;
    int[][] graph;

    Prims(int v, int[][] graph) {
        this.v = v;
        this.graph = graph;
    }

    int findMinVertex(int[] key, boolean[] mstSet) {
        int min = Integer.MAX_VALUE;
        int minIndex = -1;
        for (int i = 0; i < v; i++) {
            if (!mstSet[i] && key[i] < min) {
                min = key[i];
                minIndex = i;
            }
        }
        return minIndex;
    }

    public void applyPrims() {
        int[] parent = new int[v];
        int[] key = new int[v];
        boolean[] mstSet = new boolean[v];
        List<Integer> visitedNodes = new ArrayList<>();

        Arrays.fill(key, Integer.MAX_VALUE);
        key[0] = 0;
        parent[0] = -1;

        // ✅ Loop runs v times to ensure all nodes are included in visited order
        for (int count = 0; count < v; count++) {
            int u = findMinVertex(key, mstSet);
            mstSet[u] = true;
            visitedNodes.add(u);  // ✅ Add every picked node to visited list

            for (int i = 0; i < v; i++) {
                if (graph[u][i] != 0 && !mstSet[i] && graph[u][i] < key[i]) {
                    parent[i] = u;
                    key[i] = graph[u][i];
                }
            }
        }

        printMST(parent, visitedNodes);
    }

    void printMST(int[] parent, List<Integer> visitedNodes) {
        // ✅ Output MST edges
        for (int i = 1; i < v; i++) {
            System.out.println(parent[i] + "-" + i);
        }

        // ✅ Output visited order with clear marker
        System.out.println("VISITED");
        for (int node : visitedNodes) {
            System.out.println(node);
        }
    }

    public static void main(String[] args) {
        if (args.length < 1) {
            System.out.println("Usage: java Prims \"<adj_matrix_values>\"");
            return;
        }

        try {
            String graphInput = args[0];
            String[] rows = graphInput.split(",");
            int v = rows.length;

            int[][] adjMatrix = new int[v][v];
            for (int i = 0; i < v; i++) {
                String[] row = rows[i].trim().split(" ");
                for (int j = 0; j < v; j++) {
                    adjMatrix[i][j] = Integer.parseInt(row[j]);
                }
            }

            Prims prims = new Prims(v, adjMatrix);
            prims.applyPrims();

        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}
