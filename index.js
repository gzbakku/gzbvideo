

global.input = require("input");
global.cmd = require("./cmd");
global.fsys = require("./fsys");
global.engine = require("./engine/index");
global.Spinner = require('cli-spinner').Spinner;


async function main(){

    let work = process.argv;

    if(false){
        await engine.youtube_download.init(work);
        return;
    }

    let func;
    if(work.length > 3){
        func = work[2];
    }
    let base = [
        "extract_audio","cut","none","youtube_download"
    ];
    if(base.indexOf(func) < 0){
        func = await input.select("please select a option",base);
    } else {
        return console.error("failed-invalid-option");
    }

    console.log({func:func});

    if(func === "none"){return;}
    if(func === "cut"){engine.cut.init(work);} else
    if(func === "extract_audio"){engine.extract_audio.init(work);} else
    if(func === "youtube_download"){engine.youtube_download.init(work);} else {
        console.error("!!! invalid option");
    }

}

main();

