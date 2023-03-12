var gridLen = 10
function drawBlock(obj,ctx,pixelx,pixely,bDrawGrid){
    if(bDrawGrid){
        ctx.strokeStyle = '#aaa'
        for(let i=0;i<3;i++){
            for(let j=0;j<3;j++){
                ctx.strokeRect(pixelx+i*gridLen,pixely+j*gridLen,gridLen,gridLen)
            }
        }
    }
    for(let i=0;i<3;i++){
        for(let j=0;j<3;j++){
            if(obj.at(i,j) == 1){
                ctx.strokeStyle = '#000'
                ctx.strokeRect(pixelx+i*gridLen,pixely+j*gridLen,gridLen,gridLen)
                ctx.strokeStyle = '#fff'
                if(i>0&&obj.at(i-1,j)==1){
                    ctx.clearRect(pixelx+i*gridLen-1,pixely+j*gridLen,2,gridLen)
                    //ctx.strokeRect(pixelx+i*gridLen-2,pixely+j*gridLen,4,gridLen)
                    // ctx.beginPath()
                     //ctx.moveTo(pixelx+i*gridLen,pixely+j*gridLen)
                     //ctx.lineTo(pixelx+i*gridLen,pixely+j*gridLen+gridLen)
                    // ctx.closePath()
                }
                if(j>0&&obj.at(i,j-1)==1){
                    ctx.clearRect(pixelx+i*gridLen,pixely+j*gridLen-1,gridLen,2)
                    //ctx.strokeRect(pixelx+i*gridLen-2,pixely+j*gridLen,gridLen,4)
                    // ctx.beginPath()
                     //ctx.moveTo(pixelx+i*gridLen,pixely+j*gridLen)
                     //ctx.lineTo(pixelx+i*gridLen+gridLen,pixely+j*gridLen)
                    // ctx.closePath()
                }
            }
        }
    }
    ctx.strokeStyle = '#000'
}

function drawBoard(obj,ctx,pixelx,pixely){
    for(let i=0;i<obj.blocks.length;i++){
        drawBlock(obj.blocks[i],ctx,pixelx+obj.blocks[i].x*gridLen,pixely+obj.blocks[i].y*gridLen,false)
    }
}

function drawBlockCollect(obj,ctx,pixelx,pixely){
    if(obj.select != -1){
        ctx.fillStyle = '#835'
        ctx.strokeStyle = '#835'
        let m = Math.trunc(obj.select / 10);
        let n = obj.select % 10;
        ctx.fillRect(pixelx+n*gridLen*4-gridLen*0.5,pixely+m*(gridLen*4+20)-gridLen*0.5,gridLen*4,gridLen*4)
    }
    for(let i=0;i<obj.length;i++){
        let m = Math.trunc(i / 10);
        let n = i % 10;
        drawBlock(obj[i],ctx,10+n*gridLen*4,10+m*(gridLen*4+20),true);
        ctx.fillText(obj[i].getCode(),10+n*gridLen*4,10+m*(gridLen*4+20)+gridLen*4)
    }
}

function clearCanvas(canvas,ctx){
    let canvasRect = canvas.getBoundingClientRect();
    ctx.clearRect(0,0,canvasRect.width,canvasRect.height)
}