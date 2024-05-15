let myChart;
displayInitialChart();
fillProfile();

async function prepareChartData() {
    const basketItems = JSON.parse(localStorage.getItem('basketItems'));
    let carCount = {};

    if (basketItems) {
        let ids = basketItems.map(item => item.id);

        let url = new URL('http://localhost:5027/api/cars/ids');
        ids.forEach(id => url.searchParams.append('ids', id));

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        for (let item of basketItems) {
            let car = data.find(car => car.id == item.id);
            carCount[car.name] = item.quantity;
        }
    }

    let data = [];
    let labels = [];

    for (let name in carCount) {
        labels.push(name);
        data.push(carCount[name]);
    }

    return { data: data, labels: labels };
}

async function selectChart(element) {
    let charts = document.querySelectorAll('#chartTypes .dropdown-item');
    charts = Array.from(charts);

    let chartTypeMap = {
        "Pie Chart": "pie",
        "Bar Chart": "bar",
        "Line Chart": "line"
    };
    let selectedChart = charts.find(chart => chart.textContent === element.textContent);

    charts.forEach(chart => chart.classList.remove('active'));

    let chartType;
    if (selectedChart) {
        selectedChart.classList.add('active');
        chartType = chartTypeMap[selectedChart.textContent];
    }

    let chartData = await prepareChartData();
    updateChart(chartData.data, chartData.labels, chartType);
}

function updateChart(data, labels, chartType) {
    if (myChart) {
        myChart.destroy();
    }
    let ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                label: 'The most popular cars in basket',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 0, 0, 0.2)',
                    'rgba(0, 255, 0, 0.2)',
                    'rgba(0, 0, 255, 0.2)',
                    'rgba(255, 255, 0, 0.2)',
                    'rgba(255, 0, 255, 0.2)',
                    'rgba(0, 255, 255, 0.2)',
                    'rgba(128, 0, 0, 0.2)',
                    'rgba(0, 128, 0, 0.2)',
                    'rgba(0, 0, 128, 0.2)',
                    'rgba(128, 128, 0, 0.2)',
                    'rgba(128, 0, 128, 0.2)',
                    'rgba(0, 128, 128, 0.2)',
                    'rgba(192, 192, 192, 0.2)',
                    'rgba(128, 128, 128, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 0, 0, 1)',
                    'rgba(0, 255, 0, 1)',
                    'rgba(0, 0, 255, 1)',
                    'rgba(255, 255, 0, 1)',
                    'rgba(255, 0, 255, 1)',
                    'rgba(0, 255, 255, 1)',
                    'rgba(128, 0, 0, 1)',
                    'rgba(0, 128, 0, 1)',
                    'rgba(0, 0, 128, 1)',
                    'rgba(128, 128, 0, 1)',
                    'rgba(128, 0, 128, 1)',
                    'rgba(0, 128, 128, 1)',
                    'rgba(192, 192, 192, 1)',
                    'rgba(128, 128, 128, 1)'
                ]
                ,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

async function displayInitialChart() {
    let initialChartData = await prepareChartData();
    updateChart(initialChartData.data, initialChartData.labels, 'pie');
}

async function fillProfile() {
    let mainContainer = document.getElementsByTagName('main')[0];
    const token = localStorage.getItem('token');
    if (!token) {
        mainContainer.textContent = "";
        mainContainer.insertAdjacentHTML('beforeend', '<h1>Only authenticated users can access the basket!</h1>');
        return;
    }
    await fetch(`http://localhost:5027/api/auth/userinfo`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(async response => {
            if (!response.ok) {
                throw new Error(`Server responded: ${await response.text()}`);
            }
            return response.json();
        })
        .then(data => {
            const profileUl = document.getElementById('profileUl');
            profileUl.innerHTML = `
                <li><img id="profileImg" src="assets/images/profile.png" alt=""></li>
                <li>${data.displayName}</li>
                <li>${data.email}</li>
                <li>${data.role}</li>`;
        })
        .catch(error => {
            console.error('Error filling profile:', error);
        });
}
