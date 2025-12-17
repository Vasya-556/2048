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

const draw_cube = (grid: number[][]) => {
    const colors = {
        2: "#0000FF",
        4: "#00FF00",
        8: "#00FFFF",
        16: "#800000",
        32: "#FF00FF",
        128: "#FFFF00",
        256: "#0080FF",
        512: "#00FF80",
        1024: "#8000FF",
        2048: "#FF8000"
    }

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            console.log(grid[i]![j])
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
grid[1]![0] = 2048
grid[1]![1] = 128
grid[1]![2] = 64
grid[1]![3] = 8
draw_cube(grid)