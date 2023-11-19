const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Sample Data',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            data: [],
        }],
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    },
});

// Fetch initial data from the server
fetchData();

// Set interval to fetch updated data every 5 seconds (adjust as needed)
setInterval(fetchData, 5000);

function fetchData() {
    fetch('/api/data')
        .then(response => response.json())
        .then(data => {
            // Update chart data
            myChart.data.labels = data.map(entry => entry.label);
            myChart.data.datasets[0].data = data.map(entry => entry.value);

            // Update the chart
            myChart.update();
        })
        .catch(error => console.error('Error fetching data:', error));
}

function addData() {
    const newLabel = document.getElementById('newLabel').value;
    const newValue = document.getElementById('newValue').value;

    if (!newLabel || !newValue) {
        alert('Label and value are required.');
        return;
    }

    // Add new data to the server
    fetch('/api/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            label: newLabel,
            value: parseInt(newValue, 10),
        }),
    })
        .then(response => response.json())
        .then(() => {
            // Fetch updated data from the server
            fetchData();

            // Clear the form fields
            document.getElementById('newLabel').value = '';
            document.getElementById('newValue').value = '';
        })
        .catch(error => console.error('Error adding data:', error));
}
