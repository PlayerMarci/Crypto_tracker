function fetchCryptoData() {
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false')
      .then(response => response.json())
      .then(data => {
        // Clear previous data
        document.getElementById('crypto-table').innerHTML = '';

        // Loop through data and populate the table
        data.forEach((crypto, index) => {
          const row = `<tr>
                        <th scope="row">${index + 1}</th>
                        <td>${crypto.name}</td>
                        <td>$${crypto.current_price.toFixed(2)}</td>
                        <td class="${crypto.price_change_percentage_24h > 0 ? 'green' : 'red'}">${crypto.price_change_percentage_24h.toFixed(2)}%</td>
                      </tr>`;
          document.getElementById('crypto-table').innerHTML += row;
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  }

  // Fetch cryptocurrency data when the page loads
  window.onload = fetchCryptoData;

  // Theme toggle functionality
  const themeToggle = document.querySelector('.theme-toggle');
  const body = document.body;

  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    const moon = document.querySelector('.dark-mode');
    const sun = document.querySelector('.light-mode');
    if (body.classList.contains('dark-theme')) {
      moon.classList.remove('hidden');
      sun.classList.add('hidden');
    } else {
      moon.classList.add('hidden');
      sun.classList.remove('hidden');
    }
  });
  document.getElementById('wealth-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const firstDeposit = parseFloat(document.getElementById('first-deposit').value);
    const monthlyDeposit = parseFloat(document.getElementById('monthly-deposit').value);
    const timePeriod = parseFloat(document.getElementById('time-period').value);
    const annualYield = parseFloat(document.getElementById('annual-yield').value) / 100;

    const ctx = document.getElementById('wealth-chart').getContext('2d');
    if (window.wealthChart) {
      window.wealthChart.destroy(); // Clear previous chart instance
    }

    const labels = [];
    const withoutYieldData = [];
    const withYieldData = [];

    let currentTotal = firstDeposit;
    for (let i = 0; i <= timePeriod; i++) {
      labels.push(i);
      withoutYieldData.push(firstDeposit + (monthlyDeposit * 12 * i)); // Linear growth

      const monthlyYield = currentTotal * (annualYield / 12);
      currentTotal += monthlyDeposit * 12; // Adding monthly deposit without yield
      currentTotal += monthlyYield;
      withYieldData.push(currentTotal);
    }

    window.wealthChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Without Yield',
          data: withoutYieldData,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: false,
        }, {
          label: 'With Yield',
          data: withYieldData,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: false,
        }]
      },
      options: {
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            title: {
              display: true,
              text: 'Years'
            }
          },
          y: {
            type: 'linear',
            position: 'left',
            title: {
              display: true,
              text: 'Total Wealth ($)'
            }
          }
        }
      }
    });
  });