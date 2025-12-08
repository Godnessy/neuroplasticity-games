const MemeReward = {
    apiUrl: 'https://api.apileague.com/retrieve-random-meme',
    apiKey: null,
    maxRetries: 3,
    
    init() {
        this.apiKey = window.MEME_API_KEY || null;
        this.createOverlay();
    },

    createOverlay() {
        if (document.getElementById('meme-overlay')) return;
        
        const overlay = document.createElement('div');
        overlay.id = 'meme-overlay';
        overlay.className = 'meme-overlay';
        overlay.innerHTML = `
            <div class="meme-content">
                <button class="meme-close" id="meme-close" aria-label="Close">&times;</button>
                <div class="meme-image-container">
                    <img id="meme-image" src="" alt="Reward meme" />
                </div>
                <p class="meme-description" id="meme-description"></p>
            </div>
        `;
        document.body.appendChild(overlay);
        
        document.getElementById('meme-close').addEventListener('click', () => {
            this.hide();
            if (typeof App !== 'undefined' && App.nextQuestion) {
                App.nextQuestion();
            }
        });
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.hide();
                if (typeof App !== 'undefined' && App.nextQuestion) {
                    App.nextQuestion();
                }
            }
        });
    },

    async fetchMeme(retryCount = 0) {
        return null;
    },

    async show() {
        const meme = await this.fetchMeme();
        
        if (!meme || !meme.url) {
            return false;
        }
        
        const overlay = document.getElementById('meme-overlay');
        const image = document.getElementById('meme-image');
        const description = document.getElementById('meme-description');
        
        image.src = meme.url;
        description.textContent = meme.description;
        
        overlay.classList.add('active');
        
        return true;
    },

    hide() {
        const overlay = document.getElementById('meme-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }
};

