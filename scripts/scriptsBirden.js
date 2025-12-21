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
            currentIndex: -1, // index de l'image actuelle
            scale: 1, // niveau de zoom
            translateX: 0,
            translateY: 0,
            isDragging: false, // état du drag
            startX: 0, // pos de début de drag
            startY: 0,
            zoomEnabled: true // pour désactiver sur mobile
        };
    },
    mounted() {
        // Désactive zoom sur mobile
        this.zoomEnabled = window.innerWidth > 750;
        
        // recup img + poster des video
        const imgElements = document.querySelectorAll('.galerie-wrapper img[loading="lazy"], .processus-container img');
        const videoElements = document.querySelectorAll('.galerie-wrapper video[poster], .processus-container video[poster]');
        // combine les 2
        const allMedia = [
            ...Array.from(imgElements).map(img => ({ element: img, src: img.src })),
            ...Array.from(videoElements).map(video => ({ element: video, src: video.poster }))
        ];
        
        this.images = allMedia.map(item => item.src);
        
        // navig clavier
        document.addEventListener('keydown', (e) => {
            if (this.image) {
                if (e.key === 'ArrowLeft') this.prevImage();
                if (e.key === 'ArrowRight') this.nextImage();
                if (e.key === 'Escape') this.closeOverlay();
            }
        });
        
        // drag sur document (seulement si zoom activé)
        if (this.zoomEnabled) {
            document.addEventListener('mousemove', this.onDrag);
            document.addEventListener('mouseup', this.stopDrag);
        }
    },
    methods: {
        selectImg(imgSrc, clickedElement) { // méthode clic
            // si video get le poster
            if (clickedElement.tagName === 'VIDEO') {
                imgSrc = clickedElement.poster;
            }
            
            // trouve l'index dans l'array
            this.currentIndex = this.images.indexOf(imgSrc);
            this.image = imgSrc; // recup src
            this.resetZoom();
        },
        closeOverlay() {
            this.image = null; // pour fermer l'overlay
            this.currentIndex = -1;
            this.resetZoom();
        },
        prevImage() {
            if (this.currentIndex > 0) {
                this.currentIndex--;
                this.image = this.images[this.currentIndex];
                this.resetZoom();
            }
        },
        nextImage() {
            if (this.currentIndex < this.images.length - 1) {
                this.currentIndex++;
                this.image = this.images[this.currentIndex];
                this.resetZoom();
            }
        },
        // === SYSTÈME DE ZOOM ===
        resetZoom() {
            this.scale = 1;
            this.translateX = 0;
            this.translateY = 0;
            this.isDragging = false;
        },
        handleDoubleClick(e) {
            if (!this.zoomEnabled) return; // désactivé sur mobile
            
            // double clic = 2x / reset
            if (this.scale === 1) {
                this.scale = 2;
            } else {
                this.resetZoom();
            }
        },
        handleWheel(e) {
            if (!this.zoomEnabled) return; // désactivé sur mobile
            
            e.preventDefault();
            // molette progressif
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            this.scale = Math.min(Math.max(1, this.scale + delta), 4); // limite entre 1x et 4x
            
            // reset pos si 1x
            if (this.scale === 1) {
                this.translateX = 0;
                this.translateY = 0;
            }
        },
        startDrag(e) {
            if (!this.zoomEnabled || this.scale <= 1) return;
            
            e.preventDefault(); // CRUCIAL : empêche le drag natif
            this.isDragging = true;
            this.startX = e.clientX - this.translateX;
            this.startY = e.clientY - this.translateY;
        },
        onDrag(e) {
            if (this.isDragging) {
                e.preventDefault();
                this.translateX = e.clientX - this.startX;
                this.translateY = e.clientY - this.startY;
            }
        },
        stopDrag() {
            this.isDragging = false;
        },
        getImageStyle() {
            return {
                transform: `scale(${this.scale}) translate(${this.translateX / this.scale}px, ${this.translateY / this.scale}px)`,
                cursor: this.scale > 1 ? (this.isDragging ? 'grabbing' : 'grab') : 'default',
                transition: this.isDragging ? 'none' : 'transform 0.2s ease'
            };
        }
    }
});

const vm2 = appli2.mount('.galerie-wrapper');

/* ^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^= */
/* VUE GALERIE   VUE GALERIE   VUE GALERIE            */
/* ^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^= */