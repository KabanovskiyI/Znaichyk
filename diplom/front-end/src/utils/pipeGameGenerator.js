const GRID_SIZE = 5;

const DIRS = [
    { x: 0, y: -1, id: 0 }, // 0: Вгору
    { x: 1, y: 0, id: 1 },  // 1: Право
    { x: 0, y: 1, id: 2 },  // 2: Вниз
    { x: -1, y: 0, id: 3 }  // 3: Ліво
];

// Визначаємо тип труби та її початкову правильну ротацію
const getPipeTypeAndRotation = (fromDir, toDir) => {
    // Якщо труба пряма (різниця напрямків 2, тобто протилежні)
    if ((fromDir + 2) % 4 === toDir) {
        return { type: 'straight', rotation: fromDir % 2 === 0 ? 0 : 90 };
    }
    
    // Якщо труба кутова
    const directions = [fromDir, toDir].sort((a, b) => a - b);
    const key = directions.join('');

    // Мапінг для кутів (base: Up=0, Right=1)
    // 0,1 -> 0°  (Вгору-Право)
    // 1,2 -> 90° (Право-Вниз)
    // 2,3 -> 180°(Вниз-Ліво)
    // 0,3 -> 270°(Ліво-Вгору)
    const cornerRotations = { '01': 0, '12': 90, '23': 180, '03': 270 };
    
    return { type: 'corner', rotation: cornerRotations[key] ?? 0 };
};

export const checkPathConnections = (grid) => {
    const startIndex = grid.findIndex(cell => cell.type === 'start');
    if (startIndex === -1) return { updatedGrid: grid, isPathComplete: false };

    let visited = new Set();
    let queue = [startIndex];
    let isPathComplete = false;

    const getOpenings = (type, rotation) => {
        const steps = (rotation / 90) % 4;
        let base;
        if (type === 'straight') base = [0, 2];
        else if (type === 'corner') base = [0, 1];
        else return [0, 1, 2, 3]; // Старт/Фініш відкриті з усіх боків

        return base.map(d => (d + steps) % 4);
    };

    while (queue.length > 0) {
        const currIdx = queue.shift();
        if (visited.has(currIdx)) continue;
        visited.add(currIdx);

        const cell = grid[currIdx];
        if (cell.type === 'end') isPathComplete = true;

        const openings = getOpenings(cell.type, cell.rotation);

        openings.forEach(dir => {
            const d = DIRS[dir];
            const nx = cell.x + d.x;
            const ny = cell.y + d.y;

            if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE) {
                const nextIdx = ny * GRID_SIZE + nx;
                const nextCell = grid[nextIdx];
                
                if (nextCell && nextCell.type !== 'empty') {
                    const nextOpenings = getOpenings(nextCell.type, nextCell.rotation);
                    // Перевіряємо, чи є у сусідньої труби вхід з нашого боку
                    if (nextOpenings.includes((dir + 2) % 4)) {
                        queue.push(nextIdx);
                    }
                }
            }
        });
    }

    const updatedGrid = grid.map((c, i) => ({ ...c, isActive: visited.has(i) }));
    return { updatedGrid, isPathComplete };
};

export const generatePipeRound = () => {
    let success = false;
    let grid = [];
    let attempts = 0;

    while (!success && attempts < 50) {
        attempts++;
        const total = GRID_SIZE * GRID_SIZE;
        grid = Array.from({ length: total }, (_, i) => ({
            id: `cell-${i}-${attempts}`, type: 'empty', rotation: 0, isLocked: false, isActive: false,
            x: i % GRID_SIZE, y: Math.floor(i / GRID_SIZE)
        }));

        const path = [];
        let curr = 0; // Старт в (0,0)
        const end = total - 1; // Фініш в (4,4)
        const stack = [curr];
        const visitedPath = new Set([curr]);

        // 1. Пошук шляху Backtracking
        while (curr !== end && stack.length > 0) {
            const x = curr % GRID_SIZE;
            const y = Math.floor(curr / GRID_SIZE);
            
            let neighbors = DIRS.map((d, i) => ({
                idx: (y + d.y) * GRID_SIZE + (x + d.x),
                dir: i,
                dist: Math.abs((GRID_SIZE - 1) - (x + d.x)) + Math.abs((GRID_SIZE - 1) - (y + d.y)),
                valid: x + d.x >= 0 && x + d.x < GRID_SIZE && y + d.y >= 0 && y + d.y < GRID_SIZE
            })).filter(n => n.valid && !visitedPath.has(n.idx));

            if (neighbors.length > 0) {
                // Пріоритет руху до фінішу, але з рандомом для звивистості
                neighbors.sort((a, b) => a.dist - b.dist);
                const next = Math.random() < 0.5 ? neighbors[0] : neighbors[Math.floor(Math.random() * neighbors.length)];
                
                path.push({ idx: curr, outDir: next.dir });
                curr = next.idx;
                visitedPath.add(curr);
                stack.push(curr);
            } else {
                stack.pop();
                curr = stack[stack.length - 1];
                path.pop();
            }
        }

        if (curr === end) {
            success = true;
            path.push({ idx: end, inDir: (path[path.length - 1].outDir + 2) % 4 });

            // 2. Заповнення шляху трубами
            path.forEach((step, i) => {
                const cell = grid[step.idx];
                if (i === 0) {
                    cell.type = 'start';
                    cell.isLocked = true;
                } else if (i === path.length - 1) {
                    cell.type = 'end';
                    cell.isLocked = true;
                } else {
                    const inDir = (path[i - 1].outDir + 2) % 4;
                    const { type, rotation } = getPipeTypeAndRotation(inDir, step.outDir);
                    
                    cell.type = type;
                    // Ламаємо шлях: даємо випадкову ротацію
                    if (Math.random() < 0.20) {
                        cell.rotation = rotation; // 20% шанс, що стоїть вірно відразу
                        cell.isLocked = true;     // Для складності можна заблокувати
                    } else {
                        const turns = [90, 180, 270];
                        const randomTurn = turns[Math.floor(Math.random() * turns.length)];
                        cell.rotation = (rotation + randomTurn) % 360;
                    }
                }
            });

            // 3. Додавання шуму (лишніх деталей)
            for (let k = 0; k < 8; k++) {
                const randIdx = Math.floor(Math.random() * total);
                if (grid[randIdx].type === 'empty') {
                    grid[randIdx].type = Math.random() > 0.5 ? 'straight' : 'corner';
                    grid[randIdx].rotation = Math.floor(Math.random() * 4) * 90;
                }
            }
        }
    }

    return { grid };
};