import { PathfindingGrid } from '@/lib/pathfinding/Grid';
import { cn } from '@/lib/utils';

interface GridVisualizerProps {
  grid: PathfindingGrid;
  onCellClick: (row: number, col: number) => void;
  isRunning: boolean;
  status: string;
  stats: {
    nodesExplored: number;
    pathLength: number;
    executionTime: number;
    efficiency: number;
  };
}

export default function GridVisualizer({ 
  grid, 
  onCellClick, 
  isRunning, 
  status, 
  stats 
}: GridVisualizerProps) {
  const nodes = grid.getNodes();
  const size = grid.getSize();

  return (
    <div className="bg-card rounded-lg shadow-lg border border-border p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium text-card-foreground">Pathfinding Grid</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="text-base text-primary">ℹ️</span>
          <span>Click to place obstacles, set start/end points</span>
        </div>
      </div>
      
      <div 
        className="grid gap-1 w-full max-w-2xl mx-auto bg-muted p-4 rounded-lg border border-border"
        style={{ 
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
          aspectRatio: '1'
        }}
      >
        {nodes.map((row, rowIndex) =>
          row.map((node, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={cn(
                "grid-cell",
                node.type
              )}
              onClick={() => onCellClick(rowIndex, colIndex)}
              style={{ cursor: isRunning ? 'not-allowed' : 'pointer' }}
            />
          ))
        )}
      </div>
      
      <div className="mt-4 p-3 bg-muted rounded-lg border border-border">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-base text-primary">📈</span>
            <span className="text-muted-foreground">Status:</span>
            <span className="font-medium text-primary">{status}</span>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <span>Nodes Explored: <span className="font-medium text-card-foreground">{stats.nodesExplored}</span></span>
            <span>Path Length: <span className="font-medium text-card-foreground">{stats.pathLength}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
