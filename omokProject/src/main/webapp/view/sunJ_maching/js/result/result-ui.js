// 모달 열기 / 닫기
export function openModal() {
    document.getElementById("resultModal").style.display = "flex";
}
export function hideModal() {
    document.getElementById("resultModal").style.display = "none";
}
// 플레이어 정보 바인딩 유틸
// 내 입장, 상대방 입장에 따라 누가 you인지 다르기 때문이다.
export function renderPlayer(role, info) {
    const nameId = role === "you" ? "name1" : "name2";
    const rateId = role === "you" ? "rate1" : "rate2";
    const imgId = role === "you" ? "profile1" : "profile2";

    document.getElementById(nameId).textContent = info.id;
    document.getElementById(rateId).textContent = `승률 ${info.rate} %`;
    document.getElementById(imgId).style.backgroundImage =
        `url('../../img/profile/${info.img}.png')`;
}

export function calculate(){
    const modal = document.querySelector('#modal');
    const closeModal = document.querySelector('#go_main_btn');
    closeModal.addEventListener("click", ()=>{
        modal.style.display="none";
    });
}
//돌 색상 정하는 용도
// export function setStones(youId, player1Id) {
//     const isYouPlayer1 = youId === player1Id;q
//
//     const blackStone = document.querySelector(".stone-image-black");
//     const whiteStone = document.querySelector(".stone-image-white");
//
//     if (isYouPlayer1) {
//         // 내가 player1 → 나는 흑돌
//         blackStone.src = "../../img/black_stone.png";
//         whiteStone.src = "../../img/white_stone.png";
//     } else {
//         // 내가 player2 → 나는 백돌
//         blackStone.src = "../../img/white_stone.png";
//         whiteStone.src = "../../img/black_stone.png";
//     }
// }