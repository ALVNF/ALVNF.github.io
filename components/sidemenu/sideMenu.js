const sideMenu = document.createElement('template');
sideMenu.innerHTML=`
  <link rel="stylesheet" href="./components/sidemenu/sideMenu.css">
  <div class="container">
    <a class="menu-item selected" href="#home">HOME</a>
    <a class="menu-item" href="#latestProjects">PROJECTS</a>
    <a class="menu-item" href="#experience">EXPERIENCE</a>
    <a class="menu-item" href="#conctact">CONCTACT</a>
  </div>
`
class SideMenu extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({mode:'open'});
    this.shadowRoot.appendChild(sideMenu.content.cloneNode(true));

  }

  connectedCallback() {
    document.addEventListener("scroll", () => {
      
      this.detectDocumentSection();
    });
  }

  detectDocumentSection(){
    
    const sections = document.querySelectorAll("section");
    const menuItems = this.shadowRoot.querySelectorAll(".menu-item");
    

    let activeIndex = -1; // Inicializamos sin ningún elemento activo
    let maxVisibility = 0; // Máximo porcentaje visible encontrado
  

    // Detectar qué sección tiene mayor porcentaje visible
    sections.forEach((section, index) => {
      // Obtener las dimensiones de la sección
      const rect = section.getBoundingClientRect();
      const sectionHeight = rect.height;

      // Calcular el porcentaje visible de la sección
      const visibleHeight = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
      const visibilityPercentage = (visibleHeight / sectionHeight) * 100;

      // Verificar si esta sección tiene más visibilidad que las anteriores
      if (visibilityPercentage > maxVisibility && visibilityPercentage > 10) { // Consideramos un umbral del 10%
        maxVisibility = visibilityPercentage;
        activeIndex = index;
      }
    });

    // Si no se encontró ninguna sección suficientemente visible, selecciona la anterior
    if (activeIndex === -1) {
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 0) { // Encuentra la última sección que pasó por la parte superior
          activeIndex = index;
        }
      });
    }
  
    // Actualizar las clases de los elementos del menú
    menuItems.forEach((item, index) => {
      if (index === activeIndex) {
        item.classList.add("selected");
      } else {
        item.classList.remove("selected");
      }
    });

  }


  
}

customElements.define('side-menu', SideMenu);