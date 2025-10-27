document.addEventListener("DOMContentLoaded", () => {
    const button = document.querySelector(".avatar-random-btn");
    const profileImg = document.querySelector("#profile");
    const profileInput = document.querySelector("#profileNumber");

    button.addEventListener("click", () => {
        const randomNum = Math.floor(Math.random() * 5) + 1; // 1부터 6까지
        profileImg.src = `../../img/profile/${randomNum}.png`;
        profileInput.value = randomNum;
    });
});
