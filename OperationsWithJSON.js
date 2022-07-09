import fs from "fs";

export const getClass = (host,iterationBy) => {
    let rawdata = fs.readFileSync('site.json');
    let websites = JSON.parse(rawdata);
    return  Object.keys(websites).map(el => {
       if (el === host) return  websites[el][iterationBy]
   })

}