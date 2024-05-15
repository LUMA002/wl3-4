
async function main() {
    let news = await fetchNews();
    addNewsToPage(news);
}

main();

async function fetchNews() {
    let result;
    await fetch('news.json')
        .then(response => response.json()) // Парсимо тіло відповіді у форматі JSON
        .then(data => {
            result = data
        })
        .catch(error => {
            console.error('Error fetching news:', error);
        });
    return result;
}


function addNewsToPage(news) {
    let newsList = document.getElementById('news-list');

    news.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
    });
    for (const [index, item] of news.entries()) {
        let listItem = document.createElement('li');
        let fw = item.importance ? 'fw-bold' : 'fw-normal';

        if (window.innerWidth >= 769) {
            listItem = document.createElement('li');
            listItem.classList.add('list-group-item', 'news-item');
            listItem.innerHTML = `
                <span class="${fw} news-btn">${item.title}</span><br>
                ${formatDate(item.date)}
            `;
            listItem.addEventListener('click', function() {
                showNewsDetails(item);
            });
        } else {
            listItem.classList.add('list-group-item', 'news-item');
            listItem.innerHTML = `
                <button class="btn news-btn ${fw}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="false" aria-controls="collapse${index}">
                    ${item.title}<br>
                    ${formatDate(item.date)}
                </button>
                <div class="collapse" id="collapse${index}">
                    <div class="card card-body card-news">${item.description}</div>
                </div>
            `;
        }
        newsList.appendChild(listItem);
    }
}

function showNewsDetails(newsItem) {
    let newsDetails = document.getElementById('news-details');
    newsDetails.innerHTML = `
        <h2>${newsItem.title}</h2>
        <p>${newsItem.description}</p>
        <p><em>${formatDate(newsItem.date)}</em></p>
    `;
}

function formatDate(dateString) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}