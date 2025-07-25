import React from 'react'

export default function Features() {
    return (
     
            <div className="flex gap-8">
                <div className='flex flex-col gap-1'  >
                    <h1>Algorithmns Applied </h1>
                    <span className='text-sm' >BFS : <a className="italic text-sm text-blue-600" href='#'>Read More</a></span>
                    <span className='text-sm' >DFS : <a className="italic text-sm text-blue-600" href='#'>Read More</a></span>
                    <span className='text-sm' >Dijkstra : <a className="italic text-sm text-blue-600" href='#'>Read More</a></span>
                    <span className='text-sm' >Prims Algo : <a className="italic text-sm text-blue-600" href='#'>Read More</a></span>
                </div>
                <div className='flex flex-col gap-1' >
                    <h1 className='' >Instructions</h1>
                    <span className='text-sm italic' >Enter Graph Type  i.e that is directed or undirected , weighted or unweighted</span>
                    <span className='text-sm italic' >Navigate to taskbar </span>
                    <span className='text-sm italic' >Add vertex , edges , Use Ctrl Z & Ctrl Y for undo & redo  operations</span>
                    <span className='text-sm italic' >Visualise after selecting an algorithmn & get results</span>
                </div>
            </div>
    
    )
}
