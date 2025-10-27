<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>매치 모달</title>
    <link rel="stylesheet" type="text/css" href="matchmodal.css">
</head>
<body>
<!-- 모달 오버레이 -->
<div id="modalOverlay" class="modal-overlay">
    <!-- 모달 박스 -->
    <div class="modal-content">
        <div class="match-image"></div>

        <div class="info-content">
            <div class="player">
                <div class="card-bg"></div>
                <div class="player-card">
                    <div class="profile-image1"></div>
                    <div class="player-name">Player1</div>
                    <div class="player-rate">승률 60 %</div>
                </div>
                <img src="../../../img/black_stone.png" class="stone-image-black"  alt="흑돌"/>
            </div>

            <div class="vs-text">vs</div>

            <div class="player">
                <img src="../../../img/white_stone.png" class="stone-image-white"  alt="백돌"/>
                <div class="card-bg"></div>
                <div class="player-card">
                    <div class="profile-image2"></div>
                    <div class="player-name">Player2</div>
                    <div class="player-rate">승률 80 %</div>
                </div>
            </div>

        </div>
    </div>
</div>

<!-- 모달 열기 버튼 (테스트용) -->
<div class="button-wrapper">
    <button onclick="openModal()">모달 열기</button>
</div>

<script>
    function openModal() {
        document.getElementById("modalOverlay").style.display = "flex";
    }

    function closeModal() {
        document.getElementById("modalOverlay").style.display = "none";
    }

    // 바깥 영역 클릭 시 닫기
    window.addEventListener("click", function(event) {
        const overlay = document.getElementById("modalOverlay");
        const modal = document.querySelector(".modal-content");

        // 오버레이 안을 클릭했지만, 모달 내부가 아닌 경우만 닫기
        if (event.target === overlay) {
            closeModal();
        }
    });
</script>
</body>
</html>
