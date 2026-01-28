export function initDraw(canvas:HTMLCanvasElement){
    const ctx = canvas.getContext("2d");
    if(!ctx){
        return;
    }
    //** logic for rectangle ** */

    
    ctx.fillStyle = "rgba(0,0,0)";
    //canvas width and height are relative to the viewport for screen or canvas element
    ctx.fillRect(0,0,canvas.width, canvas.height);

    let clicked = false;
    let startX = 0;
    let startY = 0;

    canvas.addEventListener("mousedown", (e)=>{
        clicked  = true ;
        //e.clientX and e.clientY are relative to the viewport for mouse events
        startX = e.clientX;
        startY = e.clientY;
    })

    canvas.addEventListener("mouseup", (e)=>{
        clicked = false;
        console.log(e.clientX);
        console.log(e.clientY);
    })

    canvas.addEventListener("mousemove", (e)=>{
        if(clicked){
            const width = e.clientX - startX;
            const height = e.clientY - startY;
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle = "rgba(0,0,0)";
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.strokeStyle = "rgba(255,255,255)";
            ctx.strokeRect(startX,startY,width,height);
        }
    })
    
}