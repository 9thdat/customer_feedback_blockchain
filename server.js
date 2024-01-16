const express = require('express');
const cors = require('cors');
const { Web3 } = require('web3');
const getAllFeedback = require('./scripts/getAllFeedback');
const getFeedback = require('./scripts/getFeedback');
const submitFeedback = require('./scripts/submitFeedback');
const mysql = require('mysql');

const app = express();
const port = 3000;

// Sử dụng middleware cors
app.use(cors());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'customerfeedback',
});

connection.connect();

const getSecretCodes = (code) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM secretcode WHERE code = '${code}'`;
        connection.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

const setSecretCodeStatus = (code, status) => {
    return new Promise((resolve, reject) => {
        const query = `UPDATE secretcode SET status = '${status}' WHERE code = '${code}'`;
        connection.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

app.get('/', (req, res) => {
    res.send('Home');
});

app.get('/getAllFeedback', async (req, res) => {
    const feedbackArray = await getAllFeedback();
    res.json(feedbackArray);
});

app.get('/getFeedback', async (req, res) => {
    const feedback = await getFeedback(req.query.id);
    res.json(feedback);
});

app.get('/submitFeedback', async (req, res) => {
    try {
        const secretCodes = await getSecretCodes(req.query.code);
        if(secretCodes.length === 0 || secretCodes[0].status === 'Inactive')
            return res.json({
                status: 'error',
                message: 'Mã bí mật không hợp lệ!'
            });

        const result = await submitFeedback(req.query.name, req.query.email, req.query.feedback);

        await setSecretCodeStatus(req.query.code, 'Inactive');

        res.json({
            status: 'success',
        });
    } catch (e) {
        res.json({ error: e.message });
    }
});

// Lắng nghe các kết nối đến cổng 3000 trên localhost
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
