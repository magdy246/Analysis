let baseUrl = "/main.json";
let myChart;
let barColors = ["red", "green", "aqua", "orange", "brown","yellowgreen","chartreuse","blue","burlywood"];

async function getdata(nameFilterValue = "", amountFilterValue = "") {
  let response = await fetch(baseUrl);
  let result = await response.json();

  let table = "";
  let filteredTransactions = [];

  for (let i = 0; i < result.customers.length; i++) {
    let customer = result.customers[i];
    let transaction = result.transactions[i];

    if (
      (nameFilterValue == "" ||
        customer.name.toLowerCase().includes(nameFilterValue.toLowerCase())) &&
      (amountFilterValue == "" ||
        transaction.amount.toString().includes(amountFilterValue))
    ) {
      table += `<tr>
          <td>${customer.id}</td>
          <td>${customer.name}</td>
          <td>${transaction.date}</td>
          <td>${transaction.amount}</td>
        </tr>`;
      filteredTransactions.push(transaction.amount); //& collect filtered transaction amounts &
    }
  }

  document.querySelector("#data").innerHTML = table;
  updateChart(filteredTransactions); // & Update chart with filtered amounts &
}
function updateChart(data) {
  const ctx = document.getElementById("transactionChart").getContext("2d");
  if (myChart) {
    myChart.destroy(); // & destroy mean clear chart if it exists &
  }
  myChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: data.map((_, index) => `customer ${index + 1}`),
      datasets: [
        {
          label: "Amounts",
          data: data,
          backgroundColor: barColors,
          
        },
      ],
    },
    options: {
      scales: {
          beginAtZero: true,
        },
      },
  });
}

getdata();

//^^^^^^^^^^^^^^^^^^^^^^^^^FILTERs^^^^^^^^^^^^^^^^^^^^^^^^^
let nameFilter = document.querySelector("#nameFilter");
nameFilter.addEventListener("input", function () {
  getdata(nameFilter.value, amountFilter.value);
});

let amountFilter = document.querySelector("#amountFilter");
amountFilter.addEventListener("input", function () {
  getdata(nameFilter.value, amountFilter.value);
});
