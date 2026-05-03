import http, { createServer } from 'http';
// console.log(http);

// All CRUD operation like create server , read server, update server , delete server 

const PORT = 3000;

// const server = createServer((req,res)=>{
//     res.write("Hello Server");
//     console.log(req.method);// Get, POSt
//     console.log(req.url); // HOme , api 
//     res.end();
// })

// CRUD using http module 

let data = [];
const server = createServer((req,res)=>{
        res.setHeader("Content-Type", "application/json");

    // Get operation Read operation 
    if(req.method === 'GET' && req.url ==='/data'){
        res.statusCode = 200;
        res.write(JSON.stringify(data));
        res.end();
    }
    // POST Operation (Create operation)
    else if(req.method === 'POST' && req.url ==='/data'){
        res.statusCode = 200;
        let body = "";
        req.on('data',chunk=>{
            body +=chunk;
        });
        req.on('end',()=>{
            data.push(JSON.parse(body));
            res.write("Data added ");
            res.end();
        });
    }

    //  PUT Operation (update operation)
    else if(req.method === 'PUT' && req.url === '/data'){
        res.statusCode = 200;
        data[0] = {update:true};
        res.write('Data updated');
        res.end();
    }

    // Delete Operation (Delete operation)
    else if(req.method === 'DELETE' && req.url === '/data'){
        res.statusCode = 200;
        data = [];
        res.write("Data deleted ");
        res.end();
    }
    else {
        res.statusCode = 404;
        res.write ("Routes not found ");
        res.end();
    }
});


server.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
})