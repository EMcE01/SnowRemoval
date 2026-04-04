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

    function getColor(status) {
        if (status === "Cleared") return "green";
        if (status === "Light") return "yellow";
        if (status === "moderate") return "orange";
        if (status === "Heavy") return "darkred";
        if (status === "Icy") return "lightblue";
        if (status === "In Progress") return "blue";
        if (status === "Needs Attention") return "red";
        return "gray";
    }

    function ensureSidewalksLoaded() {
        if (Array.isArray(sidewalks) && sidewalks.length > 0) {
            return Promise.resolve();
        }

        return fetch('../src/assets/sidewalks.geojson')
            .then(res => res.json())
            .then(data => {
                sidewalks = data.features.map(feature => ({
                    id: feature.properties.id,
                    name: feature.properties.name,
                    status: feature.properties.status,
                    color: getColor(feature.properties.status)
                }));

                localStorage.setItem("sidewalks", JSON.stringify(sidewalks));
            })
            .catch(err => {
                console.error("Error loading sidewalks for admin panel:", err);
            });
    }

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

        const updateReport = function () {
            if (!report) {
                return;
            }

            if (report.sidewalkId !== null && report.sidewalkId !== undefined && report.sidewalkId !== '') {
                const numericId = Number(report.sidewalkId);
                let sidewalkIndex = Number.isFinite(numericId) && !Number.isNaN(numericId)
                    ? numericId
                    : sidewalks.findIndex(s => String(s.id) === String(report.sidewalkId) || s.name === report.sidewalkId);

                if (sidewalkIndex !== -1 && sidewalks[sidewalkIndex]) {
                    sidewalks[sidewalkIndex].status = "Needs Attention";
                    sidewalks[sidewalkIndex].color = "red";
                    localStorage.setItem("sidewalks", JSON.stringify(sidewalks));
                }
            }

            reports.splice(index, 1);
            localStorage.setItem("reports", JSON.stringify(reports));
            loadReports();
        };

        ensureSidewalksLoaded().then(updateReport);
    };

    window.deleteReport = function (index) {
        reports.splice(index, 1);
        localStorage.setItem("reports", JSON.stringify(reports));
        loadReports();
    };

    loadReports();

});
