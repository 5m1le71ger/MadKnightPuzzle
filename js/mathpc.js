var mathpc = {
    wait: (ms) =>{
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    factorial: (n) => {
        if (n === 0) {
            return 1;
        } else {
            return mathpc.factorial(n-1) * n;
        }
    },

    CCount : (n,k) => {
        let a = mathpc.factorial(n)
        let b = mathpc.factorial(k)
        let c = mathpc.factorial(n-k)
        let r = a / (b * c)
        return r
    },

    PCount : (n,k) => {
        let a = mathpc.factorial(n)
        let b = mathpc.factorial(n-k)
        let r = a / b
        return r
    },

    //组合遍历，从n中取k,数据基于0
    //参考 https://blog.csdn.net/uniqueleion/article/details/81624351
    C : (n,k,func) => {
        let serial = new Array()
        for(let i=0;i<k;i++){
            serial.push(i)
        }
        if(!func(serial)){
            return
        }
        if(k<=0){
            return
        }
        var step = function(pos){
            //步进，累加或者产生进位，注意每个位对进位闸值的要求不一样
            return (serial[pos]+1>n-k+pos)?(-1):(serial[pos]+1)
        }
        let over = false;
        while(!over){
            let pos = k-1 //pos为要处理的位
            while(true){
                let v = step(pos)
                if(v>=0){
                    //对当前pos位到k-1位进行赋值
                    for(let i=pos;i<=k-1;i++){
                        serial[i]=v+(i-pos)
                    }
                    if(!func(serial)){
                        return
                    }
                    break
                }
                //进位处理
                pos -- //下一次循环处理上位
                if(pos<0){
                    over=true
                    break
                }
            }
        }
    },

    generateCombinations : (n, k, callback, batchSize = 1000) =>{
        const max = 1 << n;
        let i = 0;
        let count = 0;
        function countCombinationBits(num) {
            let count = 0;
            while (num > 0) {
              count += num & 1;
              num >>= 1;
            }
            return count;
        }
        function traverseBatch() {
          while (i < max && count < batchSize) {
            if (countCombinationBits(i) === k) {
              const combination = [];
              for (let j = 0; j < n; j++) {
                if (i & (1 << j)) {
                  combination.push(j);
                }
              }
              callback(combination);
              count++;
            }
            i++;
          }
          if (i < max) {
            count = 0;
            // Use setTimeout to allow UI updates during the traversal
            setTimeout(traverseBatch, 0);
          }
        }
        traverseBatch();
    },

    generatePermutations : (n, callback, batchSize = 1000) => {
        const elements = new Array(n);
        for (let i = 0; i < n; i++) {
          elements[i] = i;
        }
        let count = 0;
        function traverseBatch(startIndex) {
          if (startIndex >= n) {
            callback(elements);
            count++;
            return;
          }
          for (let i = startIndex; i < Math.min(startIndex + batchSize, n); i++) {
            [elements[startIndex], elements[i]] = [elements[i], elements[startIndex]];
            traverseBatch(startIndex + 1);
            [elements[startIndex], elements[i]] = [elements[i], elements[startIndex]];
          }
          if (startIndex + batchSize < n) {
            // Use setTimeout to allow UI updates during the traversal
            setTimeout(() => traverseBatch(startIndex + batchSize), 0);
          }
        }
        traverseBatch(0);
    },

    CAsync : async (n,k,func) => {
        let serial = new Array()
        for(let i=0;i<k;i++){
            serial.push(i)
        }
//        await mathpc.wait(1).then(async ()=>{
            await func(serial)
//        })

        if(k<=0){
            return
        }
        var step = function(pos){
            //步进，累加或者产生进位，注意每个位对进位闸值的要求不一样
            return (serial[pos]+1>n-k+pos)?(-1):(serial[pos]+1)
        }
        let over = false;
        while(!over){
            let pos = k-1 //pos为要处理的位
            while(true){
                let v = step(pos)
                if(v>=0){
                    //对当前pos位到k-1位进行赋值
                    for(let i=pos;i<=k-1;i++){
                        serial[i]=v+(i-pos)
                    }
//                    await mathpc.wait(1).then(async ()=>{
                        await func(serial)
//                    })
                    break
                }
                //进位处理
                pos -- //下一次循环处理上位
                if(pos<0){
                    over=true
                    break
                }
            }
        }
        return true
    },

    //全排列
    //参考 https://blog.csdn.net/LINZEYU666/article/details/119729914
    PAllRec : (n,func)=>{
        let serial = new Array()
        for(let i=0;i<n;i++){
            serial.push(i)
        }
        let swap = function(a,b){
            let temp=serial[a]
            serial[a]=serial[b]
            serial[b]=temp
        }
        let recfunc = function(i,len){
            if(i == len){//跑到一个叶子节点上了
                func(serial)
            }else{
                //生成当前i节点的所有孩子节点
                for(let k=i;k<len; ++k)
                {
                    swap(i, k);//当前i位置的元素和后边所有元素交换
                    recfunc(i+1, len);//遍历i的一个孩子
                    swap(i, k);
                    //回溯到父节点，一定要再交换回来，因为生成新的孩子是基于父节点进行元素的交换
                }
            }
        }
        recfunc(0,n)
    },

    //全排列非递归实现
    PAll : (n,func)=>{
        let serial = new Array()
        for(let i=0;i<n;i++){
            serial.push(i)
        }
        let swap = function(a,b){
            let temp=serial[a]
            serial[a]=serial[b]
            serial[b]=temp
        }
        let stack = new Array()
        stack.push({ i : 0, k : 0, sw : 0})
        while(stack.length>0){
            let node = stack[stack.length-1]
            if(node.i == n){//跑到一个叶子节点上了
                if(!func(serial)){
                    return
                }
                stack.pop()
            }else{
                if(node.k < n){
                    swap(node.i, node.k);//当前i位置的元素和后边所有元素交换，以及交换回来
                    if(node.sw == 0){
                        node.sw = 1
                        stack.push({i: node.i+1, k: node.i+1, sw: 0})
                    }else{
                        node.sw = 0
                        node.k += 1
                    }
                }else{
                    stack.pop()
                }
            }
        }
    },

    PAllAsync : async (n,func)=>{
        let serial = new Array()
        for(let i=0;i<n;i++){
            serial.push(i)
        }
        let swap = function(a,b){
            let temp=serial[a]
            serial[a]=serial[b]
            serial[b]=temp
        }
        let stack = new Array()
        stack.push({ i : 0, k : 0, sw : 0})
        while(stack.length>0){
            let node = stack[stack.length-1]
            if(node.i == n){//跑到一个叶子节点上了
                //await mathpc.wait(1).then(async ()=>{
                    await func(serial)
                //})
                stack.pop()
            }else{
                if(node.k < n){
                    swap(node.i, node.k);//当前i位置的元素和后边所有元素交换，以及交换回来
                    if(node.sw == 0){
                        node.sw = 1
                        stack.push({i: node.i+1, k: node.i+1, sw: 0})
                    }else{
                        node.sw = 0
                        node.k += 1
                    }
                }else{
                    stack.pop()
                }
            }
        }
    },

    //排列
    P : (n,k,func) => {
        let serial = new Array()
        mathpc.C(n,k,function(buffC){
            mathpc.PAll(k,function(buffPAll){
                serial.splice(0,serial.length);
                for(let i=0;i<buffPAll.length;i++){
                    serial.push(buffC[buffPAll[i]])
                }
                if(!func(serial)){
                    return false
                }
                return true
            })
            return true
        })
    },
}
