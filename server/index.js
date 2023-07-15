const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require('cors');
app.use(cors());
const port = 3001;

// Read the JSON file
const handValues = JSON.parse(fs.readFileSync('handValues.json', 'utf8'));

app.get('/hand-values', (req, res) => {
  const position = req.query.position;
  
  // Filter the values based on the position
  const filteredValues = handValues.filter(hand => hand.position === position);
  
  // Group the values by percentage
  const groupedValues = filteredValues.reduce((groups, hand) => {
    const percentage = hand.percentage;
    if (!groups[percentage]) {
      groups[percentage] = [];
    }
    groups[percentage].push(hand);
    return groups;
  }, {});

  // Convert the grouped data to an array of objects and sort it by percentage
  const sortedGroupedValues = Object.keys(groupedValues)
    .sort((a, b) => b - a)  // Change 'a - b' to 'b - a' for descending order
    .map(percentage => ({
      percentage: percentage,
      hands: groupedValues[percentage]
    }));

  res.send(sortedGroupedValues);
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'src/index.js')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/omaha-trainer/src/index.js'));
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
