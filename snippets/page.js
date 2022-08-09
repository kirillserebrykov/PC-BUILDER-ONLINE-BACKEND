export const SelectCountry = async (page) => {
    if (await page.$('a[id="nav-global-location-popover-link"]') !== null) {
        await page.waitForSelector('a[id="nav-global-location-popover-link"]')
        await page.click('a[id="nav-global-location-popover-link"]');
        await page.waitForSelector('input[id="GLUXZipUpdateInput"]')
        await page.$eval('input[id="GLUXZipUpdateInput"]', el => el.value = '20095');
        await page.waitForSelector('span[id="GLUXZipUpdate"]')
        await page.click('span[id="GLUXZipUpdate"]');
        await page.waitForSelector('div[id="GLUXHiddenSuccessSelectedAddressPlaceholder"]')
        await page.click('div[data-action="a-popover-a11y"] ');
        await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
        await page.waitForSelector('#productTitle')
    }
}

export const ClickInDetailsPrice = async (page) =>{
    if ( await page.$('span[id="buybox-see-all-buying-choices"]') !== null) {
        await page.click('span[id="buybox-see-all-buying-choices"]');
        await page.waitForSelector('#aod-price-1 > .a-price > .a-offscreen')
    }
}
export const setUserAgent =  (page) =>{

    page.setDefaultNavigationTimeout(0);
    page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36')
}
