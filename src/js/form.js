document.addEventListener('DOMContentLoaded', function() {
    const reportForm = document.getElementById('reportForm');

    reportForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // clear previous error messages
        document.getElementById('locationError').textContent = '';
        document.getElementById('severityError').textContent = '';
        document.getElementById('commentsError').textContent = '';

        const formData = new FormData(reportForm);
        const data = {
            location: formData.get('location'),
            severity: formData.get('severity'),
            comments: formData.get('comments')
        };

        const errors = validateForm(data);
        if (errors.length === 0) {
            submitForm(data);
        } else {
            // show errors next to each field
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
        // comments are optional
        return errors;
    }

    function submitForm(data) {
        // Simulate form submission
        console.log('Form submitted:', data);
        alert('Thank you for your report! We will look into it shortly.');
        reportForm.reset();
    }
});