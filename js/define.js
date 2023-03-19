var timerFlag = false
function wait(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

function TimeoutTravese(array,index,step,func){
    setTimeout(function(){
        let stepReal = step
        if(index + step > array.length){
            stepReal = array.length - index - 1
        }
        for(let i=0;i<stepReal;i++){
            func(array[index+i])
        }
        if(index + step < a.length){
            trav(array,index+stepReal,step,func)
        }
    },1)
}
function ArrayDim2(_row,_col) {
    let obj = {
        row: _row,
        col: _col,
        buffer: new Array(_row * _col),
        copyfrom: (obj2) =>{
            obj.row=obj2.row
            obj.col=obj2.col
            for(let i=0;i<obj.row*obj.col;i++){
                obj.buffer[i]=obj2.buffer[i];
            }
            return obj
        },
        at: (i,j) =>{
            return obj.buffer[j*obj.row +i];
        },
        set: (i,j,v) =>{
            obj.buffer[j*obj.row +i] = v;
        },
        traverse : (func) =>{
            for(let j=0;j<obj.row;j++){
                for(let i=0;i<obj.col;i++){
                    func(i,j,obj.at(i,j))
                }
            }
        }

    }
    return obj
}
function Block(){
    let obj = ArrayDim2(3,3)
    obj.blockSize = 0
    obj.init = function(s){
        if(s.length!=3){
            return null 
        }
        for(let j=0;j<3;j++){
            if(parseInt(s[j]) < 0 || parseInt(s[j]) > 7)
            return null 
        }
        let table = [ [0,0,0],[0,0,1],[0,1,0],[0,1,1],[1,0,0],[1,0,1],[1,1,0],[1,1,1] ]
        for(let j=0;j<3;j++){
            let num = parseInt(s[j])
            if(0 <= num && num <= 7){
                for(let i=0;i<3;i++){
                    obj.set(i,j,table[num][i])
                    if(table[num][i] == 1){
                        obj.blockSize ++
                    }
                }
            }else{
                return obj;
            }
        }
        return obj
    }
    obj.equal = function(obj2){
        if(obj.row != obj2.row){
            return false
        }
        if(obj.col != obj2.col){
            return false
        }
        for(let j=0;j<3;j++){
            for(let i=0;i<3;i++){
                if(obj.at(i,j)!=obj2.at(i,j)){
                    return false
                }
            }
        }
        return true;
    }
    obj.getCode = function(){
        let table = [4,2,1]
        let s = ""
        for(let j=0;j<3;j++){
            let d = 0;
            for(let i=0;i<3;i++){
                d += table[i] * obj.at(i,j)
            }
            s += d.toString()
        }
        return s
    }
    return obj
}
function Board(){
    let obj = ArrayDim2(9,9)
    obj.blocks = new Array()
    obj.init = function(){
        obj.buffer.fill('1')
        for(let j=2;j<7;j++){
            for(let i=2;i<7;i++){
                obj.set(i,j,0)
            }
        }
        return obj
    }
    obj.equal = function(obj2){
        if(obj.length != obj2.length){
            return false;
        }
        for(let i=0;i<obj.length;i++){
            if(!obj.blocks[i].equal(obj2.blocks[i])){
                return false;
            }
        }
        return true;
    }
    obj.isCanPlace = function(block,x,y){
        if(x < 0 || x > 6 || y < 0 || y > 6) { return false }
        for(let j=0;j<3;j++){
            for(let i=0;i<3;i++){
                let test1 = block.at(i,j)
                let test2 = obj.at(x+i,y+j)
                if(block.at(i,j) == 1 && obj.at(x+i,y+j) == '1'){
                    return false
                }
            }
        }
        return true
    }
    obj.place = function(block,x,y){
        for(let j=0;j<3;j++){
            for(let i=0;i<3;i++){
                let v = block.at(i,j)
                if(v == 1){
                    obj.set(x+i,y+j,v)
                }
            }
        }
        const newblock = Block()
        newblock.copyfrom(block)
        newblock.x = x
        newblock.y = y
        obj.blocks.push(newblock)
        return obj
    }
    obj.getGroupState = function(){
        let gen = 0
        let group = ArrayDim2(9,9)
        let state = {}
        group.buffer.fill('#')
        for(let j=2;j<7;j++){
            for(let i=2;i<7;i++){
                let v = obj.at(i,j)
                if(v == 0){
                    let gl = group.at(i-1,j)
                    let gt = group.at(i,j-1)
                    if(gt=='#'){
                        if(gl=='#'){
                            gen ++
                            group.set(i,j,gen)
                            state[gen] = 1
                        }else{
                            group.set(i,j,gl)
                            state[gl] ++
                        }
                    }else{
                        if(gl=='#'){
                            group.set(i,j,gt)
                            state[gt] ++
                        }else if(gt == gl){
                            group.set(i,j,gt)
                            state[gt] ++
                        }else{
                            let count=0
                            for(let n=2;n<7;n++){
                                for(let m=2;m<7;m++){
                                    if(group.at(n,m) == gl){
                                        group.set(n,m,gt)
                                    }
                                    count ++
                                    if(count >= (j-2)*5+(i-2)-1 ){
                                        break;
                                    }
                                }
                            }
                            group.set(i,j,gt)
                            state[gt] += state[gl] + 1
                            delete state[gl]
                        }
                    }
                }
            }
        }
        // {
        //     let s = 'group=\n'
        //     group.traverse(function(i,j,v){
        //         if(i==0){
        //             s += '\n'
        //         }
        //         s += v
        //     })
        //     console.info(s)
        // }
        return state
    }
    obj.serialize = function(){
        let s = ''
        for(let i=0;i<obj.blocks.length;i++){
            let block = obj.blocks[i]
            s += '|' + block.getCode() + ',' + block.x + ',' + block.y;
        }
        s = s.substr(1)
        return s
    }
    obj.deserialize = function(s){
        obj.blocks.length = 0
        if(s.length == 0){
            return obj
        }
        let datas = s.split('|')
        for(let i=0;i<datas.length;i++){
            let ss = datas[i].split(',')
            let block = new Block()
            block.init(ss[0])
            obj.place(block,ss[1],ss[2])
        }
        return obj
    }
    obj.dump = function(){
        let s = ''
        obj.traverse(function(i,j,v){
            if(i==0){
                s += '\n'
            }
            s += v
        })
        return s
    }
    return obj
}

function BlockCollect(){
    let obj = new Array()
    obj.select = -1
    obj.setSelect = function(sel){
        if(0 <= sel && sel <= obj.length-1 ){
            obj.select = sel
        }
    }
    obj.getSelectCode = function(){
        if(obj.select == -1){
            return ''
        }
        return obj[obj.select].getCode()
    }
    obj.add = function(sText){
        const block = Block().init(sText)
        if(block == null){
            return false
        }
        obj.push(block)
        return true
    }
    obj.del = function(){
        if(obj.select == -1){
            return false
        }
        obj.splice(obj.select, 1)
        if(obj.select >= obj.length){
            obj.select = obj.length - 1
        }
    }
    obj.delAll = function(){
        obj.select = -1
        obj.length = 0
    }
    obj.getCodes = function(){
        let s = ''
        for(let i=0;i<obj.length;i++){
            s += '|' + obj[i].getCode()
        }
        s = s.substr(1)
        return s
    }
    obj._getMaxBlockCount = function(sortIndexs,sumValue){
        let v = 0
        let count=0
        for(i=0;i<obj.length;i++){
            let block = obj[sortIndexs[i]]
            v += block.blockSize
            count ++;
            if(v >= sumValue){
                break;
            }
        }
        return count;
    }
    obj._getMinBlockCount = function(sortIndexs,sumValue){
        let v = 0
        let count = 0
        let i=0
        for(let i=obj.length-1;i>=0;i--){
            let block = obj[sortIndexs[i]]
            v += block.blockSize
            count ++;
            if(v >= sumValue){
                break;
            }
        }
        return count;
    }
    obj.traverseBySum = function(sumValue,func){
        let sortIndexs = new Array();
        for(let i=0;i<obj.length;i++){
            sortIndexs.push(i)
        }
        sortIndexs.sort(function(a,b){
            return obj[a].blockSize - obj[b].blockSize
        });
        let minBlockCount = obj._getMinBlockCount(sortIndexs,25)
        let maxBlockCount = obj._getMaxBlockCount(sortIndexs,25)
        for(let blockCount=minBlockCount;blockCount<=maxBlockCount;blockCount++){
            mathpc.C(sortIndexs.length,blockCount,function(serial){
                let sizeCalc = 0;
                serial.forEach(function(v,i,ary){
                    sizeCalc += obj[serial[i]].blockSize
                })
                if(sizeCalc == sumValue){
                    func(serial)
                }

            })
        }
    }
    obj.traverseBySumAsync = async function(sumValue,funcSerial,funcProgress){
        let sortIndexs = new Array();
        for(let i=0;i<obj.length;i++){
            sortIndexs.push(i)
        }
        sortIndexs.sort(function(a,b){
            return obj[a].blockSize - obj[b].blockSize
        });
        let minBlockCount = obj._getMinBlockCount(sortIndexs,25)
        let maxBlockCount = obj._getMaxBlockCount(sortIndexs,25)
        for(let blockCount=minBlockCount;blockCount<=maxBlockCount;blockCount++){
            //await wait(1).then(async ()=>{
                let count = mathpc.CCount(sortIndexs.length,blockCount)
                let index = 0
                //funcProgress('开始搜索'+sortIndexs.length+'中取'+blockCount+'的25块组合,')
                await mathpc.CAsync(sortIndexs.length,blockCount,async function(serial){
                    index ++
                    let progressInfo = '开始搜索'+sortIndexs.length+'中取'+blockCount+'的25块组合,'+index+'/'+count
                    //funcProgress('开始搜索'+sortIndexs.length+'中取'+blockCount+'的25块组合,'+index+'/'+count)
                    let sizeCalc = 0;
                    serial.forEach(function(v,i,ary){
                        sizeCalc += obj[serial[i]].blockSize
                    })
                    if(sizeCalc == sumValue){
                        await funcSerial(serial,progressInfo)
                    }

                })
           //})
        }
        return true
    }
    obj.saveStorge = function(name){
        if (!window.localStorage){
            return false
        }
        let s = obj.getCodes()
        window.localStorage.setItem(name, s);
        return true
    }
    obj.loadStorge = function(name){
        if (!window.localStorage){
            return false
        }
        let s = window.localStorage.getItem(name);
        let codes = s.split('|')
        obj.delAll()
        for(let i=0;i<codes.length;i++){
            obj.add(codes[i])
        }
        return true
    }
    return obj
}
