function validateCaptcha() {
  return new Promise((e, t) => {
    grecaptcha.ready(function() {
      grecaptcha
        .execute("6Ld7jpQaAAAAADJDesfAcpbMuaCygmPycU-h8tfr", {
          action: "send_message"
        })
        .then(function(t) {
          return e(t);
        });
    });
  });
}
$("#Contact_Form").submit(async function() {
  event.preventDefault();
  const e = document.getElementById("first-name"),
    t = document.getElementById("last-name"),
    a = document.getElementById("email"),
    o = document.getElementById("phone"),
    n = document.getElementById("message");
  if (
    "" === e.value ||
    "" === t.value ||
    "" === a.value ||
    "" === o.value ||
    "" === n.value
  )
    alert("Please complete all fields before submitting the form"),
      event.preventDefault();
  else {
    let l = await validateCaptcha();
    const c = { recaptchaToken: l },
      i = await fetch(
        "https://dev-api.codeology.com.au/pickle-auth/recaptcha",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "https://www.phatreturns.com.au/"
          },
          redirect: "follow",
          body: JSON.stringify(c)
        }
      );
    if (200 === i.status) {
      console.log("getting form data");
      const l = {
        businessEmail: `[taxinfo@phatreturns.com.au]`,
        clientBody: `<strong>This is an automated email to inform you that a new message has been received via the PHAT Returns website.</strong><br><br>Details of the request are below.<br><br>Name: ${e.value} ${t.value}<br>Email: ${a.value}<br>Phone: ${o.value}<br> Message: ${n.value}`,
        clientTitle: `New Message from ${e.value} ${t.value} has been received`,
        toAddresses: ["taxinfo@phatreturns.com.au"]
      };
      console.log("running fetch");
      const c = await fetch(
        "https://dev-api.codeology.com.au/pickle/email/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "https://www.phatreturns.com.au/"
          },
          redirect: "follow",
          body: JSON.stringify(l)
        }
      );
      200 === c.status
        ? (alert(
            "Thank you for submitting a request. We will be in touch soon!"
          ),
          location.reload())
        : alert("Error: failed to send");
    } else
      400 === i.status &&
        (alert("You failed the Google Recaptcha."),
        console.log("google recaptcha failed - possible bot"));
  }
});
