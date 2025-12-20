const body = document.body as HTMLBodyElement;
const score_label = document.getElementById("score-label") as HTMLLabelElement
const record_label = document.getElementById("record-label") as HTMLLabelElement
const restart_button = document.getElementById("restart-button") as HTMLButtonElement
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")

if (!ctx) {
    throw new Error("Could not get 2D context");
}

canvas.width = 320;
canvas.height = 320;

let is_game_running: boolean = true;

const grid: number[][] = Array.from(
    { length: 4}, 
    () => Array(4).fill(0)
);

const clear_canvas = () => {
    ctx.clearRect(0,0,320,320);
}

const draw_grid = () => {
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

const draw_cubes = (grid: number[][]) => {
    const colors = {
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

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i]![j] !== 0){
                ctx.beginPath()
                ctx.rect(16+i*76,16+j*76,60,60)
                ctx.fillStyle = colors[grid[i]![j]! as keyof typeof colors || 2] || "#0000FF"
                ctx.fill()
                ctx.fillStyle = "black"
                ctx.textAlign = "center"
                ctx.textBaseline = "middle"
                ctx.font = "24px Arial";
                ctx.fillText(String(grid[i]![j]),16+i*76+30,16+j*76+30);
            }
        }
    }
}

draw_grid()
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
draw_cubes(grid)

body.addEventListener("keyup", (event: KeyboardEvent) => {
    check_game_state(grid)

    if (!is_game_running){
        return
    }
    
    let gridBefore = JSON.parse(JSON.stringify(grid));

    switch(event.key) {
        case("ArrowLeft"):
            move_cubes_left(grid)
            break;
        case("ArrowRight"):
            move_cubes_right(grid)
            break;
        case("ArrowUp"):
            move_cubes_up(grid)
            break;
        case("ArrowDown"):
            move_cubes_down(grid)
            break;
        default:
            return;
    }

    if(JSON.stringify(gridBefore) === JSON.stringify(grid)){
        return
    }

    draw_grid()
    spawn_cube(grid)
    draw_cubes(grid)
})

const setScore = (score: number) => {
    score_label.textContent = `Score: ${score}`
}

const getRecord = () => {
    let record: number = Number(localStorage.getItem("Record")) || 0;
    return record
}

const setRecord = (score: number) => {
    if (score >= getRecord()){
        localStorage.setItem("Record", String(score));
        record_label.textContent = `Record: ${score}`
    }
    else {
        record_label.textContent = `Record: ${getRecord()}`
    }
}

restart_button.addEventListener("click", () => {
    setScore(0)
    getRecord()
    setRecord(0)

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            grid[i]![j] = 0
        }
    }
    draw_grid()
    spawn_cube(grid)
    draw_cubes(grid)
})

const move_cubes_left = (grid: number[][]) => {
    for (let x = 0; x < 3; x++) {        
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 4; j++) {
                if (grid[i]![j]! === grid[i+1]![j]!){
                    grid[i]![j]! += grid[i+1]![j]!
                    grid[i+1]![j]! = 0
                }
                if (grid[i]![j]! === 0){
                    grid[i]![j]! = grid[i+1]![j]!
                    grid[i+1]![j]! = 0
                }
            }
        }
    }

}

const move_cubes_right = (grid: number[][]) => {
    for (let x = 0; x < 3; x++) {        
        for (let i = 1; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (grid[i]![j]! === grid[i-1]![j]!){
                    grid[i]![j]! += grid[i-1]![j]!
                    grid[i-1]![j]! = 0
                }
                if (grid[i]![j]! === 0){
                    grid[i]![j]! = grid[i-1]![j]!
                    grid[i-1]![j]! = 0
                }
            }
        }
    }
}

const move_cubes_up = (grid: number[][]) => {
    for (let x = 0; x < 3; x++) {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[i]![j]! === grid[i]![j+1]!){
                    grid[i]![j]! += grid[i]![j+1]!
                    grid[i]![j+1]! = 0
                }
                if (grid[i]![j]! === 0){
                    grid[i]![j]! = grid[i]![j+1]!
                    grid[i]![j+1]! = 0
                }
            }
        }
    }
}

const move_cubes_down = (grid: number[][]) => {
    for (let x = 0; x < 3; x++) {
        for (let i = 0; i < 4; i++) {
            for (let j = 1; j < 4; j++) {
                if (grid[i]![j]! === grid[i]![j-1]!){
                    grid[i]![j]! += grid[i]![j-1]!
                    grid[i]![j-1]! = 0
                }
                if (grid[i]![j]! === 0){
                    grid[i]![j]! = grid[i]![j-1]!
                    grid[i]![j-1]! = 0
                }
            }
        }
    }
}

const check_game_state = (grid: number[][]) => {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i]![j] === 2048){
                is_game_running = false;
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

    is_game_running = false;
    console.log("you lost")
    return false
}

const spawn_cube = (grid: number[][]) => {
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