const cheerio = require('cheerio');
const fs = require('fs');
const _ = require('underscore');

let jdHtmlContent = fs.readFileSync('./jdSrc.html').toString();
const $ = cheerio.load(jdHtmlContent);



let getDatafromSelector = function (selector, element) {
    // return _.first(_.first($(selector, element)).children).data;
    let getChildren = _.property('children');
    return _.chain(getChildren(_.chain($(selector, element)).first().value())).map(a => a.data).filter(a => !!a).first().value();
};

let convertIconToNumber = function (icon) {
    switch (icon) {
        case 'icon-ji':
            return 9;
        case 'icon-yz':
            return 1;
        case 'icon-rq':
            return 5;
        case 'icon-wx':
            return 2;
        case 'icon-lk':
            return 8;
        case 'icon-vu':
            return 3;
        case 'icon-ts':
            return 4;
        case 'icon-po':
            return 6;
        case 'icon-nm':
            return 7;
        case 'icon-acb':
            return 0;
  
      default:
            return 'X';
    }
};

let elementList = $('.cntanr').toArray().map(function (element) {
    return {
        name: getDatafromSelector('.lng_cont_name', element),
        location: getDatafromSelector('.cont_fl_addr', element),
        phone: _.chain($('.contact-info span a', element).toArray().map(a => _.chain($('span', a).toArray()).map('attribs').map('class').value())).first().map(a => a.split(' ')[1]).map(convertIconToNumber).value().join('')
    }
});

// .map(function (element) {
//     return element.children.map(child => child.data);
// });

console.log(elementList.length);

fs.writeFileSync('./scrapedData.json', JSON.stringify(elementList));