/**
    *Author: Ethan McEvoy
    *Date: 2024-06-01
**/

document.addEventListener('DOMContentLoaded', function () {

    // 🔐 Simple access control
    const password = prompt("Enter admin access code:");

    if (password !== "snowadmin") {
        alert("Access denied");
        window.location.href = "home.html";
        return;
    }

    const tableBody = document.querySelector("#reportTable tbody");

    let reports = JSON.parse(localStorage.getItem("reports")) || [];
    let sidewalks = JSON.parse(localStorage.getItem("sidewalks")) || [];

    function loadReports() {
        tableBody.innerHTML = "";

        reports.forEach((report, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${report.location}</td>
                <td>${report.severity}</td>
                <td>${report.comments || "N/A"}</td>
                <td>${new Date(report.timestamp).toLocaleString()}</td>
                <td>
                    <button onclick="approveReport(${index})">Approve</button>
                    <button onclick="deleteReport(${index})">Delete</button>
                </td>
            `;

            tableBody.appendChild(row);
        });
    }

    // 🌍 Make functions global so buttons can use them
    window.approveReport = function (index) {
        const report = reports[index];

        if (report.sidewalkId !== null) {
            sidewalks[report.sidewalkId].status = "Needs Attention";
            sidewalks[report.sidewalkId].color = "red";

            localStorage.setItem("sidewalks", JSON.stringify(sidewalks));
        }

        reports.splice(index, 1);
        localStorage.setItem("reports", JSON.stringify(reports));

        loadReports();
    };

    window.deleteReport = function (index) {
        reports.splice(index, 1);
        localStorage.setItem("reports", JSON.stringify(reports));
        loadReports();
    };

    loadReports();

});
