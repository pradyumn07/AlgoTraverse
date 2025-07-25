package backend;

import java.util.Arrays;
import java.util.Comparator;
import java.util.PriorityQueue;

public class Dijkstra {

    int v;
    int[][] graph;

    Dijkstra(int v) {
        this.v = v;
        this.graph = new int[v][v];
    }

    public void SingleSourceShortestPath(int start, int destination) {
        int[] cost = new int[v];
        boolean[] visited = new boolean[v];
        int[] parent = new int[v];
        PriorityQueue<int[]> q = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));

        Arrays.fill(cost, Integer.MAX_VALUE);
        Arrays.fill(visited, false);
        Arrays.fill(parent, -1); // Initialize all parents to -1

        cost[start] = 0;
        q.add(new int[] { 0, start });

        while (!q.isEmpty()) {
            int[] current = q.poll();
            int u = current[1];

            if (visited[u])
                continue;
            visited[u] = true;

            for (int i = 0; i < v; i++) {
                if (graph[u][i] != 0 && !visited[i]) {
                    int newCost = cost[u] + graph[u][i];
                    if (newCost < cost[i]) {
                        cost[i] = newCost;
                        parent[i] = u; // Update the parent
                        q.add(new int[] { newCost, i });
                    }
                }
            }
        }

        // Check if destination is unreachable
        if (cost[destination] == Integer.MAX_VALUE) {
            System.err.println("Error: No path found between " + start + " and " + destination);
        } else {
            // Print the path from source to destination
            printPath(parent, destination);
            System.out.println(); // End the path with a newline
        }
    }

    private void printPath(int[] parent, int node) {
        if (node == -1) {
            return;
        }
        printPath(parent, parent[node]);
        System.out.print(node + " "); // Print the node in the path
    }

    public static void main(String[] args) {
        if (args.length < 3) {
            System.out.println("Usage: java Dijkstra <adj_matrix_values> <source> <destination>");
            System.out.println("Example: java Dijkstra \"0 3,0 0\" 0 3");
            return;
        }

        try {
            // Step 1: Parse the graph input string
            String graphInput = args[0];
            String[] rows = graphInput.split(",");  // Split by commas to get each row of the adjacency matrix
            int v = rows.length;  // Number of vertices (equal to the number of rows)

            // Step 2: Parse each row into the graph's adjacency matrix
            Dijkstra graph = new Dijkstra(v);
            for (int i = 0; i < v; i++) {
                String[] row = rows[i].trim().split(" ");  // Split each row by spaces to get the values
                for (int j = 0; j < v; j++) {
                    graph.graph[i][j] = Integer.parseInt(row[j]);
                }
            }

            // Step 3: Parse the source and destination
            int source = Integer.parseInt(args[1]);  // Source node
            int destination = Integer.parseInt(args[2]);  // Destination node

            // Step 4: Run Dijkstra's algorithm to find the shortest path
            graph.SingleSourceShortestPath(source, destination);

        } catch (NumberFormatException e) {
            System.out.println("Error: Invalid number format in the adjacency matrix or source/destination.");
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}
