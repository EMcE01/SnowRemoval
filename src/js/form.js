document.addEventListener('DOMContentLoaded', function() {
    const reportForm = document.getElementById('reportForm');

    reportForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(reportForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            issue: formData.get('issue'),
        };

        if (validateForm(data)) {
            submitForm(data);
        } else {
            alert('Please fill in all fields correctly.');
        }
    });

    function validateForm(data) {
        return data.name && data.email && data.issue;
    }

    function submitForm(data) {
        // Simulate form submission
        console.log('Form submitted:', data);
        alert('Thank you for your report! We will look into it shortly.');
        reportForm.reset();
    }
});