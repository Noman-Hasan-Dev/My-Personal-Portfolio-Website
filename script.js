const nav = document.getElementById("mainNav");
const backToTop = document.getElementById("backToTop");
const typedRole = document.getElementById("typedRole");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

const roleWords = [
  "Software Engineer",
  "Angular Developer",
  "Full Stack Developer",
  "Problem Solver",
  "Angular.js Enthusiast",
  "Backend Integrator"
];

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeRoles() {
  const activeWord = roleWords[roleIndex];

  if (!deleting) {
    typedRole.textContent = activeWord.slice(0, charIndex + 1);
    charIndex += 1;

    if (charIndex === activeWord.length) {
      deleting = true;
      window.setTimeout(typeRoles, 1350);
      return;
    }

    window.setTimeout(typeRoles, 85);
  } else {
    typedRole.textContent = activeWord.slice(0, charIndex - 1);
    charIndex -= 1;

    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roleWords.length;
      window.setTimeout(typeRoles, 280);
      return;
    }

    window.setTimeout(typeRoles, 55);
  }
}

function buildSkillBars() {
  document.querySelectorAll(".skill-stack").forEach((skillItem) => {
    const skillName = skillItem.dataset.skill || "Skill";
    const skillValue = Number(skillItem.dataset.value || 0);

    skillItem.innerHTML = `
      <div class="skill-head">
        <span>${skillName}</span>
        <span class="skill-value" data-target="${skillValue}">0%</span>
      </div>
      <div class="skill-track">
        <div class="skill-fill" data-target="${skillValue}"></div>
      </div>
    `;
  });
}

function animateSkillValues(container) {
  const values = container.querySelectorAll(".skill-value");
  const fills = container.querySelectorAll(".skill-fill");

  fills.forEach((bar) => {
    const target = Number(bar.dataset.target || 0);
    bar.style.width = `${target}%`;
  });

  values.forEach((valueNode) => {
    const target = Number(valueNode.dataset.target || 0);
    let current = 0;
    const step = Math.max(1, Math.round(target / 34));

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        valueNode.textContent = `${target}%`;
        clearInterval(timer);
      } else {
        valueNode.textContent = `${current}%`;
      }
    }, 30);
  });
}

function setupScrollBehavior() {
  const toggleScrollUI = () => {
    const at = window.scrollY;
    nav.classList.toggle("nav-scrolled", at > 18);
    backToTop.classList.toggle("show", at > 500);
  };

  toggleScrollUI();
  window.addEventListener("scroll", toggleScrollUI, { passive: true });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function setupRevealAnimations() {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".reveal").forEach((node) => revealObserver.observe(node));
}

function setupSkillObserver() {
  const skillsSection = document.getElementById("skills");
  if (!skillsSection) {
    return;
  }

  let animated = false;
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animateSkillValues(skillsSection);
          animated = true;
        }
      });
    },
    { threshold: 0.25 }
  );

  skillObserver.observe(skillsSection);
}

function setupRipple() {
  document.querySelectorAll(".ripple").forEach((button) => {
    button.addEventListener("click", (event) => {
      const ripple = document.createElement("span");
      ripple.className = "ripple-wave";

      const rect = button.getBoundingClientRect();
      ripple.style.left = `${event.clientX - rect.left}px`;
      ripple.style.top = `${event.clientY - rect.top}px`;

      button.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });
  });
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function setError(field, message) {
  const errorNode = field.parentElement.querySelector(".error-text");
  if (errorNode) {
    errorNode.textContent = message;
  }
}

function clearError(field) {
  const errorNode = field.parentElement.querySelector(".error-text");
  if (errorNode) {
    errorNode.textContent = "";
  }
}

function setupFormValidation() {
  const fields = Array.from(contactForm.querySelectorAll("input, textarea"));

  fields.forEach((field) => {
    field.addEventListener("input", () => clearError(field));
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    let valid = true;
    formStatus.textContent = "";

    const name = contactForm.name;
    const email = contactForm.email;
    const subject = contactForm.subject;
    const message = contactForm.message;

    if (!name.value.trim()) {
      setError(name, "Name is required.");
      valid = false;
    }

    if (!email.value.trim()) {
      setError(email, "Email is required.");
      valid = false;
    } else if (!validateEmail(email.value.trim())) {
      setError(email, "Please provide a valid email.");
      valid = false;
    }

    if (!subject.value.trim()) {
      setError(subject, "Subject is required.");
      valid = false;
    }

    if (!message.value.trim()) {
      setError(message, "Message is required.");
      valid = false;
    } else if (message.value.trim().length < 12) {
      setError(message, "Message must be at least 12 characters.");
      valid = false;
    }

    if (!valid) {
      formStatus.textContent = "Please fix the highlighted fields.";
      return;
    }

    formStatus.textContent = "Message validated successfully. Ready to integrate with backend endpoint.";
    contactForm.reset();
  });
}

function setupParticles() {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) {
    return;
  }

  const context = canvas.getContext("2d");
  const particles = [];
  let frameId;

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function createParticles() {
    particles.length = 0;
    const count = Math.min(70, Math.max(28, Math.floor(window.innerWidth / 22)));

    for (let i = 0; i < count; i += 1) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
        radius: Math.random() * 1.8 + 0.7,
        alpha: Math.random() * 0.45 + 0.15
      });
    }
  }

  function draw() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > window.innerWidth) {
        particle.vx *= -1;
      }
      if (particle.y < 0 || particle.y > window.innerHeight) {
        particle.vy *= -1;
      }

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(148, 163, 184, ${particle.alpha})`;
      context.fill();
    });

    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.hypot(dx, dy);

        if (distance < 120) {
          const opacity = (1 - distance / 120) * 0.16;
          context.beginPath();
          context.moveTo(particles[i].x, particles[i].y);
          context.lineTo(particles[j].x, particles[j].y);
          context.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
          context.lineWidth = 1;
          context.stroke();
        }
      }
    }

    frameId = requestAnimationFrame(draw);
  }

  window.addEventListener("resize", () => {
    resize();
    createParticles();
  });

  resize();
  createParticles();
  draw();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(frameId);
      return;
    }
    draw();
  });
}

function closeMobileMenuOnSelect() {
  const navMenu = document.getElementById("navMenu");
  const bsCollapse = window.bootstrap && navMenu
    ? window.bootstrap.Collapse.getOrCreateInstance(navMenu, { toggle: false })
    : null;

  document.querySelectorAll("#navMenu .nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 992 && bsCollapse) {
        bsCollapse.hide();
      }
    });
  });
}

buildSkillBars();
setupScrollBehavior();
setupRevealAnimations();
setupSkillObserver();
setupRipple();
setupFormValidation();
setupParticles();
closeMobileMenuOnSelect();
typeRoles();
