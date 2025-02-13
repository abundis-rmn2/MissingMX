import React, { useMemo, useState, useEffect } from 'react';
import { 
  SigmaContainer, 
  useLoadGraph,
  useRegisterEvents,
} from '@react-sigma/core';
import Graph from 'graphology';
import { circular } from 'graphology-layout';
import forceAtlas2 from 'graphology-layout-forceatlas2';
import "@react-sigma/core/lib/style.css";
import { useData } from '../context/DataContext';
import getFilteredFeatures from '../context/FilteredFeatures';

const styles = {
  mainContainer: {
    height: '300px',
    width: '100%',
  },
  graphContainer: {
    height: '300px',
    width: '100%',
    marginBottom: '20px',
    border: '1px solid #ddd',
  },
  sigma: {
    height: '300px',
    width: '100%',
    position: 'absolute'
  }
};

const COLORS = {
  TERM: '#8884d8',
  CASE: '#82ca9d'
};

const GraphEvents = ({ onNodeClick }) => {
  const registerEvents = useRegisterEvents();

  useEffect(() => {
    registerEvents({
      clickNode: (e) => onNodeClick(e.node)
    });
  }, [registerEvents, onNodeClick]);

  return null;
};

const LoadGraph = ({ graph }) => {
  const loadGraph = useLoadGraph();

  useEffect(() => {
    try {
      if (graph) {
        loadGraph(graph);
      }
    } catch (error) {
      console.error('Error loading graph:', error);
    }
  }, [graph, loadGraph]);

  return null;
};

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
  
    const graph = useMemo(() => {
      const graph = new Graph();
  
      const features = getFilteredFeatures(
        map, 
        selectedDate, 
        daysRange, 
        selectedSexo, 
        selectedCondicion, 
        edadRange, 
        sumScoreRange
      ).filter(feature => feature.properties.tipo_marcador === 'cedula_busqueda');
  
      features.forEach(feature => {
        const terms = (feature.properties.violence_terms || "").split(", ").filter(Boolean);
        const caseId = String(feature.properties.id_cedula_busqueda);
  
        if (!graph.hasNode(caseId)) {
          graph.addNode(caseId, {
            label: feature.properties.nombre_completo || `Case ${caseId}`,
            size: 5,
            color: COLORS.CASE,
            x: Math.random(),  // Random initial position
            y: Math.random(),
            attributes: {
              date: feature.properties.fecha_desaparicion || "Unknown",
              location: feature.properties.municipio || "Unknown",
              description: feature.properties.descripcion_desaparicion || "No description",
              value: parseInt(feature.properties.violence_score) || 1
            }
          });
        }
  
        terms.forEach(term => {
          const termId = String(term);
          
          if (!graph.hasNode(termId)) {
            graph.addNode(termId, {
              label: term,
              size: 10,
              color: COLORS.TERM,
              x: Math.random(),  // Random initial position
              y: Math.random()
            });
          }
  
          if (!graph.hasEdge(termId, caseId)) {
            graph.addEdge(termId, caseId);
          }
        });
      });
  
      // Apply layouts
      circular.assign(graph, { scale: 100 });
      forceAtlas2.assign(graph, { 
        iterations: 50,
        settings: {
          gravity: 1,
          scalingRatio: 2,
          strongGravityMode: true,
          slowDown: 2
        }
      });
  
      return graph;
    }, [map, selectedDate, daysRange, selectedSexo, selectedCondicion, edadRange, sumScoreRange]);
  
    const displayGraph = useMemo(() => {
      if (!currentRoot) return graph;
  
      const subgraph = new Graph();
      const rootId = currentRoot.id;
  
      subgraph.addNode(rootId, graph.getNodeAttributes(rootId));
  
      graph.forEachEdge((edge, attr, source, target) => {
        if (source === rootId || target === rootId) {
          const oppositeNode = source === rootId ? target : source;
          const nodeAttrs = graph.getNodeAttributes(oppositeNode);
  
          if (!subgraph.hasNode(oppositeNode)) {
            subgraph.addNode(oppositeNode, nodeAttrs);
          }
          subgraph.addEdge(source, target);
        }
      });
  
      return subgraph;
    }, [graph, currentRoot]);
  
    const handleNodeClick = (nodeId) => {
      const nodeAttrs = graph.getNodeAttributes(nodeId);
      if (nodeAttrs.color === COLORS.TERM) {
        setCurrentRoot({ id: nodeId, ...nodeAttrs });
      } else {
        setSelectedCase({ id: nodeId, ...nodeAttrs });
      }
    };
  
    const handleBack = () => {
      if (selectedCase) {
        setSelectedCase(null);
      } else if (currentRoot) {
        setCurrentRoot(null);
      }
    };
  
    return (
      <div style={styles.mainContainer}>
        {currentRoot && (
          <button className="back-button" onClick={handleBack}>
            ← Back to Terms
          </button>
        )}
        <h3>{currentRoot ? `Cases for ${currentRoot.label}` : 'Most Common Violence Terms'}</h3>
        <div style={{height: '360px', width: '100%', marginBottom: '20px', position: 'relative'}}>
          <SigmaContainer 
            style={{height: '280px', width: '100%', marginBottom: '20px', border: '1px solid #ddd'}}
            settings={{
              renderLabels: true,
              labelSize: 12,
              labelWeight: "bold",
              defaultEdgeColor: "#999",
              minCameraRatio: 0.1,
              maxCameraRatio: 10,
            }}
          >
            <LoadGraph graph={displayGraph} />
            <GraphEvents onNodeClick={handleNodeClick} />
          </SigmaContainer>
        </div>
  
        {/* Full-Screen Modal for Case Details */}
        {selectedCase && (
          <div style={modalStyles.overlay}>
            <div style={modalStyles.container}>
              <button style={modalStyles.closeButton} onClick={handleBack}>×</button>
              <h3>Case Details</h3>
              <div style={modalStyles.details}>
                <p><strong>Name:</strong> {selectedCase.label}</p>
                <p><strong>Date:</strong> {selectedCase.attributes.date || 'N/A'}</p>
                <p><strong>Location:</strong> {selectedCase.attributes.location || 'N/A'}</p>
                <p><strong>Description:</strong> {selectedCase.attributes.description || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  const modalStyles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    },
    container: {
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "10px",
      width: "40%",
      minWidth: "300px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
    },
    closeButton: {
      position: "absolute",
      top: "10px",
      right: "15px",
      fontSize: "20px",
      cursor: "pointer",
      border: "none",
      background: "none"
    },
    details: {
      marginTop: "15px"
    }
  };
  
  export default ViolenceCases;
  