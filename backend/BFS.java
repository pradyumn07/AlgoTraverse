package backend;

import java.util.*;

public class BFS {
    public static void main(String[] args) {
        if (args.length == 0) {
            System.out.println("Please provide a 2D array input as arguments");
            return;
        }

        String input = args[0];
        String[] rows = input.split(",");
        int[][] graph = new int[rows.length][];

        for (int i = 0; i < rows.length; i++) {
            String[] cols = rows[i].trim().split(" ");
            graph[i] = new int[cols.length];
            for (int j = 0; j < cols.length; j++) {
                graph[i][j] = Integer.parseInt(cols[j]);
            }
        }

        bfs(graph, 0);
    }

    public static void bfs(int[][] graph, int startNode) {
        int numNodes = graph.length;
        boolean[] visited = new boolean[numNodes];
        int[] parent = new int[numNodes];
        Arrays.fill(parent, -1);

        List<Integer> visitedOrder = new ArrayList<>();
        Queue<Integer> queue = new LinkedList<>();

        visited[startNode] = true;
        queue.add(startNode);
        visitedOrder.add(startNode);

        while (!queue.isEmpty()) {
            int currentNode = queue.poll();

            for (int neighbor = 0; neighbor < numNodes; neighbor++) {
                if (graph[currentNode][neighbor] != 0 && !visited[neighbor]) {
                    queue.add(neighbor);
                    visited[neighbor] = true;
                    parent[neighbor] = currentNode;
                    visitedOrder.add(neighbor);  // ✅ Track visited order
                    System.out.println(currentNode + "-" + neighbor);  // For animation
                }
            }
        }

        // ✅ Print visited order after traversal
        System.out.println("VISITED");
        for (int node : visitedOrder) {
            System.out.println(node);
        }
    }
}
