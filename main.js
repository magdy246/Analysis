async function getdata(nameFilterValue = "", amountFilterValue = "") {
  let response = await fetch("main.json");
  let result = await response.json();

  let table = "";
  let filteredTransactions = [];

  for (let i = 0; i < result.transactions.length; i++) {
    let transaction = result.transactions[i];
    let customer = result.customers.find((c) => c.id === transaction.customer_id);

    if (
      (nameFilterValue === "" ||
        customer.name.toLowerCase().includes(nameFilterValue.toLowerCase())) &&
      (amountFilterValue === "" ||
        transaction.amount.toString().includes(amountFilterValue))
    ) {
      table += `<tr>
          <td>${customer.id}</td>
          <td>${customer.name}</td>
          <td>${transaction.date}</td>
          <td>${transaction.amount}</td>
          </tr>`;
      filteredTransactions.push(transaction.amount);
    }
  }

  document.querySelector("#data").innerHTML = table;
  updateChart(filteredTransactions);
}

let myChart;

function updateChart(data) {
  const ctx = document.getElementById("transactionChart").getContext("2d");
  if (myChart) {
    myChart.destroy();
  }
  myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: data.map((_, index) => `Transaction ${index + 1}`),
      datasets: [
        {
          label: "Transaction Amounts",
          data: data,
          backgroundColor: "rgba(0,0,255,0.1)",
          borderColor: "rgba(0,0,255,1.0)",
          fill: true,
        },
      ],
    },
    options: {
      legend: { display: true },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

getdata();

let nameFilter = document.querySelector("#nameFilter");
nameFilter.addEventListener("input", function () {
  getdata(nameFilter.value, amountFilter.value);
});

let amountFilter = document.querySelector("#amountFilter");
amountFilter.addEventListener("input", function () {
  getdata(nameFilter.value, amountFilter.value);
});
