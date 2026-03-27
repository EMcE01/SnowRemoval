/**
    *Author: Ethan McEvoy
    *Date: 2024-06-01
**/

document.addEventListener('DOMContentLoaded', function () {

    const reportForm = document.getElementById('reportForm');

    // ✅ Get sidewalk ID from URL
    const params = new URLSearchParams(window.location.search);
    const sidewalkId = params.get("sidewalk");

    if (sidewalkId !== null) {
        document.getElementById("location").value = "Sidewalk #" + sidewalkId;
        document.getElementById("sidewalkId").value = sidewalkId;

        // Optional: lock the field
        document.getElementById("location").readOnly = true;
    }

    reportForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // clear previous error messages
        document.getElementById('locationError').textContent = '';
        document.getElementById('severityError').textContent = '';
        document.getElementById('commentsError').textContent = '';

        const formData = new FormData(reportForm);

        const data = {
            sidewalkId: formData.get('sidewalkId'),
            location: formData.get('location'),
            severity: formData.get('severity'),
            comments: formData.get('comments'),
            timestamp: new Date()
        };

        const errors = validateForm(data);

        if (errors.length === 0) {
            submitForm(data);
        } else {
            errors.forEach(err => {
                const span = document.getElementById(err.field + 'Error');
                if (span) {
                    span.textContent = err.message;
                }
            });
        }
    });

    function validateForm(data) {
        const errors = [];

        if (!data.location || data.location.trim() === '') {
            errors.push({ field: 'location', message: 'Location is required.' });
        }

        if (!data.severity || data.severity.trim() === '') {
            errors.push({ field: 'severity', message: 'Please select a severity level.' });
        }

        return errors;
    }

    function submitForm(data) {
        let reports = JSON.parse(localStorage.getItem("reports")) || [];

        reports.push(data);

        localStorage.setItem("reports", JSON.stringify(reports));

        console.log('Saved report:', data);

        alert('Thank you for your report! It will be reviewed by an admin.');

        reportForm.reset();
    }

});
