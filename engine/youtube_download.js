const ytdl = require('ytdl-core');
const fs = require("fs");
const { log } = require('console');

module.exports = {
    init:init
};

async function init(work){


    let url = await engine.common.string(
        await engine.common.get_var(work,"url"),
        "youtube video url"
    );
    
    let outfile_name = await engine.common.string(
        await engine.common.get_var(work,"output"),
        "output file name"
    );

    // let outfile_name = "youtube";
    // let url = "https://www.youtube.com/watch?v=ZkNMZlkrzaU";

    /*
    
    node index --url=https://www.youtube.com/watch?v=ZkNMZlkrzaU --output=youtube.mp4

    */

    console.log(">>> downloading video");

    let info = await ytdl.getInfo(url);

    console.log(`video title : ${info.player_response.videoDetails.title}`);

    let book = {};
    let only_audio = [];
    let only_video = [];
    let both = [];

    for(let format of info.formats){
        let is_both = format.hasAudio && format.hasVideo;
        let is_video = !format.hasAudio && format.hasVideo;
        let is_audio = format.hasAudio && !format.hasVideo;
        let type = is_both ? "Audio/Video" : is_video ? "Video" : "Audio";
        let name = `Quality : ${format.qualityLabel} Type : ${type}`;
        // console.log(`${name} ${format.hasAudio} ${format.hasVideo}`);
        book[name] = format;
        if(is_both){both.push(name);} else 
        if(is_audio){only_audio.push(name);} else
        if(is_video){only_video.push(name);}
    }

    let options = [];
    options = options.concat(both);
    options = options.concat(only_audio);
    options = options.concat(only_video);

    let selected = await input.select("please select a format",options);
    let format = book[selected];

    let spinner = new Spinner('downloading video... %s');
    spinner.setSpinnerString('|/-\\');
    spinner.start();

    outfile_name = `${outfile_name}.${format.container}`;
    await fsys.delete(`${fsys.cwd()}/${outfile_name}`);

    if(true){
        ytdl(url,{
            format:format
        }).pipe(fs.createWriteStream(outfile_name));
    }

    spinner.stop(false);

}