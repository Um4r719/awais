// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => navLinks.classList.toggle('show'));
    document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', () => navLinks.classList.remove('show')));
}

// Active nav link based on current page
const currentPage = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPage) link.classList.add('active');
});

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
function revealOnScroll() {
    reveals.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 120) el.classList.add('active');
    });
}
window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

// Counters (only on index page)
if (document.querySelector('.metric-number')) {
    const counters = document.querySelectorAll('.metric-number');
    let counted = false;
    function startCounters() {
        if (counted) return;
        counted = true;
        counters.forEach(counter => {
            let target = parseInt(counter.dataset.target);
            let current = 0;
            let increment = Math.ceil(target / 50);
            function update() {
                current += increment;
                if (current < target) {
                    counter.innerText = current;
                    requestAnimationFrame(update);
                } else counter.innerText = target;
            }
            update();
        });
    }
    window.addEventListener('scroll', () => {
        const metrics = document.getElementById('metrics');
        if (metrics && metrics.getBoundingClientRect().top < window.innerHeight - 100 && !counted) startCounters();
    });
}

// Telegram integration (only on admission page)
const admissionForm = document.getElementById('admissionForm');
if (admissionForm) {
    const TELEGRAM_BOT_TOKEN = '8673348746:AAEZL-lYauwuGcZKz9abptnqH0iPJ1YrMhM';
    const TELEGRAM_CHAT_ID = '7059197576';
    const TELEGRAM_PROXY_URL = 'https://telegram-bot-proxy.umarofficial404.workers.dev/';
    
    function sendToTelegram(studentName, parentName, whatsapp, email, course, country, preferredTime, message) {
        const text = `🎓 *NEW QURAN ACADEMY ADMISSION* 🎓\n\n` +
                     `👤 *Student:* ${studentName}\n` +
                     `👪 *Parent:* ${parentName}\n` +
                     `📞 *WhatsApp:* ${whatsapp}\n` +
                     `📧 *Email:* ${email}\n` +
                     `📚 *Course:* ${course}\n` +
                     `🌍 *Country:* ${country}\n` +
                     `⏰ *Preferred Time:* ${preferredTime || 'Not specified'}\n` +
                     `💬 *Message:* ${message || 'None'}\n\n` +
                     `🕋 *Free 3-Day Trial Request* -- Dr. Farhat Hashmi Online Quran Academy\n` +
                     `*Time:* ${new Date().toLocaleString()}`;
        fetch(TELEGRAM_PROXY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ botToken: TELEGRAM_BOT_TOKEN, chatId: TELEGRAM_CHAT_ID, message: text })
        }).catch(err => console.error('Telegram error:', err));
    }
    
    function showToast(message, type = 'success') {
        let toast = document.querySelector('.toast-notification');
        if (toast) toast.remove();
        toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        const icon = type === 'success' ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-exclamation-circle"></i>';
        toast.innerHTML = `${icon} <span>${message}</span>`;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 5000);
    }
    
    admissionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const studentName = document.getElementById('studentName').value.trim();
        const parentName = document.getElementById('parentName').value.trim();
        const whatsapp = document.getElementById('whatsapp').value.trim();
        const email = document.getElementById('email').value.trim();
        const course = document.getElementById('course').value;
        const country = document.getElementById('country').value.trim();
        const preferredTime = document.getElementById('preferredTime').value.trim();
        const message = document.getElementById('message').value.trim();
        
        if (!studentName || !parentName || !whatsapp || !email || !course || !country) {
            showToast("❌ Please fill all required fields.", "error");
            return;
        }
        const emailPattern = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
        if (!emailPattern.test(email)) {
            showToast("⚠️ Please enter a valid email address.", "error");
            return;
        }
        const phonePattern = /^[\+\d\s\-\(\)]{8,20}$/;
        if (!phonePattern.test(whatsapp)) {
            showToast("⚠️ Please enter a valid WhatsApp number.", "error");
            return;
        }
        
        sendToTelegram(studentName, parentName, whatsapp, email, course, country, preferredTime, message);
        showToast("✅ Jazakallah! Your admission request has been submitted. We will contact you within 24 hours.", "success");
        admissionForm.reset();
    });
                                                  }
