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
    let tokenData = {};
    grecaptcha.ready(function() {
      // do request for recaptcha token
      grecaptcha
        .execute("6Ld3jpQaAAAAAPp0bz0rCE5ZYjYOLthv-5C7TbDO", {
          action: "send_message"
        })
        .then(function(token) {
          console.log(`token is ${token}`)
          // handle token
          if (token !== "") {
            console.log("received token");
            // $('#Contact_Form').prepend('<input type="hidden" name="g-recaptcha-response" value="' + token + '">')
            event.preventDefault(); //prevent page reload
            tokenData.recaptchaToken = token;
          } else {
            console.log("no token received from recaptcha");
          }
        });
    });
    console.log(`captcha token is: ${tokenData.recaptchaToken}`)
    // submit token to backend API for assessment by Google
    let response = await fetch(
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
    let data = await response.JSON();
    if (data.status === 200) {
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
      const response = fetch(
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
      if (response.ok) {
        alert("Thank you for submitting a request. We will be in touch soon!");
        location.reload();
      } else if (!response.ok) {
        console.error("Error: ", error);
      }
    } else if (data.status === 400) {
      // recaptcha failed
      alert("You failed the Google Recaptcha.");
      console.log("google recaptcha failed - possible bot");
    }
  }
});
