import {Tool} from "@/draw/tools";
import { getexistingShapes } from "./htttp";

type Shapes = {
    type : "rect";
    x : number;
    y : number;
    width : number;
    height : number;
    id : string;
    color?: string;
    lineWidth?: number;
} | {
    type: "circle";
    centerX: number;
    centerY: number;
    radiusX: number;
    radiusY: number;
    id : string;
    color?: string;
    lineWidth?: number;
} |  {
    type: "pencil";
    points : {x : number , y : number}[] // array of points
    id : string;
    color?: string;
    lineWidth?: number;
} | {
    type : "line";
    startX : number;
    startY : number;
    endX : number;
    endY : number;
    id : string;
    color?: string;
    lineWidth?: number;
} | {
    type : "arrow";
    startX : number;
    startY : number;
    endX : number;
    endY : number;
    id : string;
    color?: string;
    lineWidth?: number;
} | {
    type : "diamond";
    x : number;
    y : number;
    width : number;
    height : number;
    id : string;
    color?: string;
    lineWidth?: number;
} | {
    type : "text";
    x : number;
    y : number;
    text : string;
    id : string;
    color?: string;
    lineWidth?: number;
}

export class Game {
    private canvas : HTMLCanvasElement;
    private ctx : CanvasRenderingContext2D;
    private existingShapes : Shapes[] ;
    private roomId : string;
    private clicked : boolean;
    private startX = 0;
    private startY = 0;
    private selectedTool : Tool = "selection";
    private currentPencilPoints : {x : number , y : number}[] = [];
    private bgColor : string = "#121212";
    private strokeColor : string = "#ffffff";
    private lineWidth : number = 2;

    private socket : WebSocket;
    

    constructor(canvas : HTMLCanvasElement , roomId : string , socket : WebSocket){
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.roomId = roomId;
        this.existingShapes = [];
        this.socket = socket;
        this.clicked = false;
        this.init();
        this.initHandlers();
        this.initMouseHandlers();
        
    }

    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler)

        this.canvas.removeEventListener("mouseup", this.mouseUpHandler)

        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler)
    }

    setTool(tool: "circle" | "pencil" | "rect" | "line" | "arrow" | "diamond" | "text" | "eraser" | "selection") {
        this.selectedTool = tool;
    }

    setBgColor(color: string) {
        this.bgColor = color;
        this.clearCanvas();
    }

    setStrokeColor(color: string) {
        this.strokeColor = color;
    }

    setLineWidth(width: number) {
        this.lineWidth = width;
    }
    async init(){
        this.existingShapes = await getexistingShapes(this.roomId);
        this.clearCanvas();
    } 

    initHandlers(){
        this.socket.onmessage = (event) =>{
        const message = JSON.parse(event.data);

        if(message.type == 'chat'){
            const parsedShape = JSON.parse(message.message);
            this.existingShapes.push(parsedShape);
            this.clearCanvas();
        }else if (message.type === 'delete_shape') { 
            this.existingShapes = this.existingShapes.filter(x => x.id !== message.shapeId);
            this.clearCanvas();
        }
    } 
    }
    

    clearCanvas(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
     this.ctx.fillStyle = this.bgColor;
     this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);

     this.existingShapes.map((shape)=>{
        const shapeColor = shape.color || "#ffffff";
        const shapeLineWidth = shape.lineWidth || 2;
        this.ctx.strokeStyle = shapeColor;
        this.ctx.lineWidth = shapeLineWidth;

        if (shape.type === "rect"){
            this.ctx.strokeRect(shape.x,shape.y,shape.width,shape.height);
        }else if (shape.type === "circle"){
            this.ctx.beginPath();
            this.ctx.ellipse(shape.centerX,shape.centerY,shape.radiusX,shape.radiusY,0,0,Math.PI*2);
            this.ctx.stroke(); 
            this.ctx.closePath(); 
        }else if (shape.type === "line"){
            this.ctx.beginPath();
            this.ctx.moveTo(shape.startX,shape.startY);
            this.ctx.lineTo(shape.endX,shape.endY);
            this.ctx.stroke();
            this.ctx.closePath();
        }else if (shape.type === "arrow"){
             const headLength = 10;
             const dx = shape.endX - shape.startX;
             const dy = shape.endY - shape.startY;
             const angle = Math.atan2(dy, dx);
    
             this.ctx.beginPath();
             this.ctx.moveTo(shape.startX, shape.startY);
             this.ctx.lineTo(shape.endX, shape.endY);
            
             // Draw arrow head
             this.ctx.lineTo(
                shape.endX - headLength * Math.cos(angle - Math.PI / 6),
                shape.endY - headLength * Math.sin(angle - Math.PI / 6)); //first line of arrow head
            
                this.ctx.moveTo(shape.endX, shape.endY); //move to the end point of the arrow to draw the second line of arrow head
            
                this.ctx.lineTo(
                shape.endX - headLength * Math.cos(angle + Math.PI / 6), 
                shape.endY - headLength * Math.sin(angle + Math.PI / 6)); //second line of arrow head
             
             this.ctx.stroke();
             this.ctx.closePath();
        }else if (shape.type === "diamond") {
            const centerX = shape.x + shape.width / 2;
            const centerY = shape.y + shape.height / 2;

            this.ctx.beginPath();
            this.ctx.moveTo(centerX, shape.y); // Top
            this.ctx.lineTo(shape.x + shape.width, centerY); // Right
            this.ctx.lineTo(centerX, shape.y + shape.height); // Bottom
            this.ctx.lineTo(shape.x, centerY); // Left
            this.ctx.closePath();
            this.ctx.stroke();
        } else if (shape.type === "pencil") {
            this.ctx.beginPath();
            // Move to the first point
            this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
            // Draw lines to every subsequent point
            shape.points.forEach(point => {
                this.ctx.lineTo(point.x, point.y);
            });
            this.ctx.stroke();
            this.ctx.closePath();

        } else if (shape.type === "text") {
            const fontSize = 16 + (shapeLineWidth * 4);
            this.ctx.font = `${fontSize}px sans-serif`;
            this.ctx.fillStyle = shapeColor;
            this.ctx.textBaseline = "top";
            this.ctx.fillText(shape.text, shape.x, shape.y);

        }
     })
    }

    mouseDownHandler = (e: MouseEvent)=>{
        this.clicked = true;
        this.startX = e.clientX;
        this.startY = e.clientY;

        if (this.selectedTool === "pencil") {
            this.currentPencilPoints = [ { x: e.clientX, y: e.clientY } ];
            
        }else if (this.selectedTool === "text") {
            // Call the new helper method 
             this.createInput(e.clientX, e.clientY);
             return;
        }else if (this.selectedTool === "eraser") {
            this.clicked = false;
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            // Check if any shape was clicked
            for (let i = this.existingShapes.length - 1; i >= 0; i--) {
                const shape = this.existingShapes[i];

                if(this.isPointInShape(shape,mouseX,mouseY)){
                    this.existingShapes.splice(i,1);
                    this.clearCanvas();

                    //to broadcast the deletion to other user and delete it in db 
                    if (this.socket.readyState === WebSocket.OPEN) {
                        this.socket.send(JSON.stringify({
                        type : "delete_shape",
                        shapeId : shape.id,
                        roomId : this.roomId
                        }));
                    }
                    return;


                }
            }
            return;
            
        }
         
    
    }

    mouseUpHandler= (e : MouseEvent)=>{
        this.clicked = false;
        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;

        const selectedTool = this.selectedTool;
        let shape : Shapes | null = null;

        if(selectedTool == "rect"){
            shape = {
            type: "rect",
            x : this.startX,
            y: this.startY,
            height,
            width,
            id : Date.now().toString(36) + Math.random().toString(36).substr(2),
            color: this.strokeColor,
            lineWidth: this.lineWidth
        }

        }else if(selectedTool == "circle"){
            const radiusX = Math.abs(width)/ 2;
            const radiusY = Math.abs(height)/ 2;

            shape  = {
                type : "circle",
                radiusX : radiusX,
                radiusY : radiusY,
                centerX : this.startX + (width / 2),
                centerY : this.startY + (height / 2),
                id : Date.now().toString(36) + Math.random().toString(36).substr(2),
                color: this.strokeColor,
                lineWidth: this.lineWidth
            }

        }else if(selectedTool == "line"){
            shape = {
                type : "line",
                startX : this.startX,
                startY : this.startY,
                endX : e.clientX,
                endY : e.clientY,
                id : Date.now().toString(36) + Math.random().toString(36).substr(2),
                color: this.strokeColor,
                lineWidth: this.lineWidth
            }
        }else if(selectedTool == "arrow"){
            shape = {
                type : "arrow",
                startX : this.startX,
                startY : this.startY,
                endX : e.clientX,
                endY : e.clientY,
                id : Date.now().toString(36) + Math.random().toString(36).substr(2),
                color: this.strokeColor,
                lineWidth: this.lineWidth
            }
        }else if(selectedTool == "diamond"){
            shape = {
                type : "diamond",
                x : this.startX,
                y: this.startY,
                height,
                width,
                id : Date.now().toString(36) + Math.random().toString(36).substr(2),
                color: this.strokeColor,
                lineWidth: this.lineWidth
            }
        }else if (selectedTool == "pencil"){
            shape = {
                type : "pencil",
                points : [...this.currentPencilPoints],
                id : Date.now().toString(36) + Math.random().toString(36).substr(2),
                color: this.strokeColor,
                lineWidth: this.lineWidth
            }
            
        }

        if(!shape){
            return;
        }
        this.existingShapes.push(shape);
        
        
        

        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                type: "chat",
                message: JSON.stringify(shape),
                roomId: this.roomId
            }));
        }
    
    }

    mouseMoveHandler = (e : MouseEvent)=>{
        if(this.clicked){
            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY;
           this.clearCanvas();
            this.ctx.strokeStyle = this.strokeColor;
            this.ctx.lineWidth = this.lineWidth;

            const selectedTool = this.selectedTool;

            if (selectedTool == "rect"){
                this.ctx.strokeRect(this.startX,this.startY,width,height);

            }else if (selectedTool == "circle"){
                const centreX = this.startX + width / 2 ;
                const centreY = this.startY + height / 2 ;
                const radiusY =  Math.abs(height) / 2;
                const radiusX =  Math.abs(width) / 2;
                this.ctx.beginPath();
                this.ctx.ellipse(centreX,centreY,radiusX,radiusY,0,0,Math.PI*2);
                this.ctx.stroke(); 
                this.ctx.closePath();

            }else if(selectedTool == "line"){
                this.ctx.beginPath(); 
                this.ctx.moveTo(this.startX,this.startY); // Set a start-point
                this.ctx.lineTo(e.clientX,e.clientY); // Set an end-point
                this.ctx.stroke(); // Draw the line
                this.ctx.closePath(); 

            }else if(selectedTool == "arrow"){
                const headLength = 10;
                const dx = e.clientX - this.startX;
                const dy = e.clientY - this.startY;
                const angle = Math.atan2(dy, dx);
    
                this.ctx.beginPath();
                this.ctx.moveTo(this.startX, this.startY);
                this.ctx.lineTo(e.clientX, e.clientY);
                
                // Draw arrow head
                this.ctx.lineTo(
                    e.clientX - headLength * Math.cos(angle - Math.PI / 6), //first line of arrow head
                    e.clientY - headLength * Math.sin(angle - Math.PI / 6));
                this.ctx.moveTo(e.clientX, e.clientY); //move to the end point of the arrow to draw the second line of arrow head
                this.ctx.lineTo(
                    e.clientX - headLength * Math.cos(angle + Math.PI / 6), //second line of arrow head
                    e.clientY - headLength * Math.sin(angle + Math.PI / 6));
                this.ctx.stroke();
                this.ctx.closePath();
                
            }else if (selectedTool === "diamond") {
                const centerX = this.startX + width / 2;
                const centerY = this.startY + height / 2;

                this.ctx.beginPath();
                this.ctx.moveTo(centerX, this.startY); // Top
                this.ctx.lineTo(this.startX + width, centerY); // Right
                this.ctx.lineTo(centerX, this.startY + height); // Bottom
                this.ctx.lineTo(this.startX, centerY); // Left
                this.ctx.closePath();
                this.ctx.stroke();
            } else if (selectedTool === "pencil") {
                this.currentPencilPoints.push({ x: e.clientX, y: e.clientY });
                this.ctx.beginPath();
                this.ctx.moveTo(this.currentPencilPoints[0].x, this.currentPencilPoints[0].y);
                this.currentPencilPoints.forEach(point => {
                    this.ctx.lineTo(point.x, point.y);
                });
                this.ctx.stroke();
                this.ctx.closePath();
            }
            
        }
    }

    initMouseHandlers(){
        this.canvas.addEventListener("mousedown", this.mouseDownHandler);
        this.canvas.addEventListener("mouseup", this.mouseUpHandler);
        this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
    }

    createInput(x: number, y: number) {
        const input = document.createElement("textarea");

        input.style.position = "fixed";
        input.style.left = `${x}px`;
        input.style.top = `${y}px`;
        input.style.background = "transparent";
        input.style.border = "none";
        input.style.outline = "none";
        input.style.color = this.strokeColor;
        const fontSize = 16 + (this.lineWidth * 4);
        input.style.font = `${fontSize}px sans-serif`;
        input.style.padding = "0";
        input.style.margin = "0";
        input.style.resize = "none";
        input.style.overflow = "hidden";
        input.style.zIndex = "10000";

        document.body.appendChild(input);

        // Auto-focus with a slight delay ensures it works in all browsers
        setTimeout(() => input.focus(), 0);

        const handleBlur = () => {
            const text = input.value;
            if (text.trim()) {
                const shape: Shapes = {
                    type: "text",
                    x: x,
                    y: y,
                    text: text,
                    id : Date.now().toString(36) + Math.random().toString(36).substr(2),
                    color: this.strokeColor,
                    lineWidth: this.lineWidth
                };
                this.existingShapes.push(shape);
                
                if (this.socket.readyState === WebSocket.OPEN) {
                    this.socket.send(JSON.stringify({
                        type: "chat",
                        message: JSON.stringify(shape),
                        roomId: this.roomId
                    }));
                }
                 this.clearCanvas();
            }
            if (document.body.contains(input)) {
                document.body.removeChild(input);
            }
        };

        input.addEventListener("keydown", (e) => {
             if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                input.blur(); // Trigger handleBlur
            }
            if (e.key === "Escape") {
                input.value = ""; // Clear so nothing saves
                input.blur();
            }
        });

        input.addEventListener("blur", handleBlur);
    }

    isPointInShape(shape: Shapes, x: number, y: number): boolean {
        if (shape.type === "rect") {
            const minX = Math.min(shape.x, shape.x + shape.width);
            const maxX = Math.max(shape.x, shape.x + shape.width);
            const minY = Math.min(shape.y, shape.y + shape.height);
            const maxY = Math.max(shape.y, shape.y + shape.height);
            return x >= minX && x <= maxX && y >= minY && y <= maxY;
        } else if (shape.type === "circle") {
             const dx = x - shape.centerX;
             const dy = y - shape.centerY;
             return (dx * dx + dy * dy) <= (shape.radiusX * shape.radiusX); 
        } else if (shape.type === "line" || shape.type === "arrow") {
            const dist = this.distanceToSegment(x, y, shape.startX, shape.startY, shape.endX, shape.endY);
            return dist < 5; 
        } else if (shape.type === "text") {
             return x >= shape.x && x <= shape.x + (shape.text.length * 15) &&
                    y >= shape.y && y <= shape.y + 24;
        } else if (shape.type === "diamond") {
            // Check if point is inside diamond by converting coords
            
            // Normalize diamond center
            const cx = shape.x + shape.width / 2;
            const cy = shape.y + shape.height / 2;
            
            const dx = Math.abs(x - cx);
            const dy = Math.abs(y - cy);
            
            const halfWidth = Math.abs(shape.width) / 2;
            const halfHeight = Math.abs(shape.height) / 2;

            if (halfWidth === 0 || halfHeight === 0) return false;

            return (dx / halfWidth + dy / halfHeight) <= 1;
        } else if (shape.type === "pencil") {
            // Check distance to any segment in the pencil path
            for (let i = 0; i < shape.points.length - 1; i++) {
                const p1 = shape.points[i];
                const p2 = shape.points[i+1];
                if (this.distanceToSegment(x, y, p1.x, p1.y, p2.x, p2.y) < 5) {
                    return true;
                }
            }
            return false;
        }
        return false;
    }

    distanceToSegment(x: number, y: number, x1: number, y1: number, x2: number, y2: number) {
        const A = x - x1;
        const B = y - y1;
        const C = x2 - x1;
        const D = y2 - y1;
        const dot = A * C + B * D;
        const len_sq = C * C + D * D;
        let param = -1;
        if (len_sq != 0) param = dot / len_sq;
        let xx, yy;
        if (param < 0) { xx = x1; yy = y1; }
        else if (param > 1) { xx = x2; yy = y2; }
        else { xx = x1 + param * C; yy = y1 + param * D; }
        const dx = x - xx;
        const dy = y - yy;
        return Math.sqrt(dx * dx + dy * dy);
      }

}
