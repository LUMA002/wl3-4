document.addEventListener('DOMContentLoaded', function() {
  const carList = document.getElementById('car-list');
  let cars = []; // Define cars in the outer scope

  // Function to render cars
  function renderCars(carsArray) {
    carList.innerHTML = '';
    carsArray.forEach(car => {
      const card = document.createElement('div');
      card.classList.add('card', 'col-12', 'col-sm-6', 'col-md-4', 'col-lg-3', 'mb-3');
      card.innerHTML = `
        <img src="${car.image}" class="card-img-top" alt="${car.name}">
        <div class="card-body">
          <h5 class="card-title">${car.name}</h5>
          <p class="card-text description" style="display: none;">${car.description}</p>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">Year: ${car.year}</li>
            <li class="list-group-item">Engine Size: ${car.engineSize}</li>
            <li class="list-group-item">Class: ${car.class}</li>
          </ul>
        </div>
        <button class="btn btn-primary" onclick="addItemToBasket('${car.id}')">Purchase</button>
      `;
      card.addEventListener('click', function() {
        card.querySelector('.description').classList.toggle('d-block');
      });
      carList.appendChild(card);
    });
  }

  function sortCarsByYear(carsArray, ascending) {
    return carsArray.slice().sort((a, b) => ascending ? b.year - a.year : a.year - b.year);
  }

  // Function to sort cars by engine size
  function sortCarsByEngineSize(carsArray, ascending) {
    return carsArray.slice().sort((a, b) => ascending ? b.engineSize - a.engineSize : a.engineSize - b.engineSize);
  }

  // Function to filter cars by class
  function filterCarsByClass(carsArray, selectedClass) {
    return carsArray.filter(car => car.class === selectedClass);
  }

  // Function to handle filter change
  function handleFilterChange() {

    const selectedYear = document.getElementById('year-filter').value;
    const selectedEngineSize = document.getElementById('engine-filter').value;
    const selectedClass = document.getElementById('class-filter').value;

    let filteredCars = cars.slice();

    // Apply filters based on selected options
    if (selectedYear !== 'all') {
      filteredCars = sortCarsByYear(filteredCars, selectedYear === 'asc');
    }

    if (selectedEngineSize !== 'all') {
      filteredCars = sortCarsByEngineSize(filteredCars, selectedEngineSize === 'asc');
    }

    if (selectedClass !== 'all') {
      filteredCars = filterCarsByClass(filteredCars, selectedClass);
    }

    renderCars(filteredCars);
  }

  fetch('http://localhost:5027/api/cars')
      .then(response => response.json())
      .then(data => {
        cars = data.map(car => { // Update cars here
          return {
            id: car.id,
            name: car.name,
            image: car.imageUrl,
            description: car.description,
            year: car.year,
            engineSize: car.engineSize,
            class: car.class
          };
        });
        renderCars(cars);
        console.log(cars);

        // Add event listeners here, after cars has been updated and rendered
        document.getElementById('year-filter').addEventListener('change', handleFilterChange);
        document.getElementById('engine-filter').addEventListener('change', handleFilterChange);
        document.getElementById('class-filter').addEventListener('change', handleFilterChange);
      })
      .catch(error => console.error('Error:', error));
});




// const specialOfferToast = document.getElementById('specialOfferToast');
// const specialOfferToastBootstrap = new bootstrap.Toast(specialOfferToast);
//
// function showSpecialOfferToast() {
//   specialOfferToastBootstrap.show();
// }
//
// // Check if the user has agreed to the offer
// if (localStorage.getItem('offerAgreed') === null) {
//
//   setTimeout(showSpecialOfferToast, 3000);
//
//   // Interval to keep showing the toast until the user agrees
//   let intervalId = setInterval(() => {
//     if (localStorage.getItem('offerAgreed') === 'true' || localStorage.getItem('offerAgreed') === 'false') {
//       clearInterval(intervalId);
//     } else {
//       showSpecialOfferToast();
//     }
//   }, 30000); // 30 sec
// }

// Function to handle user agreement or rejection
function handleSpecialOfferResponse(agreed) {
  localStorage.setItem('offerAgreed', agreed);
  const specialOfferToast = document.getElementById('specialOfferToast');
  const specialOfferToastBootstrap = bootstrap.Toast.getOrCreateInstance(specialOfferToast);
  specialOfferToastBootstrap.hide();
}

// Function to handle user agreement
window.onSpecialOfferAgree = function() {
  handleSpecialOfferResponse('true');
}

// Function to handle user rejection
window.onSpecialOfferReject = function() {
  handleSpecialOfferResponse('false');
}

//AD
  const modal = new bootstrap.Modal(document.getElementById('advertisement-modal'), { backdrop: 'static', keyboard: false });
  const closeAdBtn = document.getElementById('close-ad-btn');
  const visitSiteBtn = document.getElementById('visit-site-btn');
  const countdownElement = document.getElementById('countdown');

  let remainingTime = 5;

  setTimeout(function() {
    modal.show();


    const countdownInterval = setInterval(function() {
      remainingTime -= 1;
      countdownElement.textContent = remainingTime;
      if (remainingTime <= 0) {
        clearInterval(countdownInterval);
        closeAdBtn.removeAttribute('disabled');
      }
    }, 1000);
  }, 15000);

  closeAdBtn.addEventListener('click', function() {
    if (remainingTime <= 0) {
      modal.hide();
    }
  });

// basket handling
function addItemToBasket(id) {
  const basketItems = localStorage.getItem('basketItems');
  let newBasketItems = basketItems ? JSON.parse(basketItems) : [];

  const existingItemIndex = newBasketItems.findIndex(item => item.id === id);

  if (existingItemIndex !== -1) {
    newBasketItems[existingItemIndex].quantity += 1;
  } else {
    newBasketItems.push({ id: id, quantity: 1 });
  }

  localStorage.setItem('basketItems', JSON.stringify(newBasketItems));
  setBasketItemsCount();

  let hours = 240;
  let now = new Date().getTime();
  let setupTime = localStorage.getItem('setupTime');

  if (setupTime == null) {
    let newSetupTime = new Date(now + hours * 60 * 60 * 1000);
    let setupTimeString = newSetupTime.toISOString();

    localStorage.setItem('setupTime', setupTimeString);
  } else {
    let storedSetupTime = new Date(setupTime);

    if (now - storedSetupTime.getTime() > hours * 60 * 60 * 1000) {
      localStorage.clear();
      localStorage.setItem('setupTime', now);
    }
  }

}
