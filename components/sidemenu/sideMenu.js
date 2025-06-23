const sideMenu = document.createElement('template');
sideMenu.innerHTML=`
  <link rel="stylesheet" href="./components/sidemenu/sideMenu.css">
  <div class="container">
    <a class="menu-item selected" href="#home">HOME</a>
    <a class="menu-item" href="#skills">SKILLS</a>
    <a class="menu-item" href="#experience">EXPERIENCE</a>
    <a class="menu-item" href="#latestProjects">PROJECTS</a>
    <a class="menu-item" href="#contact">CONTACT</a>
  </div>
`
class SideMenu extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({mode:'open'});
    this.shadowRoot.appendChild(sideMenu.content.cloneNode(true));

  }

  connectedCallback() {

    this.setActiveMenuItem(0); // por defecto
  }

  setActiveMenuItem(index) {
    const items = this.shadowRoot.querySelectorAll(".menu-item");
    items.forEach((item, i) => {
      item.classList.toggle("selected", i === index);
    });
  }

  forceMenuSelection(index) {
    this.setActiveMenuItem(index);
  }

  
}

customElements.define('side-menu', SideMenu);