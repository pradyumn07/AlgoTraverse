
import java.util.*;

public class DFS {

    int v;
    int[][] graph;
    List<Integer> visitedOrder = new ArrayList<>(); // ✅ Track visited nodes

    DFS(int v) {
        this.v = v;
        this.graph = new int[v][v];
    }

    void dfsUtil(int start, boolean[] visited, int[] parent) {
        visited[start] = true;
        visitedOrder.add(start);  // ✅ Add node to visited order

        for (int i = 0; i < v; i++) {
            if (graph[start][i] != 0 && !visited[i]) {
                parent[i] = start; 
                System.out.println(start + "-" + i);  // ✅ For animation
                dfsUtil(i, visited, parent);
            }
        }
    }

    void dfs() {
        int[] parent = new int[v];
        boolean[] visited = new boolean[v];

        Arrays.fill(visited, false);
        Arrays.fill(parent, -1);
        dfsUtil(0, visited, parent);

        // ✅ Print visited order at the end
        System.out.println("VISITED");
        for (int node : visitedOrder) {
            System.out.println(node);
        }
    }

    public static void main(String[] args) {
        if (args.length < 1) {
            System.out.println("Usage: java DFS <adj_matrix_values>");
            return;
        }

        try {
            String graphInput = args[0];
            String[] rows = graphInput.split(",");
            int v = rows.length;

            DFS graph = new DFS(v);
            for (int i = 0; i < v; i++) {
                String[] row = rows[i].trim().split(" ");
                for (int j = 0; j < v; j++) {
                    graph.graph[i][j] = Integer.parseInt(row[j]);
                }
            }

            graph.dfs();

        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}
