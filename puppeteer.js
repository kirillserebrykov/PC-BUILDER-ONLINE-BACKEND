import puppeteer from 'puppeteer'
import {getClass} from "./OperationsWithJSON.js";
import {puppeteer_settings} from "./setting.js"


export const GetPage = async (url_site) => {
    const browser = await puppeteer.launch(puppeteer_settings);
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.goto(url_site,{ waitUntil: 'networkidle2' });

    let result = []
    const ParseElement = async (iterationBy,isImg = false) => {
        const className = getClass(url_site.host,iterationBy).join("")
        if(isImg) return  await page.$eval("head > meta[property='og:image']", element => element.content );
        else return  await page.$eval(className, element => element.innerText );
    }
    const catchErrorInParse = (err) => {result.push(err)}
    await   ParseElement("class.price").then(value => result.push(value)).catch(err => catchErrorInParse(err))
    await  ParseElement("class.img",true).then(value => result.push(value)).catch(err => catchErrorInParse(err))
    await   ParseElement("class.title").then(value => result.push(value)).catch(err => catchErrorInParse(err))

    await browser.close()
    return result


}
