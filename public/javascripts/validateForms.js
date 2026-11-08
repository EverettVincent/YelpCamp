// public/javascripts/validateForms.js 
    // Example starter JavaScript for disabling form submissions if there are invalid fields
    (() => {
      'use strict'

      console.log("Hello from form validation script in validateForms.js");

      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      const forms = document.querySelectorAll('.validated-form');

      // Loop over them and prevent submission
      Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }

          form.classList.add('was-validated')
        }, false)
      })
    }) ()