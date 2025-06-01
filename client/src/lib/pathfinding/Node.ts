export type NodeType = 'empty' | 'obstacle' | 'start' | 'end' | 'explored' | 'path' | 'current';

export class Node {
  public row: number;
  public col: number;
  public type: NodeType;
  public distance: number;
  public heuristic: number;
  public fScore: number;
  public parent: Node | null;
  public visited: boolean;

  constructor(row: number, col: number, type: NodeType = 'empty') {
    this.row = row;
    this.col = col;
    this.type = type;
    this.distance = Infinity;
    this.heuristic = 0;
    this.fScore = Infinity;
    this.parent = null;
    this.visited = false;
  }

  reset() {
    if (this.type !== 'start' && this.type !== 'end' && this.type !== 'obstacle') {
      this.type = 'empty';
    }
    this.distance = Infinity;
    this.heuristic = 0;
    this.fScore = Infinity;
    this.parent = null;
    this.visited = false;
  }

  isWalkable(): boolean {
    return this.type !== 'obstacle';
  }

  getNeighbors(grid: Node[][]): Node[] {
    const neighbors: Node[] = [];
    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1] // Up, Down, Left, Right
    ];

    for (const [dRow, dCol] of directions) {
      const newRow = this.row + dRow;
      const newCol = this.col + dCol;

      if (newRow >= 0 && newRow < grid.length && 
          newCol >= 0 && newCol < grid[0].length) {
        neighbors.push(grid[newRow][newCol]);
      }
    }

    return neighbors;
  }

  calculateDistance(other: Node): number {
    return Math.abs(this.row - other.row) + Math.abs(this.col - other.col);
  }
}
