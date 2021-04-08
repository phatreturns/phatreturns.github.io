$("#Contact_Form").submit(async function submitForm() {
  // stop page reload
  event.preventDefault();
  // validate form
  const firstName = document.getElementById("first-name");
  const lastName = document.getElementById("last-name");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const message = document.getElementById("message");
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
    // get recaptcha token from google
    let token = await validateCaptcha();
    const tokenData = {
      recaptchaToken: token
    };
    // submit token to backend API for assessment by Google
    const response = await fetch(
      "https://dev-api.codeology.com.au/pickle-auth/recaptcha",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "https://www.phatreturns.com.au/"
        },
        redirect: "follow",
        body: JSON.stringify(tokenData)
      }
    );
    if (response.status === 200) {
      // if recaptcha successful then send email
      console.log("getting form data");
      const formData = {
        clientFirstName: `${firstName.value}`,
        clientLastName: `${lastName.value}`,
        clientEmail: `${email.value}`,
        clientPhone: `${phone.value}`,
        clientMessage: `${message.value}`
      };
      console.log("running fetch");
      const data = await fetch(
        "https://dev-api.codeology.com.au/pickle/email/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "https://www.phatreturns.com.au/"
          },
          redirect: "follow",
          body: JSON.stringify(formData)
        }
      );
      if (data.status === 200) {
        // if email send successful
        alert("Thank you for submitting a request. We will be in touch soon!");
        location.reload();
      } else {
        // if email send failed
        alert("Error: failed to send");
      }
    } else if (response.status === 400) {
      // if recaptcha failed
      alert("You failed the Google Recaptcha.");
      console.log("google recaptcha failed - possible bot");
    }
  }
});

function validateCaptcha() {
  return new Promise((res, rej) => {
    grecaptcha.ready(function() {
      grecaptcha.execute("6Ld3jpQaAAAAAPp0bz0rCE5ZYjYOLthv-5C7TbDO", {
        action: "send_message"
      })
      .then(function(token) {
          return res(token);
      });
    });
  });
}