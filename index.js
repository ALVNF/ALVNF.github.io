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

const skills = document.querySelector(".skillsContainer");


function getScrollAmount () {
  return -(skills.scrollWidth - innerWidth);
}

function spacerHeight(){         //  ej. 2 × innerWidth  →  2 000 px
  return -getScrollAmount();     //  getScrollAmount()  devuelve negativo
}


/* 1 · tween horizontal (sin ScrollTrigger dentro) */
const horizontalTween = gsap.to(skills,{
  x: getScrollAmount,
  ease:"none",
  paused:true
});

/* 2 · único pin de SKILLS */
ScrollTrigger.create({
  trigger: ".skillsWrapper",
  start: "top top",
  end:   () => `+=${spacerHeight()}`,
  pin: true,
  scrub: 1,
  animation: horizontalTween,
  anticipatePin: 1,
  invalidateOnRefresh: true
});

/* 3 · IntersectionObserver para el menú lateral */
const MENU_INDEX = { home:0, skills:1, experience:2, projects:3, contact:4 };
const mm   = matchMedia("(max-width: 768px)");
let isMobile = mm.matches;
mm.addEventListener('change', e => isMobile = e.matches);

const observer = new IntersectionObserver(entries => {
  entries.forEach(e=>{
    if(e.isIntersecting){
      setMenuIndex( MENU_INDEX[e.target.dataset.menu] );
    }
  });
},{
  /* en móvil basta con que la sección toque el 30 % central;
     en escritorio exigimos ~40 % */
  threshold : isMobile ? 0 : 0.4,
  rootMargin: isMobile ? "-35% 0px -35% 0px" : "0px"
});

document.querySelectorAll('[data-menu]').forEach(el => observer.observe(el));


const panels = gsap.utils.toArray(".skillsContainer .panel");

panels.forEach(panel => {
  const planet = panel.querySelector('skills-planet');


  gsap.fromTo(panel,
    { opacity: 1, scale: 1 },
    { opacity: 0, scale: 0,
      scrollTrigger: {
        containerAnimation: horizontalTween, 
        trigger: panel,
        start: "left+=60% center",
        end  : "left+=180% center",
        scrub: 0.6
      }
    });

  // 2-B  –– encoger la órbita del planeta --------------------------
  gsap.fromTo(planet,
    {"--rf": 1},
    { "--rf": 0,
      scrollTrigger: {
        containerAnimation: horizontalTween,
        trigger: panel,
        start: "left+=60% center",
        end  : "left+=180% center",
        scrub: 0.6
      }
    });
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