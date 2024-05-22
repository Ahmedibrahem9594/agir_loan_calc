function calculateAmortization() {
  // Get input values
  const customerName = document.getElementById("customer-name").value;
  const startDate = new Date(document.getElementById("start-date").value);
  const loanAmount = parseFloat(document.getElementById("loan-amount").value);
  const annualInterestRate =
    parseFloat(document.getElementById("annual-interest-rate").value) / 100;
  const loanTerm = parseInt(document.getElementById("loan-term").value);
  const paymentFrequency = parseInt(
    document.getElementById("payment-frequency").value
  );
  const expensePercentage =
    parseFloat(document.getElementById("expense-percentage").value) / 100;

  // Calculate the expense amount based on the loan amount
  const expenseAmount = loanAmount * expensePercentage;

  // Calculate period interest rate
  const periodInterestRate = annualInterestRate / paymentFrequency;

  // Calculate total number of payments
  const totalPayments = loanTerm * paymentFrequency;

  // Calculate payment amount using the original loan amount
  const paymentAmount =
    (loanAmount * periodInterestRate) /
    (1 - Math.pow(1 + periodInterestRate, -totalPayments));

  // Initialize remaining balance
  let remainingBalance = loanAmount;

  // Get the table body element
  const tableBody = document.querySelector("#amortization-schedule tbody");

  // Clear previous results
  tableBody.innerHTML = "";

  // Generate the amortization schedule
for (let i = 1; i <= totalPayments; i++) {
    const interestPayment = remainingBalance * periodInterestRate;
    const principalPayment = paymentAmount - interestPayment;
    remainingBalance -= principalPayment;

    // Calculate the payment date
    const paymentDate = new Date(startDate);
   // paymentDate.setDate(paymentDate.getDate() + i * (365 / paymentFrequency) - 1);
    //paymentDate.setDate(1 + (i - 1) * (12 / paymentFrequency));
    paymentDate.setMonth(paymentDate.getMonth() + i * (12 / paymentFrequency)); // Assuming paymentFrequency is the number of payments per year

    // Format the payment date as dd/mm/yyyy
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const formattedDate = paymentDate.toLocaleDateString('en-GB', options); // 'en-GB' represents English (United Kingdom) locale

    // Create a new row
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${i}</td>
        <td>${formattedDate}</td>
        <td>${paymentAmount.toFixed(2)}</td>
        <td>${principalPayment.toFixed(2)}</td>
        <td>${interestPayment.toFixed(2)}</td>
        <td>${remainingBalance.toFixed(2)}</td>
    `;

    // Append the row to the table
    tableBody.appendChild(row);
}


  // Display the expense summary
  const expenseSummary = document.getElementById("expense-summary");
  expenseSummary.innerHTML = `
    <table>
        <tr>
            <td style="font-weight:bold; background-color:#007bff;color:white; border:1px solid black">اسم العميل</td>
            <td style="border:1px solid black">${customerName}</td>
        </tr>
        <tr>
            <td style="font-weight:bold; background-color:#007bff;color:white; border:1px solid black">التاريخ</td>
            <td style="border:1px solid black">${startDate.toLocaleDateString()}</td>
        </tr>
        <tr>
            <td style="font-weight:bold; background-color:#007bff;color:white; border:1px solid black">اصل قيمة القرض</td>
            <td style="border:1px solid black">${loanAmount.toFixed(2)}</td>
        </tr>
        <tr>
            <td style="font-weight:bold; background-color:#007bff;color:white; border:1px solid black">نسبة المصاريف الادارية</td>
            <td style="border:1px solid black">${(expensePercentage * 100).toFixed(2)}%</td>
        </tr>
        <tr>
            <td style="font-weight:bold; background-color:#007bff;color:white; border:1px solid black">قيمة المصاريف الادارية</td>
            <td style="border:1px solid black">${expenseAmount.toFixed(2)}</td>
        </tr>
    </table>
`;
}

function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const customerName = document.getElementById("customer-name").value;
    const startDate = new Date(
        document.getElementById("start-date").value
    ).toLocaleDateString();
    const loanAmount = parseFloat(
        document.getElementById("loan-amount").value
    ).toFixed(2);
    const expensePercentage = parseFloat(
        document.getElementById("expense-percentage").value
    ).toFixed(2);
    const expenseAmount = (loanAmount * (expensePercentage / 100)).toFixed(2);

    // Add image logo
    const logo = new Image();
    logo.src = 'agri_logo.png';
    const logoWidth = 50; // Adjust the width of the logo as needed
    const logoHeight = (logo.naturalHeight / logo.naturalWidth) * logoWidth;
    doc.addImage(logo, 'PNG', 10, 10, logoWidth, logoHeight);

    // Add the summary information
    doc.setFont("Arial", "normal");
    doc.setFontSize(10);
    doc.text(`Start Date: ${startDate}`, 70, 20);
    doc.text(`Original Loan Amount: ${loanAmount}`, 70, 30);
    doc.text(`Expense Percentage: ${expensePercentage}%`, 70, 40);
    doc.text(`Expense Amount: ${expenseAmount}`, 70, 50);

    // Add the table headers
    const headers = [
        "Payment #",
        "Payment Date",
        "Payment Amount",
        "Principal",
        "Interest",
        "Balance",
    ];
    const data = [];
    const tableBody = document.querySelector("#amortization-schedule tbody");
    const rows = tableBody.querySelectorAll("tr");

    rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        const rowData = [];
        cells.forEach((cell) => {
            rowData.push(cell.innerText);
        });
        data.push(rowData);
    });

    // Add the table
    doc.autoTable({
        head: [headers],
        body: data,
        startY: 70, // Adjust the start y position based on the logo height
        theme: 'striped',
        columnStyles: { 0: { cellWidth: 20 }, 1: { cellWidth: 40 }, 2: { cellWidth: 30 }, 3: { cellWidth: 20 }, 4: { cellWidth: 20 }, 5: { cellWidth: 20 } },
        margin: { top: logoHeight + 20 } // Adjust the top margin based on the logo height
    });

    // Save the PDF
    doc.save("amortization_schedule.pdf");
}
