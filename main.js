//^^^^^^^^^^^^^^^^^^^^^^^^^^^FETCH THE JOSN FILE^^^^^^^^^^^^^^^^^^^^^^^^^^^
async function getData(nameFilterValue = "", amountFilterValue = "") {
  let response = await fetch("main.json");
  let result = await response.json();

  let table = "";
  let filteredTransactions = [];

  for (let i = 0; i < result.transactions.length; i++) {
    let transaction = result.transactions[i];
    //* link the id of custmor with the id of transaction *
    let customer = result.customers.find(function (c) {
      return c.id == transaction.customer_id;
    });

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
  //* link the data with the library *
  updateChart(filteredTransactions);
}
getData();

//^^^^^^^^^^^^^^^^^^^^^^^^^^^CHART.JS^^^^^^^^^^^^^^^^^^^^^^^^^^^
let myChart;
function updateChart(data) {
  let ctx = document.querySelector("#transactionChart").getContext("2d");
  if (myChart) {
    myChart.destroy();
  }
  myChart = new Chart(ctx, {
    type: "line", //! type of graph !
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

//^^^^^^^^^^^^^^^^^^^^^^^^^^^FILTERs^^^^^^^^^^^^^^^^^^^^^^^^^^^
let nameFilter = document.querySelector("#nameFilter");
nameFilter.addEventListener("input", function () {
  getData(nameFilter.value, amountFilter.value);
});

let amountFilter = document.querySelector("#amountFilter");
amountFilter.addEventListener("input", function () {
  getData(nameFilter.value, amountFilter.value);
});
