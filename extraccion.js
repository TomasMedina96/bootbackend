import puppeter from 'puppeteer';

const URL = 'https://www.trattorialapasta.com/menu';

const scrapMenu = async () => {
    const browser = await puppeter.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(URL, {waitUntil: 'domcontentloaded'});

    const resultado = await page.evaluate(() => {
        const items = [];
        document.querySelectorAll('body').forEach((el) => {
            const text = el.innerText.trim();
            if(text.length > 0) items.push(text);
        });
        return items;
    });

    await browser.close();
    console.log('MENU EXTRAIDO:\n');
    console.log(resultado.join('\n'));
}

scrapMenu();