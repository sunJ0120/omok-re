import {openWebSocket} from "../websocket.js";

//안정적인 export를 위해 객체로 감싸기
export const cache = {
    youCache: null,
    opponentCache: null
};

function showWaitingState() {
    document.getElementById('card-bg2').classList.add('hidden');
    document.getElementById('stone2').classList.add('hidden');
    document.getElementById('loading2').classList.remove('hidden');   // 로딩 아이콘 보이기
    document.getElementById('profile2').classList.add('hidden');
    document.getElementById('name2').classList.add('hidden');
    document.getElementById('rate2').classList.add('hidden');
}

export function showPlayer2Info(opponent, player1, you) {
    document.getElementById('card-bg2').classList.remove('hidden');
    document.getElementById('stone2').classList.remove('hidden');
    document.getElementById('loading2').classList.add('hidden');      // 로딩 아이콘 숨기기
    document.getElementById('profile2').classList.remove('hidden');
    document.getElementById('name2').classList.remove('hidden');
    document.getElementById('rate2').classList.remove('hidden');

    // const opponent = cache.opponentCache;
    console.log("🔍 opponentCache in showPlayer2Info:", opponent);

    //상대방이 player1이라면, player2는 you가 된다. you로 그려야 한다.
    if(player1 === opponent.id){
        if (you.id) {
            console.log("you.id 있나 확인!!!", you.id);
            // 'profile-player-name' 클래스를 가진 모든 요소를 HTMLCollection으로 반환
            const nameEls = document.getElementsByClassName('profile-player-name');

            // 첫 번째 요소(플레이어1)와 두 번째 요소(플레이어2)로 접근
            if (nameEls.length >= 2 && you.id) {
                // 0번이 player1, 1번이 player2
                nameEls[1].textContent = you.id;
            }
        } else {
            console.warn("⛔ id 데이터가 불완전합니다.");
        }
        if (you.img) {
            console.log("⭐⭐ 이미지 정보 잘 날라오나 찾기 : ", you.img);
            // document.getElementsByClassName('game-profile-image2').style.backgroundImage =
            //     `url('${contextPath}/img/profile/${opponent.img}.png')`;
            const el = document.querySelector('.game-profile-image2');
            if (el) {
                el.style.backgroundImage =
                    `url('${contextPath}/img/profile/${you.img}.png')`;
            }
        } else {
            console.log("you.image 값:", JSON.stringify(you.img));
            console.warn("⛔ img 데이터가 불완전합니다.");
        }
    }else{
        if (opponent.id) {
            console.log("opponent.id 있나 확인!!!", opponent.id);
            // 'profile-player-name' 클래스를 가진 모든 요소를 HTMLCollection으로 반환
            const nameEls = document.getElementsByClassName('profile-player-name');

            // 첫 번째 요소(플레이어1)와 두 번째 요소(플레이어2)로 접근
            if (nameEls.length >= 2 && opponent.id) {
                // 0번이 player1, 1번이 player2
                nameEls[1].textContent = opponent.id;
            }
        } else {
            console.warn("⛔ id 데이터가 불완전합니다.");
        }
        if (opponent.img) {
            console.log("⭐⭐ 이미지 정보 잘 날라오나 찾기 : ", opponent.img);
            // document.getElementsByClassName('game-profile-image2').style.backgroundImage =
            //     `url('${contextPath}/img/profile/${opponent.img}.png')`;
            const el = document.querySelector('.game-profile-image2');
            if (el) {
                el.style.backgroundImage =
                    `url('${contextPath}/img/profile/${opponent.img}.png')`;
            }
        } else {
            console.log("opponent.image 값:", JSON.stringify(opponent.img));
            console.warn("⛔ img 데이터가 불완전합니다.");
        }
    }


    // if(opponent.id && opponent.image) {
    //     document.getElementById('name2').textContent = opponent.id;
    //     document.getElementById('profile2').style.backgroundImage =
    //         `url('${contextPath}/img/profile/${opponent.image}.png')`;
    // } else {
    //     console.warn("⛔ opponent 데이터가 불완전합니다.");
    // }
}

// AJAX로 초기 상태 확인
window.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get("gameId");

    if (!gameId) {
        alert("gameId 없음!");
        return;
    }

    // gameId를 서버에 넘겨서 상태 확인
    // 앞에서 받을 경우, 파라미터에 지저분하게 남겨야 해서 두 번 받기로 함.
    fetch("/omok/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId })
    })
        .then(res => res.json())
        .then(data => {
            const status = data.game.status;

            // 유저 정보 저장, 이건 왜 넣는거징. 일단 넣어보자.
            cache.youCache = data.you;
            cache.opponentCache = data.opponent || null;

            // openWebSocket(gameId); // 소켓 연결

            if (status === "WAITING") {
                console.log("상대방을 기다리는 중..."); //콘솔로 확인만 한다.
                showWaitingState(); // waiting 상태 UI 설정
            } else if (status === "MATCHED") {
                console.log("상대방과 매칭되었습니다.");
                showPlayer2Info(); // matched 상태 UI 설정
            }

            openWebSocket(gameId); // 소켓 연결
        });
});

function startGame() {
    console.log("게임 시작!");
}