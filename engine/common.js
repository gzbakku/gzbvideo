

module.exports = {
    time:time,
    get_var:get_var,
    string:string,
    number:number,
    file:file
};

async function get_var(input,name){
    if(!input instanceof Array){return false;}
    for(let item of input){
        if(item.indexOf(`--${name}`) >= 0){
            let hold = item.split("=");

            let recompile = '';
            for(let i=1;i<hold.length;i++){
                if(recompile.length > 0){recompile += "=";}
                recompile += hold[i];
            }

            return recompile;
        }
    }
    return false;
}

async function string(take,message){

    if(!take || typeof(take) !== "string" || take.length == 0){
        take = await input.text(message);
    }

    if(typeof(take) !== "string" || take.length == 0){
        return string(take,message);
    } else {
        return take;
    }

}

async function file(take,message){

    if(typeof(take) == "string" && take.length > 0){
        return take;
    } else {
        return await fsys.browse_files(message);
    }

}

async function number(take,message){

    if(!take || typeof(take) !== "string" || take.length == 0){
        take = await input.text(message);
    }

    if(typeof(take) !== "string" || take.length == 0){
        return string(take,message);
    }

    if(isNaN(string)){
        return string(take,message);
    }

    return Number(take);

}

async function time(take,message){

    if(!take || typeof(take) !== "string" || take.length == 0){
        take = await input.text(message);
    }

    let hold = take.split(":");
    if(hold.length !== 3){return time(take,message);} 
    if(
        isNaN(hold[0]) || 
        isNaN(hold[1]) || 
        isNaN(hold[2]) 
    ){
        return time(take,message);
    }
    return {
        hour:Number(hold[0]),
        min:Number(hold[1]),
        sec:Number(hold[2]),
        time:take
    };

}