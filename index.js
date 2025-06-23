particlesJS.load('particles-js', './assets/particlesjs-config.json', function(){
    // console.log('particles.json loaded...');
});


let resumeTween = gsap.fromTo(".resumeBtn",
    {
        filter: "drop-shadow(0px 0px 10px #bf00ffbd)",
        border: "none"
    },
    {
    paused:true,
    boxShadow:"0px 0px 20px rgba(152, 56, 255, 0.74)",
    border:"solid 0.1px rgba(205, 158, 255, 0.74)",
    duration:0.5,
    ease: "back"
});

document.getElementById("resumeBtn").addEventListener("mouseenter", () => resumeTween.play());
document.getElementById("resumeBtn").addEventListener("mouseleave", () => resumeTween.reverse());

// 0 = home, 1 = skills, 2 = experience, 3 = projects, 4 = contact

function setMenuIndex(index) {
  const menu = document.querySelector('side-menu');
  if (menu) {
    menu.forceMenuSelection(index);
  }
}

// HOME
ScrollTrigger.create({
  trigger: "#home",
  start: "top center",
  end: "bottom top",
  onEnter: () => setMenuIndex(0),
  onEnterBack: () => setMenuIndex(0)
});

// SKILLS
const contents = gsap.utils.toArray(".skillsContainer .panel");
// const master = gsap.to(contents,{
//     xPercent: -100 * (contents.length -1),
//     ease: "none",
//     scrollTrigger:{
//       trigger: ".skillsContainer",
//       start:"top top",
//       end: () => "+=" + (contents.length - 1) * innerWidth,
//       pin:true,
//       scrub: 1,
//       onEnter: () => setMenuIndex(1),
//       onEnterBack: () => setMenuIndex(1),
//       onLeave: () => setMenuIndex(2),
//       onLeaveBack: () => setMenuIndex(0)
//     }
// })


let master;

function createHorizontalScroll() {
  if (master) master.kill(); // Borra el anterior si existe

  master = gsap.to(contents, {
    xPercent: -100 * (contents.length - 1),
    ease: "none",
    scrollTrigger: {
      trigger: ".skillsContainer",
      start: "top top",
      end: () => "+=" + (contents.length - 1) * window.innerWidth,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      onEnter: () => setMenuIndex(1),
      onEnterBack: () => setMenuIndex(1),
      onLeave: () => setMenuIndex(2),
      onLeaveBack: () => setMenuIndex(0),
    }
  });
}

// Activamos en todos los tamaños
createHorizontalScroll();

// Refresca al cambiar de tamaño
window.addEventListener("resize", () => {
  ScrollTrigger.refresh();
});



// EXPERIENCE
ScrollTrigger.create({
  trigger: "#experience",
  start: "top center",
  end: "bottom top",
  onEnter: () => setMenuIndex(2),
  onEnterBack: () => setMenuIndex(2)
});

// PROJECTS
ScrollTrigger.create({
  trigger: "#projects",
  start: "top center",
  end: "bottom top",
  onEnter: () => setMenuIndex(3),
  onEnterBack: () => setMenuIndex(3)
});

// CONTACT
ScrollTrigger.create({
  trigger: "#contact",
  start: "top center",
  end: "bottom top",
  onEnter: () => setMenuIndex(4),
  onEnterBack: () => setMenuIndex(4)
});



// contents.forEach(panel => {
//   const planet = panel.querySelector('skills-planet');

//   /* 1 — difuminar el panel */
//   gsap.fromTo(panel,
//     {
//         opacity: 1,
//         scale:1
//     },
//     {
//       opacity: 0,
//       scale:0,
//       scrollTrigger: {
//         containerAnimation: master,
//         trigger: panel,
//         start: "left+=60% center",
//         end:   "left+=180% center",
//         scrub: 0.6
//       }
//     });

//   /* 2 — encoger la órbita animando la var CSS en el HOST */
//   gsap.fromTo(planet,
//     {"--rf": 1},
//     {
//       "--rf": 0,
//       scrollTrigger: {
//         containerAnimation: master,
//         trigger: panel,
//         start: "left+=60% center",
//         end:   "left+=180% center",
//         scrub: 0.6
//       }
//     });
// });


ScrollTrigger.matchMedia({
  // Pantallas grandes
  "(min-width: 768px)": function () {
    contents.forEach(panel => {
      const planet = panel.querySelector('skills-planet');

      gsap.fromTo(panel, { opacity: 1, scale: 1 }, {
        opacity: 0,
        scale: 0,
        scrollTrigger: {
          containerAnimation: master,
          trigger: panel,
          start: "left+=60% center",
          end: "left+=180% center",
          scrub: 0.6
        }
      });

      gsap.fromTo(planet, { "--rf": 1 }, {
        "--rf": 0,
        scrollTrigger: {
          containerAnimation: master,
          trigger: panel,
          start: "left+=60% center",
          end: "left+=180% center",
          scrub: 0.6
        }
      });
    });
  },

  // Pantallas pequeñas (móviles)
  "(max-width: 767px)": function () {
    contents.forEach(panel => {
      const planet = panel.querySelector('skills-planet');

      gsap.fromTo(panel, { opacity: 1, scale: 1 }, {
        opacity: 0,
        scale: 0.8, // menor para móviles
        scrollTrigger: {
          containerAnimation: master,
          trigger: panel,
          start: "left+=80% center",
          end: "left+=200% center",
          scrub: 0.6
        }
      });

      gsap.fromTo(planet, { "--rf": 1 }, {
        "--rf": 0,
        scrollTrigger: {
          containerAnimation: master,
          trigger: panel,
          start: "left+=80% center",
          end: "left+=200% center",
          scrub: 0.6
        }
      });
    });
  }
});


gsap.timeline()
.to("#mouseScroll", {y:20, duration:0.7, ease:"back", repeat:-1, yoyo:true})
.to("#mouseScroll div", {y:50, duration:0.9, repeat:-1, yoyo:true})// xPercent: moves 100 percent of width

// GSDevTools.create()


const filters = document.querySelectorAll('.projectsFilter span');
const projects = document.querySelectorAll('project-card');
const noProjectsMsg = document.getElementById('noProjectsMsg');

filters.forEach(filter => {
  filter.addEventListener('click', () => {
    // Cambiar estilo de filtro activo
    filters.forEach(f => f.classList.remove('filterSelected'));
    filter.classList.add('filterSelected');

    const selected = filter.textContent.toLowerCase();
    let anyVisible = false;

    projects.forEach(card => {
      const category = card.getAttribute('data-category');
      const matches = selected === 'all' || category === selected;

      card.style.display = matches ? 'block' : 'none';
      if (matches) anyVisible = true;
    });

    noProjectsMsg.style.display = anyVisible ? 'none' : 'block';
  });
});