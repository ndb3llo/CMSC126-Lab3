import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { PlacementMode, AnimationSpeed } from '@/hooks/usePathfinding';
import { AlgorithmType } from '@/lib/pathfinding/algorithms';
import { cn } from '@/lib/utils';
import { Play, Flag, Square, Eraser, PlayIcon, Baseline, RotateCcw, Save, FolderOpen } from 'lucide-react';

interface ControlPanelProps {
  algorithm: AlgorithmType;
  setAlgorithm: (algorithm: AlgorithmType) => void;
  placementMode: PlacementMode;
  setPlacementMode: (mode: PlacementMode) => void;
  animationSpeed: AnimationSpeed;
  setAnimationSpeed: (speed: AnimationSpeed) => void;
  gridSize: number;
  onGridSizeChange: (size: number) => void;
  isRunning: boolean;
  stats: {
    nodesExplored: number;
    pathLength: number;
    executionTime: number;
    efficiency: number;
  };
  onStartPathfinding: () => void;
  onClearPath: () => void;
  onResetGrid: () => void;
  onSaveGrid: () => void;
  onLoadGrid: () => void;
}

const modeButtons = [
  { mode: 'start' as PlacementMode, icon: Play, label: 'Start Point', color: 'border-blue-500 text-blue-600 bg-blue-50' },
  { mode: 'end' as PlacementMode, icon: Flag, label: 'End Point', color: 'border-blue-500 text-blue-600 bg-blue-50' },
  { mode: 'obstacle' as PlacementMode, icon: Square, label: 'Obstacles', color: 'border-gray-300 text-gray-700' },
  { mode: 'erase' as PlacementMode, icon: Eraser, label: 'Erase', color: 'border-gray-300 text-gray-700' },
];

const speedButtons = [
  { speed: 'slow' as AnimationSpeed, label: 'Slow' },
  { speed: 'medium' as AnimationSpeed, label: 'Medium' },
  { speed: 'fast' as AnimationSpeed, label: 'Fast' },
];

export default function ControlPanel({
  algorithm,
  setAlgorithm,
  placementMode,
  setPlacementMode,
  animationSpeed,
  setAnimationSpeed,
  gridSize,
  onGridSizeChange,
  isRunning,
  stats,
  onStartPathfinding,
  onClearPath,
  onResetGrid,
  onSaveGrid,
  onLoadGrid
}: ControlPanelProps) {
  return (
    <div className="bg-card rounded-lg shadow-lg border border-border p-6 h-full flex flex-col">
      <h3 className="text-lg font-medium text-card-foreground mb-6">Control Panel</h3>
      
      {/* Algorithm Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-card-foreground mb-2">Algorithm</label>
        <Select value={algorithm} onValueChange={(value: AlgorithmType) => setAlgorithm(value)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dijkstra">Dijkstra's Algorithm</SelectItem>
            <SelectItem value="astar">A* Search</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Mode Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-card-foreground mb-3">Placement Mode</label>
        <div className="grid grid-cols-2 gap-2">
          {modeButtons.map(({ mode, icon: Icon, label }) => (
            <Button
              key={mode}
              variant="outline"
              size="sm"
              className={cn(
                "control-button p-2 text-sm font-medium border-2",
                placementMode === mode
                  ? "border-primary text-primary bg-primary/10"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary"
              )}
              onClick={() => setPlacementMode(mode)}
              disabled={isRunning}
            >
              <Icon className="w-4 h-4 mr-1" />
              {label}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Speed Control */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-card-foreground mb-2">Animation Speed</label>
        <div className="flex gap-2">
          {speedButtons.map(({ speed, label }) => (
            <Button
              key={speed}
              variant="outline"
              size="sm"
              className={cn(
                "control-button flex-1 text-xs font-medium border-2",
                animationSpeed === speed
                  ? "border-primary text-primary bg-primary/10"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary"
              )}
              onClick={() => setAnimationSpeed(speed)}
              disabled={isRunning}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="space-y-3 mb-6 flex-1">
        <Button
          className="control-button w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2"
          onClick={onStartPathfinding}
          disabled={isRunning}
        >
          <PlayIcon className="w-4 h-4" />
          Find Path
        </Button>
        
        <Button
          variant="outline"
          className="control-button w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 border-orange-500"
          onClick={onClearPath}
          disabled={isRunning}
        >
          <Baseline className="w-4 h-4" />
          Clear Path
        </Button>
        
        <Button
          variant="outline"
          className="control-button w-full bg-muted hover:bg-muted/80 text-muted-foreground font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 border-border"
          onClick={onResetGrid}
          disabled={isRunning}
        >
          <RotateCcw className="w-4 h-4" />
          Reset Grid
        </Button>
      </div>
      
      {/* Grid Size Control */}
      <div className="mt-auto">
        <label className="block text-sm font-medium text-card-foreground mb-2">Grid Size</label>
        <div className="flex items-center gap-3">
          <Slider
            value={[gridSize]}
            onValueChange={(value) => onGridSizeChange(value[0])}
            min={5}
            max={20}
            step={1}
            disabled={isRunning}
            className="flex-1"
          />
          <span className="text-sm font-medium text-muted-foreground w-8">{gridSize}</span>
        </div>
      </div>
    </div>
  );
}
