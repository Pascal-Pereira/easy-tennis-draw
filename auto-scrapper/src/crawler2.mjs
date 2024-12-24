import { PlaywrightCrawler } from 'crawlee';
import proxyChain from 'proxy-chain';

// Dataset to store scraped data
const dataset = [];
const urls = ['https://www.oscaro.com/'];

// Utility to sleep for a given time
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// List of proxies
const proxies = [
    'http://username:password@proxy1.com:3128',
    'http://username:password@proxy2.com:3128',
    'http://username:password@proxy3.com:3128',
];

// Function to select a random proxy
const getRandomProxy = () => proxies[Math.floor(Math.random() * proxies.length)];

// Function to get a valid proxy
const getValidProxy = async () => {
    for (let attempts = 0; attempts < 5; attempts++) {
        const proxyUrl = getRandomProxy();
        try {
            const proxiedUrl = await proxyChain.anonymizeProxy(proxyUrl);
            return proxiedUrl;
        } catch (error) {
            console.error(`Proxy error: ${proxyUrl}, Error: ${error.message}`);
        }
    }
    throw new Error('All proxies failed.');
};

// User-Agent string
const userAgent = 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:133.0) Gecko/20100101 Firefox/133.0';

// PlaywrightCrawler setup
const crawler = new PlaywrightCrawler({
    async requestHandler({ request, page, log }) {
        log.info(`Processing URL: ${request.url}`);

        // Set custom headers
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
            'User-Agent': userAgent,
        });

        // Handle human verification if detected
        const verifyButton = await page.$('input.ctp-button[value="Verify you are human"]');
        if (verifyButton) {
            log.info('Human verification detected. Attempting to click the button...');
            await verifyButton.click();
            await sleep(2000);
        }

        // Scrape data
        const scrappedProduct = {
            title: await page.title(),
            vehicleModal: await getVehicleModal(page),
        };

        dataset.push(scrappedProduct);
        log.info(`Scraped data: ${JSON.stringify(scrappedProduct, null, 2)}`);
    },

    failedRequestHandler({ request, error, log }) {
        log.error(`Request to ${request.url} failed: ${error.message}`);
    },

    preNavigationHooks: [
        async ({ page }) => {
            // Apply random proxy before navigation
            const proxyUrl = await getValidProxy();
            console.log(`Using proxy: ${proxyUrl}`);
            await page.context().setExtraHTTPHeaders({
                'User-Agent': userAgent,
            });
        },
    ],

    launchContext: {
        launchOptions: {
            headless: true, // Set to false for debugging
            browserType: 'firefox',
        },
    },
});

// Function to scrape vehicle modal details
// const getVehicleModal = async (page) => {
//     return await page.$$eval('div[class="car-selector"]', (modals) => 
//         modals.map((modal) => modal.textContent.trim())
//     );
// };
// Function to interact with the car link and extract modal content
const getVehicleModal = async (page) => {
  try {
      // Click the "car-link" with the "ico-chevron-right" icon
      const carLink = await page.$('button.car-link.ico-chevron-right');
      if (carLink) {
          console.log('Found car-link. Clicking to open the modal...');
          await carLink.click();

          // Wait for the modal with the "popin-container" class to appear
          await page.waitForSelector('.popin-container', { timeout: 5000 });
          console.log('Modal opened.');

          // Extract content from the modal
          const modalContent = await page.$$eval('.popin-container', (modals) =>
            modals.map((modal) => modal.innerHTML.trim())
        );  

          console.log('Extracted modal content:', modalContent);
          return modalContent;
      } else {
          console.log('No car-link found on the page.');
          return [];
      }
  } catch (error) {
      console.error('Error while interacting with the modal:', error.message);
      return [];
  }
};


// Main execution
const run = async () => {
    console.log('Starting crawler...');
    await crawler.run(urls);
    console.log('Crawling completed. Data:', JSON.stringify(dataset, null, 2));
};

run().catch((error) => {
    console.error('Crawler encountered an error:', error);
});
