import puppeteer from 'puppeteer';
import {getClass} from "./OperationsWithJSON.js";
import {puppeteer_settings} from "./setting.js";



export const GetPage = async (url_site) => {

    const browser = await puppeteer.launch(puppeteer_settings);
    const page = await browser.newPage();
    const client = await page.target().createCDPSession();
    await client.send('Network.clearBrowserCookies');
    await client.send('Network.clearBrowserCache');
    await page.setDefaultNavigationTimeout(0);
    await page.goto(url_site,{ waitUntil: 'networkidle2' });

    let result = []
    const ParseElement = async (iterationBy,isImg = false) => {
        const className = getClass(url_site.host,iterationBy).join("")
        if(isImg) return  await page.$eval("head > meta[property='og:image']", element => element.content );
        else return  await page.$eval(className, element => element.innerText );
    }
    const catchErrorInParse = (err) => {result.push(err)}
    await  ParseElement("class.price").then(value => result.push(value)).catch(err => catchErrorInParse(err))
    await  ParseElement("class.img",true).then(value => result.push(value)).catch(err => catchErrorInParse(err))
    await  ParseElement("class.title").then(value => result.push(value)).catch(err => catchErrorInParse(err))
    await browser.close()
    return result


}
export const GetDataComputerUniverse = async (id) => {
    const browser = await puppeteer.launch(puppeteer_settings);
    const pagePrice = await browser.newPage();
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await pagePrice.setDefaultNavigationTimeout(0);
    await page.content();
    await pagePrice.content();
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36')
    await pagePrice.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36')
    await page.goto(`https://webapi.computeruniverse.net/api/products/${id}/variablecached?shippingCountryIsoCode=DE&languageCode=1&customerRoleIds=4&showTax=true&bWareCombined=true`,{ waitUntil: 'networkidle2' });
    await pagePrice.goto(`https://webapi.computeruniverse.net/api/products/${id}/pdp?languageCode=1`,{ waitUntil: 'networkidle2' });
    let resultForPrice = await page.evaluate(async () =>  {
        return JSON.parse(document.querySelector("body").innerText);
    });
    let resultForData = await pagePrice.evaluate(async () =>  {
        return JSON.parse(document.querySelector("body").innerText);
    });

    const price = resultForPrice.Price.PriceRaw.Value
    const name = resultForData.Name
    const img = `https://img.computerunivers.net${resultForData.ProductPictures[0].ImageUrlBig}`
    const currency = resultForPrice.Price.PriceRaw.Currency.CurrencyCode
    console.log(currency)

    await browser.close()
    return [
        price + currency ,
        img,
        name
    ]


}