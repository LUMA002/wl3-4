async function signIn(event) {
    event.preventDefault();
    try {
        const emailValue = document.getElementById('signInEmail').value;
        const passwordValue = document.getElementById('signInPassword').value;
        const signInForm = document.getElementById('signInForm');
        let textAlert = signInForm.getElementsByClassName('text-danger')[0];


        const response = await fetch('http://localhost:5027/api/auth/login', {
            method: "POST",
            body: JSON.stringify({
                "email": `${emailValue}`,
                "password": `${passwordValue}`
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        if (!response.ok) {
            const errorDetails = await response.text();

            if (errorDetails === "User is not found." || errorDetails === "Wrong email or password.") {
                textAlert.setAttribute('style', 'display: block');
                textAlert.textContent = "Wrong email or password!";
            } else {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }
        } else {
            localStorage.setItem('token', `${await response.text()}`)
            location.reload();
        }
    } catch (error) {
        console.error(`Error fetching:`, error);
    }
}

async function signUp(event) {
    event.preventDefault();
    try {
        const signUpForm = document.getElementById('signUpForm');
        const emailValue = document.getElementById('signUpEmail').value;
        const displayNameValue = document.getElementById('signUpDisplayName').value;
        const passwordValue = document.getElementById('signUpPassword').value;
        const confirmPasswordValue = document.getElementById('confirmPassword').value;


        let textAlerts = signUpForm.getElementsByClassName('text-danger');
        let isFormValid = true;

        for (let textAlert of textAlerts) {
            textAlert.removeAttribute('style');
        }

        if (!emailValue.match('^([a-zA-Z0-9_\\-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$')) {
            textAlerts[0].textContent = 'Email is not valid';
            textAlerts[0].setAttribute('style', 'display: block');
            isFormValid = false;
        }
        if (displayNameValue.length < 3) {
            textAlerts[1].setAttribute('style', 'display: block');
            isFormValid = false;
        }
        if (!passwordValue.match('^[a-zA-Z]\\w{8,50}$')) {
            textAlerts[2].setAttribute('style', 'display: block');
            isFormValid = false;
        }

        if (confirmPasswordValue !== passwordValue && passwordValue.match('^(?=.*\\d)(?=.*\\W).{9,}$\n')) {
            textAlerts[3].setAttribute('style', 'display: block');
            isFormValid = false;
        }

        if (isFormValid) {
            const response = await fetch('http://localhost:5027/api/auth/register', {
                method: "POST",
                body: JSON.stringify({
                    "email": `${emailValue}`,
                    "displayName": `${displayNameValue}`,
                    "password": `${passwordValue}`
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            });

            if (!response.ok) {
                const errorDetails = await response.json();
                if (errorDetails.Email) {
                    textAlerts[0].textContent = 'Email already exists';
                    textAlerts[0].setAttribute('style', 'display: block');
                }
            } else {
                location.reload();
            }
        }
    } catch (error) {
        console.error(`Error signing up:`, error);
    }
}


function onAccountExit() {
    if (localStorage.getItem('token') !== null) {
        localStorage.removeItem('token');
        location.reload();
    }
}