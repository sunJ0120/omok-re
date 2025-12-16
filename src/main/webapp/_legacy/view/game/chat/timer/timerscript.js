const bar = document.querySelector('.timer-bar');

function restarttimer() { /* 타이머 리셋 */
    bar.classList.remove('decrease');
    void bar.offsetWidth;  // 강제 리플로우
    bar.classList.add('decrease');
}
bar.addEventListener('animationend', e => {
    if (e.animationName === 'decrease') {
        // 시간초과 처리 (턴 넘기기 or 패배)
        console.log('시간초과');
    }
});
// 페이지 로드 시 자동 시작
window.onload = restarttimer;