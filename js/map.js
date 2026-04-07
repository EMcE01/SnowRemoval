/**
    *Author: Ethan McEvoy
    *Date: 2024-06-01
**/

document.addEventListener('DOMContentLoaded', function () {

    // ✅ Initialize map FIRST
    const map = L.map('map').setView([42.2428, -97.014], 16);

    // Base map layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // 🎨 Color logic
    function getColor(status) {
        if (status === "Cleared") return "green";
        if (status === "Light") return "yellow";
        if (status === "moderate") return "orange";
        if (status === "Icy") return "lightblue";
        if (status === "In Progress") return "blue";
        return "red";
    }

    function getEstimatedCompletion(status, name) {
        if (status !== "In Progress") return null;

        const estimates = {
            "West": "15 minutes",
            "East": "20 minutes",
            "North": "12 minutes",
            "South": "18 minutes"
        };

        return estimates[name] || "about 20 minutes";
    }

    // ✅ Load GeoJSON (ONLY map data now)
    fetch('../src/assets/sidewalks.geojson')
        .then(res => res.json())
        .then(data => {

            L.geoJSON(data, {

                style: function (feature) {
                    return {
                        color: getColor(feature.properties.status),
                        weight: 5
                    };
                },

                onEachFeature: function (feature, layer) {
                    const name = feature.properties.name;
                    const status = feature.properties.status;
                    const eta = getEstimatedCompletion(status, name);

                    layer.bindPopup(
                        name + " - " + status + (eta ? `<br>ETA: ${eta}` : "")
                    );

                    if (eta) {
                        layer.on('mouseover', function () {
                            layer.openPopup();
                        });
                        layer.on('mouseout', function () {
                            layer.closePopup();
                        });
                    }

                    layer.on('click', function () {
                        window.location.href = `report.html?sidewalk=${name}`;
                    });
                }

            }).addTo(map);

        })
        .catch(err => {
            console.error("Error loading GeoJSON:", err);
        });

});
