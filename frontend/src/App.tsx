import { useState } from "react";
import axios from "axios";
import "./App.css";

const SIZE = 20;
const defaultGrid = Array.from({ length: SIZE }, () =>
  Array(SIZE).fill(0)
);

function App() {
  const [grid, setGrid] = useState(defaultGrid);
  const [start, setStart] = useState<[number, number]>([0, 0]);
  const [goal, setGoal] = useState<[number, number]>([SIZE - 1, SIZE - 1]);
  const [path, setPath] = useState<[number, number][]>([]);

  const toggleCell = (r: number, c: number) => {
    if ((r === start[0] && c === start[1]) || (r === goal[0] && c === goal[1]))
      return;
    const newGrid = grid.map((row) => [...row]);
    newGrid[r][c] = grid[r][c] === 0 ? 1 : 0;
    setGrid(newGrid);
  };

  const solveMaze = async () => {
    const response = await axios.post("http://127.0.0.1:8000/solve", {
      grid,
      start,
      goal,
    });
    setPath(response.data.path);
  };

  return (
    <div className="app">
      <h2>A* Pathfinding Visualizer</h2>
      <div className="grid">
        {grid.map((row, r) => (
          <div key={r} className="row">
            {row.map((cell, c) => {
              const isStart = r === start[0] && c === start[1];
              const isGoal = r === goal[0] && c === goal[1];
              const isWall = cell === 1;
              const inPath = path.some(([x, y]) => x === r && y === c);

              return (
                <div
                  key={c}
                  className={`cell 
                    ${isWall ? "wall" : ""} 
                    ${isStart ? "start" : ""} 
                    ${isGoal ? "goal" : ""} 
                    ${inPath ? "path" : ""}`}
                  onClick={() => toggleCell(r, c)}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="buttons">
        <button onClick={solveMaze}>Solve A*</button>
      </div>
    </div>
  );
}

export default App;
