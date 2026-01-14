import { COLORS } from "./Colors.js";
import { Tile } from "./Tile.js";

const body = document.body as HTMLBodyElement;
const scoreLabel = document.getElementById("score-label") as HTMLLabelElement
const recordLabel = document.getElementById("record-label") as HTMLLabelElement
const restartButton = document.getElementById("restart-button") as HTMLButtonElement
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")
const canvasBackground = document.getElementById("canvas-background") as HTMLCanvasElement;
const ctxBackground = canvasBackground.getContext("2d")
const ANIMATION_SPEED = 19;

if (!ctx) {
    throw new Error("Could not get 2D context");
}

if (!ctxBackground) {
    throw new Error("Could not get 2D context");
}

canvas.width = 320;
canvas.height = 320;

canvasBackground.width = 320;
canvasBackground.height = 320;

ctxBackground.rect(0,0,320,320)
ctxBackground.fillStyle = "gray"
ctxBackground.fill()

for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
        ctxBackground.beginPath()
        ctxBackground.rect(16+i*76,16+j*76,60,60)
        ctxBackground.fillStyle = COLORS[0]
        ctxBackground.fill()
    }
}

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
    spawnRandomTile()
    spawnRandomTile()
    spawnRandomTile()
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
            if (grid[xAxis]![yAxis]!.getValue() === 0){
                arr.push([xAxis,yAxis])
            }
        }
    }
    
    if (arr.length === 0) {
        return
    }

    let randomIndex = Math.floor(Math.random() * arr.length)
    let i = arr[randomIndex]![0]!
    let j = arr[randomIndex]![1]!
    let randomNumber = Math.floor(Math.random()*10)+1
    randomNumber > 2 
        ? grid[i]![j]!.setValue(2) 
        : grid[i]![j]!.setValue(4)
}

const drawGrid = () => {

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
            moveTilesLeft()
            break

        case "right":
            moveTilesRight()
            break

        case "up":
            moveTilesUp()
            break

        case "down":
            moveTilesDown()
            break

        default:
            break
    }

    if(compareTiles()){
        return
    }

    animate()
    setScore()
    drawGrid()
}

const moveTilesLeft = () => {
    for (let y = 0; y < 4; y++) {
        const row = [
            grid[0]![y]!,
            grid[1]![y]!,
            grid[2]![y]!,
            grid[3]![y]!
        ]

        const newRow: Tile[] = []
        let skip = false

        for (let i = 0; i < 4; i++) {
            if (skip) {
                skip = false;
                continue
            }

            const tile = row[i]!
            if (tile.getValue() === 0){
                continue
            }

            if (
                i < 3 &&
                tile.getValue() === row[i + 1]!.getValue() &&
                row[i + 1]!.getValue() !== 0
            ) {
                tile.setValue(tile.getValue() * 2)
                row[i + 1]!.setToRemove(true)
                skip = true
            }

            newRow.push(tile);
        }

        while (newRow.length < 4) {
            newRow.push(new Tile(0, 0))
        }

        for (let x = 0; x < 4; x++) {
            const tile = newRow[x]!
            tile.setTargetX(16 + x * 76)
            tile.setTargetY(16 + y * 76)
            grid[x]![y]! = tile
        }
    }
}

const moveTilesRight = () => {
    for (let y = 0; y < 4; y++) {
        const row = [
            grid[3]![y]!,
            grid[2]![y]!,
            grid[1]![y]!,
            grid[0]![y]!
        ]

        const newRow: Tile[] = []
        let skip = false

        for (let i = 0; i < 4; i++) {
            if (skip) {
                skip = false
                continue
            }

            const tile = row[i]!
            if (tile.getValue() === 0) continue

            if (
                i < 3 &&
                tile.getValue() === row[i + 1]!.getValue() &&
                row[i + 1]!.getValue() !== 0
            ) {
                tile.setValue(tile.getValue() * 2)
                row[i + 1]!.setToRemove(true)
                skip = true
            }

            newRow.push(tile)
        }

        while (newRow.length < 4) {
            newRow.push(new Tile(0, 0))
        }

        for (let x = 0; x < 4; x++) {
            const tile = newRow[x]!
            tile.setTargetX(16 + (3 - x) * 76)
            tile.setTargetY(16 + y * 76)
            grid[3 - x]![y]! = tile
        }
    }
}

const moveTilesUp = () => {
    for (let x = 0; x < 4; x++) {
        const col = [
            grid[x]![0]!,
            grid[x]![1]!,
            grid[x]![2]!,
            grid[x]![3]!
        ]

        const newCol: Tile[] = []
        let skip = false

        for (let i = 0; i < 4; i++) {
            if (skip) {
                skip = false
                continue
            }

            const tile = col[i]!
            if (tile.getValue() === 0) continue

            if (
                i < 3 &&
                tile.getValue() === col[i + 1]!.getValue() &&
                col[i + 1]!.getValue() !== 0
            ) {
                tile.setValue(tile.getValue() * 2)
                col[i + 1]!.setToRemove(true)
                skip = true
            }

            newCol.push(tile)
        }

        while (newCol.length < 4) {
            newCol.push(new Tile(0, 0))
        }

        for (let y = 0; y < 4; y++) {
            const tile = newCol[y]!
            tile.setTargetX(16 + x * 76)
            tile.setTargetY(16 + y * 76)
            grid[x]![y]! = tile
        }
    }
}

const moveTilesDown = () => {
    for (let x = 0; x < 4; x++) {
        const col = [
            grid[x]![3]!,
            grid[x]![2]!,
            grid[x]![1]!,
            grid[x]![0]!
        ]

        const newCol: Tile[] = []
        let skip = false

        for (let i = 0; i < 4; i++) {
            if (skip) {
                skip = false
                continue
            }

            const tile = col[i]!
            if (tile.getValue() === 0) continue

            if (
                i < 3 &&
                tile.getValue() === col[i + 1]!.getValue() &&
                col[i + 1]!.getValue() !== 0
            ) {
                tile.setValue(tile.getValue() * 2)
                col[i + 1]!.setToRemove(true)
                skip = true
            }

            newCol.push(tile)
        }

        while (newCol.length < 4) {
            newCol.push(new Tile(0, 0))
        }

        for (let y = 0; y < 4; y++) {
            const tile = newCol[y]!
            tile.setTargetX(16 + x * 76)
            tile.setTargetY(16 + (3 - y) * 76)
            grid[x]![3 - y]! = tile
        }
    }
}

const animate = () => {
    let animating = true

    const step = () => {
        animating = false
        cleatCanvas()

        forEachTile((tile) => {
            const tx = tile.getTargetX()
            const ty = tile.getTargetY()

            if (tx !== null) {
                const cx = tile.getCurrentX()
                const dx = tx - cx

                if (Math.abs(dx) > ANIMATION_SPEED) {
                    tile.setCurrentX(cx + Math.sign(dx) * ANIMATION_SPEED)
                    animating = true
                } else {
                    tile.setCurrentX(tx)
                    tile.setTargetX(null)
                }
            }

            if (ty !== null) {
                const cy = tile.getCurrentY()
                const dy = ty - cy

                if (Math.abs(dy) > ANIMATION_SPEED) {
                    tile.setCurrentY(cy + Math.sign(dy) * ANIMATION_SPEED)
                    animating = true
                } else {
                    tile.setCurrentY(ty)
                    tile.setTargetY(null)
                }
            }

            tile.drawTile(ctx)
        })

        if (animating) {
            requestAnimationFrame(step)
        } else {
            cleanupAfterAnimation()
            drawGrid()
        }
    }

    requestAnimationFrame(step)
}

const cleanupAfterAnimation = () => {
    forEachTile((tile) => {
        if (tile.getToRemove()) {
            tile.setValue(0)
            tile.setToRemove(false)
        }
    })

    spawnRandomTile()
}

const checkGameState = () => {
    for (let xAxis = 0; xAxis < 4; xAxis++) {
        for (let yAxis = 0; yAxis < 4; yAxis++) {
            if (grid[xAxis]![yAxis]!.getValue() >= 2048) {
                isGameRunning = false
                console.log("you won")
                return
            }
        }
    }

    for (let xAxis = 0; xAxis < 4; xAxis++) {
        for (let yAxis = 0; yAxis < 4; yAxis++) {
            if (grid[xAxis]![yAxis]!.getValue() === 0) {
                return
            }
        }
    }

    for (let xAxis = 0; xAxis < 3; xAxis++) {
        for (let yAxis = 0; yAxis < 4; yAxis++) {
            if (grid[xAxis]![yAxis]!.getValue() === grid[xAxis + 1]![yAxis]!.getValue()) {
                return
            }
        }
    }

    for (let xAxis = 0; xAxis < 4; xAxis++) {
        for (let yAxis = 0; yAxis < 3; yAxis++) {
            if (grid[xAxis]![yAxis]!.getValue() === grid[xAxis]![yAxis + 1]!.getValue()) {
                return
            }
        }
    }

    isGameRunning = false
    console.log("you lost")
}

const cloneGrids = () => {
    for (let xAxis = 0; xAxis < 4; xAxis++) {
        for (let yAxis = 0; yAxis < 4; yAxis++) {
            gridBefore[xAxis]![yAxis]!.setValue(grid[xAxis]![yAxis]!.getValue())
        }
    }
}

const compareTiles = (): boolean => {
    for (let xAxis = 0; xAxis < 4; xAxis++) {
        for (let yAxis = 0; yAxis < 4; yAxis++) {
            if (gridBefore[xAxis]![yAxis]!.getValue() !== grid[xAxis]![yAxis]!.getValue()) {
                return false
            }
        }
    }
    return true
}

start()