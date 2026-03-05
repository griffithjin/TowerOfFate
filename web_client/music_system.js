/**
 * 命运塔·首登者 - 背景音乐系统
 * Background Music System
 */

class GameMusic {
    constructor() {
        this.bgMusic = null;
        this.isPlaying = false;
        this.volume = 0.5;
        this.currentTrack = 0;
        
        // 音乐列表
        this.tracks = [
            {
                name: 'The Campfire',
                artist: 'Peder B. Helland',
                url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // 占位符，需要替换为真实音乐
                mood: 'peaceful'
            },
            {
                name: 'Waves That Sound Like You',
                artist: 'BigRicePiano',
                url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
                mood: 'emotional'
            },
            {
                name: '命运之塔主题',
                artist: '原创',
                url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
                mood: 'epic'
            }
        ];
        
        this.init();
    }
    
    init() {
        // 创建音频元素
        this.bgMusic = new Audio();
        this.bgMusic.loop = true;
        this.bgMusic.volume = this.volume;
        
        // 检查本地存储的设置
        const savedVolume = localStorage.getItem('gameMusicVolume');
        if (savedVolume !== null) {
            this.volume = parseFloat(savedVolume);
            this.bgMusic.volume = this.volume;
        }
        
        const savedTrack = localStorage.getItem('gameMusicTrack');
        if (savedTrack !== null) {
            this.currentTrack = parseInt(savedTrack);
        }
        
        // 设置音乐源
        this.loadTrack(this.currentTrack);
        
        // 创建音乐控制UI
        this.createMusicControl();
        
        // 尝试自动播放（需要用户交互）
        this.setupAutoplay();
    }
    
    loadTrack(index) {
        if (index >= 0 && index < this.tracks.length) {
            this.currentTrack = index;
            this.bgMusic.src = this.tracks[index].url;
            localStorage.setItem('gameMusicTrack', index);
        }
    }
    
    play() {
        if (this.bgMusic.paused) {
            this.bgMusic.play().then(() => {
                this.isPlaying = true;
                this.updateControlUI();
            }).catch(e => {
                console.log('音乐播放需要用户交互');
                this.showPlayPrompt();
            });
        }
    }
    
    pause() {
        this.bgMusic.pause();
        this.isPlaying = false;
        this.updateControlUI();
    }
    
    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    nextTrack() {
        const next = (this.currentTrack + 1) % this.tracks.length;
        this.loadTrack(next);
        if (this.isPlaying) {
            this.play();
        }
    }
    
    prevTrack() {
        const prev = (this.currentTrack - 1 + this.tracks.length) % this.tracks.length;
        this.loadTrack(prev);
        if (this.isPlaying) {
            this.play();
        }
    }
    
    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
        this.bgMusic.volume = this.volume;
        localStorage.setItem('gameMusicVolume', this.volume);
        this.updateVolumeUI();
    }
    
    setupAutoplay() {
        // 监听页面首次点击，尝试播放音乐
        const tryPlay = () => {
            if (!this.isPlaying) {
                this.play();
            }
            document.removeEventListener('click', tryPlay);
            document.removeEventListener('touchstart', tryPlay);
        };
        
        document.addEventListener('click', tryPlay);
        document.addEventListener('touchstart', tryPlay);
    }
    
    showPlayPrompt() {
        // 创建提示
        const prompt = document.createElement('div');
        prompt.id = 'musicPrompt';
        prompt.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: linear-gradient(135deg, rgba(255,215,0,0.9), rgba(255,107,107,0.9));
            color: #000;
            padding: 15px 20px;
            border-radius: 10px;
            font-size: 14px;
            font-weight: bold;
            z-index: 10001;
            animation: slideIn 0.5s ease-out;
            cursor: pointer;
            box-shadow: 0 5px 20px rgba(255,215,0,0.4);
        `;
        prompt.innerHTML = '🎵 点击开启背景音乐';
        prompt.onclick = () => {
            this.play();
            prompt.remove();
        };
        
        document.body.appendChild(prompt);
        
        // 5秒后自动消失
        setTimeout(() => {
            if (prompt.parentNode) {
                prompt.style.animation = 'slideOut 0.5s ease-out';
                setTimeout(() => prompt.remove(), 500);
            }
        }, 5000);
    }
    
    createMusicControl() {
        const control = document.createElement('div');
        control.id = 'musicControl';
        control.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0,0,0,0.8);
            border: 2px solid rgba(255,215,0,0.3);
            border-radius: 30px;
            padding: 10px 15px;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 10000;
            transition: all 0.3s;
        `;
        control.innerHTML = `
            <button id="musicToggle" style="
                width: 36px; height: 36px; border-radius: 50%;
                background: linear-gradient(135deg, #ffd700, #ff6b6b);
                border: none; cursor: pointer; font-size: 16px;
                display: flex; align-items: center; justify-content: center;
            ">🎵</button>
            
            <div id="musicInfo" style="
                color: #fff; font-size: 12px; max-width: 120px;
                overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
            ">
                🎵 背景音乐
            </div>
            
            <input type="range" id="musicVolume" min="0" max="100" value="${this.volume * 100}"
                style="width: 60px; height: 4px; -webkit-appearance: none; background: rgba(255,255,255,0.3); border-radius: 2px;"
            >
        `;
        
        document.body.appendChild(control);
        
        // 绑定事件
        document.getElementById('musicToggle').onclick = () => this.toggle();
        document.getElementById('musicVolume').oninput = (e) => {
            this.setVolume(e.target.value / 100);
        };
        
        // 添加CSS动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100px); opacity: 0; }
            }
            #musicVolume::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 12px; height: 12px;
                background: #ffd700;
                border-radius: 50%;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);
    }
    
    updateControlUI() {
        const toggle = document.getElementById('musicToggle');
        const info = document.getElementById('musicInfo');
        if (toggle && info) {
            toggle.textContent = this.isPlaying ? '🔊' : '🔇';
            info.textContent = this.isPlaying 
                ? `🎵 ${this.tracks[this.currentTrack].name}`
                : '🎵 背景音乐';
        }
    }
    
    updateVolumeUI() {
        const volumeSlider = document.getElementById('musicVolume');
        if (volumeSlider) {
            volumeSlider.value = this.volume * 100;
        }
    }
}

// 全局音乐实例
let gameMusic;

// 页面加载完成后初始化音乐
document.addEventListener('DOMContentLoaded', () => {
    gameMusic = new GameMusic();
});

// 导出供其他脚本使用
window.GameMusic = GameMusic;
window.getGameMusic = () => gameMusic;
