import http, { createServer } from 'http';
// console.log(http);

const PORT = 3000; 

const server = createServer((req,res)=>{
    if(req.url === '/')
    res.end("This is me Raju kumar for Geeks for Geeks channel ");
    // else res.end("This is not working ")
})

server.listen(PORT,()=>{
    console.log("Server ji is ready to exited ")
})