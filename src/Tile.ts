import { COLORS } from "./Colors.js";

export class Tile {
    private currentX: number;
    private currentY: number;
    private targetX: number | null = null;
    private targetY: number | null = null;
    private value: number;
    private toRemove: boolean = false;

    constructor (x:number, y:number) {
        this.currentX = x;
        this.currentY = y
        this.value = 0
    }

    public getCurrentX(): number {
        return this.currentX;
    }

    public setCurrentX(x: number): void {
        this.currentX = x;
    }

    public getCurrentY(): number {
        return this.currentY;
    }

    public setCurrentY(y: number): void {
        this.currentY = y;
    }

    public getTargetX(): number | null {
        return this.targetX;
    }

    public setTargetX(x: number | null): void {
        this.targetX = x;
    }

    public getTargetY(): number | null {
        return this.targetY;
    }

    public setTargetY(y: number | null): void {
        this.targetY = y;
    }

    public getValue(): number {
        return this.value;
    }

    public setValue(value: number): void {
        this.value = value;
    }

    public getToRemove(): boolean {
        return this.toRemove
    }

    public setToRemove(condition: boolean): void {
        this.toRemove = condition;
    }

    public drawTile = (ctx: CanvasRenderingContext2D) => {
        if (this.value > 0){
            ctx.beginPath()
            ctx.rect(this.currentX, this.currentY, 60, 60)
            ctx.fillStyle = COLORS[this.value as keyof typeof COLORS || 0] || "#0000FF"
            ctx.fill()

            ctx.fillStyle = "#0d0c0d"
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            ctx.font = "24px Arial";
            // + 30 offset for text to be in the middle of tile
            ctx.fillText(String(this.value), this.currentX+30, this.currentY+30);
        }
    }
}