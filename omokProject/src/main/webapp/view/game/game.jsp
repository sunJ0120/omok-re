<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>OMOK</title>
  <link rel="stylesheet" href="game.css" />
  <link rel="stylesheet" href="profile/profile.css" />
  <link rel="stylesheet" href="chat/timer/timerstyle.css" />
  <link rel="stylesheet" href="chat/chatwindow/chatstyle.css" />
</head>
<body>
<!-- 바둑판 + 정보 패널 -->
<div class="container">
  <div class="board" id="board">
    <img id="board-image" src="../../img/omok_board.png" alt="omok board" />
  </div>
  <div class="info">
    <!-- 프로필 -->
    <div class="profile-content">
      <div class="player">
        <div class="card-bg"></div>
        <div class="player-card">
          <div class="profile-image1"></div>
          <div class="player-name">Player1</div>
        </div>
        <img src="../../img/black_stone.png" class="stone-image-black"  alt="흑돌"/>
      </div>

      <div class="vs-text">vs</div>

      <div class="player">
        <img src="../../img/white_stone.png" class="stone-image-white"  alt="백돌"/>
        <div class="card-bg"></div>
        <div class="player-card">
          <div class="profile-image2"></div>
          <div class="player-name">Player2</div>
        </div>
      </div>

    </div>

    <!-- 타이머 -->
    <div class="timer">
      <div class="timer">
        <div class="timer-bar decrease"></div>
      </div>
    </div>

    <!-- 채팅 -->
    <div class="chat-box">
      <div class="chat-top">채팅방</div>
      <div class="chat-mid"></div>
      <div class="chat-bottom">
        <input type="text" class="chat-input" placeholder="메시지를 입력해 주세요">
        <button class="send-btn">전송</button>
      </div>
    </div>
    <button class="exit-button">나가기</button>
  </div>
</div>
<!-- 나가기 버튼 (아래줄 오른쪽) -->
<%--<div class="exit-container">--%>
<%--  <button class="exit-button">나가기</button>--%>
<%--</div>--%>

<script src="board/board.js"></script>
<script src="chat/timer/timerscript.js"></script>
<script src="chat/chatwindow/chatscript.js"></script>
</body>
</html>
