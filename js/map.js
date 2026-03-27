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
                    layer.bindPopup(
                        feature.properties.name + " - " + feature.properties.status
                    );

                    layer.on('click', function () {
                        const id = feature.properties.id;
                        window.location.href = `report.html?sidewalk=${id}`;
                    });
                }

            }).addTo(map);

        })
        .catch(err => {
            console.error("Error loading GeoJSON:", err);
        });

});
