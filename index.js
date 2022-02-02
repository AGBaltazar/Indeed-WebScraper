const PORT =8000;
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const nodemailer = require('nodemailer');

const app = express()
const url = 'https://www.indeed.com/jobs?q=Junior+engineer&l=Remote&fromage=1';

//Axios will return a promise and once the promise is returned we will get the response(data)//

axios(url)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const indeedJobPostings =[]

        //After cheerio has loaded our html, we begin by searching through a .resultContent class for our needed title and company //
        $('.resultContent',html).each(function(){
             title = $(this).find('.jobTitle').text()
             company = $(this).find('.companyName').text()
             indeedJobPostings.push(`<strong>Title:</strong> ${title} <strong>Company:</strong> ${company}`);
            
        })
        
        //A for loop will go through each job posting and add each of them to a list that is seperate from the body ///
        var arrayPostings = "";
        var n;
        for (n in indeedJobPostings) {
         arrayPostings += "<br /><li>" + indeedJobPostings[n] + "</li><br />";
        }

        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: 'Email Username',
                pass: 'Email Password'
            }
        });

        let mailOptions = {
            from: 'email',
            to: 'email recipient',
            subject: 'Daily Indeed Postings',
            html: `<h2>Goodmorning! <br /> You have ${indeedJobPostings.length}  daily discoveries from Indeed:</h2>  <ul>${arrayPostings}</ul>`
        };
        
        console.log(mailOptions);

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error.message);
            }
            console.log('success');
        });

    }).catch(err => console.log(err))


app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))


