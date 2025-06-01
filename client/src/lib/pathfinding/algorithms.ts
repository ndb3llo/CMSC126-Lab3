import { Node } from './Node';
import { PathfindingGrid } from './Grid';

export interface PathfindingResult {
  path: Node[];
  exploredNodes: Node[];
  success: boolean;
  distance: number;
}

export interface PathfindingStep {
  currentNode: Node;
  exploredNodes: Node[];
  path: Node[];
  finished: boolean;
}

class PriorityQueue<T> {
  private items: { element: T; priority: number }[] = [];

  enqueue(element: T, priority: number): void {
    const queueElement = { element, priority };
    let added = false;

    for (let i = 0; i < this.items.length; i++) {
      if (queueElement.priority < this.items[i].priority) {
        this.items.splice(i, 0, queueElement);
        added = true;
        break;
      }
    }

    if (!added) {
      this.items.push(queueElement);
    }
  }

  dequeue(): T | null {
    if (this.isEmpty()) return null;
    return this.items.shift()!.element;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }
}

export class DijkstraAlgorithm {
  static* findPath(grid: PathfindingGrid): Generator<PathfindingStep> {
    const startNode = grid.getStartNode();
    const endNode = grid.getEndNode();

    if (!startNode || !endNode) {
      return { currentNode: startNode!, exploredNodes: [], path: [], finished: true };
    }

    const nodes = grid.getNodes();
    const exploredNodes: Node[] = [];
    const unvisitedNodes = new PriorityQueue<Node>();

    // Initialize distances
    startNode.distance = 0;
    unvisitedNodes.enqueue(startNode, 0);

    while (!unvisitedNodes.isEmpty()) {
      const currentNode = unvisitedNodes.dequeue()!;

      if (currentNode.visited) continue;
      currentNode.visited = true;

      if (currentNode !== startNode && currentNode !== endNode) {
        currentNode.type = 'current';
      }

      yield {
        currentNode,
        exploredNodes: [...exploredNodes],
        path: [],
        finished: false
      };

      if (currentNode === endNode) {
        // Reconstruct path
        const path: Node[] = [];
        let current: Node | null = endNode;
        while (current !== null) {
          path.unshift(current);
          current = current.parent;
        }

        // Mark path nodes
        for (const node of path) {
          if (node !== startNode && node !== endNode) {
            node.type = 'path';
          }
        }

        yield {
          currentNode,
          exploredNodes,
          path,
          finished: true
        };
        return;
      }

      exploredNodes.push(currentNode);
      if (currentNode !== startNode && currentNode !== endNode) {
        currentNode.type = 'explored';
      }

      const neighbors = currentNode.getNeighbors(nodes);
      for (const neighbor of neighbors) {
        if (!neighbor.isWalkable() || neighbor.visited) continue;

        const tentativeDistance = currentNode.distance + 1;

        if (tentativeDistance < neighbor.distance) {
          neighbor.distance = tentativeDistance;
          neighbor.parent = currentNode;
          unvisitedNodes.enqueue(neighbor, neighbor.distance);
        }
      }
    }

    // No path found
    yield {
      currentNode: endNode,
      exploredNodes,
      path: [],
      finished: true
    };
  }
}

export class AStarAlgorithm {
  static* findPath(grid: PathfindingGrid): Generator<PathfindingStep> {
    const startNode = grid.getStartNode();
    const endNode = grid.getEndNode();

    if (!startNode || !endNode) {
      return { currentNode: startNode!, exploredNodes: [], path: [], finished: true };
    }

    const nodes = grid.getNodes();
    const exploredNodes: Node[] = [];
    const openSet = new PriorityQueue<Node>();
    const closedSet = new Set<Node>();

    // Initialize start node
    startNode.distance = 0;
    startNode.heuristic = startNode.calculateDistance(endNode);
    startNode.fScore = startNode.distance + startNode.heuristic;
    
    openSet.enqueue(startNode, startNode.fScore);

    while (!openSet.isEmpty()) {
      const currentNode = openSet.dequeue()!;

      if (closedSet.has(currentNode)) continue;
      closedSet.add(currentNode);

      if (currentNode !== startNode && currentNode !== endNode) {
        currentNode.type = 'current';
      }

      yield {
        currentNode,
        exploredNodes: [...exploredNodes],
        path: [],
        finished: false
      };

      if (currentNode === endNode) {
        // Reconstruct path
        const path: Node[] = [];
        let current: Node | null = endNode;
        while (current !== null) {
          path.unshift(current);
          current = current.parent;
        }

        // Mark path nodes
        for (const node of path) {
          if (node !== startNode && node !== endNode) {
            node.type = 'path';
          }
        }

        yield {
          currentNode,
          exploredNodes,
          path,
          finished: true
        };
        return;
      }

      exploredNodes.push(currentNode);
      if (currentNode !== startNode && currentNode !== endNode) {
        currentNode.type = 'explored';
      }

      const neighbors = currentNode.getNeighbors(nodes);
      for (const neighbor of neighbors) {
        if (!neighbor.isWalkable() || closedSet.has(neighbor)) continue;

        const tentativeGScore = currentNode.distance + 1;

        if (tentativeGScore < neighbor.distance) {
          neighbor.parent = currentNode;
          neighbor.distance = tentativeGScore;
          neighbor.heuristic = neighbor.calculateDistance(endNode);
          neighbor.fScore = neighbor.distance + neighbor.heuristic;

          openSet.enqueue(neighbor, neighbor.fScore);
        }
      }
    }

    // No path found
    yield {
      currentNode: endNode,
      exploredNodes,
      path: [],
      finished: true
    };
  }
}

export type AlgorithmType = 'dijkstra' | 'astar';

export function getAlgorithm(type: AlgorithmType) {
  switch (type) {
    case 'dijkstra':
      return DijkstraAlgorithm;
    case 'astar':
      return AStarAlgorithm;
    default:
      return DijkstraAlgorithm;
  }
}
