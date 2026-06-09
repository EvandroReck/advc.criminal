// Script.js - SisDefesa Advocacia Criminal

document.addEventListener('DOMContentLoaded', () => {
    console.log('%c🚀 SisDefesa - Advocacia Criminal carregado com sucesso!', 
        'color: #D4AF37; font-size: 18px; font-weight: bold;');

    // Animação dos Cards com Intersection Observer
    const cards = document.querySelectorAll('.card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150);
            }
        });
    }, { threshold: 0.15 });

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
        card.style.transition = 'all 0.7s ease';
        observer.observe(card);
    });

    // Efeito parallax suave no banner
    const banner = document.querySelector('.banner');
    if (banner) {
        banner.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) * 8;
            const y = (e.clientY / window.innerHeight) * 8;
            banner.style.backgroundPosition = `calc(50% + ${x}px) calc(50% + ${y}px)`;
        });
    }

    // Botões com efeito ripple
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size/2}px`;
            ripple.style.top = `${e.clientY - rect.top - size/2}px`;

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Contador animado para estatísticas
    function animateCounter(el, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                el.textContent = target + (target === 98 ? '%' : '+');
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(start) + (target === 98 ? '%' : '+');
            }
        }, 16);
    }

    // Ativar contadores quando visíveis
    const statNumbers = document.querySelectorAll('.stat-item h4');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const number = parseInt(entry.target.textContent);
                if (!isNaN(number)) {
                    entry.target.textContent = '0';
                    animateCounter(entry.target, number);
                }
                statsObserver.unobserve(entry.target);
            }
        });
    });

    statNumbers.forEach(stat => statsObserver.observe(stat));

    // Tecla de atalho (Exemplo: Pressione "C" para ir para Clientes)
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'c') {
            window.location.href = 'clientes.html';
        }
    });
});

// Função extra para futuro uso em outras páginas
function showNotification(message, type = 'success') {
    const notif = document.createElement('div');
    notif.className = `notification ${type}`;
    notif.textContent = message;
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.opacity = '0';
        setTimeout(() => notif.remove(), 500);
    }, 3000);
}
