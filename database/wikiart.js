 const request = require('request');
 const Utils = require('../helpers/utils.js');


class Wikiart {

  constructor() {
    const url = 'http://www.wikiart.org/';
    const lang = 'fr'
    this.baseURL = url + lang + '/'
  }

  getArtistByName( name ) {
    let url = this.baseURL + Utils.slugify( name ) + '?json=2';
    return new Promise((resolve, reject) => {
        const options = {
          url: url,
          headers: {
            'User-Agent': 'node.js'
          }
        };
        request(options, (error, response) => {
            if (error) {
                console.log('Error sending message: ', error);
                reject(error);
            } else if (response.body.error) {
                console.log('Error: ', response.body.error);
                reject(new Error(response.body.error));
            }
            console.log("wikiart url", url);

            let artist = Utils.parseJSON(response.body)
            if( !artist ) {
              reject('undefined');
            } else {
              console.log("@#@#@#@######@@@##@#@@@####@##", artist);
              resolve(this.sanitize(artist));
            }

        });
    });
  }

  getArtworkByName( name ) {
    let url = encodeURI(this.baseURL + 'search/' + name + '/1?json=2');
    console.log(url);
    return new Promise((resolve, reject) => {
        request(url, (error, response) => {
            if (error) {
                console.log('Error sending message: ', error);
                reject(error);
            } else if (response.body.error) {
                console.log('Error: ', response.body.error);
                reject(new Error(response.body.error));
            }
            let paintings = Utils.parseJSON(response.body)
            if( !paintings ) {
              reject('undefined');
            } else {
              console.log("paintings", paintings);
              let similarityScore = [];
              for( let i = 0; i < paintings.length; i++ ){
                  similarityScore.push( Utils.similarity( name , paintings[i].title  ) );
              }
              let painting = paintings[ similarityScore.indexOf( Math.max.apply( Math, similarityScore )) ];
              resolve( painting );
            }


        });
    });
  }

  getPaintingById( id ) {
    let url = encodeURI(this.baseURL + 'App/Painting/ImageJson/' + id );
    console.log(url);
    return new Promise((resolve, reject) => {
        request(url, (error, response) => {
            if (error) {
                console.log('Error sending message: ', error);
                reject(error);
            } else if (response.body.error) {
                console.log('Error: ', response.body.error);
                reject(new Error(response.body.error));
            }
            let res = Utils.parseJSON(response.body)
            if( !res ) {
              reject('undefined');
            } else {
              resolve( res )
            }

        });
    });
  }

  getPaintingsFromArtist(name) {

  }

  getArtistOfPainting() {

  }

  sanitize(artist) {
    artist.first_name = '';
    artist.last_name = artist.artistName;
    if(artist.image)
        artist.image = artist.image.replace('g!Portrait.jpg', 'g');

    if(artist.birthDayAsString) {
        const birthdate = new Date(artist.birthDayAsString);
        artist.day_of_birth = birthdate.getDate();
        artist.month_of_birth = birthdate.getMonth();
        artist.year_of_birth = birthdate.getFullYear();
    }

    if(artist.deathDayAsString) {
        const deathdate = new Date(artist.deathDayAsString);
        artist.day_of_death = deathdate.getDate();
        artist.month_of_death = deathdate.getMonth();
        artist.year_of_death = deathdate.getFullYear();
    }
    return artist;
  }

}

module.exports = Wikiart;
