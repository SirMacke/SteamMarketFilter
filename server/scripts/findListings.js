const axios = require('axios');
const { Item } = require('../models/item');

module.exports = async () => {
  let itemCounter = 0;
  let itemsOnEachRequest = 20000;
  let moreItemsToFind = true;

  while (moreItemsToFind) {
    console.log('Item:', itemCounter);

    try {
      let rawData = await axios(`https://steamcommunity.com/market/search/render/?query=&start=${itemCounter}&count=${itemsOnEachRequest}&search_descriptions=0&sort_column=popular&sort_dir=desc&norender=1`, {
        "headers": {
          "accept": "text/javascript, text/html, application/xml, text/xml, */*",
          "accept-language": "en,sv-SE;q=0.9,sv;q=0.8,en-SE;q=0.7,en-US;q=0.6,de;q=0.5",
          "sec-ch-ua": "\"Chromium\";v=\"92\", \" Not A;Brand\";v=\"99\", \"Google Chrome\";v=\"92\"",
          "sec-ch-ua-mobile": "?0",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-prototype-version": "1.7",
          "x-requested-with": "XMLHttpRequest",
          "cookie": "sessionid=b1bb751a03c990d0472979b1; steamCountry=SE%7C288bb219397a27f8fffd85993ac7b6e4; timezoneOffset=7200,0; cookieSettings=%7B%22version%22%3A1%2C%22preference_state%22%3A1%2C%22content_customization%22%3Anull%2C%22valve_analytics%22%3Anull%2C%22third_party_analytics%22%3Anull%2C%22third_party_content%22%3Anull%2C%22utm_enabled%22%3Atrue%7D; _ga=GA1.2.1912171294.1627069246; _gid=GA1.2.1734396492.1627069246"
        },
        "referrer": "https://steamcommunity.com/market/search?q=",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors"
      });
  
      let items = rawData.data.results;
  
      if (items.length == 0) {
        moreItemsToFind = false;
        break;
      }
    
      for (let rawItemData of items) {
        
        let item = new Item({
          name: rawItemData['name'],
          app: rawItemData['app_name'],
          quantity: rawItemData['sell_listings'],
          sellPrice: rawItemData['sell_price'] / 100,
          icon: `https://community.akamai.steamstatic.com/economy/image/${rawItemData['asset_description']['icon_url']}`
        });

        item.minimumTotalValue = item.quantity * item.sellPrice;
  
        Item.findOne({$or: [{name: item.name}, {app: item.app}] }, async (err, result) => {
          if (!result) {
            await item.save();
          }
        });
  
      }
  
      itemCounter += itemsOnEachRequest;
  
      // To only request once
      //moreItemsToFind = false;
    } catch (err) {
      console.log(err);
    }
  }

  console.log('Done');
}