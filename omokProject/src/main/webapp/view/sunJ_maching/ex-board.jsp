<%--우리 게임 하는 화면은 WEB-INF에 넣을 경우, 여기 링킹하는거 수정해야 한다!!!! (Controller에서 하는거로.... 그래서 시간 없으면 그냥 빼둬도 괜찮다.)--%>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>OMOK</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/view/game/board/board.css"/>
    <%--매칭 모달 스타일 추가--%>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/view/modal/match/matchmodal.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/view/game/chat/chatwindow/chatstyle.css"/>
</head>
<body>

<%--여기에 매칭 모달 추가--%>
<!-- 모달 오버레이 -->
<div id="modalOverlay" class="modal-overlay" style="display:none;">
    <!-- 모달 박스 -->
    <div class="modal-content">
        <div class="match-image"></div>

        <div class="info-content">
            <!-- Player 1 -->
            <div class="player">
                <div class="card-bg"></div>
                <div class="player-card">
                    <div class="profile-image1" id="profile1"></div>
                    <div class="player-name" id="name1"></div>
                    <div class="player-rate" id="rate1"></div>
                </div>
                <img id="stone1" src="${pageContext.request.contextPath}/img/black_stone.png" class="stone-image-black" alt="흑돌"/>
            </div>

            <div class="vs-text">vs</div>

            <!-- Player 2 -->
            <div class="player" id="player2-wrapper">
                <img id="stone2" src="${pageContext.request.contextPath}/img/white_stone.png" class="stone-image-white" alt="백돌"/>
                <div class="card-bg"></div>
                <div class="player-card">
                    <div class="profile-image2" id="profile2"></div>
                    <div class="player-name" id="name2"></div>
                    <div class="player-rate" id="rate2"></div>
                </div>
            </div>
        </div>
    </div>
</div>
<%--매칭 모달 추가 끝--%>

<div class="container">
    <div class="board" id="board">
        <img id="board-image" src="${pageContext.request.contextPath}/img/omok_board.png" alt="omok board" />
    </div>
    <div class="info">
        <div class="profile">
            profile
        </div>
        <div class="chat">
            <div class="chat-box">
                <div class="chat-top">채팅방</div>
                <div class="chat-mid"></div>
                <div class="chat-bottom">
                    <input type="text" class="chat-input" placeholder="메시지를 입력해 주세요">
                    <button class="send-btn">전송</button>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="board.js"></script>

<%--여기에 웹소켓 + 매칭 관련 스크립트 추가--%>
<script type="module" src="${pageContext.request.contextPath}/view/sunJ_maching/js/match/modal-ui.js"></script>
<script type="module" src="${pageContext.request.contextPath}/view/sunJ_maching/js/websocket.js"></script>
<script type="module" src="${pageContext.request.contextPath}/view/sunJ_maching/js/match/match-init.js"></script>

</body>
</html>