$("#Contact_Form").submit(async function submitForm() {
  //check reCaptcha response
  // grecaptcha.execute();
  // const captcha = await grecaptcha.getResponse();
  // console.log(captcha)

  
  // if (captcha.length === 0) {
  //   //reCaptcha not verified
  //   alert("Please try captcha again!");
  //   event.preventDefault(); //prevent page reload
  // } else {
    //reCaptcha verified

  // we stopped it
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
      // needs for recaptacha ready
      grecaptcha.ready(function() {
        // do request for recaptcha token
        // response is promise with passed token
        grecaptcha.execute('6Ld3jpQaAAAAAPp0bz0rCE5ZYjYOLthv-5C7TbDO', {action: 'send_message'}).then(function(token) {
          // add token to form
          if (token !== "") {
            $('#comment_form').prepend('<input type="hidden" name="g-recaptcha-response" value="' + token + '">')
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
              .then(response =>
                alert("Thank you for submitting a request. We will be in touch soon!")
              )
              .then(response => location.reload())
              .catch(error => console.error("Error: ", error));
          } else {
            alert('BOT DETECTED')
          }
        });
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
      })
    }
});
