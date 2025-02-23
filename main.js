document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form");
    const searchInput = document.getElementById("search");
    const categorySelect = document.getElementById("category");
    const resourceSections = document.querySelectorAll("section");
    const searchButton = document.getElementById("button");

    searchButton.addEventListener("click", function(event) {
        event.preventDefault();
        const searchQuery = searchInput.value.trim().toLowerCase();
        const selectedCategory = categorySelect.value;
        let found = false;

        resourceSections.forEach(section => {
            section.style.display = "none";
        });

        document.querySelectorAll(".resource-item").forEach(item => {
            const itemName = item.querySelector("h3").textContent.toLowerCase();
            const itemCategory = item.getAttribute("data-category");

            if ((selectedCategory === "all" || itemCategory === selectedCategory) && itemName.includes(searchQuery)) {
                item.closest("section").style.display = "block";
                found = true;
            }
        });

        if (!found) {
            fetchGovernmentResource(searchQuery);
        }
    });

    categorySelect.addEventListener("change", function() {
        const category = this.value.toLowerCase();
        const items = document.querySelectorAll(".resource-item");

        items.forEach(item => {
            const itemCategory = item.dataset.category.toLowerCase();
            if (itemCategory === category || category === 'all') {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });

    async function fetchGovernmentResource(query) {
        try {
            const apiKey = API_KEY;  // From config.js
            const searchEngineId = SEARCH_ENGINE_ID;  // From config.js
            const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}+site:gov.in&cx=${searchEngineId}&key=${apiKey}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.items && data.items.length > 0) {
                displaySearchResults(data.items);
            } else {
                displayNoResults(query);
            }
        } catch (error) {
            console.error("Error fetching government resources:", error);
            displayNoResults(query);
        }
    }

    function displaySearchResults(results) {
        const resultContainer = document.createElement("section");
        resultContainer.innerHTML = `<h2>Search Results</h2><ul></ul>`;

        const resultList = resultContainer.querySelector("ul");
        results.forEach(item => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `<a href="${item.link}" target="_blank">${item.title}</a> - ${item.snippet}`;
            resultList.appendChild(listItem);
        });

        document.querySelector("main").appendChild(resultContainer);
    }

    function displayNoResults(query) {
        const resultContainer = document.createElement("section");
        resultContainer.innerHTML = `
            <h2>No Local Results Found</h2>
            <p>Click below to search on Google:</p>
            <p><a href="https://www.google.com/search?q=${encodeURIComponent(query)}+site:gov.in" target="_blank">Search on Google</a></p>
        `;
        document.querySelector("main").appendChild(resultContainer);
    }

    const resourceForm = document.getElementById('resourceForm');
    const confirmationMessage = document.getElementById('confirmationMessage');

    if (resourceForm) {
        resourceForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const resourceName = document.getElementById('resourceName').value.trim();
            const category = document.getElementById('category').value.trim();
            const address = document.getElementById('address').value.trim();
            const contact = document.getElementById('contact').value.trim();
            const description = document.getElementById('description').value.trim();

            if (!resourceName || !category || !address || !contact) {
                alert('Please fill out all required fields.');
                return;
            }

            console.log({ resourceName, category, address, contact, description });
            
            confirmationMessage.style.display = 'block';
            resourceForm.reset();

            setTimeout(() => {
                confirmationMessage.style.display = 'none';
            }, 3000);
        });
    }

    localStorage.setItem('submittedResource', JSON.stringify({ resourceName, category }));
});
