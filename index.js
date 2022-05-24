let { writeFile, read } = require('fs');
let { join } = require('path');
let request = require('request');
let mergeImg = require('merge-img');
const prompt = require("prompt-sync")({ sigint: true });
let validateColor = require("validate-color").default;


function catPictures (greeting, who, width, height, color, size)
{

    let firstReq = {
    // https://cataas.com/cat/says/Hi%20There?width=500&amp;height=800&amp;c=Cyan&amp;s=150
    url: 'https://cataas.com/cat/says/' + greeting + '?width=' + width + '&height=' + height + '&color' + color + '&s=' + size, encoding: 'binary'
    };

    let secondReq = {
        url: 'https://cataas.com/cat/says/' + who + '?width=' + width + '&height=' + height + '&color' + color + '&s=' + size, encoding: 'binary'
    };

    //Get the first image
    request.get(firstReq, (err, res, firstBody) => { 
        if(err) {
            console.log(err);
            return; 
        }    
        console.log('Received first response with status:' + res.statusCode);
        
        //Get the second image
        request.get(secondReq, (err, res, secondBody) => { 
            if(err) {
                console.log(err);
                return; 
            }        
            console.log('Received second response with status:' + res.statusCode); 

            //Merge the two image into one and save it as a jpg file    
            mergeImg([
                { src: new Buffer.from(firstBody, 'binary')}, 
                { src: new Buffer.from(secondBody, 'binary')}
            ])
            .then((img) => {
                img.write('cat-card.jpg', () => console.log('done'));
            });

        });
    });
}

//Get the parameters
let greeting = prompt("What is the greeting: "),
who = prompt("Who are you greeting: ");

let width;
while(isNaN(width))
    width = prompt("Enter the width(number) of the pictures you want: ");

let height;
while(isNaN(height))
    height= prompt("Enter the height(number) of the pictures you want: ");

let color;
while(!validateColor(color) && color != "")
    color = prompt("Enter a color for the pictures you want: ");

let size;
while(isNaN(size))
    size = prompt("Enter the size(number) of the text you want: ");

console.log("\n");

//call the fucntion & default parameter values
catPictures (greeting?greeting:"Hello", who?who:"You", width?width:400,
                height?height:500, color?color:"Pink", size?size:100)   