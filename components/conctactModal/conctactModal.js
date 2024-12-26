const modalConctact = document.createElement('template');
modalConctact.innerHTML = `
    <link rel="stylesheet" href="./components/conctactModal/conctactModal.css">
    <div class="modal">
      <form id="conctactForm" class="modal-content">
        <span class="close">&times;</span>
        <h2 class="syncopate-bold">Conctact with me</h2>

        <label for="userName">Your name:</label>
        <input type="text" name="name" id="userName" class="spacegrotesk-regular" placeholder="Your name" required />

        <label for="userEmail">Your mail:</label>
        <input type="email" name="email" id="userEmail" class="spacegrotesk-regular" placeholder="youremail@example.com" required />

        <label for="company">Business:</label>
        <input type="text" name="company" id="company" class="spacegrotesk-regular" placeholder="Business name" required />

        <label for="subject">Subject:</label>
        <input type="text" name="subject" id="subject" class="spacegrotesk-regular" placeholder="Subject" required />

        <label for="message">Message:</label>
        <textarea id="message" name="message" class="spacegrotesk-regular" placeholder="Write your message here" required></textarea>

        <button type="submit" id="sendEmailBtn"  class="btnGeneral spacegrotesk-regular">SEND EMAIL</button>
      </form>
    </div>
`;

class ModalConctact extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(modalConctact.content.cloneNode(true));
  
      // Referencias a elementos internos
      this.modal = this.shadowRoot.querySelector('.modal');
      this.closeButton = this.shadowRoot.querySelector('.close');
      this.sendEmailBtn = this.shadowRoot.querySelector('#sendEmailBtn');
    }
  
    connectedCallback() {
      // Inicializar EmailJS

      if (!window.emailjs) {
        console.error('EmailJS no está disponible.');
        return;
      }
      emailjs.init('b5Sb4bIWVJ4Mosu30');


      // Lógica para cerrar el modal al hacer clic en la "X"
      this.closeButton.addEventListener('click', () => this.close());
  
      // Lógica para cerrar el modal al hacer clic fuera de su contenido
      window.addEventListener('click', (e) => {
        if (e.target === this.modal) {
          this.close();
        }
      });
  
      // Lógica para enviar el correo
      this.shadowRoot.querySelector("#conctactForm").addEventListener('submit', (e) => {
        e.preventDefault();
        this.sendEmail(this)
      });
    }
  
    disconnectedCallback() {
      // Eliminar eventos al desconectar el componente
      this.closeButton.removeEventListener('click', this.close);
      window.removeEventListener('click', this.close);
      this.sendEmailBtn.removeEventListener('click', this.sendEmail);
    }
  
    open() {
      this.modal.style.display = 'block';
    }
  
    close() {
      this.modal.style.display = 'none';
    }
  

    

    sendEmail(form) {

      const userEmail = this.shadowRoot.querySelector('#userEmail').value;
      const company = this.shadowRoot.querySelector('#company').value;
      const message = this.shadowRoot.querySelector('#message').value;
      const subject = this.shadowRoot.querySelector('#subject').value;
      const userName = this.shadowRoot.querySelector('#userName').value;
  
      if (!userEmail || !company || !message || !subject || !userName) {
        alert('Por favor, completa todos los campos.');
        return;
      }
  
      // const mailtoLink = `mailto:alvaroniguezfernandez1@gmail.com?subject=Contacto de ${encodeURIComponent(
      //   company
      // )}&body=${encodeURIComponent(`Hola,\n\nMe llamo ${userEmail} y trabajo en ${company}.\n\n${message}`)}`;
      // window.location.href = mailtoLink;

      const serviceId = "service_xp7qj0s";
      const templateId = "template_267y1jb";
      const templateParams = {
        email: userEmail,
        subject: subject,
        name: userName,
        company: company,
        message: message,
      };
      
      emailjs.send(serviceId, templateId, templateParams).then(
        (response) =>{
          console.log("SUCCESS!", response.status, response.text);
          alert("SUCCESS!");
        },
        (error) =>{
          console.log("FAILED...", error);
          alert("FAILED...");
        }
      );

      // Cerrar el modal después de enviar
      this.close();
    }
  }
  
  
  // Registrar el Web Component
  customElements.define('conctact-modal', ModalConctact);