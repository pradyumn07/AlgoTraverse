import React, { useEffect, useRef, useState } from 'react'
import { DataSet } from 'vis-data'
import { Network } from 'vis-network';

export default function GraphCanva() {

  const canavaRef = useRef(null);
  const [network, setNetwork] = useState(null);
  const [nodes] = useState(new DataSet([
    { label: "Node 1", id: 1 }
  ]));
  const [edges] = useState(new DataSet());

  useEffect(() => {
    const container = canavaRef.current;
    const data = { edges, nodes };
    const options = {
      nodes: {
        shape: 'dot',
        scaling: {
          min: 10,
          max: 30,
        },
      },
      edges: {
        smooth: true,
        width: 2,
        color: {
          inherit: true,
          color: 'rgba(0, 0, 0, 0.5)',
        },
      },

    }


    if (!network) {
      const newNetwork = new Network(container, data, options);
      setNetwork(newNetwork);
    }
  }, [nodes, edges])
  const fetchAlgo = async () => {

  }
  const visualisePath = async () => {

  }


  const AddNode = () => {

  }

  const AddEdge = () => {

  }

  const DeleteEdge = () => {

  }
  return (
    <div className='flex gap-2' >
      <div className='flex-1 h-96 border-2 border-black' ref={canavaRef} ></div>
      <section className='flex-[0.4] h-screen' >
        <Menu className="flex-[0.5] h-screen bg-black" />
      </section>
    </div>
  )
}


const Menu = () => {
  return (
    <section className='h-screen flex-2 p-5' >
      <div>
        <span className='text-lg font-medium' >Menu Bar</span>
      </div>
      <div>
      </div>
    </section>
  )
}