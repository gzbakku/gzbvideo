// const { log } = require('console');
const { log } = require('console');
const fs = require('fs');

let browser_tree = [];

module.exports = {

  browse_dir:browse_dir,

  get_base_dir:get_base_dir,

  cwd:cwd,

  browse_files:browse_files,

  exists:exists,

  delete:_delete

};

async function _delete(path){
  return new Promise((resolve,reject)=>{
    if(exists(path)){
      fs.unlink(path,(e)=>{
        if(e){reject();} else {resolve();}
      });
    } else {
      resolve();
    }

  })
  .then(()=>{return true;}).catch(()=>{return false;});
}

async function browse_dir(message){

  if(message){
    console.log(`>>> ${message}`);
  }

  // console.clear();

  const base_dir = await get_base_dir();
  if(!base_dir){
    return common.error("failed-get_base_dir-browse_dir");
  }

  let app_dir = base_dir;
  for(let item of browser_tree){
    app_dir += '/' + item;
  }

  const dirs = await get_sub_dir(app_dir)
  .then((f)=>{return f;}).catch(()=>{return false;});

  if(!dirs){
    return console.error("failed-get_sub_dir-browse_dir");
  }

  let options = [];
  options.push("<<< back");
  options.push(">>> select this dir");
  for(let h of dirs){options.push(h);}

  const select = await input.select("please select a dir",options);
  if(select === "<<< back"){
    if(browser_tree.length > 0){
      browser_tree.pop();
    }
  } else
  if(select === ">>> select this dir"){
    // return browse_files(app_dir);
    return clean_path(app_dir);
  } else {
    browser_tree.push(select);
  }

  return await browse_dir();

}

async function browse_files(message){

  if(message){
    console.log(`>>> ${message}`);
  }

  // console.clear();

  let path = await browse_dir();

  const files = await get_dir_files(path)
  .then((f)=>{return f;}).catch(()=>{return false;});
  if(!files){
    return console.error("failed-get_sub_dir-browse_dir");
  }

  let options = [];
  options.push("<<< cancel");
  for(let h of files){options.push(h);}

  const select = await input.select("please select a dir",options);
  if(select === "<<< cancel"){
    return false;
  } else {
    return {
      filename:select,
      file:`${path}/${select}`,
      dir:path
    }
  }

}

function cwd(){
  return clean_path(process.cwd());
}

function clean_path(p){
  while(p.indexOf("\\") >= 0){
    p = p.replace('\\','/');
  }
  if(p[p.length-1] == "/"){
    return p.slice(0, -1);
  }
  return p;
}

async function get_items_worker(data){
  const base_dir = await get_base_dir();
  if(!base_dir){
    return common.error("failed-base_dir-get_items_worker");
  }
  const get_items = await get_dir_items(base_dir + data.path)
  .then((i)=>{return i;})
  .catch((e)=>{return false;});
  if(get_items === false){
    return common.error("failed-get_items-get_items_worker");
  }
  if(get_items.length === 0){
    return common.error(data.not_found);
  }
  if(get_items.length === 1){return get_items[0];}
  return input.select(data.select,get_items);
}

async function get_dir_items(path){
  return new Promise((resolve,reject)=>{
    fs.readdir(path,(e,items)=>{
      if(e){
        reject("failed-readdir-not_found");
      } else {
        resolve(items);
      }
    });
  });
}

async function get_dir_files(path){
  return new Promise((resolve,reject)=>{
    fs.readdir(path,{withFileTypes:true},(e,items)=>{
      if(e){
        reject("failed-readdir-not_found");
      } else {
        let collect = [];
        for(let item of items){
          if(!item.isDirectory()){
            collect.push(item.name);
          }
        }
        resolve(collect);
      }
    });
  });
}

async function get_sub_dir(path){
  return new Promise((resolve,reject)=>{
    fs.readdir(path,{withFileTypes:true},(e,items)=>{
      if(e){
        reject("failed-readdir-not_found");
      } else {
        let collect = [];
        for(let item of items){
          if(item.isDirectory()){
            collect.push(item.name);
          }
        }
        resolve(collect);
      }
    });
  });
}

function exists(location){
  // if(!location){return false;}
  // return fs.exists(location);
  return fs.existsSync(location);
}

async function get_base_dir(){
  let lcwd = cwd();
  if(lcwd.includes("\\")){while(lcwd.includes("\\")){lcwd = lcwd.replace('\\','/');}}
  let hold = lcwd.split("/");
  let app_found = false;
  for(let h of hold){if(h === "app"){app_found = true;}}
  if(!app_found){if(await exists(lcwd + "/app")){return lcwd + "/";}}
  let remake = '';
  for(let h of hold){if(h === "app"){break;} else {
    remake += h + "/";
  }}
  return remake;
}
