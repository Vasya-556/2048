const body = document.body as HTMLBodyElement;
const scoreLabel = document.getElementById("score-label") as HTMLLabelElement
const recordLabel = document.getElementById("record-label") as HTMLLabelElement
const restartButton = document.getElementById("restart-button") as HTMLButtonElement
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")

if (!ctx) {
    throw new Error("Could not get 2D context");
}

canvas.width = 320;
canvas.height = 320;

let isGameRunning: boolean = true;
let totalScore: number = 0;
const COLORS = {
    2: "#0000FF",
    4: "#00FF00",
    8: "#00FFFF",
    16: "#800000",
    32: "#FF00FF",
    128: "#FFFF00",
    64: "#FF80FF",
    256: "#0080FF",
    512: "#00FF80",
    1024: "#8000FF",
    2048: "#FF8000"
}

const grid: number[][] = Array.from(
    { length: 4}, 
    () => Array(4).fill(0)
);

const cleatCanvas = () => {
    ctx.clearRect(0,0,320,320);
}

const drawGrid = () => {
    ctx.rect(0,0,320,320)
    ctx.fillStyle = "gray"
    ctx.fill()
    
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            ctx.beginPath()
            ctx.rect(16+i*76,16+j*76,60,60)
            ctx.fillStyle = "red"
            ctx.fill()
        }
    }
}

const drawCubes = (grid: number[][]) => {
    for (let x_axis = 0; x_axis < 4; x_axis++) {
        for (let y_axis = 0; y_axis < 4; y_axis++) {
            if (grid[x_axis]![y_axis] !== 0){
                ctx.beginPath()
                ctx.rect(16+x_axis*76,16+y_axis*76,60,60)
                ctx.fillStyle = COLORS[grid[x_axis]![y_axis]! as keyof typeof COLORS || 2] || "#0000FF"
                ctx.fill()
                ctx.fillStyle = "black"
                ctx.textAlign = "center"
                ctx.textBaseline = "middle"
                ctx.font = "24px Arial";
                ctx.fillText(String(grid[x_axis]![y_axis]),16+x_axis*76+30,16+y_axis*76+30);
            }
        }
    }
}

drawGrid()
// grid[1]![0] = 2048
// grid[0]![1] = 128
// grid[1]![1] = 128
// grid[2]![1] = 256
// grid[2]![0] = 512
// grid[3]![1] = 512
// grid[1]![2] = 64
// grid[2]![2] = 128
// grid[2]![3] = 128
grid[1]![3] = 8
drawCubes(grid)

body.addEventListener("keyup", (event: KeyboardEvent) => {
    checkGameState(grid)

    if (!isGameRunning){
        return
    }
    
    let gridBefore = JSON.parse(JSON.stringify(grid));

    switch(event.key) {
        case("ArrowLeft"):
            moveCubesLeft(grid)
            break;
        case("ArrowRight"):
            moveCubesRight(grid)
            break;
        case("ArrowUp"):
            moveCubesUp(grid)
            break;
        case("ArrowDown"):
            moveCubesDown(grid)
            break;
        default:
            return;
    }

    setScore()
    setRecord()

    if(JSON.stringify(gridBefore) === JSON.stringify(grid)){
        return
    }

    drawGrid()
    spawnCube(grid)
    drawCubes(grid)
})

const setScore = () => {
    scoreLabel.textContent = `${totalScore}`
}

const setRecord = () => {
    let record: number = Number(localStorage.getItem("Record")) || 0;

    if (totalScore >= record){
        localStorage.setItem("Record", String(totalScore));
        recordLabel.textContent = `${totalScore}`
    }
    else {
        recordLabel.textContent = `${record}`
    }
}

restartButton.addEventListener("click", () => {
    totalScore = 0;
    setScore()
    setRecord()

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            grid[i]![j] = 0
        }
    }

    isGameRunning = true;
    
    drawGrid()
    spawnCube(grid)
    drawCubes(grid)
})

const moveCubesLeft = (grid: number[][]) => {
    for (let x = 0; x < 3; x++) {        
        for (let x_axis = 0; x_axis < 3; x_axis++) {
            for (let y_axis = 0; y_axis < 4; y_axis++) {
                if (grid[x_axis]![y_axis]! === grid[x_axis+1]![y_axis]!){
                    grid[x_axis]![y_axis]! += grid[x_axis+1]![y_axis]!
                    grid[x_axis+1]![y_axis]! = 0
                    totalScore += grid[x_axis]![y_axis]!
                }
                if (grid[x_axis]![y_axis]! === 0){
                    grid[x_axis]![y_axis]! = grid[x_axis+1]![y_axis]!
                    grid[x_axis+1]![y_axis]! = 0
                }
            }
        }
    }
}

const moveCubesRight = (grid: number[][]) => {
    for (let x = 0; x < 3; x++) {        
        for (let x_axis = 1; x_axis < 4; x_axis++) {
            for (let y_axis = 0; y_axis < 4; y_axis++) {
                if (grid[x_axis]![y_axis]! === grid[x_axis-1]![y_axis]!){
                    grid[x_axis]![y_axis]! += grid[x_axis-1]![y_axis]!
                    grid[x_axis-1]![y_axis]! = 0
                    totalScore += grid[x_axis]![y_axis]!
                }
                if (grid[x_axis]![y_axis]! === 0){
                    grid[x_axis]![y_axis]! = grid[x_axis-1]![y_axis]!
                    grid[x_axis-1]![y_axis]! = 0
                }
            }
        }
    }
}

const moveCubesUp = (grid: number[][]) => {
    for (let x = 0; x < 3; x++) {
        for (let x_axis = 0; x_axis < 4; x_axis++) {
            for (let y_axis = 0; y_axis < 3; y_axis++) {
                if (grid[x_axis]![y_axis]! === grid[x_axis]![y_axis+1]!){
                    grid[x_axis]![y_axis]! += grid[x_axis]![y_axis+1]!
                    grid[x_axis]![y_axis+1]! = 0
                    totalScore += grid[x_axis]![y_axis]!
                }
                if (grid[x_axis]![y_axis]! === 0){
                    grid[x_axis]![y_axis]! = grid[x_axis]![y_axis+1]!
                    grid[x_axis]![y_axis+1]! = 0
                }
            }
        }
    }
}

const moveCubesDown = (grid: number[][]) => {
    for (let x = 0; x < 3; x++) {
        for (let x_axis = 0; x_axis < 4; x_axis++) {
            for (let y_axis = 1; y_axis < 4; y_axis++) {
                if (grid[x_axis]![y_axis]! === grid[x_axis]![y_axis-1]!){
                    grid[x_axis]![y_axis]! += grid[x_axis]![y_axis-1]!
                    grid[x_axis]![y_axis-1]! = 0
                    totalScore += grid[x_axis]![y_axis]!
                }
                if (grid[x_axis]![y_axis]! === 0){
                    grid[x_axis]![y_axis]! = grid[x_axis]![y_axis-1]!
                    grid[x_axis]![y_axis-1]! = 0
                }
            }
        }
    }
}

const checkGameState = (grid: number[][]) => {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i]![j] === 2048){
                isGameRunning = false;
                console.log("you won")
                return true
            }
        }
    }

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i]![j] === 0) {
                return true
            }
        }
    }

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i]![j] === grid[i+1]![j]){
                return true
            }
        }
    }

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[i]![j] === grid[i]![j+1]){
                return true
            }
        }
    }

    isGameRunning = false;
    console.log("you lost")
    return false
}

const spawnCube = (grid: number[][]) => {
    let arr:number[][] = []
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i]![j] === 0){
                arr.push([i,j])
            }
        }
    }
    let random_index = Math.floor(Math.random() * arr.length)
    let i = arr[random_index]![0]!
    let j = arr[random_index]![1]!
    let random_number = Math.floor(Math.random()*10)+1
    random_number > 2 ? grid[i]![j] = 2 : grid[i]![j] = 4
}