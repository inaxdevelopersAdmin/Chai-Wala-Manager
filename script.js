/**
 * Chai Wala Manager - Production JavaScript
 * Pure Vanilla JS (No Framework Dependencies)
 */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // 1. Dynamic Year Update
  const currentYearEl = document.getElementById("currentYear");
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // 2. Sticky Navbar & Scroll Spy
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-item");
  const sections = document.querySelectorAll("section[id]");
  const backToTopBtn = document.getElementById("backToTop");

  const handleScroll = () => {
    const scrollY = window.scrollY;

    if (navbar) {
      if (scrollY > 30) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    }

    if (backToTopBtn) {
      if (scrollY > 500) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    }

    let currentSectionId = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      const href = link.getAttribute("href");
      if (href && href === `#${currentSectionId}`) {
        link.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // 3. Mobile Navigation Drawer
  const mobileToggle = document.getElementById("mobileToggle");
  const mobileDrawer = document.getElementById("mobileDrawer");
  const mobileNavItems = document.querySelectorAll(".mobile-nav-item");

  const toggleMobileMenu = (forceClose = false) => {
    if (!mobileToggle || !mobileDrawer) return;

    const isOpen = forceClose
      ? true
      : mobileToggle.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      mobileToggle.setAttribute("aria-expanded", "false");
      mobileDrawer.classList.remove("open");
      mobileDrawer.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    } else {
      mobileToggle.setAttribute("aria-expanded", "true");
      mobileDrawer.classList.add("open");
      mobileDrawer.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
  };

  if (mobileToggle) {
    mobileToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  mobileNavItems.forEach((item) => {
    item.addEventListener("click", () => toggleMobileMenu(true));
  });

  document.addEventListener("click", (e) => {
    if (mobileDrawer && mobileDrawer.classList.contains("open")) {
      if (
        !mobileDrawer.contains(e.target) &&
        !mobileToggle.contains(e.target)
      ) {
        toggleMobileMenu(true);
      }
    }
  });

  // 4. Scroll Reveal Animations
  const revealElements = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.getAttribute("data-delay") || 0;
            setTimeout(() => {
              entry.target.classList.add("revealed");
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -40px 0px", threshold: 0.1 },
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("revealed"));
  }

  // 5. Screenshots Interactive Slider & Tabs
  const sliderTrack = document.getElementById("sliderTrack");
  const slides = document.querySelectorAll(".slide-card");
  const galleryTabs = document.querySelectorAll(".gallery-tab");
  const sliderDots = document.querySelectorAll(".slider-dot");
  const prevBtn = document.getElementById("sliderPrev");
  const nextBtn = document.getElementById("sliderNext");

  let currentSlide = 0;
  const totalSlides = slides.length;
  let autoSlideTimer = null;

  const updateSlider = (index) => {
    if (!sliderTrack || totalSlides === 0) return;
    currentSlide = (index + totalSlides) % totalSlides;
    sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

    slides.forEach((slide, idx) =>
      slide.classList.toggle("active", idx === currentSlide),
    );
    galleryTabs.forEach((tab, idx) => {
      const isSelected = idx === currentSlide;
      tab.classList.toggle("active", isSelected);
      tab.setAttribute("aria-selected", isSelected ? "true" : "false");
    });
    sliderDots.forEach((dot, idx) =>
      dot.classList.toggle("active", idx === currentSlide),
    );
  };

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      updateSlider(currentSlide + 1);
      restartAutoSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      updateSlider(currentSlide - 1);
      restartAutoSlide();
    });
  }

  galleryTabs.forEach((tab, idx) => {
    tab.addEventListener("click", () => {
      updateSlider(idx);
      restartAutoSlide();
    });
  });

  sliderDots.forEach((dot, idx) => {
    dot.addEventListener("click", () => {
      updateSlider(idx);
      restartAutoSlide();
    });
  });

  // Touch Swipe Support
  let startX = 0;
  let endX = 0;
  if (sliderTrack) {
    sliderTrack.addEventListener(
      "touchstart",
      (e) => {
        startX = e.changedTouches[0].screenX;
      },
      { passive: true },
    );

    sliderTrack.addEventListener(
      "touchend",
      (e) => {
        endX = e.changedTouches[0].screenX;
        if (startX - endX > 50) {
          updateSlider(currentSlide + 1);
          restartAutoSlide();
        } else if (endX - startX > 50) {
          updateSlider(currentSlide - 1);
          restartAutoSlide();
        }
      },
      { passive: true },
    );
  }

  const startAutoSlide = () => {
    stopAutoSlide();
    autoSlideTimer = setInterval(() => updateSlider(currentSlide + 1), 6000);
  };
  const stopAutoSlide = () => {
    if (autoSlideTimer) {
      clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }
  };
  const restartAutoSlide = () => {
    stopAutoSlide();
    startAutoSlide();
  };

  const sliderViewport = document.querySelector(".slider-viewport");
  if (sliderViewport) {
    sliderViewport.addEventListener("mouseenter", stopAutoSlide);
    sliderViewport.addEventListener("mouseleave", startAutoSlide);
  }
  startAutoSlide();

  // 6. Animated Statistics Counters
  const counterElements = document.querySelectorAll(".counter-val");
  let countersAnimated = false;

  const animateCounters = () => {
    if (countersAnimated) return;

    counterElements.forEach((counter) => {
      const target = parseInt(counter.getAttribute("data-target"), 10);
      const duration = 2000;
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentCount = Math.floor(ease * target);

        counter.textContent = currentCount.toLocaleString("en-IN");
        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toLocaleString("en-IN");
        }
      };

      requestAnimationFrame(updateCounter);
    });

    countersAnimated = true;
  };

  const statsSection = document.getElementById("stats");
  if (statsSection && "IntersectionObserver" in window) {
    const statsObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 },
    );

    statsObserver.observe(statsSection);
  }

  // 7. Interactive FAQ Accordion
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const trigger = item.querySelector(".faq-trigger");
    const content = item.querySelector(".faq-content");

    if (trigger && content) {
      trigger.addEventListener("click", () => {
        const isExpanded = trigger.getAttribute("aria-expanded") === "true";

        faqItems.forEach((otherItem) => {
          if (otherItem !== item) {
            otherItem.classList.remove("active");
            const otherTrigger = otherItem.querySelector(".faq-trigger");
            const otherContent = otherItem.querySelector(".faq-content");
            if (otherTrigger)
              otherTrigger.setAttribute("aria-expanded", "false");
            if (otherContent) otherContent.hidden = true;
          }
        });

        if (isExpanded) {
          trigger.setAttribute("aria-expanded", "false");
          content.hidden = true;
          item.classList.remove("active");
        } else {
          trigger.setAttribute("aria-expanded", "true");
          content.hidden = false;
          item.classList.add("active");
        }
      });
    }
  });

  // 8. Demo Video Modal & Interactive Walkthrough Simulator
  const openDemoBtn = document.getElementById("openDemoBtn");
  const videoCardTrigger = document.getElementById("videoCardTrigger");
  const mainPlayBtn = document.getElementById("mainPlayBtn");
  const videoModal = document.getElementById("videoModal");
  const closeVideoModal = document.getElementById("closeVideoModal");
  const simPlayToggle = document.getElementById("simPlayToggle");
  const simProgressFill = document.getElementById("simProgressFill");
  const simTimeLabel = document.getElementById("simTimeLabel");
  const simBody = document.getElementById("simBody");

  let simInterval = null;
  let simSeconds = 14;
  const simTotalSeconds = 135;

  const demoSteps = [
    {
      time: 10,
      title: "Step 1: Adding 4 Special Chais & 2 Samosas",
      detail: "Subtotal: ₹80 • Instant POS Tap",
      status: "Paid via UPI QR",
    },
    {
      time: 35,
      title: "Step 2: Recording ₹150 Daily Milk Expense",
      detail: "Raw Material: Full Cream Amul Milk",
      status: "Inventory Updated",
    },
    {
      time: 70,
      title: "Step 3: Customer Udhar Khata Reminder",
      detail: "Sent WhatsApp statement to Rahul",
      status: "Delivered in 1-Click",
    },
    {
      time: 100,
      title: "Step 4: Evening Profit & Settlement Report",
      detail: "Total Sales: ₹4,850 • Net Profit: ₹2,100",
      status: "Ready to Export",
    },
  ];

  const updateSimPlayer = () => {
    simSeconds = (simSeconds + 1) % simTotalSeconds;
    const progressPct = (simSeconds / simTotalSeconds) * 100;
    if (simProgressFill) simProgressFill.style.width = `${progressPct}%`;

    const mins = Math.floor(simSeconds / 60);
    const secs = simSeconds % 60;
    const formatted = `${mins}:${secs < 10 ? "0" : ""}${secs} / 02:15`;
    if (simTimeLabel) simTimeLabel.textContent = formatted;

    const currentStep =
      demoSteps
        .slice()
        .reverse()
        .find((s) => simSeconds >= s.time) || demoSteps[0];
    if (simBody && currentStep) {
      simBody.innerHTML = `
        <div class="sim-step">
          <h4>${currentStep.title}</h4>
          <div class="sim-visual-bill">
            <span>${currentStep.detail}</span>
            <span class="badge-success">${currentStep.status}</span>
          </div>
        </div>
      `;
    }
  };

  const startSimPlayer = () => {
    if (!simInterval) {
      simInterval = setInterval(updateSimPlayer, 1000);
      if (simPlayToggle) simPlayToggle.textContent = "❚❚ Pause";
    }
  };

  const pauseSimPlayer = () => {
    if (simInterval) {
      clearInterval(simInterval);
      simInterval = null;
      if (simPlayToggle) simPlayToggle.textContent = "▶ Play";
    }
  };

  const openModal = () => {
    if (videoModal) {
      videoModal.classList.add("open");
      videoModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      startSimPlayer();
    }
  };

  const closeModal = () => {
    if (videoModal) {
      videoModal.classList.remove("open");
      videoModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      pauseSimPlayer();
    }
  };

  if (openDemoBtn) openDemoBtn.addEventListener("click", openModal);
  if (videoCardTrigger) videoCardTrigger.addEventListener("click", openModal);
  if (mainPlayBtn)
    mainPlayBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openModal();
    });
  if (closeVideoModal) closeVideoModal.addEventListener("click", closeModal);

  if (simPlayToggle) {
    simPlayToggle.addEventListener("click", () => {
      if (simInterval) pauseSimPlayer();
      else startSimPlayer();
    });
  }

  if (videoModal) {
    videoModal.addEventListener("click", (e) => {
      if (e.target === videoModal) closeModal();
    });
  }

  // 9. Policy & Information Modal
  const infoModal = document.getElementById("infoModal");
  const closeInfoModal = document.getElementById("closeInfoModal");
  const infoModalTitle = document.getElementById("infoModalTitle");
  const infoModalContent = document.getElementById("infoModalContent");

  const policyContent = {
    privacy: {
      title: "Privacy Policy",
      body: `<p><strong>Last Updated: 2026</strong></p><h4>1. Local-First Storage</h4><p>Chai Wala Manager stores customer names, orders, and expenses on your device. We do not sell or monetize your records.</p><h4>2. Cloud Sync</h4><p>Google Drive backup is strictly encrypted and controlled by your Google account.</p>`,
    },
    terms: {
      title: "Terms of Service",
      body: `<h4>1. Service Agreement</h4><p>Chai Wala Manager is provided as a billing and bookkeeping utility for food & beverage businesses.</p><h4>2. Data Ownership</h4><p>You own 100% of all data created within your app ledger.</p>`,
    },
    security: {
      title: "Data Security & Encryption",
      body: `<h4>Device Encryption</h4><p>Data is stored locally on Android sandbox storage with optional biometric PIN/fingerprint lock.</p>`,
    },
    refund: {
      title: "Refund Policy",
      body: `<h4>Zero Risk</h4><p>Core features are 100% free. Any optional pro add-ons include a 7-day unconditional refund guarantee.</p>`,
    },
    about: {
      title: "About Chai Tech Labs",
      body: `<h4>Empowering Small Business</h4><p>Building high-speed, intuitive digital tools for tea stalls, cafés, and local beverage vendors.</p>`,
    },
  };

  const openInfoModal = (type) => {
    const data = policyContent[type];
    if (data && infoModal && infoModalTitle && infoModalContent) {
      infoModalTitle.textContent = data.title;
      infoModalContent.innerHTML = data.body;
      infoModal.classList.add("open");
      infoModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
  };

  const closeInfoModalHandler = () => {
    if (infoModal) {
      infoModal.classList.remove("open");
      infoModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  };

  if (closeInfoModal)
    closeInfoModal.addEventListener("click", closeInfoModalHandler);
  if (infoModal) {
    infoModal.addEventListener("click", (e) => {
      if (e.target === infoModal) closeInfoModalHandler();
    });
  }

  [
    { id: "privacyLink", type: "privacy" },
    { id: "termsLink", type: "terms" },
    { id: "securityLink", type: "security" },
    { id: "refundLink", type: "refund" },
    { id: "aboutLink", type: "about" },
  ].forEach((item) => {
    const el = document.getElementById(item.id);
    if (el) {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        openInfoModal(item.type);
      });
    }
  });

  // Global ESC Key Handler
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
      closeInfoModalHandler();
      toggleMobileMenu(true);
    }
  });

  // 10. Contact Form Validation & Submission
  const contactForm = document.getElementById("contactForm");
  const nameInput = document.getElementById("contactName");
  const emailInput = document.getElementById("contactEmail");
  const messageInput = document.getElementById("contactMessage");
  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const messageError = document.getElementById("messageError");
  const submitBtn = document.getElementById("submitBtn");
  const formSuccessAlert = document.getElementById("formSuccessAlert");

  const isValidEmail = (email) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
  const isValidPhone = (phone) => {
    const cleaned = phone.replace(/[^0-9]/g, "");
    return cleaned.length >= 10 && cleaned.length <= 12;
  };

  const validateField = (input, errorEl, condition) => {
    if (!condition) {
      input.classList.add("invalid");
      if (errorEl) errorEl.classList.add("visible");
      return false;
    } else {
      input.classList.remove("invalid");
      if (errorEl) errorEl.classList.remove("visible");
      return true;
    }
  };

  if (nameInput) {
    nameInput.addEventListener("input", () => {
      validateField(nameInput, nameError, nameInput.value.trim().length >= 2);
    });
  }

  if (emailInput) {
    emailInput.addEventListener("input", () => {
      const val = emailInput.value.trim();
      validateField(
        emailInput,
        emailError,
        isValidEmail(val) || isValidPhone(val),
      );
    });
  }

  if (messageInput) {
    messageInput.addEventListener("input", () => {
      validateField(
        messageInput,
        messageError,
        messageInput.value.trim().length >= 10,
      );
    });
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const isNameValid = validateField(
        nameInput,
        nameError,
        nameInput.value.trim().length >= 2,
      );
      const emailVal = emailInput.value.trim();
      const isEmailValid = validateField(
        emailInput,
        emailError,
        isValidEmail(emailVal) || isValidPhone(emailVal),
      );
      const isMessageValid = validateField(
        messageInput,
        messageError,
        messageInput.value.trim().length >= 10,
      );

      if (isNameValid && isEmailValid && isMessageValid) {
        const btnLabel = submitBtn.querySelector(".btn-label");
        const btnSpinner = submitBtn.querySelector(".btn-spinner");

        if (btnLabel && btnSpinner) {
          btnLabel.textContent = "Sending...";
          btnSpinner.hidden = false;
          submitBtn.disabled = true;
        }

        setTimeout(() => {
          if (btnLabel && btnSpinner) {
            btnLabel.textContent = "Message Sent";
            btnSpinner.hidden = true;
          }

          if (formSuccessAlert) {
            formSuccessAlert.hidden = false;
          }

          contactForm.reset();

          setTimeout(() => {
            if (btnLabel) btnLabel.textContent = "Send Message";
            submitBtn.disabled = false;
          }, 4000);
        }, 1200);
      }
    });
  }
});
