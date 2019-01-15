const url = require('url');
const filejson = require('./items.json');
const fs = require("fs");
const contents = fs.readFileSync('./items.json');


exports.getItems = function (req, res) {
    const reqUrl = url.parse(req.url, true);
   
    if (reqUrl.query.name) {
        name = reqUrl.query.name
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(filejson));
};

exports.testRequest = function (req, res) {
    
    
    


    body = '';

    req.on('data', function (chunk) {
        body += chunk;
    });

   
   
    req.on('end', function () {

        postBody = JSON.parse(body);
        //console.log(postBody);

        const jsonContent = JSON.parse(contents);
        var compute = '';
        var result = {};
    
        //console.log(jsonContent.ult_small[1]);      

        switch(postBody.prodcode) {
            case "ult_small":
                if(postBody.numitem >= 3){
                    if(postBody.discount != ''){
                        disc = .10;
                    }
                    if(postBody.numitem > 3 ){
                        compute = (postBody.numitem - 1) * jsonContent.ult_small[1];
                    }
                    else{
                        compute = 2 * jsonContent.ult_small[1];
                    }
                    //console.log(Math.round(compute* 100) / 100);                  
                }
                else{
                    compute = postBody.numitem * jsonContent.ult_small[1];
                }

                if(postBody.discount == 'I<3AMAYSIM'){
                    disc = compute * .10;
                    compute = compute - disc;  
                }

                result = {"prod_code": jsonContent.ult_small[0],"numitembuy": postBody.numitem, "total": Math.round(compute * 100) / 100}

                 
                break;

            case "ult_medium":
               
                compute = postBody.numitem * jsonContent.ult_medium[1]; 
                
                if(postBody.discount == 'I<3AMAYSIM'){
                    disc = compute * .10;
                    compute = compute - disc;  
                }

                result = {"prod_code": jsonContent.ult_medium[0], "bundle": jsonContent.utl_1gb[0] ,"numitembuy": postBody.numitem, "total": Math.round(compute* 100) / 100}
                
                break;

            case "ult_large":
                if (postBody.numitem > 3){
                    compute = postBody.numitem * 39.90;
                }
                else{
                    compute = postBody.numitem * jsonContent.ult_large[1];
                }

                if(postBody.discount == 'I<3AMAYSIM'){
                    disc = compute * .10;
                    compute = compute - disc;  
                }

                result = {"prod_code": jsonContent.ult_medium[0], "bundle": jsonContent.utl_1gb[0] ,"numitembuy": postBody.numitem, "total": Math.round(compute* 100) / 100}
                

                break;
        }
        
        //var response =result

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result));
    });

   
};

exports.invalidRequest = function (req, res) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Invalid Request');
};