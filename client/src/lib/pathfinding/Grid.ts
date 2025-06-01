import { Node, NodeType } from './Node';

export interface GridState {
  nodes: Node[][];
  startNode: Node | null;
  endNode: Node | null;
  size: number;
}

export class PathfindingGrid {
  private nodes: Node[][];
  private startNode: Node | null = null;
  private endNode: Node | null = null;
  private size: number;

  constructor(size: number = 10) {
    this.size = size;
    this.nodes = this.initializeGrid();
  }

  private initializeGrid(): Node[][] {
    const grid: Node[][] = [];
    for (let row = 0; row < this.size; row++) {
      const currentRow: Node[] = [];
      for (let col = 0; col < this.size; col++) {
        currentRow.push(new Node(row, col));
      }
      grid.push(currentRow);
    }
    return grid;
  }

  getNode(row: number, col: number): Node | null {
    if (row >= 0 && row < this.size && col >= 0 && col < this.size) {
      return this.nodes[row][col];
    }
    return null;
  }

  setNodeType(row: number, col: number, type: NodeType): boolean {
    const node = this.getNode(row, col);
    if (!node) return false;

    // Handle start/end node updates
    if (type === 'start') {
      if (this.startNode) {
        this.startNode.type = 'empty';
      }
      this.startNode = node;
    } else if (type === 'end') {
      if (this.endNode) {
        this.endNode.type = 'empty';
      }
      this.endNode = node;
    } else if (node.type === 'start') {
      this.startNode = null;
    } else if (node.type === 'end') {
      this.endNode = null;
    }

    node.type = type;
    return true;
  }

  getNodes(): Node[][] {
    return this.nodes;
  }

  getStartNode(): Node | null {
    return this.startNode;
  }

  getEndNode(): Node | null {
    return this.endNode;
  }

  getSize(): number {
    return this.size;
  }

  reset(): void {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        this.nodes[row][col].reset();
      }
    }
  }

  clearPath(): void {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const node = this.nodes[row][col];
        if (node.type === 'explored' || node.type === 'path' || node.type === 'current') {
          node.type = 'empty';
        }
        node.distance = Infinity;
        node.heuristic = 0;
        node.fScore = Infinity;
        node.parent = null;
        node.visited = false;
      }
    }
  }

  resize(newSize: number): void {
    this.size = newSize;
    this.nodes = this.initializeGrid();
    this.startNode = null;
    this.endNode = null;
  }

  toJSON(): any {
    return {
      size: this.size,
      nodes: this.nodes.map(row => 
        row.map(node => ({
          row: node.row,
          col: node.col,
          type: node.type
        }))
      ),
      startNode: this.startNode ? { row: this.startNode.row, col: this.startNode.col } : null,
      endNode: this.endNode ? { row: this.endNode.row, col: this.endNode.col } : null
    };
  }

  fromJSON(data: any): void {
    this.size = data.size;
    this.nodes = this.initializeGrid();
    
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (data.nodes[row] && data.nodes[row][col]) {
          this.nodes[row][col].type = data.nodes[row][col].type;
          if (data.nodes[row][col].type === 'start') {
            this.startNode = this.nodes[row][col];
          } else if (data.nodes[row][col].type === 'end') {
            this.endNode = this.nodes[row][col];
          }
        }
      }
    }
  }
}
