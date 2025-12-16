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

draw_grid()