if(process.env.NODE_ENV==='production')
{            module.exports={ mongoURI:'mongodb://HASNAT:123456789mmm@ds245150.mlab.com:45150/tests'}     }
else {      module.exports= {mongoURI:'mongodb://localhost/test'}                   }
