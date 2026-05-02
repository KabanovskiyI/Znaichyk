function selectAnswer(skill, level, nextSlideIndex) {
    document.getElementById('input_' + skill).value = level;

    const currentSlide = document.querySelector('.question-slide.active');
    if (currentSlide) {
        currentSlide.classList.remove('active');
    }

    if (nextSlideIndex === 'submit') {
        document.querySelector('.auth-card h1').style.display = 'none';
        document.querySelector('.auth-subtitle').style.display = 'none';
        document.getElementById('final-step').style.display = 'block';
        document.getElementById('test-form').submit();
    } else {
        document.getElementById('slide-' + nextSlideIndex).classList.add('active');
    }
}
