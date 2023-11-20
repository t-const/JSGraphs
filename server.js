const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// SQLite database setup
const db = new sqlite3.Database('data.db');
db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS chart_data (label TEXT, value INTEGER, ts TIMESTAMP)');
});

app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// API endpoint to get chart data
app.get('/api/data', (req, res) => {
    db.all('SELECT * FROM chart_data', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(rows);
        }
    });
});

// API endpoint to add new data
app.post('/api/data', (req, res) => {
    const { label, value } = req.body;
    if (!label || !value) {
        res.status(400).json({ error: 'Label and value are required' });
        return;
    }

    db.run('INSERT INTO chart_data (label, value, ts) VALUES (?, ?, CURRENT_TIMESTAMP)', [label, value], (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json({ message: 'Data added successfully' });
        }
    });
});

app.post('/api/data/clear', (req, res) => {
    const { label } = req.body;
    if(!label) {
        // clear all table
        db.run('DELETE FROM chart_data', (err) => {
            if(err) {
                console.error(err.message);
                res.status(500).json({error: 'Internal Server Error'});
            }
            else
            {
                res.json({message: 'All data removed successfully'});
            }
        });
        return;
    }

    db.run('DELETE FROM chart_data WHERE label=?', [label], (err) => {
        if(err) {
            console.error(err.message);
            res.status(500).json({error: 'Internal Server Error'});
        }
        else
        {
            res.json({message: 'Data removed successfully'});
        }
    });

})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
