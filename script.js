// --- Gestione Tema ---
const themeToggle = document.getElementById('theme-toggle');
const icon = themeToggle.querySelector('i');
const body = document.body;

// Controllo preferenza salvata
if(localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    icon.classList.replace('fa-moon', 'fa-sun');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        localStorage.setItem('theme', 'light');
        icon.classList.replace('fa-sun', 'fa-moon');
    }
});

// --- Navigazione Principale ---
const navBtns = document.querySelectorAll('.nav-btn[data-target]');
const pages = document.querySelectorAll('.page-section');

navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if(btn.classList.contains('discord-btn')) return; // Ignora il bottone discord (gestito html)
        
        navBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const target = btn.getAttribute('data-target');
        pages.forEach(page => {
            page.classList.remove('active');
            if(page.id === target) page.classList.add('active');
        });
    });
});

// --- Navigazione Utilità ---
const toolBtns = document.querySelectorAll('.tool-btn');
const toolPanels = document.querySelectorAll('.tool-panel');
const outputBox = document.getElementById('output-container');

toolBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        toolBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const tool = btn.getAttribute('data-tool');
        toolPanels.forEach(panel => {
            panel.classList.remove('active');
            if(panel.id === `tool-${tool}`) panel.classList.add('active');
        });
        
        // Nascondi output quando cambi tool
        outputBox.style.display = 'none'; 
    });
});

// --- Carosello Immagini ---
const images = [
    'image_80ee68.jpg', 
    'image_80ee8d.jpg', 
    'image_80eea7.jpg', 
    'image_80eead.jpg', 
    'image_80eeeb.jpg', 
    'image_80ef47.jpg'
];
let currentImg = 0;
const carouselImg = document.getElementById('carousel-img');

document.getElementById('next-slide').addEventListener('click', () => {
    currentImg = (currentImg + 1) % images.length;
    carouselImg.src = images[currentImg];
});

document.getElementById('prev-slide').addEventListener('click', () => {
    currentImg = (currentImg - 1 + images.length) % images.length;
    carouselImg.src = images[currentImg];
});

// Auto-play carosello
setInterval(() => {
    currentImg = (currentImg + 1) % images.length;
    carouselImg.src = images[currentImg];
}, 4000);


// --- LOGICA UTILITIES ---

// Helper Output Copia
function showOutput(command) {
    const inputField = document.getElementById('generated-command');
    inputField.value = command;
    outputBox.style.display = 'block';
    
    // Reset bottone copia
    const copyBtn = document.getElementById('copy-btn');
    copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copia';
    copyBtn.style.backgroundColor = '#198754';
}

function copyCommand() {
    const inputField = document.getElementById('generated-command');
    inputField.select();
    inputField.setSelectionRange(0, 99999); // Mobile
    navigator.clipboard.writeText(inputField.value);
    
    const copyBtn = document.getElementById('copy-btn');
    copyBtn.innerHTML = '<i class="fas fa-check"></i> Copiato!';
    copyBtn.style.backgroundColor = '#0d6efd';
}

// Helper Valori Vuoti
function getVal(id) {
    return document.getElementById(id).value.trim() || 'x';
}

// 1. Registratore di Cassa
let cart = [];
const MAX_ITEMS = 9;

// Init Data Odierna
document.getElementById('shop-date').value = new Date().toLocaleDateString('it-IT');

document.getElementById('add-item-btn').addEventListener('click', () => {
    if (cart.length >= MAX_ITEMS) {
        alert("Puoi aggiungere massimo 9 oggetti allo scontrino.");
        return;
    }

    const nameInput = document.getElementById('item-name');
    const priceInput = document.getElementById('item-price');
    
    const name = nameInput.value.trim().replace(/\s+/g, '_'); // Niente spazi per il comando
    const price = parseFloat(priceInput.value);

    if (!name || isNaN(price) || price <= 0) {
        alert("Inserisci un nome valido e un prezzo maggiore di 0.");
        return;
    }

    cart.push({ name, price: price.toFixed(2) });
    nameInput.value = '';
    priceInput.value = '';
    
    updateCartUI();
});

function updateCartUI() {
    const list = document.getElementById('cart-items');
    list.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += parseFloat(item.price);
        const li = document.createElement('li');
        li.innerHTML = `<span>${item.name}</span> <span>${item.price}€ <i class="fas fa-times text-danger" style="cursor:pointer; color:red;" onclick="removeItem(${index})"></i></span>`;
        list.appendChild(li);
    });

    document.getElementById('cart-count').innerText = cart.length;
    
    const somma = total.toFixed(2);
    document.getElementById('cart-sum').innerText = somma;
    
    // Aggiorna campo IVA (22% della somma totale)
    const iva = (total * 0.22).toFixed(2);
    document.getElementById('shop-iva').value = iva + "€";
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function generateScontrino() {
    let negozio = document.getElementById('shop-name').value.trim().replace(/\s+/g, '_');
    if(!negozio) negozio = 'Negozio';
    
    let command = `/wallet get scontrino ${negozio} `;
    let totalSum = 0;

    // Loop per 9 oggetti esatti (padding con x)
    for (let i = 0; i < 9; i++) {
        if (i < cart.length) {
            command += `${cart[i].name} ${cart[i].price} `;
            totalSum += parseFloat(cart[i].price);
        } else {
            command += `x x `;
        }
    }

    const iva = (totalSum * 0.22);
    const data = document.getElementById('shop-date').value;
    const totaleFinale = (totalSum + iva).toFixed(2);

    command += `${iva.toFixed(2)} ${data} ${totaleFinale}`;
    
    showOutput(command.trim());
}

// 2. Carta d'identità
function generateId() {
    const n = getVal('id-nome').replace(/\s+/g, '_');
    const c = getVal('id-cognome').replace(/\s+/g, '_');
    const data = getVal('id-nascita');
    const naz = getVal('id-naz').replace(/\s+/g, '_');
    const sesso = getVal('id-sesso');
    const em = getVal('id-emiss');
    const sc = getVal('id-scad');

    showOutput(`/wallet get carta-identita ${n} ${c} ${data} ${naz} ${sesso} ${em} ${sc}`);
}

// 3. Patente
function generatePatente() {
    const n = getVal('pat-nome').replace(/\s+/g, '_');
    const c = getVal('pat-cognome').replace(/\s+/g, '_');
    const data = getVal('pat-nascita');
    const em = getVal('pat-emiss');
    const sc = getVal('pat-scad');
    const cat = getVal('pat-cat');

    showOutput(`/wallet get patente ${n} ${c} ${data} ${em} ${sc} ${cat}`);
}

// 4. Tessera Sanitaria
function generateTessera() {
    const cf = getVal('ts-cf');
    const n = getVal('ts-nome').replace(/\s+/g, '_');
    const c = getVal('ts-cognome').replace(/\s+/g, '_');
    const naz = getVal('ts-naz').replace(/\s+/g, '_');
    const sesso = getVal('ts-sesso');
    const data = getVal('ts-nascita');
    const em = getVal('ts-emiss');
    const sc = getVal('ts-scad');

    showOutput(`/wallet get tessera-sanitaria ${cf} ${n} ${c} ${naz} ${sesso} ${data} ${em} ${sc}`);
}

// 5. Assegno
function generateAssegno() {
    const b = getVal('ass-banca').replace(/\s+/g, '_');
    const d = getVal('ass-data');
    const i = getVal('ass-importo');
    const ni = getVal('ass-nomeint').replace(/\s+/g, '_');
    const ci = getVal('ass-cogint').replace(/\s+/g, '_');
    const nf = getVal('ass-nomefirm').replace(/\s+/g, '_');
    const cf = getVal('ass-cogfirm').replace(/\s+/g, '_');

    showOutput(`/wallet get assegno ${b} ${d} ${i} ${ni} ${ci} ${nf} ${cf}`);
}
