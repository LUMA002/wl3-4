let mainContainer = document.getElementsByTagName('main')[0];


fillBasket();

async function fillBasket() {
    if (localStorage.getItem('token') === null) {
        mainContainer.textContent = "";
        mainContainer.insertAdjacentHTML('beforeend', '<h1>Only authenticated users can access the basket!</h1>');
        return;
    }
    const basketItems = JSON.parse(localStorage.getItem('basketItems'));

    let ids = [];
    for (let basketItem of basketItems) {
        ids.push(basketItem.id);
    }

    let url = new URL('http://localhost:5027/api/cars/ids');
    ids.forEach(id => url.searchParams.append('ids', id));

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    let total = 0;

    const data = await response.json();
    console.log(data)
    let result = '';
    if (data.length > 0) {
        for (let car of data) {
            let carsInBasket = getCarsQuantityInBasket(car.id);
            const row = addBasketRowHTML(car, carsInBasket);
            result += row;

            total += carsInBasket * car.price;
        }
        const basketTotal = document.getElementById('basketTotal');
        basketTotal.textContent = `$${total.toFixed(2)}`;
    }

    console.log("test")
    const basketTbody = document.getElementById('basketTbody');
    basketTbody.textContent = '';
    basketTbody.insertAdjacentHTML('beforeend', result);

}

function addBasketRowHTML(car, quantity) {
    return `<tr>
                <th class="basket-row-header" scope="row">
                    <img src="${car.imageUrl}" alt="${car.name}">
                    <p>${car.name}</p>
                    <i class="bi bi-trash" onclick="removecarFromBasket('${car.id}')"></i>
                </th>
                <td id="basketPrice-${car.id}">$${car.price}</td>
                <td>
                    <i class="bi bi-dash" onclick="basketMinus('${car.id}')"></i>
                    <p id="basketQuantity-${car.id}" class="d-inline-flex">${quantity}</p>
                    <i class="bi bi-plus" onclick="basketPlus('${car.id}')"></i>
                </td>
                <td id="basketSubtotal-${car.id}">$${(car.price * quantity).toFixed(2)}</td>
            </tr>`;
}
function getCarsQuantityInBasket(id) {
    const basketItems = JSON.parse(localStorage.getItem('basketItems'));
    if (basketItems === null) {
        return 0;
    }
    const item = basketItems.find(i => i.id == id);
    return item ? item.quantity : 0;
}


function basketMinus(id) {
    const itemQuantity = document.getElementById(`basketQuantity-${id}`);
    const itemSubtotal = document.getElementById(`basketSubtotal-${id}`);
    const basketTotal = document.getElementById('basketTotal');
    const itemPrice = document.getElementById(`basketPrice-${id}`);

    if (itemQuantity.textContent - 1 !== 0) {
        let basketItems = JSON.parse(localStorage.getItem('basketItems'));
        const indexOfItem = basketItems.findIndex(item => item.id === id);

        basketItems[indexOfItem].quantity--;
        localStorage.setItem('basketItems', JSON.stringify(basketItems));
        itemQuantity.textContent--;

        itemSubtotal.textContent = `$${(basketItems[indexOfItem].quantity * itemPrice.textContent.substring(1)).toFixed(2)}`;
        basketTotal.textContent = `$${(+basketTotal.textContent.substring(1) - +itemPrice.textContent.substring(1)).toFixed(2)}`;

    }
}

function basketPlus(id) {
    const itemQuantity = document.getElementById(`basketQuantity-${id}`);
    const itemSubtotal = document.getElementById(`basketSubtotal-${id}`);
    const basketTotal = document.getElementById('basketTotal');
    const itemPrice = document.getElementById(`basketPrice-${id}`);

    let basketItems = JSON.parse(localStorage.getItem('basketItems'));
    const indexOfItem = basketItems.findIndex(item => item.id === id);

    basketItems[indexOfItem].quantity++;
    localStorage.setItem('basketItems', JSON.stringify(basketItems));
    itemQuantity.textContent++;

    itemSubtotal.textContent = `$${(basketItems[indexOfItem].quantity * itemPrice.textContent.substring(1)).toFixed(2)}`;
    basketTotal.textContent = `$${(+basketTotal.textContent.substring(1) + +itemPrice.textContent.substring(1)).toFixed(2)}`;
}

function removecarFromBasket(id) {
    let basketItems = JSON.parse(localStorage.getItem('basketItems'));
    const itemSubtotal = document.getElementById(`basketSubtotal-${id}`);
    const basketTotal = document.getElementById('basketTotal');

    basketTotal.textContent = `$${(+basketTotal.textContent.substring(1) - +itemSubtotal.textContent.substring(1)).toFixed(2)}`;

    basketItems = basketItems.filter(item => item.id !== id);

    localStorage.setItem('basketItems', JSON.stringify(basketItems));
    setBasketItemsCount();
    fillBasket();
}

function fillPurchaseConfirmWindow() {
    const modalElement = document.getElementById('modal-content');
    modalElement.innerHTML = `
    <div class="modal-header">
        <h5 class="modal-title">Confirm Purchase</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p>Do you confirm your purchase?</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" onclick="confirmPurchase()" class="btn btn-primary">Confirm</button>
      </div>
`;
    document.getElementById('carCreateForm').addEventListener('submit', createcar);
}

function confirmPurchase() {
    location.reload();
    localStorage.removeItem('basketItems');

}