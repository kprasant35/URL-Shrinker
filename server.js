const express = require('express');
const app = express();
const ShortUrl=require('./models/ShortUrl');
const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost/urlshortner',{
    useNewUrlParser: true, useUnifiedTopology: true
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:false}));

app.get('/', async (req,res) => {
    const shortUrls = await ShortUrl.find();
    res.render('index', {shortUrls : shortUrls});
})

app.post('/ShortUrls', async (req,res) => {
    await ShortUrl.create({ full: req.body.FullURL })
    res.redirect('/');
})

app.get('/:short', async (req,res) => {
    console.log(req.params.short);

    const shortUrl = await ShortUrl.findOne({short : req.params.short});
    

    if(shortUrl == null) return res.sendStatus(404);

    shortUrl.clicks++
    shortUrl.save()
  
    res.redirect(shortUrl.full)
})



app.listen(process.env.PORT || 5000);
