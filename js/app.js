class NewsApi {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.cache = {
            responses: {}
        };
    }

    async getResponse(query) {
        try {
            if (this.cache.responses[query]) {
                return this.cache.responses[query];
            }
            let response = await fetch(`https://newsapi.org/v2/everything?q=${query}&apiKey=${this.apiKey}`);
            let data = await response.json()
    
            this.cache.responses[query] = data;
            return this.cache.responses[query];    
        } catch (error) {
            console.log('I am error incarnate')
            return [];
        }
    }

    testResponseTime(query) {
        var t0 = performance.now();
     
        Promise.resolve(
            this.getResponse(query).then(
                (response) => {
                    var t1 = performance.now();
                    console.log(response);
                    console.log("Call to getResponse took " + (t1 - t0) + " milliseconds.");
                }
            )
        )
    }
}

class NewsRenderer {
    constructor(apiKey, containerId) {
        this.api = new NewsApi(apiKey);
        this.containerId = containerId;
        this.displayedArticles = [];
    }

    generateLayout() {
        const container = document.getElementById(this.containerId);

        const html = '<div class="search-container"><div class="search-container-inner"><input id="query-input" type="text"/><a id="search-button">Search</a></div></div><div id="cards-container" class="cards-container"></div>';

        container.innerHTML = html;
    }

    renderData() {
        const cardsContainer = document.getElementById('cards-container');
        let cardsHtml = '';

        if (this.displayedArticles !== undefined) {
            this.displayedArticles.forEach((article) => {
                cardsHtml += `<div class="card"><a href="${article.url}" target="blank"><div class="card-inner"><h5>${article.title}</h5><img class="preview-image" src="${article.urlToImage}" alt="${article.title}"/><h5>${article.author}</h5></div></a></div>`;
            });
        }

        cardsContainer.innerHTML = cardsHtml;
    }

    bindListeners() {
        const searchButton = document.getElementById('search-button');

        searchButton.addEventListener('click', this.handleSearch.bind(this));
    }

    unbindListeners() {
        const searchButton = document.getElementById('search-button');

        searchButton.removeEventListener('click', this.handleSearch, false);
    }

    handleSearch(e) {
        e.preventDefault();

        const queryInput = document.getElementById('query-input');

        this.getResponse(queryInput.value);
    }

    getResponse(query) {
        Promise.resolve(this.api.getResponse(query)).then((response => {
            this.displayedArticles = response.articles;

            this.renderData();
        }));
    }

    init() {
        this.generateLayout();
        this.bindListeners();

    }

    destroy() {
        this.unbindListeners();

        const container = document.getElementById(this.containerId);
        container.innerHTML = '';
    }
}

const renderer = window.renderer = new NewsRenderer('797defe668ed400aaffaf1699e8ca036', 'app');

renderer.init();

