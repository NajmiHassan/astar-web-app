from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Tuple

app = FastAPI()

# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace * with frontend domain for production
    allow_methods=["*"],
    allow_headers=["*"],
)

class GridData(BaseModel):
    grid: List[List[int]]
    start: Tuple[int, int]
    goal: Tuple[int, int]

@app.post("/solve")
def solve_maze(data: GridData):
    path = astar_solver(data.grid, data.start, data.goal)
    return {"path": path}

def astar_solver(grid, start, goal):
    import heapq
    rows, cols = len(grid), len(grid[0])
    open_set = [(0 + heuristic(start, goal), 0, start, None)]
    came_from = {}
    cost_so_far = {start: 0}

    while open_set:
        _, g, current, parent = heapq.heappop(open_set)
        if current in came_from:
            continue
        came_from[current] = parent
        if current == goal:
            break
        for d in [(1,0),(-1,0),(0,1),(0,-1)]:
            nbr = (current[0]+d[0], current[1]+d[1])
            if 0 <= nbr[0] < rows and 0 <= nbr[1] < cols and grid[nbr[0]][nbr[1]] == 0:
                new_cost = g + 1
                if nbr not in cost_so_far or new_cost < cost_so_far[nbr]:
                    cost_so_far[nbr] = new_cost
                    priority = new_cost + heuristic(nbr, goal)
                    heapq.heappush(open_set, (priority, new_cost, nbr, current))
    
    # Reconstruct path
    path = []
    node = goal
    while node:
        path.append(node)
        node = came_from.get(node)
    path.reverse()
    return path

def heuristic(a, b):
    return abs(a[0] - b[0]) + abs(a[1] - b[1])
