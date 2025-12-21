/* v=v=v=v=v=v=v=v=v=v=v=v=v=v=v=v=v=v=v=v=v=v=v=v=v= */
/* VUE FETCH   VUE FETCH   VUE FETCH   VUE FETCH      */
/* v=v=v=v=v=v=v=v=v=v=v=v=v=v=v=v=v=v=v=v=v=v=v=v=v= */

const appli = Vue.createApp({
    data() {
        return {
            projets: [],  // array vide qui sera rempli avec les projets dans le fetch
            idProjet: null, // index du projet à afficher
            etat: "loading"  // état du fetch (définit à loading au chargement), relié à un <p> dans le html pour accessib.
        };
    },
    computed: {
        projetActuel() {
            return this.projets[this.idProjet];  // assigne à l'array l'id du projet
        }
    },
    mounted() {
        console.log("L'app Vue a été créée et montée au DOM (mounted) !"); 
        let wrapper = document.querySelector('.projet-wrapper'); // sélectionne la section
        this.idProjet = parseInt(wrapper.dataset.index) // récupère l'index (=0) du data set dans le .projet-wrapper et l'applique à idProjet
        fetch('../assets/projects.json')
            .then(response => response.json())
            .then(data => {
                this.projets = data.projets;  // récupère les données json des projets et les mets dans l'array
                this.etat = "loaded"; // change l'état quand fetch réussi
            })
            .catch(error => {
                console.error(error); // log l'erreur dans la console
                this.etat = "error";  // fetch échoué
            });
    }
});

const vm = appli.mount('.projet-wrapper');

/* ^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^= */
/* VUE FETCH   VUE FETCH   VUE FETCH   VUE FETCH      */
/* ^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^= */

/* v=v=v=v=v=v=v=v=v=v=v=v=v=v=v=v=v=v=v=v=v=v=v=v=v= */
/* VUE GALERIE   VUE GALERIE   VUE GALERIE            */
/* v=v=v=v=v=v=v=v=v=v=v=v=v=v=v=v=v=v=v=v=v=v=v=v=v= */

const appli2 = Vue.createApp({
    data() {
        return {
            image: null, // image qui sera sélectionnée
            images: [], // liste de toutes les images
            currentIndex: -1 // index de l'image actuelle
        };
    },
    mounted() {
        // recup lesi mg
        const imgElements = document.querySelectorAll('.galerie-wrapper img[loading="lazy"], .processus-container img');
        this.images = Array.from(imgElements).map(img => img.src);
        
        // navig clavier
        document.addEventListener('keydown', (e) => {
            if (this.image) {
                if (e.key === 'ArrowLeft') this.prevImage();
                if (e.key === 'ArrowRight') this.nextImage();
                if (e.key === 'Escape') this.closeOverlay();
            }
        });
    },
    methods: {
        selectImg(imgSrc, clickedElement) { // méthode lors du clic
            const allImages = document.querySelectorAll('.galerie-wrapper img[loading="lazy"], .processus-container img');
            this.currentIndex = Array.from(allImages).findIndex(img => img.src === clickedElement.src);
            this.image = clickedElement.src; // récupère la source de l'image cliquée
        },
        closeOverlay() {
            this.image = null; // pour fermer l'overlay
            this.currentIndex = -1;
        },
        prevImage() {
            if (this.currentIndex > 0) {
                this.currentIndex--;
                this.image = this.images[this.currentIndex];
            }
        },
        nextImage() {
            if (this.currentIndex < this.images.length - 1) {
                this.currentIndex++;
                this.image = this.images[this.currentIndex];
            }
        }
    }
});

const vm2 = appli2.mount('.galerie-wrapper');

/* ^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^= */
/* VUE GALERIE   VUE GALERIE   VUE GALERIE            */
/* ^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^= */