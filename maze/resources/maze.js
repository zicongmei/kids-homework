// Cell class definition
class Cell {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.visited = false;
        // Walls: top, right, bottom, left
        this.walls = {
            top: true,
            right: true,
            bottom: true,
            left: true
        };
    }

    // Get unvisited neighbors
    getUnvisitedNeighbors(grid, rows, cols) {
        const neighbors = [];
        // Define potential neighbor relative coordinates and the walls to remove
        // wallToRemove: wall on *current* cell to remove to connect to neighbor
        // neighborWallToRemove: wall on *neighbor* cell to remove to connect to current cell
        const potentialNeighbors = [
            { r: this.row - 1, c: this.col, wallToRemove: 'top', neighborWallToRemove: 'bottom' }, // Up
            { r: this.row, c: this.col + 1, wallToRemove: 'right', neighborWallToRemove: 'left' }, // Right
            { r: this.row + 1, c: this.col, wallToRemove: 'bottom', neighborWallToRemove: 'top' }, // Down
            { r: this.row, c: this.col - 1, wallToRemove: 'left', neighborWallToRemove: 'right' }  // Left
        ];

        for (const pn of potentialNeighbors) {
            // Check if neighbor is within grid bounds
            if (pn.r >= 0 && pn.r < rows && pn.c >= 0 && pn.c < cols) {
                const neighbor = grid[pn.r][pn.c];
                if (!neighbor.visited) {
                    neighbors.push({ cell: neighbor, wallToRemove: pn.wallToRemove, neighborWallToRemove: pn.neighborWallToRemove });
                }
            }
        }
        return neighbors;
    }
}

// Maze Generation Algorithm (Recursive Backtracker)
// generationStyle: 'easy_path' for straighter paths, 'hard_path' for more winding/random paths
function generateMaze(rows, cols, generationStyle) {
    // Initialize grid with all walls intact
    const grid = Array(rows).fill(null).map((_, r) =>
        Array(cols).fill(null).map((_, c) => new Cell(r, c))
    );

    // Stack now stores objects { cell, enteredFrom } to track previous direction
    // enteredFrom: the wall on the *current* cell that was broken to enter it (e.g., 'top' if came from above)
    const stack = [];
    const startCell = grid[0][0];
    startCell.visited = true;
    // For the start cell, there's no 'enteredFrom' direction
    stack.push({ cell: startCell, enteredFrom: null });

    const straightPathBiasChance = 0.7; // 70% chance to prefer straight path for 'easy_path'

    while (stack.length > 0) {
        // Peek at the top cell and its 'enteredFrom' direction
        const { cell: currentCell, enteredFrom } = stack[stack.length - 1]; 

        // Get unvisited neighbors of the current cell
        const neighbors = currentCell.getUnvisitedNeighbors(grid, rows, cols);

        if (neighbors.length > 0) {
            let chosenNeighborInfo;

            if (generationStyle === 'easy_path' && enteredFrom !== null) {
                // Determine the wall that would continue the straight path
                // If currentCell was entered from 'top', a straight path means going 'down', so wallToRemove is 'bottom'
                const straightPathWall = enteredFrom; // The wall to break to go straight is the same as the one we entered through
                const straightNeighbors = neighbors.filter(n => n.wallToRemove === straightPathWall);

                if (straightNeighbors.length > 0 && Math.random() < straightPathBiasChance) {
                    // Pick a random straight neighbor
                    chosenNeighborInfo = straightNeighbors[Math.floor(Math.random() * straightNeighbors.length)];
                } else {
                    // Either no straight path, or failed the bias chance, so pick randomly from all neighbors
                    chosenNeighborInfo = neighbors[Math.floor(Math.random() * neighbors.length)];
                }
            } else {
                // 'hard_path' or first cell (enteredFrom is null) - pick a purely random unvisited neighbor
                chosenNeighborInfo = neighbors[Math.floor(Math.random() * neighbors.length)];
            }
            
            const { cell: randomNeighbor, wallToRemove, neighborWallToRemove } = chosenNeighborInfo;

            // Remove walls between the current cell and the chosen neighbor
            currentCell.walls[wallToRemove] = false;
            randomNeighbor.walls[neighborWallToRemove] = false;

            // Mark the chosen neighbor as visited and push it to the stack
            randomNeighbor.visited = true;
            // Store the direction from which the randomNeighbor was entered
            stack.push({ cell: randomNeighbor, enteredFrom: neighborWallToRemove });
        } else {
            // If no unvisited neighbors, backtrack by popping the current cell
            stack.pop();
        }
    }
    return grid;
}

// Maze Drawing Function
function drawMaze(ctx, maze, rows, cols, cellSize, wallThickness) {
    const totalWidth = cols * cellSize + wallThickness;
    const totalHeight = rows * cellSize + wallThickness;

    // Clear canvas and set background to white
    ctx.clearRect(0, 0, totalWidth, totalHeight);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    // Set wall style
    ctx.strokeStyle = 'black';
    ctx.lineWidth = wallThickness;
    ctx.lineCap = 'butt'; // For crisp, non-overlapping corners

    const halfWall = wallThickness / 2; // Offset for centering lines on grid coordinates

    // Draw all maze walls
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = maze[r][c];
            const x = c * cellSize;
            const y = r * cellSize;

            // Draw top wall if it exists
            if (cell.walls.top) {
                ctx.beginPath();
                ctx.moveTo(x + halfWall, y + halfWall);
                ctx.lineTo(x + cellSize + halfWall, y + halfWall);
                ctx.stroke();
            }

            // Draw left wall if it exists
            if (cell.walls.left) {
                ctx.beginPath();
                ctx.moveTo(x + halfWall, y + halfWall);
                ctx.lineTo(x + halfWall, y + cellSize + halfWall);
                ctx.stroke();
            }

            // Draw the rightmost outer wall if it's the last column
            if (c === cols - 1) {
                ctx.beginPath();
                ctx.moveTo(x + cellSize + halfWall, y + halfWall);
                ctx.lineTo(x + cellSize + halfWall, y + cellSize + halfWall);
                ctx.stroke();
            }

            // Draw the bottommost outer wall if it's the last row
            if (r === rows - 1) {
                if (cell.walls.bottom) { // This condition allows for removing the exit wall
                    ctx.beginPath();
                    ctx.moveTo(x + halfWall, y + cellSize + halfWall);
                    ctx.lineTo(x + cellSize + halfWall, y + cellSize + halfWall);
                    ctx.stroke();
                }
            }
        }
    }

    // Add start and end markers
    const markerSize = cellSize * 0.5; // Square marker size
    const startX = halfWall + (cellSize - markerSize) / 2; // Center in cell (0,0)
    const startY = halfWall + (cellSize - markerSize) / 2;
    const endX = (cols - 1) * cellSize + halfWall + (cellSize - markerSize) / 2; // Center in cell (rows-1, cols-1)
    const endY = (rows - 1) * cellSize + halfWall + (cellSize - markerSize) / 2;

    ctx.fillStyle = 'green';
    ctx.fillRect(startX, startY, markerSize, markerSize);

    ctx.fillStyle = 'red';
    ctx.fillRect(endX, endY, markerSize, markerSize);
}

// Main function to create and download the maze PDF
function createAndDownloadMazePDF(mazeSize, generationStyle, numPages) {
    // Ensure jsPDF is loaded
    if (typeof jspdf === 'undefined' || !jspdf.jsPDF) {
        console.error("jsPDF library not loaded. Please check the CDN link.");
        alert("Error: jsPDF library not loaded. Cannot generate PDF.");
        return;
    }

    let mazeRows, mazeCols;
    switch (mazeSize) {
        case 'small':
            mazeRows = 15;
            mazeCols = 15;
            break;
        case 'medium':
            mazeRows = 25;
            mazeCols = 25;
            break;
        case 'large':
            mazeRows = 35;
            mazeCols = 35;
            break;
        case 'x-large':
            mazeRows = 45;
            mazeCols = 45;
            break;
        default:
            console.warn("Invalid maze size, defaulting to medium.");
            mazeRows = 25;
            mazeCols = 25;
            break;
    }

    // Create a new jsPDF instance
    // Set PDF page size to 'letter' (8.5 x 11 inches)
    // Using 'px' unit where 1 inch = 72 px by jsPDF's internal standard for 'letter' format
    const pdf = new jspdf.jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'letter'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();   // Approx 612 px (8.5 * 72)
    const pdfHeight = pdf.internal.pageSize.getHeight(); // Approx 792 px (11 * 72)

    // Define margins in pixels (e.g., 0.5 inch = 36 px)
    const pageMarginPx = 36; // 0.5 inches * 72 px/inch

    const usableWidth = pdfWidth - 2 * pageMarginPx;
    const usableHeight = pdfHeight - 2 * pageMarginPx;

    // Define the wall thickness. Keep it a small, fixed value for clarity and consistency.
    // This value will be used for both calculations and drawing.
    const wallThickness = 2; // Fixed wall thickness in pixels

    // Calculate maximum possible cell size to fit the maze within the usable area
    // The total maze dimension is (N * CELL_SIZE) + WALL_THICKNESS (for the outer border)
    const maxCellSizeFromWidth = (usableWidth - wallThickness) / mazeCols;
    const maxCellSizeFromHeight = (usableHeight - wallThickness) / mazeRows;

    // Use the smaller of the two to ensure the maze fits entirely within both width and height constraints
    // Math.floor to ensure integer pixel values for cleaner rendering
    let cellSize = Math.floor(Math.min(maxCellSizeFromWidth, maxCellSizeFromHeight));
    
    // Ensure cell size is at least 1 to prevent issues with very small or zero-sized cells
    cellSize = Math.max(1, cellSize); 

    // Calculate the actual total canvas size with the determined cell size and wall thickness
    const canvasTotalWidth = mazeCols * cellSize + wallThickness;
    const canvasTotalHeight = mazeRows * cellSize + wallThickness;

    // Calculate position to center the maze image on the PDF page, respecting the defined margins
    const xOffset = pageMarginPx + (usableWidth - canvasTotalWidth) / 2;
    const yOffset = pageMarginPx + (usableHeight - canvasTotalHeight) / 2;

    for (let i = 0; i < numPages; i++) {
        // Add a new page for each maze, unless it's the very first maze
        if (i > 0) {
            pdf.addPage();
        }

        // Create a temporary canvas element in memory for each maze
        const canvas = document.createElement('canvas');
        canvas.width = canvasTotalWidth;
        canvas.height = canvasTotalHeight;
        const ctx = canvas.getContext('2d');

        // Generate maze data, passing the generationStyle
        const maze = generateMaze(mazeRows, mazeCols, generationStyle);

        // Make entrance at the top of the first cell (0,0)
        // By setting its top wall to false, `drawMaze` will not render it.
        maze[0][0].walls.top = false;
        // Make exit at the bottom of the last cell (MAZE_ROWS-1, MAZE_COLS-1)
        // By setting its bottom wall to false, `drawMaze` will not render it.
        maze[mazeRows - 1][mazeCols - 1].walls.bottom = false;

        // Draw the generated maze onto the canvas using the calculated cellSize and wallThickness
        drawMaze(ctx, maze, mazeRows, mazeCols, cellSize, wallThickness);

        // Convert the canvas content to a PNG image data URL
        const imgData = canvas.toDataURL('image/png');

        // Add the maze image to the PDF using the calculated offsets and dimensions
        pdf.addImage(imgData, 'PNG', xOffset, yOffset, canvasTotalWidth, canvasTotalHeight);
    }

    // Save the PDF file
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    pdf.save(`maze_puzzles_${mazeSize}_${generationStyle}_${numPages}_pages_${timestamp}.pdf`);
}