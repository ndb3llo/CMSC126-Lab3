import { usePathfinding } from '@/hooks/usePathfinding';
import GridVisualizer from '@/components/GridVisualizer';
import ControlPanel from '@/components/ControlPanel';

export default function PathfindingVisualizer() {
  const {
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
    clearPath,
    resetGrid,
    resizeGrid,
    saveGrid,
    loadGrid
  } = usePathfinding(10);

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Interactive Pathfinding Visualizer
          </h1>
          <p className="text-muted-foreground text-lg">
            Visualize Dijkstra's Algorithm and A* Search in action
          </p>
        </div>

        {/* Main Content Grid - Three Column Layout */}
        <div className="grid grid-cols-[1.5fr_2fr_1.5fr] gap-2 min-h-[calc(100vh-12rem)]">
          {/* First Column - Control Panel */}
          <div className="flex flex-col h-full">
            <ControlPanel
              algorithm={algorithm}
              setAlgorithm={setAlgorithm}
              placementMode={placementMode}
              setPlacementMode={setPlacementMode}
              animationSpeed={animationSpeed}
              setAnimationSpeed={setAnimationSpeed}
              gridSize={grid.getSize()}
              onGridSizeChange={resizeGrid}
              isRunning={isRunning}
              stats={stats}
              onStartPathfinding={startPathfinding}
              onClearPath={clearPath}
              onResetGrid={resetGrid}
              onSaveGrid={saveGrid}
              onLoadGrid={loadGrid}
            />
          </div>

          {/* Second Column - Grid Visualizer */}
          <div className="flex items-start justify-center pt-8">
            <GridVisualizer
              key={gridVersion}
              grid={grid}
              onCellClick={handleCellClick}
              isRunning={isRunning}
              status={status}
              stats={stats}
            />
          </div>

          {/* Third Column - Info Panel */}
          <div className="flex flex-col h-full">
            <div className="bg-card rounded-lg shadow-lg border border-border p-6 h-full flex flex-col">
              {/* Legend */}
              <div className="mb-6 pb-6 border-b border-border">
                <h4 className="text-base font-medium text-card-foreground mb-3">Legend</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border border-border" style={{ backgroundColor: 'hsl(142 76% 36%)' }}></div>
                    <span className="text-xs text-muted-foreground">Start Point</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border border-border" style={{ backgroundColor: 'hsl(217 91% 60%)' }}></div>
                    <span className="text-xs text-muted-foreground">End Point</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border border-border" style={{ backgroundColor: 'hsl(350 89% 60%)' }}></div>
                    <span className="text-xs text-muted-foreground">Obstacles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border border-border" style={{ backgroundColor: 'hsl(47 96% 89%)' }}></div>
                    <span className="text-xs text-muted-foreground">Explored Nodes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border border-border" style={{ backgroundColor: 'hsl(142 69% 58%)' }}></div>
                    <span className="text-xs text-muted-foreground">Shortest Path</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border border-border" style={{ backgroundColor: 'hsl(32 95% 44%)' }}></div>
                    <span className="text-xs text-muted-foreground">Current Node</span>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="mb-6 pb-6 border-b border-border">
                <h4 className="text-base font-medium text-card-foreground mb-3 flex items-center gap-2">
                  <span>📊</span>
                  Performance Metrics
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-2 bg-muted rounded border border-border">
                    <div className="text-sm font-bold text-primary">{stats.executionTime}ms</div>
                    <div className="text-xs text-muted-foreground">Time</div>
                  </div>
                  <div className="text-center p-2 bg-muted rounded border border-border">
                    <div className="text-sm font-bold text-primary">{stats.efficiency}%</div>
                    <div className="text-xs text-muted-foreground">Efficiency</div>
                  </div>
                  <div className="text-center p-2 bg-muted rounded border border-border">
                    <div className="text-sm font-bold text-primary">{stats.nodesExplored}</div>
                    <div className="text-xs text-muted-foreground">Explored</div>
                  </div>
                  <div className="text-center p-2 bg-muted rounded border border-border">
                    <div className="text-sm font-bold text-primary">{stats.pathLength}</div>
                    <div className="text-xs text-muted-foreground">Path</div>
                  </div>
                </div>
              </div>

              {/* Grid Management */}
              <div className="flex-1 flex flex-col justify-end">
                <h4 className="text-base font-medium text-card-foreground mb-3 flex items-center gap-2">
                  <span>💾</span>
                  Grid Management
                </h4>
                <div className="space-y-2">
                  <button
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 border border-green-600 transition-colors disabled:opacity-50"
                    onClick={saveGrid}
                    disabled={isRunning}
                  >
                    <span className="text-sm">💾</span>
                    Save Grid
                  </button>
                  <button
                    className="w-full border-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950 font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                    onClick={loadGrid}
                    disabled={isRunning}
                  >
                    <span className="text-sm">📁</span>
                    Load Grid
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
