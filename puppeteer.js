import puppeteer from 'puppeteer';
import {getClass} from "./OperationsWithJSON.js";
import {puppeteer_settings} from "./setting.js";



export const GetPage = async (url_site) => {

    const browser = await puppeteer.launch(puppeteer_settings);
    const page = await browser.newPage();
    await page.setViewport({width: 1360, height: 720})
    await page.setDefaultNavigationTimeout(0);
    await page.goto(url_site,{ waitUntil: 'networkidle2' });

    let result = {
        "price": "",
        "img": "",
        "title": "",
        "currency": ""
    }

    const ParseElement = async (iterationBy,isImg = false) => {
        const className = getClass(url_site.host,iterationBy).join("")
        if(isImg) return await page.$eval(className, (element) => element.content ? element.content : element.src);
        else return  await page.$eval(className, element => element.innerText );
    }

    const pushInResult = (where, value) => result[where] = value

    const catchErrorInParse = async (err) => {
        throw Error("not found")
    }

    await  ParseElement("class.img",true).then(value => {pushInResult("img", value)}).catch(err => catchErrorInParse(err))
    await  ParseElement("class.title").then(value =>  pushInResult("title", value)  ).catch(err => catchErrorInParse(err))
    if (await page.$('span[id="buybox-see-all-buying-choices"]') !== null) {
        await page.click('span[id="buybox-see-all-buying-choices"]');
        await page.waitForSelector('.a-price')
    }


    await  ParseElement("class.price").then(value => {
        const price = value.replace(/[,]/g, ".").replace(/[a-z A-Z а-я А-Я $ € ₴]/g, "")
        const currency = value.replace(/[0-9,\s+ .]/g, "").toUpperCase()

        pushInResult("price", +price)
        pushInResult("currency",currency)
    }).catch( async () => {
        await  ParseElement("class.case.err").then(value => {
            const price = value.replace(/[,]/g, ".").replace(/[a-z A-Z а-я А-Я $ €]/g, "")
            const currency = value.replace(/[0-9,\s+ .]/g, "").toUpperCase()
            pushInResult("price", price)
            pushInResult("currency",currency)
        }).catch(async() => {catchErrorInParse()})
    })
    await browser.close()
    return result

}
 const setUserAgent =  (page) =>{
     page.setDefaultNavigationTimeout(0);
     page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36')
 }


export const GetDataComputerUniverse = async (id) => {
    const browser = await puppeteer.launch(puppeteer_settings);
    const pagePrice = await browser.newPage();
    const page = await browser.newPage();
    await setUserAgent(page)
    await setUserAgent(pagePrice)

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

   await browser.close()
    return {
        "price": price,
        "img": img,
        "title": name,
        "currency": currency
    }



}