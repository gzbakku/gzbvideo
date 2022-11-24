// const cmd = require("../cmd");
// const fsys = require("../fsys");

const fsys = require("../fsys");

module.exports = {
    init:init
};

async function init(work){


    let inputFile = await engine.common.string(
        await engine.common.get_var(work,"input"),
        "input file name"
    );
    let dir;
    if(!inputFile){
        let hold = await fsys.browse_files("please select input file");
        dir = hold.dir;
        inputFile = hold.filename;
    }

    let cwd = fsys.cwd();
    if(!fsys.exists(`${cwd}/${inputFile}`)){
        console.error("!!! input file not found in current directory");
        let hold = await fsys.browse_files("please select input file");
        dir = hold.dir;
        inputFile = hold.filename;
    } else {
        dir = cwd;
    }
    process.chdir(dir);
    
    let outfile_name = await engine.common.string(
        await engine.common.get_var(work,"output"),
        "output file name"
    );

    await fsys.delete(`${dir}/${outfile_name}`);

    // console.log({
    //     'input file name':inputFile,
    //     'dir':dir,
    //     'output file name':outfile_name
    // });

    /*
    
    node index --input=output.mp4 --output=output.mp3

    ffmpeg -i output.mp4 -q:a 0 -map a output.mp3

    */

    let run_cmd = `ffmpeg -i ${inputFile} -q:a 0 -map a ${outfile_name}`;

    console.log(run_cmd);

    let run = await cmd.run(run_cmd);

    

}