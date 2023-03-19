function getSerialModel(bc,serial){
    let model = {}
    for(let i=0;i<serial.length;i++){
        let code = bc[serial[i]].getCode()
        if(model[code] === undefined){
            model[code] = 1
        }else{
            model[code] ++
        }
    }
    return model;
}
//https://www.coder.work/article/934323
function compareMaps(map1, map2) {
    var testVal;
    if (map1.size !== map2.size) {
        return false;
    }
    for (const [key, val] of map1.entries()) {
        testVal = map2.get(key);
        // in cases of an undefined value, make sure the key
        // actually exists on the object so there are no false positives
        if (testVal !== val || (testVal === undefined && !map2.has(key))) {
            return false;
        }
    }
    return true;
}

function solution(bc)
{
    let boardSolution = new Array()
    let serials = new Array()
    let models = new Array()
    bc.traverseBySum(25,function(serial){
        let model = getSerialModel(bc,serial)
        let s_model = JSON.stringify(model)
        let bMatched = false;
        for(let i=0;i<models.length;i++){
            let s_model2 = JSON.stringify(models[i])
            if(s_model == s_model2){
                bMatched = true
                break;
            }
        }
        if(!bMatched){
            models.push(model)
            mathpc.PAll(serial.length,function(serialP){
                let serialCopy = new Array()
                for(let i=0;i<serialP.length;i++){
                    serialCopy.push(serial[serialP[i]])
                }
                serials.push(serialCopy)
            })
        }
    })
    for(let index=0;index<serials.length;index++){
        let board = Board()
        board.init()
        let serial = serials[index]
        let placedAll = true
        for(let i=0;i<serial.length;i++){
            let placed = false
            for(let x=0;x<7;x++){
                for(let y=0;y<7;y++){
                    if(board.isCanPlace(bc[serial[i]],x,y)){
                        board.place(bc[serial[i]],x,y)
                        console.info('board:place(' + x + ',' + y + ')')
                        console.info(board.dump())
                        placed = true
                        break;
                    }
                }
                if(placed){
                    break;
                }
            }
            if(!placed){
                placedAll = false
                break;
            }
        }
        if(placedAll){
            let bFind = false
            for(let i=0;i<boardSolution.length;i++){
                if(boardSolution[i].equal(board)){
                    bFind = true;
                    break;
                }
            }
            if(!bFind){
                boardSolution.push(board)
            }
        }
    }
    return boardSolution
}

async function onTraverseBySumAsync(bc,serial,progressInfo,serials,models){
    let f = async () =>{
        let model = getSerialModel(bc,serial)
        let s_model = JSON.stringify(model)
        let bMatched = false;
        for(let i=0;i<models.length;i++){
            let s_model2 = JSON.stringify(models[i])
            if(s_model == s_model2){
                bMatched = true
                break;
            }
        }
        if(!bMatched){
            models.push(model)
            let count = mathpc.PCount(serial.length,serial.length)
            let index = 0;
            await mathpc.PAllAsync(serial.length,async function(serialP){
                index ++
                let f = () =>{
                    let serialCopy = new Array()
                    for(let i=0;i<serialP.length;i++){
                        serialCopy.push(serial[serialP[i]])
                    }
                    serials.push(serialCopy)
                }
                if(timerFlag){
                    timerFlag = false
                    await wait(1).then(async ()=>{
                        funcProgress(progressInfo + ', ' + index + '/' + count)
                        await f()
                    })
                }else{
                    await f()
                }
            })
        }
    }
    if(timerFlag){
        timerFlag = false
        await wait(1).then(async ()=>{
            funcProgress(progressInfo)
            f()
        })
    }else{
        f()
    }
}
async function solutionAsync(bc,funcProgress)
{
    funcProgress('开始搜索所有能凑齐25块的组合...')
    let boardSolution = new Array()
    let serials = new Array()
    let models = new Array()
    let r = await bc.traverseBySumAsync(25,async function(serial,progressInfo){
        await onTraverseBySumAsync(bc,serial,progressInfo,serials,models)
    },funcProgress)
    for(let index=0;index<serials.length;index++){
            if(index == 46){
                debugger
            }
        let f = ()=>{
            let board = Board()
            board.init()
            let serial = serials[index]
            let placedAll = true
            for(let i=0;i<serial.length;i++){
                let placed = false
                for(let x=0;x<7;x++){
                    for(let y=0;y<7;y++){
                        if(board.isCanPlace(bc[serial[i]],x,y)){
                            board.place(bc[serial[i]],x,y)
                            //console.info('board:place(' + x + ',' + y + ')')
                            //console.info(board.dump())
                            placed = true
                            break;
                        }
                    }
                    if(placed){
                        break;
                    }
                }
                if(!placed){
                    placedAll = false
                    break;
                }
            }
            if(placedAll){
                let bFind = false
                for(let i=0;i<boardSolution.length;i++){
                    if(boardSolution[i].equal(board)){
                        bFind = true;
                        break;
                    }
                }
                if(!bFind){
                    boardSolution.push(board)
                }
            }
        }
        if(timerFlag){
            timerFlag = false
            await wait(1).then(async ()=>{
                let per = Math.trunc(index * 100 / serials.length)
                funcProgress('开始遍历排列搜索到的组合:'+per+'%,'+index+'/'+serials.length)
                f();
            })
        }else{
            f()
        }
    }

   return boardSolution
}