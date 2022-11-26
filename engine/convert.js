// const cmd = require("../cmd");
// const fsys = require("../fsys");

module.exports = {
    init:init
};

async function init(work){

    let inputFile = await engine.common.file(
        await engine.common.get_var(work,"input"),
        "please select input file"
    );

    let dir;
    if(typeof(inputFile) === "object"){
        dir = inputFile.dir;
        inputFile = inputFile.filename;
    }

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
    //     "start time":start,
    //     'end time':end,
    //     'input file name':inputFile,
    //     'dir':dir,
    //     'output file name':outfile_name
    // });

    /*
    
    node index --start=00:01:35 --end=00:01:40 --input=input.mp4 --output=output.mp4

    */

    let run_cmd = `ffmpeg -i ${inputFile} -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" ${outfile_name}`;

    console.log(run_cmd);

    let run = await cmd.run(run_cmd);

    

}