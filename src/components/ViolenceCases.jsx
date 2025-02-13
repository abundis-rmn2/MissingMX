import React, { useMemo, useState, useEffect, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d'; // For 2D network graph
import { useData } from '../context/DataContext';
import getFilteredFeatures from '../context/FilteredFeatures';

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7300', 
  '#d84848', '#6b486b', '#98abc5', '#8a89a6'
];

const ViolenceCases = () => {
  const { 
    selectedDate,
    daysRange,
    map,
    selectedSexo,
    selectedCondicion,
    edadRange,
    sumScoreRange
  } = useData();

  const [currentRoot, setCurrentRoot] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const graphRef = useRef();
  const hasCenteredRef = useRef(false);

  // Generate graph data
  const treeMapData = useMemo(() => {
    const features = getFilteredFeatures(
      map, 
      selectedDate, 
      daysRange, 
      selectedSexo, 
      selectedCondicion, 
      edadRange, 
      sumScoreRange
    ).filter(feature => feature.properties.tipo_marcador === 'cedula_busqueda');

    const termGroups = {};
    const caseGroups = {};

    features.forEach(feature => {
      const terms = feature.properties.violence_terms?.split(', ') || [];
      const caseId = feature.properties.nombre_completo; // Unique identifier for the case

      // Create case node if it doesn't exist
      if (!caseGroups[caseId]) {
        caseGroups[caseId] = {
          id: caseId,
          name: feature.properties.nombre_completo,
          type: 'case',
          date: feature.properties.fecha_desaparicion,
          location: feature.properties.municipio,
          description: feature.properties.descripcion_desaparicion,
          value: parseInt(feature.properties.violence_score) || 1,
          color: COLORS[1] // Default color for cases
        };
      }

      // Create term nodes and link them to the case
      terms.forEach(term => {
        if (!termGroups[term]) {
          termGroups[term] = {
            id: term,
            name: term,
            type: 'term',
            value: 0,
            color: COLORS[0] // Default color for terms
          };
        }
        termGroups[term].value += caseGroups[caseId].value; // Aggregate value for terms
      });
    });

    // Convert groups to nodes and links
    const nodes = Object.values(termGroups).concat(Object.values(caseGroups));
    const links = [];

    features.forEach(feature => {
      const terms = feature.properties.violence_terms?.split(', ') || [];
      const caseId = feature.properties.nombre_completo;

      terms.forEach(term => {
        links.push({
          source: term,
          target: caseId
        });
      });
    });

    // Filter out orphan nodes
    const linkedNodeIds = new Set(links.flatMap(link => [link.source, link.target]));
    const filteredNodes = nodes.filter(node => linkedNodeIds.has(node.id));

    return { nodes: filteredNodes, links };
  }, [map, selectedDate, daysRange, selectedSexo, selectedCondicion, edadRange, sumScoreRange]);

  // Update graph data when treeMapData changes
  useEffect(() => {
    setGraphData(treeMapData);
  }, [treeMapData]);

  // Center the graph initially
  useEffect(() => {
    if (graphRef.current && !hasCenteredRef.current) {
      graphRef.current.zoomToFit(400);
      hasCenteredRef.current = true;
    }
  }, [graphData]);

  // Handle node click
  const handleNodeClick = (node) => {
    if (node.type === 'term') {
      setCurrentRoot(node);
    } else if (node.type === 'case') {
      setSelectedCase(node);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (selectedCase) {
      setSelectedCase(null);
    } else if (currentRoot) {
      setCurrentRoot(null);
    }
  };

  // Custom node rendering
  const nodeCanvasObject = (node, ctx, globalScale) => {
    const label = node.name;
    const fontSize = node.type === 'term' ? 16 : 12; // Larger font for terms
    const nodeSize = node.type === 'term' ? 20 : 10; // Double size for terms

    ctx.fillStyle = node.color;
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI, false);
    ctx.fill();

    // Draw label
    ctx.font = `${fontSize}px Sans-Serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000';
    ctx.fillText(label, node.x, node.y);

    // Draw legend for term nodes
    if (node.type === 'term') {
      ctx.fillStyle = '#000';
      ctx.fillText('Term', node.x, node.y + nodeSize + 10);
    }
  };

  if (!graphData.nodes.length) {
    return <div>No violence terms data available</div>;
  }

  if (selectedCase) {
    return (
      <div className="violence-cases-container">
        <button className="back-button" onClick={handleBack}>
          ← Back to Cases
        </button>
        <h3>Case Details</h3>
        <div className="case-details">
          <p><strong>Name:</strong> {selectedCase.name}</p>
          <p><strong>Date:</strong> {selectedCase.date || 'N/A'}</p>
          <p><strong>Location:</strong> {selectedCase.location || 'N/A'}</p>
          <p><strong>Description:</strong> {selectedCase.description || 'N/A'}</p>
        </div>
      </div>
    );
  }

  if (currentRoot) {
    // Filter graph data to show only cases linked to the selected term
    const filteredNodes = graphData.nodes.filter(node => 
      node.type === 'case' && graphData.links.some(link => 
        link.source === currentRoot.id && link.target === node.id
      )
    );
    const filteredLinks = graphData.links.filter(link => 
      filteredNodes.some(node => node.id === link.target)
    );

    return (
      <div className="violence-cases-container" style={{ height: '400px', width: '25rem' }}>
        <button className="back-button" onClick={handleBack}>
          ← Back to Terms
        </button>
        <h3>Cases for {currentRoot.name}</h3>
        <ForceGraph2D
          ref={graphRef}
          graphData={{ nodes: [currentRoot, ...filteredNodes], links: filteredLinks }}
          nodeLabel="name"
          nodeAutoColorBy="type"
          linkDirectionalArrowLength={3.5}
          linkDirectionalArrowRelPos={1}
          linkCurvature={0.25}
          onNodeClick={handleNodeClick}
          nodeCanvasObject={nodeCanvasObject}
        />
      </div>
    );
  }

  return (
    <div className="violence-cases-container" style={{ height: '400px', width: '25rem' }}>
      <h3>Most Common Violence Terms</h3>
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        nodeLabel="name"
        nodeAutoColorBy="type"
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
        linkCurvature={0.25}
        onNodeClick={handleNodeClick}
        nodeCanvasObject={nodeCanvasObject}
      />
    </div>
  );
};

export default ViolenceCases;