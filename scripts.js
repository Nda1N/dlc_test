const loadingCircle = document.getElementById('loadingCircle');
const videoPopup = document.getElementById('videoPopup');
const popupVideo = document.getElementById('popupVideo');
const closeButton = document.getElementById('closeButton');
const tapHint = document.getElementById('tapHint');
const markerStatus = document.getElementById('markerStatus');

// 動画のパス
const videoPaths = {
    city1: ['human_tb.mov', 'human_t.mov'],
    city2: ['dog_tb.mov', 'dog_t.mov'],
    city3: ['cat_tb.mov', 'cat_t.mov'],
    city4: ['crow_tb.mov', 'crow_t.mov'],
    grass1: ['giraffe_tb.mov', 'giraffe_t.mov'],
    grass2: ['meerkat_tb.mov', 'meerkat_t.mov'],
    grass3: ['horse_tb.mov', 'horse_t.mov'],
    grass4: ['kangaroo_tb.mov', 'kangaroo_t.mov'],
    jungle1: ['gibbon_tb.mov', 'gibbon_t.mov'],
    jungle2: ['bear_tb.mov', 'bear_t.mov'],
    jungle3: ['ezorisu_tb.mov', 'ezorisu_t.mov'],
    jungle4: ['deer_tb.mov', 'deer_t.mov'],
    ocean1: ['penguin_tb.mov', 'penguin_t.mov'],
    ocean2: ['seal_tb.mov', 'seal_t.mov'],
    ocean3: ['seaotter_tb.mov', 'seaotter_t.mov'],
    ocean4: ['seaturtle_tb.mov', 'seaturtle_t.mov']
};

// マーカーごとの現在の動画インデックスを管理
const markerVideoIndexes = {};

// 動画を事前に読み込む
const preloadVideos = () => {
    Object.keys(videoPaths).forEach(markerId => {
        markerVideoIndexes[markerId] = 0; // 各マーカーごとに初期化
        videoPaths[markerId].forEach(path => {
            const video = document.createElement('video');
            video.src = path;
            video.preload = 'auto';
            video.muted = true;
            video.load();
        });
    });
};

// UIヒントを表示
function showTapHint() {
    tapHint.style.display = 'block';
    tapHint.classList.add('show');
}

// 動画を再生する関数
function showPopupVideo(markerId) {
    if (!videoPaths[markerId]) return;

    isPlaying = true;
    let currentVideoIndex = markerVideoIndexes[markerId];
    const video = popupVideo;

    function playVideo(index) {
        video.src = videoPaths[markerId][index];
        video.load();
        video.loop = true;

        video.play().catch(() => {
            console.warn("自動再生に失敗しました。タップしてください。");
            showTapHint();
        });
    }

    loadingCircle.style.display = 'block';
    videoPopup.style.display = 'none';

    video.oncanplaythrough = () => {
        loadingCircle.style.display = 'none';
        videoPopup.style.display = 'block';
        video.play();
    };

    video.onerror = () => {
        console.error("動画読み込み失敗: " + video.src);
        setTimeout(() => {
            video.load();
            video.play().catch(err => console.error("再生エラー:", err));
        }, 1000);
    };

    playVideo(currentVideoIndex);

    video.addEventListener('click', () => {
        currentVideoIndex = (currentVideoIndex + 1) % videoPaths[markerId].length;
        markerVideoIndexes[markerId] = currentVideoIndex;
        playVideo(currentVideoIndex);
    });

    closeButton.addEventListener('click', () => {
        video.pause();
        video.currentTime = 0;
        videoPopup.style.display = 'none';
        isPlaying = false;
    });
}

// マーカーイベントを処理
document.querySelectorAll('a-marker').forEach(marker => {
    marker.addEventListener('markerFound', () => {
        if (isPlaying) return;

        const markerId = marker.id;
        if (videoPaths[markerId]) {
            setTimeout(() => {
                showPopupVideo(markerId);
            }, 1000);
        }
    });
});

// ページロード時に動画を事前ロード
window.addEventListener('load', () => {
    preloadVideos();
});
