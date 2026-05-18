document.addEventListener('DOMContentLoaded', function() {
  const playButtons = document.querySelectorAll('#playVideoBtn, .play-video-btn');
  
  playButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      // Find elements relative to the button if possible, or fall back to IDs
      const container = this.closest('.relative') || this.parentElement;
      const iframe = container.querySelector('iframe') || document.getElementById('videoFrame');
      const thumbnail = container.querySelector('img') || document.getElementById('videoThumbnail');

      if (iframe) {
        const videos = [
          'https://www.youtube.com/embed/D0UnqGm_miA',
          'https://www.youtube.com/embed/ScMzIvxBSi4',
          'https://www.youtube.com/embed/aqz-KE-bpKQ',
          'https://www.youtube.com/embed/9bZkp7q19f0',
          'https://www.youtube.com/embed/dQw4w9WgXcQ'
        ];
        const randomVideo = videos[Math.floor(Math.random() * videos.length)] + '?autoplay=1';

        // Set secure attributes for the iframe
        iframe.setAttribute('src', randomVideo);
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
        iframe.setAttribute('allowfullscreen', 'true');
        
        iframe.classList.remove('hidden');
        iframe.style.display = 'block';
      }

      if (thumbnail) {
        thumbnail.classList.add('hidden');
        thumbnail.style.display = 'none';
      }
      
      this.classList.add('hidden');
      this.style.display = 'none';
    });
  });
});
