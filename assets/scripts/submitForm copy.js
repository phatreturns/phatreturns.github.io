$("#Contact_Form").submit(async function submitForm() {
   // stop page reload
  event.preventDefault();
    // validate form
    var firstName = document.getElementById("first-name");
    var lastName = document.getElementById("last-name");
    var email = document.getElementById("email");
    var phone = document.getElementById("phone");
    var message = document.getElementById("message");
    if (
      firstName.value === "" ||
      lastName.value === "" ||
      email.value === "" ||
      phone.value === "" ||
      message.value === ""
    ) {
      alert("Please complete all fields before submitting the form");
      event.preventDefault(); //prevent page reload
    } else {
      // recaptacha ready
      grecaptcha.ready(function() {
        // do request for recaptcha token
        // response is promise with passed token
        grecaptcha.execute('6Ld3jpQaAAAAAPp0bz0rCE5ZYjYOLthv-5C7TbDO', {action: 'send_message'}).then(function(token) {
          // check token
          if (token !== "") {
            const data = {
              recaptchaToken: token
            };
            console.log("running recaptcha verfication");
            fetch("https://dev-api.codeology.com.au/pickle/site/captcha", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "https://www.phatreturns.com.au/"
              },
              redirect: "follow",
              body: JSON.stringify(data)
            })
            .then(response =>
              console.log('recaptcha ok, sending email')
            )
            .then(response => {
              // send email
              event.preventDefault(); //prevent page reload
              console.log("getting form data");
              const formData = {
                clientFirstName: `${firstName.value}`,
                clientLastName: `${lastName.value}`,
                clientEmail: `${email.value}`,
                clientPhone: `${phone.value}`,
                clientMessage: `${message.value}`
              };
              console.log("running fetch");
              fetch("https://dev-api.codeology.com.au/pickle/email/send", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "https://www.phatreturns.com.au/"
                },
                redirect: "follow",
                body: JSON.stringify(formData)
              })
                .then(response2 =>
                  alert("Thank you for submitting a request. We will be in touch soon!")
                )
                .then(response2 => location.reload())
                .catch(error => console.error("Send Error: ", error));
            })
            .catch(error => console.error("Captcha Error: Bot detected?", error));
            // $('#Contact_Form').prepend('<input type="hidden" name="g-recaptcha-response" value="' + token + '">')
            // event.preventDefault(); //prevent page reload
            // console.log("getting form data");
            // const formData = {
            //   clientFirstName: `${firstName.value}`,
            //   clientLastName: `${lastName.value}`,
            //   clientEmail: `${email.value}`,
            //   clientPhone: `${phone.value}`,
            //   clientMessage: `${message.value}`
            // };
            // console.log("running fetch");
            // fetch("https://dev-api.codeology.com.au/pickle/email/send", {
            //   method: "POST",
            //   headers: {
            //     "Content-Type": "application/json",
            //     "Access-Control-Allow-Origin": "https://www.phatreturns.com.au/"
            //   },
            //   redirect: "follow",
            //   body: JSON.stringify(formData)
            // })
            //   .then(response =>
            //     alert("Thank you for submitting a request. We will be in touch soon!")
            //   )
            //   .then(response => location.reload())
            //   .catch(error => console.error("Error: ", error));
          } else {
            console.log('recaptcha token not generated')
          }
        });
      })
    }
});
