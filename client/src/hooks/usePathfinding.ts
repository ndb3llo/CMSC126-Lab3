import { useState, useCallback, useRef } from 'react';
import { PathfindingGrid } from '@/lib/pathfinding/Grid';
import { NodeType } from '@/lib/pathfinding/Node';
import { getAlgorithm, AlgorithmType, PathfindingStep } from '@/lib/pathfinding/algorithms';

export type PlacementMode = 'start' | 'end' | 'obstacle' | 'erase';
export type AnimationSpeed = 'slow' | 'medium' | 'fast';

const SPEED_DELAYS = {
  slow: 200,
  medium: 100,
  fast: 50
};

export function usePathfinding(initialSize: number = 10) {
  const [grid] = useState(() => new PathfindingGrid(initialSize));
  const [gridVersion, setGridVersion] = useState(0);
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('dijkstra');
  const [placementMode, setPlacementMode] = useState<PlacementMode>('start');
  const [animationSpeed, setAnimationSpeed] = useState<AnimationSpeed>('medium');
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Ready to start');
  const [stats, setStats] = useState({
    nodesExplored: 0,
    pathLength: 0,
    executionTime: 0,
    efficiency: 0
  });

  const animationRef = useRef<number | null>(null);
  const generatorRef = useRef<Generator<PathfindingStep> | null>(null);

  const forceUpdate = useCallback(() => {
    setGridVersion(prev => prev + 1);
  }, []);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (isRunning) return;

    const node = grid.getNode(row, col);
    if (!node) return;

    let newType: NodeType;
    
    switch (placementMode) {
      case 'start':
        newType = 'start';
        break;
      case 'end':
        newType = 'end';
        break;
      case 'obstacle':
        newType = node.type === 'obstacle' ? 'empty' : 'obstacle';
        break;
      case 'erase':
        newType = 'empty';
        break;
      default:
        return;
    }

    // Don't place obstacles on start/end nodes
    if (newType === 'obstacle' && (node.type === 'start' || node.type === 'end')) {
      return;
    }

    grid.setNodeType(row, col, newType);
    forceUpdate();
  }, [grid, placementMode, isRunning, forceUpdate]);

  const animateStep = useCallback((step: PathfindingStep) => {
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const delay = SPEED_DELAYS[animationSpeed];
      
      if (elapsed >= delay) {
        forceUpdate();
        
        if (step.finished) {
          setIsRunning(false);
          const pathLength = step.path.length;
          const nodesExplored = step.exploredNodes.length;
          const efficiency = pathLength > 0 ? Math.round((pathLength / (nodesExplored + pathLength)) * 100) : 0;
          
          setStats(prev => ({
            ...prev,
            pathLength,
            nodesExplored,
            efficiency
          }));
          
          if (step.path.length > 0) {
            setStatus('Path found!');
          } else {
            setStatus('No path found');
          }
          return;
        }

        // Continue to next step
        const nextStep = generatorRef.current?.next();
        if (nextStep && !nextStep.done) {
          animateStep(nextStep.value);
        }
      } else {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  }, [animationSpeed, forceUpdate]);

  const startPathfinding = useCallback(() => {
    if (isRunning) return;

    const startNode = grid.getStartNode();
    const endNode = grid.getEndNode();

    if (!startNode || !endNode) {
      setStatus('Please set both start and end points');
      return;
    }

    grid.clearPath();
    setIsRunning(true);
    setStatus('Finding path...');
    
    const startTime = Date.now();
    const AlgorithmClass = getAlgorithm(algorithm);
    generatorRef.current = AlgorithmClass.findPath(grid);
    
    const firstStep = generatorRef.current.next();
    if (!firstStep.done) {
      animateStep(firstStep.value);
    }

    setStats(prev => ({
      ...prev,
      executionTime: Date.now() - startTime
    }));
  }, [grid, algorithm, isRunning, animateStep]);

  const stopPathfinding = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    generatorRef.current = null;
    setIsRunning(false);
    setStatus('Stopped');
  }, []);

  const clearPath = useCallback(() => {
    if (isRunning) {
      stopPathfinding();
    }
    grid.clearPath();
    setStatus('Ready to start');
    setStats({ nodesExplored: 0, pathLength: 0, executionTime: 0, efficiency: 0 });
    forceUpdate();
  }, [grid, isRunning, stopPathfinding, forceUpdate]);

  const resetGrid = useCallback(() => {
    if (isRunning) {
      stopPathfinding();
    }
    grid.reset();
    setStatus('Ready to start');
    setStats({ nodesExplored: 0, pathLength: 0, executionTime: 0, efficiency: 0 });
    forceUpdate();
  }, [grid, isRunning, stopPathfinding, forceUpdate]);

  const resizeGrid = useCallback((newSize: number) => {
    if (isRunning) return;
    grid.resize(newSize);
    setStatus('Ready to start');
    setStats({ nodesExplored: 0, pathLength: 0, executionTime: 0, efficiency: 0 });
    forceUpdate();
  }, [grid, isRunning, forceUpdate]);

  const saveGrid = useCallback(() => {
    const gridData = grid.toJSON();
    localStorage.setItem('pathfinding-grid', JSON.stringify(gridData));
    setStatus('Grid saved');
  }, [grid]);

  const loadGrid = useCallback(() => {
    if (isRunning) return;
    
    const savedData = localStorage.getItem('pathfinding-grid');
    if (savedData) {
      try {
        const gridData = JSON.parse(savedData);
        grid.fromJSON(gridData);
        setStatus('Grid loaded');
        forceUpdate();
      } catch (error) {
        setStatus('Failed to load grid');
      }
    } else {
      setStatus('No saved grid found');
    }
  }, [grid, isRunning, forceUpdate]);

  return {
    grid,
    gridVersion,
    algorithm,
    setAlgorithm,
    placementMode,
    setPlacementMode,
    animationSpeed,
    setAnimationSpeed,
    isRunning,
    status,
    stats,
    handleCellClick,
    startPathfinding,
    stopPathfinding,
    clearPath,
    resetGrid,
    resizeGrid,
    saveGrid,
    loadGrid
  };
}
