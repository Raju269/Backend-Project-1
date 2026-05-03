import http from 'http';
// console.log(http);
// This is comment to about http function 

const PORT = 3000;

// now create a server 
const server = http.createServer((req,res)=>{
    // console.log(req);
    // console.log(res);
    console.log(req.url);
    console.log(req.body);
    console.log(req.method);
    res.statusCode = 200;
    res.setHeader("author","Rajukumar");
    // res.end("Hello ji Raju kais hai appka ")
    if(req.url ==='/'){
        res.end("This is me raju kumar");
    }
    else if(req.url ==='/Home'){
        res.end("This is home page bro ");
    }
    else if(req.url ==='/contact'){
        res.end("This is contact page ");
    }
    else if(req.url=== '/products'){
        res.end("This is product pages ");
    }
    else if(req.url === '/Raju'){
        res.end("This is Raju bhai sab ");
    }else{
        res.statusCode = 404;
        res.end("this is not working ");
    }
});


server.listen(PORT,()=>{
    console.log("Serve is started now . ")
})