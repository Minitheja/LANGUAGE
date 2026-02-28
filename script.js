document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('nav-scrolled');
        } else {
            navbar.classList.remove('nav-scrolled');
        }
    });

    // Mobile menu toggle
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenu.querySelector('i').classList.toggle('fa-times');
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                navLinks.classList.remove('active');
                mobileMenu.querySelector('i').classList.remove('fa-times');

                window.scrollTo({
                    top: targetElement.offsetTop - navbar.offsetHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form Validation and Success Message
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Basic validation check (redundant but good practice)
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            if (name && email && subject && message) {
                // Hide form and show success message
                contactForm.style.display = 'none';
                formSuccess.style.display = 'block';

                // Optionally reset form after some time and show again
                /*
                setTimeout(() => {
                    formSuccess.style.display = 'none';
                    contactForm.style.display = 'block';
                    contactForm.reset();
                }, 5000);
                */
            } else {
                alert('Please fill in all fields.');
            }
        });
    }

    // Button Click Pop-ups for unfinished links
    document.querySelectorAll('.btn, .nav-btns a').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const href = btn.getAttribute('href');
            if (href === '#' || !href || href.startsWith('javascript:')) {
                e.preventDefault();
                alert('This feature is currently in development. Stay tuned for updates!');
            }
        });
    });

    // Scroll Spy: Highlight active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links li a');

    const scrollSpyOptions = {
        threshold: 0.5,
        rootMargin: "-80px 0px 0px 0px"
    };

    const scrollSpyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navItems.forEach(item => {
                    item.classList.toggle('nav-active', item.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, scrollSpyOptions);

    sections.forEach(section => scrollSpyObserver.observe(section));

    // Intersection Observer for Reveal Animations
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
        revealObserver.observe(el);
    });

    // Live Stats Counter Logic
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat-number');
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    animateValue(counter, 0, target, 2000);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.live-stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});
