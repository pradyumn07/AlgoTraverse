    import React, { useEffect, useRef, useState } from 'react'
    import { DataSet } from 'vis-data';
    import { Network } from 'vis-network'
    import Features from './features/Features';

    import axios from 'axios'
    import toast from 'react-hot-toast';
    import { ArrowDownward, Egg, Refresh } from '@mui/icons-material';

    export default function Graph() {
        const canvasRef = useRef();
        const [network, setNetwork] = useState(null);
        const [edges, setEdges] = useState(new DataSet());
        const [nodes, setNodes] = useState(new DataSet());
        const [GraphType1, setGraphType1] = useState(2);
        const [GraphType2, setGraphType2] = useState(2);
        const [graphSelected, setGraphSelected] = useState(false);
        const [nodeCount, setNodeCount] = useState(0);
        const [GraphDetails, setGraphDetails] = useState({
            directed: false,
            weighted: false
        })


        useEffect(() => {
            const container = canvasRef.current;
            const data = { nodes: nodes, edges: edges };
            const options = {
                nodes: {
                    shape: "dot",
                    size: 16,
                    font: { size: 14, color: "#000000" },
                    color: { background: "skyblue", border: "#e9e9e9" },
                },
                edges: {
                    width: 3,
                    smooth: false,
                    color: "#e9e9e9",
                    arrows: { to: { enabled: GraphDetails.directed, scaleFactor: 0.7 } },
                    font: { size: 14, align: "top" },
                },
                physics: { enabled: false },
                manipulation: {
                    enabled: true,
                    addEdge: true,
                    deleteEdge: true,
                    editEdge: true
                },
            };
            if (!network && graphSelected) {
                console.log("Hello")
                const newNetwork = new Network(container, data, options);
                setNetwork(newNetwork);
            } else if (graphSelected) {
                network.on("click", (event) => {
                    if (event.nodes.length > 0) {
                        const nodeId = event.nodes[0];
                        console.log(nodeId);

                    } else {
                        console.log("Clicked Outside");
                    }
                })
            }
        }, [nodes, edges, GraphDetails]);


        return (
            <section className='flex text-gray-900 font-[Poppins] h-[calc(100vh-56px-16px)] w-full' >
                <button type='submit' onClick={() => { window.location.reload() }} className='text-gray-900 absolute right-10 cursor-pointer top-[100px]' ><Refresh /></button>
                <div className='flex flex-1 relative w-full flex-col gap-4 p-3'>
                    <span className='text-gray-900 absolute bottom-5 ml-2 z-50 font-semibold pl-2 ' >Graph with Nodes & Edges</span>
                    <span className='text-gray-900 absolute right-10 z-50 mt-2 font-semibold pl-2 ' >
                        <div className='flex gap-2 items-center' >
                            <div className="flex h-7 w-7 rounded-full bg-blue-400"></div>
                            <span className='text-sm' >Vertice / Node</span>
                        </div>

                        <div className='flex items-center gap-2' >
                            <div className='w-10 h-1 bg-gray-900' ></div>
                            <span className='text-sm'>Edges </span>
                        </div>
                    </span>
                    <div ref={canvasRef} className='h-full bg-white shadow-lg rounded-lg' ></div>
                    {/* <Features /> */}
                </div>
                <div className='flex-[0.5] p-3' >
                    {!graphSelected &&
                        <Taskar setGraphSelected={setGraphSelected} setGraphDetails={setGraphDetails} setGraphType1={setGraphType1} setGraphType2={setGraphType2} GraphType1={GraphType1} GraphType2={GraphType2} />
                    }
                    {
                        graphSelected &&
                        <HandelGraph edges={edges} GraphDetails={GraphDetails} nodes={nodes} setNodes={setNodes} />
                    }
                </div>
            </section>
        )
    }







    const HandelGraph = ({ nodes, setNodes, GraphDetails, edges }) => {
        const [option, setOption] = useState(1);
        const [nodeCount, setNodeCount] = useState(0);
        const [edgeCount, setEdgeCount] = useState(0);
        const [algorithmn, setAlgorithmn] = useState(1);
        const [from, setFrom] = useState(null);
        const [to, setTo] = useState(null);
        const [weight, setWeight] = useState(null);
        const [nodeToDelete, setNodeToDelete] = useState('');
        const [path, setPath] = useState([]);
        const [source, setSource] = useState(0);
        const [destination, setDestination] = useState(0);
        const [minCost, setMinCost] = useState(null);

        // Handle action selection
        const [fetching, setFetching] = useState(false);
        const [visitedOrder, setVisitedOrder] = useState([]);


        useEffect(() => {
            console.log(GraphDetails)
        }, [GraphDetails])
        const handleOptionChange = (e) => {
            const selectedOption = parseInt(e.target.value, 10);
            setOption(selectedOption);
        };

        // Visulaisation Logic Starts
        // Making API Call to backend

        const handelVisualisation = async () => {
            await Visulaisation();
            setFetching(false);

        }
        const Visulaisation = async () => {
            try {
                setFetching(true);
                const baseurl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

                let graphMatrix;
                if (GraphDetails.directed == true) {
                    graphMatrix = createAdjacencyMatrixDirected(nodes, edges);
                } else {
                    graphMatrix = createAdjacencyMatrixUnDirected(nodes, edges);
                }
                graphMatrix = MatToStr(graphMatrix);
                let stringToPass = String(graphMatrix);

                if (algorithmn == 0) {
                    await axios.get(baseurl + `/dijkstra?graph="${stringToPass}"&source="${source}"&destination="${destination}"`)
                        .then(data => dijkstrasTraversal(data.data.stdout))
                        .catch(err => console.log(err));
                } else if (algorithmn == 1) {
                    await axios.get(baseurl + `/prims?graph="${stringToPass}"`)
                        .then(data => {
        animatePrimsMST (data.data.steps,data.data.visited);
        setVisitedOrder(data.data.visited);   // ✅ Save visited nodes
    })
                        .catch(err => toast.error("Failed to visualise"));
                } else if (algorithmn == 2) {
                    await axios.get(baseurl + `/bfs?graph="${stringToPass}"`)
        .then(data => {
            animateTraversalSteps(data.data.steps);
            setVisitedOrder(data.data.visited);   // ✅ set visited order for BFS
        })
        .catch(err => console.log(err));

                } else if (algorithmn == 3) {
                    await axios.get(baseurl + `/dfs?graph="${stringToPass}"`)
                        .then(data => {
            animateDFS(data.data.steps);
            setVisitedOrder(data.data.visited);   // ✅ set visited order for DFS
        })
                        .catch(err => console.log(err));
                }
            } catch (e) {
                toast.error('Failed');
                console.log(e);
            }
        }

        // Add a new edge
        const handelEdge = () => {
            if (!from || !to || (!weight && GraphDetails.weighted)) {
                alert("All fields are required!");
                return;
            }
            if (from >= nodeCount || to >= nodeCount || from < 0 || to < 0 || weight <= 0) {
                alert("Please Enter A Valid edge")
                return;
            }
            if (to == from) {
                alert('No Loops Allowed')
                return;
            }
            let newEdge
            if (GraphDetails.weighted) {
                newEdge = { id: edgeCount, from, to, label: String(weight) };
            } else {
                newEdge = { id: edgeCount, from, to, label: String(1) };
            }

            // Check if edge already exists
            let existingEdge;
            if (GraphDetails.directed) {
                existingEdge = edges.get({
                    filter: (edge) =>
                        (edge.from === from && edge.to === to)
                });
            } else {
                existingEdge = edges.get({
                    filter: (edge) =>
                        (edge.from === from && edge.to === to) ||
                        (edge.from === to && edge.to === from)
                });
            }
            if (existingEdge.length > 0) {
                alert("Edge already exists!");
                return;
            }
            setEdgeCount((prev) => prev + 1);
            edges.add(newEdge);
            console.log("Edge added:", newEdge);

            // Reset the form fields
            setFrom('');
            setTo('');
            setWeight('');
        };


        // Update an existing edge
        const updateEdge = () => {
            if (!from || !to || !weight) {
                alert("All fields (From, To, Weight) are required to update an edge!");
                return;
            }
            if (weight <= 0) {
                alert("Please enter valid weight")
                return;
            }
            // Locate the existing edge
            const existingEdge = edges.get({
                filter: (edge) => edge.from === from && edge.to === to,
            });

            if (existingEdge.length > 0) {
                const updatedEdge = { ...existingEdge[0], label: String(weight) };
                edges.update(updatedEdge);
                alert(`Edge (${from} -> ${to}) updated successfully!`);
            } else {
                alert("Edge not found!");
            }

            // Reset the form fields
            setFrom('');
            setTo('');
            setWeight('');
        };

        // Delete an edge
        const deleteEdge = () => {
            if (!from || !to) {
                toast.error("Both 'From' and 'To' fields are required to delete an edge!");
                return;
            }

            const existingEdge = edges.get({
                filter: (edge) => edge.from == from && edge.to == to ||
                    (GraphDetails.directed && edge.from == to && edge.to == from)
            });
            if (existingEdge.length > 0) {
                edges.remove(existingEdge);
                console.log("Edge deleted:", existingEdge);
                toast.error("Delete Edge Successfully")
            } else {
                alert("Edge not found!");
            }

            // Reset the form fields
            setFrom('');
            setTo('');
        };

        // Add a new vertex
        const addNode = () => {
            const newNode = {
                id: nodeCount,
                label: `V ${nodeCount}`,
            };

            nodes.add(newNode);
            console.log("Node added:", newNode);

            setNodeCount((prev) => prev + 1);
        };


        const deleteNode = () => {
            if (!nodeToDelete) {
                toast.error("Please Select a Vertice First");
                return;
            }
            const node = nodes.get({ filter: (node) => node.id === nodeToDelete });
            if (node.length > 0) {
                nodes.remove(node);
            }


        }
        const animatePrimsMST = (edgesList = [], visitedNodes = [], timeout = 1000) => {
    if (!edgesList.length) return;

    let step = 0;

    const highlightEdge = (from, to) => {
        const edge = edges.get({
            filter: (e) =>
                (e.from === from && e.to === to) ||
                (!GraphDetails.directed && e.from === to && e.to === from)
        })[0];
        if (edge) {
            edges.update({
                id: edge.id,
                color: { color: "#00cc44" }, // green for MST
                width: 5,
            });
        }
    };

    const highlightNode = (id, color) => {
        nodes.update({
            id,
            color: { background: color, border: "#004400" },
        });
    };

    // First mark starting node
    if (visitedNodes.length > 0) {
        highlightNode(visitedNodes[0], "#ffa500"); // orange start
    }

    const runStep = () => {
        if (step >= edgesList.length) return;

        const [from, to] = edgesList[step].split('-').map(Number);
        highlightEdge(from, to);

        if (visitedNodes[step + 1] !== undefined) {
            highlightNode(visitedNodes[step + 1], "#ff69b4"); // pink visited
        }

        step++;
        setTimeout(runStep, timeout);
    };

    runStep();
};

        const animateDFS = (steps = [], timeout = 1000, onFinish = () => {}) => {
    if (!steps.length) {
        console.log("No DFS steps to animate");
        return;
    }

    console.log("Animating DFS:", steps);

    let stepIndex = 0;

    const resetColors = () => {
        const allNodeIds = nodes.get().map(n => n.id);
        allNodeIds.forEach(id => {
            nodes.update({
                id,
                color: { background: "skyblue", border: "#e9e9e9" },
            });
        });

        const allEdgeIds = edges.get().map(e => e.id);
        allEdgeIds.forEach(id => {
            edges.update({
                id,
                color: { color: "#e9e9e9" },
                width: 3,
            });
        });
    };

    const runStep = () => {
        if (stepIndex >= steps.length) {
            // Finished animation
            setTimeout(() => resetColors(), timeout * 2);
            onFinish();
            return;
        }

        const [from, to] = steps[stepIndex].split('-').map(Number);
        console.log(`DFS Step ${stepIndex + 1}: ${from} -> ${to}`);

        // 1️⃣ Highlight the edge first
        const edge = edges.get({
            filter: (e) =>
                (e.from === from && e.to === to) ||
                (!GraphDetails.directed && e.from === to && e.to === from)
        })[0];
        if (edge) {
            edges.update({
                id: edge.id,
                color: { color: "#0080ff" }, // blue edge for DFS
                width: 5,
            });
        }

        // 2️⃣ Highlight the 'from' node as current
        const fromNode = nodes.get({ filter: (n) => n.id === from })[0];
        if (fromNode) {
            nodes.update({
                id: fromNode.id,
                color: { background: "#ffa500", border: "#ff7f00" }, // orange for current node
            });
        }

        // 3️⃣ After half delay, mark 'to' node as visited
        setTimeout(() => {
            const toNode = nodes.get({ filter: (n) => n.id === to })[0];
            if (toNode) {
                nodes.update({
                    id: toNode.id,
                    color: { background: "#9370db", border: "#6a0dad" }, // purple for visited
                });
            }

            stepIndex++;
            setTimeout(runStep, timeout);
        }, timeout / 2);
    };

    resetColors(); // clear colors before starting
    runStep();
};



        const visualizeTraversal = (path = [], timeout = 400) => {
            console.log(path);
        
            const highlightedEdges = [];
            const highlightedNodes = path;
        
            for (let i = 1; i < path.length; i += 2) {
                const edge = { from: path[i - 1], to: path[i] };
                highlightedEdges.push(edge);
            }
        
            console.log("Edges to Highlight:", highlightedEdges);
        
            // Highlight nodes one by one
            highlightedNodes.forEach((nodeId, index) => {
                setTimeout(() => {
                    const node = nodes.get({ filter: (node) => node.id === nodeId })[0];
                    if (node) {
                        nodes.update({
                            id: node.id,
                            color: { background: "pink", border: "#e9e9e9" },
                        });
                    } else {
                        console.log("Node not found:", nodeId);
                    }
                }, index * timeout);
            });
        
            // Highlight edges all at once after nodes are highlighted
            setTimeout(() => {
                highlightedEdges.forEach(edgeInfo => {
                    const edge = edges.get({
                        filter: (edge) =>
                            (edge.from == edgeInfo.from && edge.to == edgeInfo.to) ||
                            (edge.from == edgeInfo.to && edge.to == edgeInfo.from && !GraphDetails.directed),
                    })[0];
                    if (edge) {
                        edges.update({
                            id: edge.id,
                            color: { color: "pink", border: "#e9e9e9" },
                        });
                    } else {
                        console.log("Edge not found:", edgeInfo);
                    }
                });
        
                // Reset colors after highlighting
                setTimeout(() => {
                    highlightedNodes.forEach(nodeId => {
                        const node = nodes.get({ filter: (node) => node.id === nodeId })[0];
                        if (node) {
                            nodes.update({
                                id: node.id,
                                color: { background: "skyblue", border: "#0000FF" },
                            });
                        }
                    });
        
                    highlightedEdges.forEach(edgeInfo => {
                        const edge = edges.get({
                            filter: (edge) =>
                                (edge.from == edgeInfo.from && edge.to == edgeInfo.to) ||
                                (edge.from == edgeInfo.to && edge.to == edgeInfo.from && !GraphDetails.directed),
                        })[0];
                        if (edge) {
                            edges.update({
                                id: edge.id,
                                color: { color: "#e9e9e9", border: "#0000FF" },
                            });
                        }
                    });
                }, timeout * highlightedNodes.length);
            }, timeout * highlightedNodes.length);
        };
        
        const animateTraversalSteps = (steps = [], timeout = 1000, onFinish = () => {}) => {
        if (!steps.length) {
            console.log("No BFS steps to animate");
            return;
        }

        console.log("Animating BFS:", steps);

        let stepIndex = 0;

        const resetColors = () => {
            const allNodeIds = nodes.get().map(n => n.id);
            allNodeIds.forEach(id => {
                nodes.update({
                    id,
                    color: { background: "skyblue", border: "#e9e9e9" },
                });
            });

            const allEdgeIds = edges.get().map(e => e.id);
            allEdgeIds.forEach(id => {
                edges.update({
                    id,
                    color: { color: "#e9e9e9" },
                    width: 3,
                });
            });
        };

        const runStep = () => {
            if (stepIndex >= steps.length) {
                // Finished animation
                setTimeout(() => resetColors(), timeout * 2);
                onFinish();
                return;
            }

            const [from, to] = steps[stepIndex].split('-').map(Number);
            console.log(`Step ${stepIndex + 1}: Visiting ${from} -> ${to}`);

            // 1️⃣ Highlight the edge first
            const edge = edges.get({
                filter: (e) =>
                    (e.from === from && e.to === to) ||
                    (!GraphDetails.directed && e.from === to && e.to === from)
            })[0];
            if (edge) {
                edges.update({
                    id: edge.id,
                    color: { color: "#ff7f00" }, // orange edge
                    width: 5,
                });
            }

            // 2️⃣ Highlight the 'from' node as "current"
            const fromNode = nodes.get({ filter: (n) => n.id === from })[0];
            if (fromNode) {
                nodes.update({
                    id: fromNode.id,
                    color: { background: "#ffb347", border: "#ff7f00" }, // orange for current node
                });
            }

            // 3️⃣ After half delay, highlight the 'to' node as visited
            setTimeout(() => {
                const toNode = nodes.get({ filter: (n) => n.id === to })[0];
                if (toNode) {
                    nodes.update({
                        id: toNode.id,
                        color: { background: "#ff69b4", border: "#e91e63" }, // pink for visited
                    });
                }

                // Move to next step
                stepIndex++;
                setTimeout(runStep, timeout);
            }, timeout / 2);
        };

        resetColors();  // reset before starting
        runStep();
    };



        const dijkstrasTraversal = async (path = []) => {
            const highlightedEdges = [];
            const highlightedNodes = path;

            for (let i = 1; i < path.length; i++) {
                const edge = { from: path[i - 1], to: path[i] };
                highlightedEdges.push(edge);
            }

            const resetColors = () => {
                highlightedNodes.forEach((item) => {
                    const node = nodes.get({ filter: (n) => n.id == item });
                    if (node) {
                        nodes.update({
                            id: item,
                            color: { background: "skyblue", border: "#e9e9e9" },
                        });
                    }
                });


                highlightedEdges.forEach((item) => {
                    const edge = edges.get({
                        filter: (e) => (e.from == item.from && e.to == item.to) ||
                            (e.from == item.to && e.to == item.from && !GraphDetails.directed)
                    })[0];
                    if (edge) {
                        edges.update({
                            id: edge.id,
                            color: { color: "#e9e9e9" },
                            width: 3,
                            dashes: false,
                        });
                    }
                });
            };

            for (let i = 0; i < highlightedNodes.length; i++) {
                const node = nodes.get({ filter: (n) => n.id == highlightedNodes[i] });
                if (node) {
                    nodes.update({
                        id: highlightedNodes[i],
                        color: { background: "pink", border: "pink" },
                    });
                }

                if (i < highlightedEdges.length) {
                    console.log(highlightedEdges[i]);
                    const edge = edges.get({
                        filter: (e) => (e.from == highlightedEdges[i].from && e.to == highlightedEdges[i].to) ||
                            (e.from == highlightedEdges[i].to && e.to == highlightedEdges[i].from && !GraphDetails.directed)
                    })[0];
                    console.log("No edge found")
                    if (edge) {
                        console.log(edge);
                        edges.update({
                            id: edge.id,
                            color: { color: "pink" },
                            width: 5,
                        });
                    }
                }

                await new Promise(resolve => setTimeout(resolve, 400));
            }

            resetColors();
        };


        return (
            <div className="p-6 text-gray-900 bg-white rounded-lg shadow-md space-y-4">
                <div className="mb-4">
                    <h1 className="text-xl font-bold text-gray-800 mb-4">Graph Actions</h1>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Select Action</label>
                    <select
                        value={option}
                        onChange={handleOptionChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-800 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    >
                        <option value="1">Add Vertex</option>
                        <option value="2">Add Edge</option>
                        {
                            GraphDetails.weighted &&
                            <option value="3">Edit Edge</option>
                        }
                        <option value="4">Delete Edge</option>
                        {/* <option value="5">Delete Vertex</option> */}
                        <option value="6">Visualize</option>
                    </select>
                </div>

                <div className="p-4 bg-white rounded-lg shadow-sm space-y-4">
                    {/* Add Vertex */}
                    {option === 1 && (
                        <button
                            onClick={addNode}
                            className="w-full text-sm bg-gray-900 hover:bg-gray-800 text-white rounded-lg px-4 py-2 transition"
                        >
                            Add Vertex
                        </button>
                    )}
                    {/* Add or Edit Edge */}
                    {(option === 2) && (
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                                placeholder="From"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                placeholder="To"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {
                                GraphDetails.weighted &&
                                <input
                                    type="text"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    placeholder="Weight"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            }
                            <button
                                onClick={option === 2 ? handelEdge : updateEdge}
                                className="w-full text-sm bg-gray-900 hover:bg-gray-800 text-white rounded-lg px-4 py-2 transition"
                            >
                                {option === 2 ? "Add Edge" : "Update Edge"}
                            </button>
                        </div>
                    )}
                    {(option === 3 && GraphDetails.weighted) && (
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                                placeholder="From"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                placeholder="To"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {
                                GraphDetails.weighted &&
                                <input
                                    type="text"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    placeholder="Weight"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            }
                            <button
                                onClick={option === 2 ? handelEdge : updateEdge}
                                className="w-full text-sm bg-gray-900 hover:bg-gray-800 text-white rounded-lg px-4 py-2 transition"
                            >
                                {option === 2 ? "Add Edge" : "Update Edge"}
                            </button>
                        </div>
                    )}
                    {/* Delete Edge */}
                    {option === 4 && (
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                                placeholder="From"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                placeholder="To"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={deleteEdge}
                                className="w-full text-sm bg-gray-900 hover:bg-gray-800 text-white rounded-lg px-4 py-2 transition"
                            >
                                Delete Edge
                            </button>
                        </div>
                    )}
                    {option === 5 && (
                        <>
                            <input
                                type="text"
                                value={nodeToDelete}
                                onChange={(e) => setNodeToDelete(e.target.value)}
                                placeholder="Enter Node to Delete"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={deleteNode}
                                className="w-full text-sm bg-gray-900 hover:bg-gray-800 text-white rounded-lg px-4 py-2 transition"
                            >
                                Delete Node
                            </button>
                        </>
                    )}

                    {/* Visualize */}
                    {option === 6 && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Choose Algorithm</label>

                            <select value={algorithmn} onChange={(e) => { setAlgorithmn(e.target.value) }} className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-800 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">

                                {
                                    GraphDetails.weighted &&
                                    <option value="0">Dijkstra</option>
                                }
                                <option value="1">Prim's MST</option>
                                <option value="2">BFS</option>
                                <option value="3">DFS</option>
                            </select>
                            <button disabled={fetching} onClick={handelVisualisation} className="w-full text-sm bg-gray-900 hover:bg-gray-800 text-white rounded-lg px-4 py-2 transition">
                                Run
                            </button>
                            {
                                algorithmn == 0 && (
                                    <>
                                        <h1>Choose Source & Destination</h1>
                                        <div className="flex gap-2">
                                            <input value={source} onChange={(e) => { setSource(e.target.value) }} type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-800 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder='Source' />
                                            <input value={destination} onChange={(e) => { setDestination(e.target.value) }} type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-800 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder='Destination' />
                                        </div>
                                    </>
                                )
                            }
                        </div>
                        

                    )}
                </div>
                {visitedOrder.length > 0 && (
    <div className="mt-4 p-2 bg-gray-100 rounded">
        <h3 className="font-bold text-gray-800">Visited Nodes Order:</h3>
        <div className="flex gap-2 mt-2">
            {visitedOrder.map((node, idx) => (
                <span key={idx} className="px-3 py-1 bg-blue-200 rounded">
                    V{node}
                </span>
            ))}
        </div>
    </div>
)}
            </div>
        );
    };




    /* User Task Bar containing all options related to project */
    // User Task Bar Starts
    const Taskar = ({ setGraphSelected, setGraphDetails, setGraphType1, setGraphType2, GraphType1, GraphType2 }) => {


        const handelClick = () => {
            setGraphDetails({
                directed: GraphType1 == 1 ? true : false,
                weighted: GraphType2 == 1 ? true : false
            })
            setGraphSelected(true);
            console.log(GraphType1);
            console.log(GraphType2);
        }
        return (
            <div className="p-8 font-[Poppins] bg-gradient-to-r  bg-white rounded-2xl shadow-lg">
                <h1 className="text-xl font-bold  mb-6">Task Bar</h1>
                <div className="flex flex-wrap gap-6">
                    {/* Graph Type Selection */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium te-700 mb-2">
                            Select Graph Type
                        </label>
                        <select
                            value={GraphType1}
                            onChange={(e) => setGraphType1(e.target.value)}
                            className="border bord-300 rounded-lg px-4 py-2 bg-white te-800 hover:bord-400 focus:outline-none focus:ring-2 focus:ri-500 transition"
                        >
                            <option value="2">Undirected</option>
                            <option value="1">Directed</option>
                        </select>
                    </div>

                    {/* Graph Weight Type Selection */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium te-700 mb-2">
                            Select Weight Type
                        </label>
                        <select
                            value={GraphType2}
                            onChange={(e) => setGraphType2(e.target.value)}
                            className="border bord-300 rounded-lg px-4 py-2 bg-white te-800 hover:bord-400 focus:outline-none focus:ring-2 focus:ri-500 transition"
                        >
                            <option value="1">Weighted</option>
                            <option value="2">Unweighted</option>
                        </select>
                    </div>
                </div>

                {/* Apply Action Button */}
                <div className="mt-8">
                    <button
                        onClick={handelClick}
                        className="w-full teext-sm  bg-gray-900 md:w-auto px-8 py-1 text-white bg-gray-9000 rounded-lg shadow-lg hover:opacity-30 focus:outline-none  transition font-semibold"
                    >
                        Apply Action
                    </button>
                </div>
            </div>
        );
    };

    // User Task Bar ends


    // Helper Functions Starts
    const createAdjacencyMatrixUnDirected = (nodes, edges, isDirected = false) => {
        const nodeIds = nodes.map(node => node.id); // Extract node IDs
        const n = nodeIds.length;

        // Create a mapping of node IDs to matrix indices
        const nodeIndexMap = {};
        nodeIds.forEach((id, index) => {
            nodeIndexMap[id] = index;
        });

        // Initialize the adjacency matrix with zeros
        const adjacencyMatrix = Array.from({ length: n }, () => Array(n).fill(0));

        // Populate the adjacency matrix based on edges
        edges.forEach(edge => {
            const fromIndex = nodeIndexMap[edge.from];
            const toIndex = nodeIndexMap[edge.to];
            const weight = edge.label || 1; // Default weight is 1

            adjacencyMatrix[fromIndex][toIndex] = weight;

            // If the graph is undirected, also update the reverse edge
            if (!isDirected) {
                adjacencyMatrix[toIndex][fromIndex] = weight;
            }
        });

        return adjacencyMatrix;
    };


    const createAdjacencyMatrixDirected = (nodes, edges, isDirected = true) => {
        const nodeIds = nodes.map(node => node.id);
        const n = nodeIds.length;

        const nodeIndexMap = {};
        nodeIds.forEach((id, index) => {
            nodeIndexMap[id] = index;
        });

        const adjacencyMatrix = Array.from({ length: n }, () => Array(n).fill(0));

        edges.forEach(edge => {
            const fromIndex = nodeIndexMap[edge.from];
            const toIndex = nodeIndexMap[edge.to];
            const weight = edge.label || 1;

            adjacencyMatrix[fromIndex][toIndex] = weight;

        });

        return adjacencyMatrix;
    };

    // Matrix to String 

    const MatToStr = (matrix = []) => {
        let string = "";

        for (let i = 0; i < matrix.length; i++) {
            string += matrix[i].join(" ");
            string += ","
        }
        let output = string.replace(/,$/, '');
        return output;
    }