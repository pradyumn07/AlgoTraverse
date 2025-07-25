const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const cors = require('cors')

const app = express();
const PORT = 3001;
const allowedOrigins = ['http://localhost:3000','https://algotraverse-1.onrender.com']
// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors({origin: allowedOrigins, credentials: true}));


// Endpoint to run a prims
app.get('/prims', (req, res) => {
    const { graph } = req.query;
    console.log("Prim's graph:", graph);

    exec(`java Prims.java ${graph}`, (error, stdout, stderr) => {
        if (error) return res.status(500).json({ error: error.message });

        const lines = stdout.trim().split('\n');
        const steps = [];
        const visited = [];

        let readingVisited = false;
        for (const line of lines) {
            if (line.trim() === "VISITED") {
                readingVisited = true;
                continue;
            }
            if (!readingVisited) steps.push(line.trim());
            else visited.push(parseInt(line.trim()));
        }

        res.json({ steps, visited });
    });
});



app.get('/dfs', (req, res) => {
    const { graph } = req.query;
    console.log("Received DFS request with graph:", graph);

    // ✅ Compile then run
    exec(`javac DFS.java && java DFS ${graph}`, (error, stdout) => {
        if (error) {
            console.error(`Execution error: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }

        const lines = stdout.trim().split('\n');
        const steps = [];
        const visited = [];

        let readingVisited = false;
        for (const line of lines) {
            if (line.trim() === "VISITED") {
                readingVisited = true;
                continue;
            }
            if (!readingVisited) steps.push(line.trim());
            else visited.push(parseInt(line.trim()));
        }

        console.log("DFS steps:", steps);
        console.log("DFS visited:", visited);

        res.json({ steps, visited });
    });
});



app.get('/bfs', (req, res) => {
    const { graph } = req.query;
    console.log("Received BFS request with graph:", graph);

    exec(`java BFS.java ${graph}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Execution error: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }

        const lines = stdout.trim().split('\n');
        const steps = [];
        const visited = [];

        let readingVisited = false;
        for (const line of lines) {
            if (line.trim() === "VISITED") {
                readingVisited = true;
                continue;
            }
            if (!readingVisited) steps.push(line.trim());
            else visited.push(parseInt(line.trim()));
        }

        console.log("BFS steps:", steps);
        console.log("BFS visited:", visited);

        res.json({ steps, visited });
    });
});


app.get('/dijkstra', (req, res) => {

    const { graph, source, destination } = req.query;
    console.log(graph, source)
    console.log("java Dijkstra " + graph + " " + source)
    exec(`java Dijkstra.java ${graph} ${source} ${destination}`, (error, stdout, stderr) => {
        if (stderr) {
            console.error(`Error executing command: ${stderr}`);
            return res.status(500).json({ error: stderr });
        }
        console.log(stdout);
        let output = stdout.trim().split(' ').map((i) => parseInt(i));
        console.log(output); // This will print the array of integers
        res.json({
            message: 'Command executed successfully',
            stdout: output,
            stderr: stderr.trim(),
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


