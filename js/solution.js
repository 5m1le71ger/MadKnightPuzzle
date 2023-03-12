function getSerialModel(serial){
    let model = {}
    for(let i=0;i<serial.length;i++){
        let code = blockCollect[serial[i]].getCode()
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

function solution(blockCollect)
{
    let boardSolution = new Array()
    let serials = new Array()
    let models = new Array()
    blockCollect.traverseBySum(25,function(serial){
        let model = getSerialModel(serial)
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
                    if(board.isCanPlace(blockCollect[serial[i]],x,y)){
                        board.place(blockCollect[serial[i]],x,y)
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

async function solutionAsync(blockCollect,funcProgress)
{
    funcProgress('开始搜索所有能凑齐25块的组合...')
    let boardSolution = new Array()
    let serials = new Array()
    let models = new Array()
    let r = await blockCollect.traverseBySumAsync(25,async function(serial){
        let model = getSerialModel(serial)
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
            await mathpc.PAllAsync(serial.length,async function(serialP){
               await wait(1).then(async ()=>{
                    let serialCopy = new Array()
                    for(let i=0;i<serialP.length;i++){
                        serialCopy.push(serial[serialP[i]])
                    }
                    serials.push(serialCopy)
               })
            })
        }
        var debug = 1
    },funcProgress)
    for(let index=0;index<serials.length;index++){
        let per = Math.trunc(index * 100 / serials.length)
        funcProgress('开始遍历排列搜索到的组合:'+per+'%,'+index+'/'+serials.length)
        //console.info('index='+index)
        await wait(1).then(()=>{
            let board = Board()
            board.init()
            let serial = serials[index]
            let placedAll = true
            for(let i=0;i<serial.length;i++){
                let placed = false
                for(let x=0;x<7;x++){
                    for(let y=0;y<7;y++){
                        if(board.isCanPlace(blockCollect[serial[i]],x,y)){
                            board.place(blockCollect[serial[i]],x,y)
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
        })
    }

   return boardSolution
}