import { Tile } from "./Tile.js";

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
let grid: Tile[][] = [];
let gridBefore: Tile[][] = [];

let touchStartX: number = 0;
let touchStartY: number = 0;
let touchEndX: number = 0;
let touchEndY: number = 0;

restartButton.addEventListener("click", () => {
    start()
})

body.addEventListener("keyup", (event: KeyboardEvent) => {
    let move: string;
    switch(event.key) {
        case("ArrowLeft"):
            move = "left"
            break;
        case("ArrowRight"):
            move = "right"
            break;
        case("ArrowUp"):
            move = "up"
            break;
        case("ArrowDown"):
            move = "down"
            break;
        default:
            return;
    }
    runGame(move);
})

canvas.addEventListener("touchstart", (e: TouchEvent) => {
    e.preventDefault();
    const touch = e.changedTouches.item(0);
    if (!touch) return;
    touchStartX = touch.screenX;
    touchStartY = touch.screenY;
}, {
    passive: false
})

canvas.addEventListener("touchend", (e: TouchEvent) => {
    e.preventDefault();

    const touch = e.changedTouches.item(0);
    if (!touch) return;
    touchEndX = touch.screenX;
    touchEndY = touch.screenY;

    handleGesture()
}, {
    passive: false
})

const handleGesture = () => {
    // left/right move
    if (Math.abs(touchStartX - touchEndX) > Math.abs(touchStartY - touchEndY) && Math.abs(touchStartX - touchEndX) > 20){
        if (touchStartX > touchEndX) {
            runGame("left");
        }
        else {
            runGame("right");
        }
    }
    // up/down move
    else if (Math.abs(touchStartX - touchEndX) < Math.abs(touchStartY - touchEndY) && Math.abs(touchStartX - touchEndX) > 20){
        if (touchStartY > touchEndY) {
            runGame("up");
        }
        else {
            runGame("down");
        }
    }

}

const cleatCanvas = () => {
    ctx.clearRect(0,0,320,320);
}

const start = () => {
    isGameRunning = true;
    totalScore = 0;
    setRecord()
    setScore()

    for (let xAxis = 0; xAxis < 4; xAxis++) {
        grid[xAxis] = []
        gridBefore[xAxis] = []
        for (let yAxis = 0; yAxis < 4; yAxis++) {
            //16+nAxis*76 16 is offset from left 
            //nAxis*76 76 is (60 + 16)*n where n is axis 
            grid[xAxis]![yAxis] = new Tile(16+xAxis*76,16+yAxis*76);
            gridBefore[xAxis]![yAxis] = new Tile(16+xAxis*76,16+yAxis*76);
        }
    }

    spawnRandomTile()
    drawGrid()
}

const forEachTile = (func: (tile: Tile) => void, startX: number = 0, startY: number = 0, endX: number = 4, endY: number = 4) => {
    for (let xAxis = startX; xAxis < endX; xAxis++) {
        for (let yAxis = startY; yAxis < endY; yAxis++) {
            const tile = grid[xAxis]?.[yAxis]!
            func(tile)
        }
    }
}

const spawnRandomTile = () => {
    let arr:number[][] = []

    for (let xAxis = 0; xAxis < 4; xAxis++) {
        for (let yAxis = 0; yAxis < 4; yAxis++) {
            if (grid[xAxis]![yAxis]?.getValue() === 0){
                arr.push([xAxis,yAxis])
            }
        }
    }
    let randomIndex = Math.floor(Math.random() * arr.length)
    let i = arr[randomIndex]![0]!
    let j = arr[randomIndex]![1]!
    let randomNumber = Math.floor(Math.random()*10)+1
    randomNumber > 2 ? grid[i]![j]!.setValue(2) : grid[i]![j]!.setValue(4)
}

const drawGrid = () => {
    ctx.rect(0,0,320,320)
    ctx.fillStyle = "gray"
    ctx.fill()

    forEachTile((tile) => {
        tile.drawTile(ctx)
    })
}

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

const runGame = (move: string) => {
    checkGameState()

    if (!isGameRunning){
        return
    }
    
    cloneGrids()

    switch (move){
        case "left":
            break

        case "right":
            break

        case "up":
            break

        case "down":
            break

        default:
            break
    }

    if(!compareTiles()){
        return
    }

    setScore()
    spawnRandomTile()
}

const checkGameState = () => {

}

const cloneGrids = () => {
    for (let xAxis = 0; xAxis < 4; xAxis++) {
        for (let yAxis = 0; yAxis < 4; yAxis++) {
            gridBefore[xAxis]![yAxis]?.setCurrentX(grid[xAxis]![yAxis]?.getCurrentX()!)
            gridBefore[xAxis]![yAxis]?.setCurrentY(grid[xAxis]![yAxis]?.getCurrentY()!)
            gridBefore[xAxis]![yAxis]?.setTargetX(grid[xAxis]![yAxis]?.getTargetX()!)
            gridBefore[xAxis]![yAxis]?.setTargetY(grid[xAxis]![yAxis]?.getTargetY()!)
            gridBefore[xAxis]![yAxis]?.setValue(grid[xAxis]![yAxis]?.getValue()!)
        }
    }
}

const compareTiles = (): boolean => {
    for (let xAxis = 0; xAxis < 4; xAxis++) {
        for (let yAxis = 0; yAxis < 4; yAxis++) {
            const tileBefore = gridBefore[xAxis]![yAxis]
            const tileAfter = grid[xAxis]![yAxis]

            if (!tileBefore || !tileAfter) {
                return false
            }

            if (!tileBefore.isEqual(tileAfter)){
                return false
            }
        }
    }
    return true
}

start()