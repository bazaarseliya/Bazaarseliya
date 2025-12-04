const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    menu.classList.toggle("active");
});


function normalize(text) {
    return text.toLowerCase().replace(/\s+/g, '');
}
function searchProducts() {
    const inputRaw = document.getElementById('searchInput').value;
    const input = normalize(inputRaw);
    const resultsDiv = document.getElementById('searchResults');

    resultsDiv.innerHTML = "";

    if (input.trim() === "") {
        resultsDiv.innerHTML = "<p>Please enter a search term.</p>";
        return;
    }

    const matched = products.filter(product => {
        const name = normalize(product.name);
        return (
            name.includes(input) ||
            input.split('').every(char => name.includes(char))
        );
    });

    if (matched.length === 0) {
        resultsDiv.innerHTML = "<p>No results found.</p>";
        return;
    }

    matched.forEach(product => {
        const productHTML = `
            <a href="${product.link}">
                <div class="product-card">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p><span class="price">${product.price}</span> <span class="old-price">${product.oldPrice}</span></p>
                </div>
            </a>
            `;

        const container = document.createElement('div');
        container.classList.add('product-container');
        container.innerHTML = productHTML;

        resultsDiv.appendChild(container);
    });
}

function openSearch() {
    const input = document.getElementById('searchInput');
    const results = document.getElementById('searchResults');

    input.value = "";
    results.innerHTML = "";

    document.getElementById('searchOverlay').style.display = "block";
    input.focus();
}

function closeSearch() {
    document.getElementById('searchOverlay').style.display = "none";
    document.getElementById('searchInput').value = "";
    document.getElementById('searchResults').innerHTML = "";
}

// Close search overlay when clicking outside the search box
document.addEventListener("click", function (event) {
    const overlay = document.getElementById("searchOverlay");
    const searchBox = document.querySelector(".search-box");

    if (overlay.style.display === "block") {
        // अगर क्लिक search-box के अंदर नहीं है और close-btn नहीं है तो बंद करो
        if (!searchBox.contains(event.target) && !event.target.classList.contains('close-btn')) {
            closeSearch();
        }
    }
});
// Add this event listener after your other scripts
document.getElementById('searchOverlay').addEventListener('click', function (event) {

    const searchBox = this.querySelector('.search-box');

    // अगर क्लिक searchBox के बाहर है, तो close करो
    if (!searchBox.contains(event.target)) {
        closeSearch();
    }
});
function openSearch() {
    document.getElementById("searchOverlay").style.display = "flex";
}
function closeSearch() {
    document.getElementById("searchOverlay").style.display = "none";
}
const messages = document.querySelectorAll('.announcement-message');
let current = 0;

setInterval(() => {
    // Hide current
    messages[current].classList.remove('active');
    messages[current].classList.add('exit');

    // Move to next
    current = (current + 1) % messages.length;

    // Show next
    messages[current].classList.remove('exit');
    messages[current].classList.add('active');
}, 2000); // 2 second speed
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("service-worker.js")
      .then(() => console.log("✅ Service Worker Registered!"))
      .catch(err => console.log("❌ Service Worker Failed:", err));
  });
}