
import { Router } from 'express';
import axios from 'axios';


export default ({ config, db }) => {


    //My thought on the 5th question would be to save my bounding box lat/long coords, call time to a data base, along with the returned csv file
    //if a new call falls near that bounding box and is within the timeframe, send the saved csv file

    let api = Router();

    var googleMapsClient = require('@google/maps').createClient({
        key: 'AIzaSyBIitnsj2Ey_evcKCf1wdP9hwEDvjfzi8E'
    });

    api.get('/form',function(req,res) {
        res.sendFile('form.html', { root: './src/views/' })
    });

    api.post('/form', function(req, res) {

        googleMapsClient.geocode({
            address: req.body.address
        }, function(err, response) {
            if (!err) {

                try {
                    let lat = response.json.results[0].geometry.location.lat;
                    let long = response.json.results[0].geometry.location.lng;
                    let n = req.body.radius;

                    //not super accurate
                    let minLat = lat - (0.009 * n);
                    let maxLat = lat + (0.009 * n);
                    let minLon = long - (0.009 * n);
                    let maxLon = long + (0.009 * n);

                    axios.post('https://www.homeaway.com/serp/g', {
                        "operationName": "SearchQuery",
                        "variables": {
                            "params": {
                                "swLat": minLat,
                                "swLong": minLon,
                                "neLat": maxLat,
                                "neLong": maxLon,
                                "pageSize": 50
                            }
                        },
                        "query":"query SearchQuery($params: ResultsParams, $url: String) {\n  results(params: $params) {\n    id\n    analyticsdatalayer\n    destinationBreadcrumbs {\n      name\n      url\n      __typename\n    }\n    headlineTitle\n    hitCollection {\n      ...ResultsHitCollection\n      ...PagerHitCollection\n      ...MapHitCollection\n      ...ExpandedSearchGroupsHitCollection\n      __typename\n    }\n    internal {\n      searchServiceUrl\n      __typename\n    }\n    searchBanner {\n      type\n      ...PercentBookedSearchBanner\n      ...UrgentMessageSearchBanner\n      __typename\n    }\n    breadcrumbs {\n      url\n      name\n      termId\n      __typename\n    }\n    liveRegionRedirectUrl\n    pidRedirectUrl\n    searchReviewsHeadline\n    searchReviews {\n      detailPageUrl\n      reviewHead\n      reviewText\n      reviewCreated\n      reviewArrival\n      reviewRating\n      hitThumbnailUrl\n      __typename\n    }\n    searchTerm {\n      description\n      name\n      termId\n      __typename\n    }\n    seoSerpLinks {\n      name\n      url\n      termId\n      __typename\n    }\n    filterGroups {\n      key\n      filters {\n        key\n        checked\n        __typename\n      }\n      __typename\n    }\n    searchGeography {\n      geoType\n      location {\n        latitude\n        longitude\n        __typename\n      }\n      isGeoCoded\n      __typename\n    }\n    ...AdSenseResults\n    ...FilterCountsResults\n    ...FooterSeoLinksResults\n    ...HtmlTitleResults\n    ...DestinationMessageFragment\n    __typename\n  }\n}\n\nfragment AdSenseResults on Results {\n  searchTerm {\n    name\n    termId\n    __typename\n  }\n  adSenseConfiguration {\n    query\n    queryLink\n    queryContext\n    channel\n    adtest\n    hl\n    pubId\n    __typename\n  }\n  __typename\n}\n\nfragment ExpandedSearchGroupsHitCollection on HitCollection {\n  isDatelessSearch\n  expandedSearchGroups {\n    ...ExpandedSearchGroupExpandedSearchGroup\n    __typename\n  }\n  __typename\n}\n\nfragment ExpandedSearchGroupExpandedSearchGroup on ExpandedSearchGroup {\n  hits {\n    ...HitSERPHit\n    __typename\n  }\n  mapViewport {\n    neLat\n    neLong\n    swLat\n    swLong\n    __typename\n  }\n  __typename\n}\n\nfragment HitSERPHit on SERPHit {\n  absolutePosition\n  detailPageUrl\n  imageCount\n  images {\n    lowResSrc\n    src\n    altText\n    __typename\n  }\n  relativePosition\n  spu\n  thumbnailUrl1\n  ...HitInfoSERPHit\n  __typename\n}\n\nfragment HitInfoSERPHit on SERPHit {\n  ...DetailsSERPHit\n  ...PriceSERPHit\n  ...GeoDistanceSERPHit\n  ...RatingSERPHit\n  detailPageUrl\n  freeCancellationUntil\n  headline\n  instantBookable\n  listingId\n  minStay\n  partnerBadges {\n    helpText\n    name\n    __typename\n  }\n  reviewBadges {\n    name\n    __typename\n  }\n  propertyId\n  propertyType\n  urgencyMessage {\n    icon\n    message\n    __typename\n  }\n  __typename\n}\n\nfragment DetailsSERPHit on SERPHit {\n  details {\n    sleeps\n    bedrooms\n    bathroomsFull\n    bathroomsHalf\n    bathroomsToiletOnly\n    area\n    __typename\n  }\n  amenitiesBadges {\n    name\n    __typename\n  }\n  __typename\n}\n\nfragment GeoDistanceSERPHit on SERPHit {\n  geoDistance {\n    default {\n      text\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment PriceSERPHit on SERPHit {\n  price {\n    currencyUnits\n    periodType\n    value\n    __typename\n  }\n  priceSummary {\n    edapEventJson\n    formattedAmount\n    pricePeriodDescription\n    __typename\n  }\n  __typename\n}\n\nfragment RatingSERPHit on SERPHit {\n  averageRating\n  reviewCount\n  __typename\n}\n\nfragment FilterCountsResults on Results {\n  hitCollection {\n    total\n    __typename\n  }\n  filterGroups {\n    name\n    key\n    filters {\n      name\n      key\n      count\n      checked\n      description\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment FooterSeoLinksResults on Results {\n  seoSerpLinks {\n    name\n    url\n    __typename\n  }\n  destination {\n    breadcrumbs {\n      name\n      url\n      __typename\n    }\n    links {\n      name\n      url\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment ResultsHitCollection on HitCollection {\n  isDatelessSearch\n  hits {\n    ...PinnedPropertyHit\n    ...HitSERPHit\n    __typename\n  }\n  __typename\n}\n\nfragment PinnedPropertyHit on SERPHit {\n  available\n  pinned\n  __typename\n}\n\nfragment MapHitCollection on HitCollection {\n  hits {\n    ...MapHitSERPHit\n    __typename\n  }\n  expandedSearchGroups {\n    hits {\n      ...MapHitSERPHit\n      __typename\n    }\n    __typename\n  }\n  mapViewport {\n    neLat\n    neLong\n    swLat\n    swLong\n    __typename\n  }\n  __typename\n}\n\nfragment MapHitSERPHit on SERPHit {\n  location {\n    latitude\n    longitude\n    __typename\n  }\n  __typename\n}\n\nfragment PagerHitCollection on HitCollection {\n  total\n  page\n  pageCount\n  pageSize\n  from\n  to\n  __typename\n}\n\nfragment HtmlTitleResults on Results {\n  pageTitle\n  metaDescription\n  metaKeywords\n  canonicalLink(url: $url)\n  alternativeLinks(url: $url) {\n    link\n    hrefLang\n    __typename\n  }\n  __typename\n}\n\nfragment DestinationMessageFragment on Results {\n  urgencyDestinationMessage {\n    iconTitleTextV1 {\n      title\n      message\n      icon\n      __typename\n    }\n    iconTextV1 {\n      message\n      icon\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment PercentBookedSearchBanner on SearchBanner {\n  location\n  percentageLeft\n  __typename\n}\n\nfragment UrgentMessageSearchBanner on SearchBanner {\n  countOfVisitors\n  location\n  __typename\n}\n"

                    }).then(function (response) {

                            let resultArray = [];

                            //My plan for the "nightly prices for the next 12 months" was to use Promise.all with each listing's id in an axios GET
                            //however I couldn't get the RATES query param to work per listing so I defaulted to 50 within the border box

                            for(let hit of response.data.data.results.hitCollection.hits){

                                resultArray.push({
                                    "Id": hit.listingId,
                                    "Headline": hit.headline,
                                    "Price": hit.price,
                                    "Property Type": hit.propertyType,
                                    "Location": hit.location,
                                    "Average Rating": hit.averageRating
                                });
                            }

                                const Json2csvParser = require('json2csv').Parser;
                                const fields = ['Id', 'Headline', 'Price', 'Property Type', 'Location', 'Average Rating'];
                                const opts = { fields };
                                const parser = new Json2csvParser(opts);
                                const csv = parser.parse(resultArray);

                                res.setHeader('Content-disposition', 'attachment; filename=testing.csv');
                                res.set('Content-Type', 'text/csv');
                                res.status(200).send(csv);

                        })
                        .catch(function (error) {
                            console.log(error)
                        });


                } catch (err) {

                    res.sendFile('error.html', { root: './src/views/' })

                }


            }
        });

    });

    return api;
}