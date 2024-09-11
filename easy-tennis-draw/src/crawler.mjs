// For more information, see https://crawlee.dev/
import { PlaywrightCrawler, Dataset, playwrightUtils } from 'crawlee';
import fs from 'fs';
// import dayjs from 'dayjs';
import path from 'path';
const dataset = [];
let urls = ['https://www.atptour.com/en/tournaments'];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));



// PlaywrightCrawler crawls the web using a headless
// browser controlled by the Playwright library.
const crawler = new PlaywrightCrawler({
  // Use the requestHandler to process each of the crawled pages.
  async requestHandler({ request, page, enqueueLinks, log }) {
    log = log || console;
    log.info(`Loaded ${request.loadedUrl}`);
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const queryParams = {};

    const url = new URL(request.loadedUrl);
    console.log('searchParams', queryParams, url.searchParams);
    url.searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });

    console.log('searchParams', queryParams);

    const getTournaments = async () => {
      return await page.$$eval('div[class="tournament-list"] ul', (tournaments) => {
        tournaments.map((tournament) => {
          console.log('tournament tournament', tournament)
        })
        return tournaments
      })
    }

    await page.evaluate(() => {
      console.info('Scrolling down');
      window.scrollBy(0, window.innerHeight);
      window.sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      //   window.getImageUrls = (element) => {
      //     const imageUrls = element.querySelectorAll('.ant-image img.ant-image-img');
      //     return [...new Set([...imageUrls].map((image) => image.getAttribute('src')))];
      //   };
    });

    await sleep(500);
    // We need to scroll all the way down to load the images, especially those lazy loaded by disponibilities
    await page.evaluate(() => {
      console.info('Scrolling down');
      window.scrollBy(0, window.innerHeight);
    });

    // If there is a readMoreButton for the description, we need to click on it to get the full description
    // if (await page.$('.read-more-button > button')) {
    //   await page.click('.read-more-button > button');
    // }
    const scrappedProduct = {
      // The title is the h1 tag
      title: '',
      tournaments: await getTournaments()
    }

    // console.log('data', JSON.stringify(data.campings));
    //  fs.writeFileSync('campings.json', JSON.stringify(data.campings, null, 2), { encoding: 'utf8' });
    // console.log('data', JSON.stringify(data, null, 2));
    sleep(1000);
    // Save results as JSON to ./storage/datasets/campsites
    console.dir('scrappedProduct', JSON.stringify(scrappedProduct, null, 2));
    dataset.push(scrappedProduct);
  },
  // Uncomment this option to see the browser window.
  headless: true,
});


const run = async () => {
  // try {
  //   fs.unlinkSync(path.resolve(__dirname, 'storage/key_value_stores/default/kampaohFinal.json'));
  // } catch (e) {
  //   console.error('error deleting file', e);
  // }

  // loop through all possible dates and number of adults and zones
  // const dates = getNextDates();

  console.log('===============================================================');
  console.log('urls', urls.length, 'to crawl');
  //console.log('urls', urls[0], 'to crawl');
  await crawler.run([...urls.slice(0, 10)]);

  console.log('DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD', dataset)

  process.exit(0);
};

run().catch(console.error);
