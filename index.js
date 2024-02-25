require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

app.get('/', async (req, res) => {
    const residences = 'https://api.hubspot.com/crm/v3/objects/residences?properties=name,street_address,access_instructions';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(residences, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Custom Object Table', data });      
    } catch (error) {
        console.error(error);
    }
    
});

app.get('/update-cobj', async (req, res) => {
        res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });      
});

app.post('/update-cobj', async (req, res) => {
 const update = {
        properties: {
            "name": req.body.name,
            "street_address": req.body.address,
            "access_instructions": req.body.access
        }
    }
    const updateResidence = `https://api.hubspot.com/crm/v3/objects/residences`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.post(updateResidence, update, { headers } );
        res.redirect('/');
    } catch(err) {
        console.error(err);
    }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));