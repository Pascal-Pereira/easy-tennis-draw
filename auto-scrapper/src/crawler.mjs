import { PlaywrightCrawler } from 'crawlee';
import proxyChain from 'proxy-chain';
import  fs from 'fs'; // Importer le module fs pour écrire dans un fichier

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
// const getVehicleModal = async (page) => {
//   try {
//       // Click the "car-link" with the "ico-chevron-right" icon
//       const carLink = await page.$('button.car-link.ico-chevron-right');
//       if (carLink) {
//           console.log('Found car-link. Clicking to open the modal...');
//           await carLink.click();

//           // Wait for the modal with the "popin-container" class to appear
//           await page.waitForSelector('.popin-container', { timeout: 10000 });
//           console.log('Modal opened.');

//           // Extract content from the modal
//             const modalContent = await page.$$eval('.popin-container', (modals) =>
//                 modals.map((modal) => modal.innerHTML.trim())
//             );

//           console.log('Extracted modal content:', modalContent);
//           return modalContent;
//       } else {
//           console.log('No car-link found on the page.');
//           return [];
//       }
//   } catch (error) {
//       console.error('Error while interacting with the modal:', error.message);
//       return [];
//   }
// };

const getVehicleModal = async (page) => {
  try {
    // Cliquez sur le lien du véhicule pour ouvrir la modale
    const carLink = await page.$('button.car-link.ico-chevron-right');
    if (carLink) {
      console.log('Found car-link. Clicking to open the modal...');
      await carLink.click();

      // Attendez que la modale avec la classe "popin-container" apparaisse
      await page.waitForSelector('.popin-container', { timeout: 10000 });
      console.log('Modal opened.');

      // Attendez que le champ "Marque" devienne actif et sélectionnez une option
      await page.waitForSelector('select#vsms-0', { timeout: 10000 });
      const marqueSelect = await page.$('select#vsms-0');
      await marqueSelect.selectOption({ index: 1 }); // Sélectionner la première option (Marque)

      // Attendez que le champ "Famille" devienne actif
      await page.waitForSelector('select#vsms-1:not([disabled])', { timeout: 10000 });
      const familleSelect = await page.$('select#vsms-1');
      await familleSelect.selectOption({ index: 1 }); // Sélectionner la première option (Famille)

      // Attendez que le champ "Modèle" devienne actif
      await page.waitForSelector('select#vsms-2:not([disabled])', { timeout: 10000 });
      const modeleSelect = await page.$('select#vsms-2');
      await modeleSelect.selectOption({ index: 1 }); // Sélectionner la première option (Modèle)

      // Attendez que le champ "Type" devienne actif
      await page.waitForSelector('select#vsms-3:not([disabled])', { timeout: 10000 });
      const typeSelect = await page.$('select#vsms-3');
      await typeSelect.selectOption({ index: 1 }); // Sélectionner la première option (Type)

      // Extraire le contenu de la modale après toutes les sélections
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


//         // Cliquez sur le lien du véhicule pour ouvrir la modale
//         const carLink = await page.$('button.car-link.ico-chevron-right');
//         if (carLink) {
//             console.log('Found car-link. Clicking to open the modal...');
//             await carLink.click();

//             // Attendez que la modale avec la classe "popin-container" apparaisse
//             await page.waitForSelector('.popin-container', { timeout: 10000 });
//             console.log('Modal opened.');

//             // Sélectionnez la marque
//             await page.waitForSelector('select#vsms-0', { timeout: 10000 });
//             const marqueSelect = await page.$('select#vsms-0');
//             await marqueSelect.selectOption({ index: 1 }); // Sélectionner la première option (Marque)

//             // Attendez que "Famille" devienne actif et sélectionnez une option
//             await page.waitForSelector('select#vsms-1:not([disabled])', { timeout: 10000 });
//             const familleSelect = await page.$('select#vsms-1');
//             await familleSelect.selectOption({ index: 1 }); // Sélectionner la première option (Famille)

//             // Attendez que "Modèle" devienne actif et sélectionnez une option
//             await page.waitForSelector('select#vsms-2:not([disabled])', { timeout: 10000 });
//             const modeleSelect = await page.$('select#vsms-2');
//             await modeleSelect.selectOption({ index: 1 }); // Sélectionner la première option (Modèle)

//             // Attendre que le bouton "Ok" devienne actif
//             await page.waitForSelector('input[type="submit"]:not([disabled])', { timeout: 10000 });
//             const submitButton = await page.$('input[type="submit"]:not([disabled])');


//             console.log('SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS', submitButton)

//             // Soumettre le formulaire
//             await submitButton.click();

//             // Attendez que la page soit redirigée et récupérez l'URL
//             await page.waitForNavigation({ waitUntil: 'networkidle0' });
//             const currentUrl = page.url(); // Récupère l'URL de redirection après la soumission

//             console.log(`Redirected URL: ${currentUrl}`);

//             // Obtenez les valeurs de marque, famille et modèle
//             const marque = await marqueSelect.evaluate(el => el.value);
//             const famille = await familleSelect.evaluate(el => el.value);
//             const modele = await modeleSelect.evaluate(el => el.value);

//             // Créez un objet avec le triplet et l'URL
//             const vehicleData = {
//                 marque,
//                 famille,
//                 modele,
//                 url: currentUrl // Associer l'URL à ce triplet
//             };

//             // Sauvegarde des données dans un fichier JSON
//             fs.appendFileSync('vehicleData.json', JSON.stringify(vehicleData, null, 2) + '\n');
//             console.log('Data saved to vehicleData.json');
//         } else {
//             console.log('No car-link found.');
//         }
//     } catch (error) {
//         console.error('Error while interacting with the modal:', error.message);
//     }
// };

// Main execution
const run = async () => {
    console.log('Starting crawler...');
    await crawler.run(urls);
    console.log('Crawling completed. Data:', JSON.stringify(dataset, null, 2));
};

run().catch((error) => {
    console.error('Crawler encountered an error:', error);
});
