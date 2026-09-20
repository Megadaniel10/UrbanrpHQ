// --- Gestione Tema (Dark/Light) ---
const themeToggle = document.getElementById('theme-toggle');
const icon = themeToggle.querySelector('i');
const body = document.body;

if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    icon.classList.replace('fa-moon', 'fa-sun');
}

themeToggle?.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        localStorage.setItem('theme', 'light');
        icon.classList.replace('fa-sun', 'fa-moon');
    }
});

// --- Navigazione SPA Principale ---
const navBtns = document.querySelectorAll('.nav-btn[data-target]');
const pages = document.querySelectorAll('.page-section');

function navigateToSection(targetId) {
    pages.forEach(page => {
        page.classList.remove('active');
        if (page.id === targetId) {
            page.classList.add('active');
        }
    });

    navBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-target') === targetId) {
            btn.classList.add('active');
        }
    });

    if (targetId === 'storia-castro') {
        const homeBtn = document.querySelector('.nav-btn[data-target="home"]');
        if (homeBtn) homeBtn.classList.add('active');
    }

    document.querySelector('.content-area').scrollTop = 0;
}

navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        if (target) {
            navigateToSection(target);
        }
    });
});

// --- Link Esterni e Bottoni Manuali ---
document.getElementById('btn-leggi-storia')?.addEventListener('click', () => navigateToSection('storia-castro'));
document.getElementById('btn-torna-home')?.addEventListener('click', () => navigateToSection('home'));
document.getElementById('btn-discord')?.addEventListener('click', () => window.open('https://discord.gg/n75PCJTA3E', '_blank'));
document.getElementById('btn-nebulastocks')?.addEventListener('click', () => window.open('https://nebula-stock.vercel.app/', '_blank'));

// --- LOGICA TOOLTIP STAFF (Interattività Immagine) ---
const staffData = {
    'Marzio': {
        role: 'Marzio (SoyXmirzioo)',
        desc: 'Uno dei due fondatori di Urban RP (Prima chiamato Vita in città)'
    },
    'Francesco': {
        role: 'Francesco (_Its_checc0)',
        desc: 'Developer e costruttore, dotato della migliore fedina penale del server (simile a quella di Osama bin Laden)'
    },
    'Daniel': {
        role: 'Daniel (Megadaniel10)',
        desc: 'Co-owner del server e capitalista'
    },
    'Diego': {
        role: 'Diego (Dieghito_it)',
        desc: 'Owner del server'
    },
    'Stefano': {
        role: 'Stefano (Steffo_0)',
        desc: 'Disoccupato del server'
    },
    'Federico': {
        role: 'Federico (FILORGIO2)',
        desc: 'Developer e fallito'
    }
};

const hoverZones = document.querySelectorAll('.hover-zone');
const tooltip = document.getElementById('staff-tooltip');
const tooltipName = document.getElementById('tooltip-name');
const tooltipDesc = document.getElementById('tooltip-desc');
const staffContainer = document.querySelector('.staff-container');

if (hoverZones && tooltip && staffContainer) {
    hoverZones.forEach(zone => {
        zone.addEventListener('mouseenter', (e) => {
            const key = e.target.getAttribute('data-tooltip');
            const data = staffData[key];
            if (data) {
                tooltipName.textContent = data.role;
                tooltipDesc.textContent = data.desc;
                tooltip.classList.add('visible');
            }
        });

        zone.addEventListener('mousemove', (e) => {
            const rect = staffContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            tooltip.style.left = `${x}px`;
            tooltip.style.top = `${y}px`;
        });

        zone.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
        });
    });
}

// --- Navigazione Utilità (Sottomenu) ---
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
            if (panel.id === `tool-${tool}`) panel.classList.add('active');
        });
        
        if (outputBox) outputBox.style.display = 'none'; 
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

function setCarouselImage(index) {
    if (!carouselImg) return;
    currentImg = (index + images.length) % images.length;
    carouselImg.style.opacity = '0';
    setTimeout(() => {
        carouselImg.src = images[currentImg];
        carouselImg.style.opacity = '1';
    }, 180);
}

document.getElementById('next-slide')?.addEventListener('click', () => {
    setCarouselImage(currentImg + 1);
});

document.getElementById('prev-slide')?.addEventListener('click', () => {
    setCarouselImage(currentImg - 1);
});

let autoCarousel = setInterval(() => {
    setCarouselImage(currentImg + 1);
}, 5000);

const carouselContainer = document.querySelector('.carousel-container');
if(carouselContainer) {
    carouselContainer.addEventListener('mouseenter', () => clearInterval(autoCarousel));
    carouselContainer.addEventListener('mouseleave', () => {
        autoCarousel = setInterval(() => setCarouselImage(currentImg + 1), 5000);
    });
}

// --- Modal Fullscreen per Immagini ---
const imageModal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-img');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const closeModal = document.getElementById('close-modal');

if(fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
        modalImg.src = carouselImg.src;
        imageModal.classList.add('open');
    });
}

if(closeModal) {
    closeModal.addEventListener('click', () => {
        imageModal.classList.remove('open');
    });
}

if(imageModal) {
    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            imageModal.classList.remove('open');
        }
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && imageModal && imageModal.classList.contains('open')) {
        imageModal.classList.remove('open');
    }
});


// --- LOGICA UTILITIES & GENERAZIONE COMANDI ---

function showOutput(command) {
    const inputField = document.getElementById('generated-command');
    if (inputField) inputField.value = command;
    if (outputBox) outputBox.style.display = 'block';
    
    const copyBtn = document.getElementById('copy-btn');
    if (copyBtn) {
        copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copia';
        copyBtn.style.backgroundColor = '#198754';
    }
}

document.getElementById('copy-btn')?.addEventListener('click', () => {
    const inputField = document.getElementById('generated-command');
    inputField.select();
    inputField.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(inputField.value);
    
    const copyBtn = document.getElementById('copy-btn');
    copyBtn.innerHTML = '<i class="fas fa-check"></i> Copiato!';
    copyBtn.style.backgroundColor = '#0d6efd';
});

function getVal(id) {
    const el = document.getElementById(id);
    return el ? (el.value.trim() || 'x') : 'x';
}

// 1. Registratore di Cassa
let cart = [];
const MAX_ITEMS = 9;

const shopDateEl = document.getElementById('shop-date');
if(shopDateEl) {
    shopDateEl.value = new Date().toLocaleDateString('it-IT');
}

document.getElementById('add-item-btn')?.addEventListener('click', () => {
    if (cart.length >= MAX_ITEMS) {
        alert("Puoi aggiungere massimo 9 oggetti allo scontrino.");
        return;
    }

    const nameInput = document.getElementById('item-name');
    const priceInput = document.getElementById('item-price');
    
    const name = nameInput.value.trim().replace(/\s+/g, '_');
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
    if(!list) return;
    list.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += parseFloat(item.price);
        const li = document.createElement('li');
        li.innerHTML = `<span><strong>${item.name}</strong></span> <span>${item.price}€ <i class="fas fa-trash text-danger" style="cursor:pointer; color:#dc3545; margin-left:8px;" data-index="${index}" title="Rimuovi"></i></span>`;
        list.appendChild(li);
    });

    // Delegazione Eventi per tasti Rimuovi creati dinamicamente
    document.querySelectorAll('.fa-trash').forEach(trashIcon => {
        trashIcon.addEventListener('click', (e) => {
            const idx = e.target.getAttribute('data-index');
            cart.splice(idx, 1);
            updateCartUI();
        });
    });

    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.innerText = cart.length;
    
    const somma = total.toFixed(2);
    const sumEl = document.getElementById('cart-sum');
    if (sumEl) sumEl.innerText = somma;
    
    const iva = (total * 0.22).toFixed(2);
    const ivaEl = document.getElementById('shop-iva');
    if (ivaEl) ivaEl.value = iva + "€";
}

document.getElementById('btn-genera-scontrino')?.addEventListener('click', () => {
    let negozio = document.getElementById('shop-name').value.trim().replace(/\s+/g, '_');
    if (!negozio) negozio = 'Negozio';
    
    let command = `/wallet get scontrino ${negozio} `;
    let totalSum = 0;

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
});

// 2. Carta d'identità
document.getElementById('btn-genera-id')?.addEventListener('click', () => {
    const n = getVal('id-nome').replace(/\s+/g, '_');
    const c = getVal('id-cognome').replace(/\s+/g, '_');
    const data = getVal('id-nascita');
    const naz = getVal('id-naz').replace(/\s+/g, '_');
    const sesso = getVal('id-sesso');
    const em = getVal('id-emiss');
    const sc = getVal('id-scad');

    showOutput(`/wallet get carta-identita ${n} ${c} ${data} ${naz} ${sesso} ${em} ${sc}`);
});

// 3. Patente
document.getElementById('btn-genera-patente')?.addEventListener('click', () => {
    const n = getVal('pat-nome').replace(/\s+/g, '_');
    const c = getVal('pat-cognome').replace(/\s+/g, '_');
    const data = getVal('pat-nascita');
    const em = getVal('pat-emiss');
    const sc = getVal('pat-scad');
    const cat = getVal('pat-cat');

    showOutput(`/wallet get patente ${n} ${c} ${data} ${em} ${sc} ${cat}`);
});

// 4. Tessera Sanitaria
document.getElementById('btn-genera-tessera')?.addEventListener('click', () => {
    const cf = getVal('ts-cf');
    const n = getVal('ts-nome').replace(/\s+/g, '_');
    const c = getVal('ts-cognome').replace(/\s+/g, '_');
    const naz = getVal('ts-naz').replace(/\s+/g, '_');
    const sesso = getVal('ts-sesso');
    const data = getVal('ts-nascita');
    const em = getVal('ts-emiss');
    const sc = getVal('ts-scad');

    showOutput(`/wallet get tessera-sanitaria ${cf} ${n} ${c} ${naz} ${sesso} ${data} ${em} ${sc}`);
});

// 5. Assegno
document.getElementById('btn-genera-assegno')?.addEventListener('click', () => {
    const b = getVal('ass-banca').replace(/\s+/g, '_');
    const d = getVal('ass-data');
    const i = getVal('ass-importo');
    const ni = getVal('ass-nomeint').replace(/\s+/g, '_');
    const ci = getVal('ass-cogint').replace(/\s+/g, '_');
    const nf = getVal('ass-nomefirm').replace(/\s+/g, '_');
    const cf = getVal('ass-cogfirm').replace(/\s+/g, '_');

    showOutput(`/wallet get assegno ${b} ${d} ${i} ${ni} ${ci} ${nf} ${cf}`);
});
