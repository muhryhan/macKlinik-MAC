document.addEventListener('DOMContentLoaded', function () {
    fetchArticleData();
    $(".article-link").click(function (e) {
        e.preventDefault();
        const id = $(this).attr("href").split("?id=")[1];
    
        // Sembunyikan semua artikel kecuali yang sesuai dengan ID
        $(".post-box").not(`[data-id="${id}"]`).hide(1000);
        $(".post-box[data-id=${id}]").show(1000);
    });    
});

function fetchArticleData() {
    const id = new URLSearchParams(window.location.search).get("id");

    if (id) {
        fetch('/artikel/read')
            .then(response => response.json())
            .then(data => {
                const read = document.getElementById('read');
                const article = data.articles.articles.find(article => article.id == id);

                if (article) {
                    const articleElement = createArticleElement(article);
                    read.appendChild(articleElement);
                } else {
                    console.error('Article not found');
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    } else {
        console.error('Article ID not found');
    }
}

function createArticleElement(article) {
    const articleContainer = document.createElement('div');
    articleContainer.classList.add('read-contentBx');

    const titleElement = document.createElement('h2');
    titleElement.classList.add('titleText');
    titleElement.textContent = article.title;

    const descriptionElement = document.createElement('p');
    descriptionElement.classList.add('title-text');
    descriptionElement.innerHTML = `<br>${article.description}`;

    const imgContainer = document.createElement('div');
    imgContainer.classList.add('imgBx');

    const imgElement = document.createElement('img');
    imgElement.src = article.image;
    imgElement.alt = article.title;
    imgElement.classList.add('imgBx');

    imgContainer.appendChild(imgElement);

    articleContainer.appendChild(titleElement);
    articleContainer.appendChild(descriptionElement);
    articleContainer.appendChild(imgContainer);

    return articleContainer;
}
