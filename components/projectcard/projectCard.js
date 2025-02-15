const projectCard = document.createElement('template');
projectCard.innerHTML=`
  <link rel="stylesheet" href="./components/projectcard/projectCard.css">
  <div class="card" >
    <hgroup>
      <label id="project-number" class="syncopate-regular">01</label>
      <h1 id="project-name" class="syncopate-regular">Playharbor</h1>
    </hgroup>


    <div class="descriptionContainer">
      <p id="project-description" class="spacegrotesk-regular">Website where you can play video games uploaded by developers.</p>
      <span id="techs">
        <span class="tech"><img class="techLogo" src="./assets/logos/html5.svg"/></span>
        <span class="tech"><img class="techLogo" src="./assets/logos/javascript.svg"/></span>
      </span>
    </div>

    <button id="viewCode" class="spacegrotesk-regular"><img id="githubLogo" src="./assets/logos/github.svg"/>Github</button>
  
  </div>
`

class ProjectCard extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({mode:'open'});
    this.shadowRoot.appendChild(projectCard.content.cloneNode(true));
    this.githubLink = '';
  }

  static get observedAttributes() {
    return ['project-number', 'project-name', 'technologies', 'description', 'project-img', 'github-link'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this[name.replace(/-/g, '')] = newValue;
      this.render();
    }
  }


  render() {
    const projectNumber = this.getAttribute('project-number') || '00';
    const projectName = this.getAttribute('project-name') || 'Unnamed Project';
    const technologies = (this.getAttribute('technologies') || '').split(',').map((tech) => tech.trim());
    const description = this.getAttribute('description') || 'No description provided';
    const projectImg = this.getAttribute('project-img') || 'background_1';
    this.githubLink = this.getAttribute('github-link') || '';

    // Actualizar el contenido dinámico
    this.shadowRoot.querySelector('#project-number').textContent = `${projectNumber}`;
    this.shadowRoot.querySelector('#project-name').textContent = projectName;

    // Renderizar las tecnologías
    const techContainer = this.shadowRoot.querySelector('#techs');
    techContainer.innerHTML = technologies.map((tech) => `<span class="tech"><img class="techLogo" src="./assets/logos/${tech}.svg"/></span>`).join('');

    this.shadowRoot.querySelector('#project-description').textContent = description;

    this.shadowRoot.querySelector('.card').style.backgroundImage = 'url('+ `./assets/${projectImg}.jpg`+')';
      
  }



  connectedCallback() {
    this.render();
    this.shadowRoot.querySelector("#viewCode").addEventListener('click', () => {
      window.open("https://github.com/ALVNF/"+this.getAttribute('github-link'));
    });
  
  }


  
}

customElements.define('project-card', ProjectCard);