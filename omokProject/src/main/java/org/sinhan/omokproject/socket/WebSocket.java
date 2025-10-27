package org.sinhan.omokproject.socket;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import lombok.extern.log4j.Log4j2;
import org.sinhan.omokproject.domain.GameVO;
import org.sinhan.omokproject.domain.UserVO;
import org.sinhan.omokproject.repository.sunJMatchingDAO.GameDAO;
import org.sinhan.omokproject.repository.sunJMatchingDAO.UserDAO;
import org.sinhan.omokproject.util.JsonBuilderUtil;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;



@Log4j2
@ServerEndpoint(value = "/min-value")
public class WebSocket {
    // gameId → 세션들
    // Set<Session>가 해당 게임방에 들어온 유저들이다.
    private static final Map<Integer, Set<Session>> gameRoomMap = new ConcurrentHashMap<>();
    // 세션 → gameId
    private static final Map<Session, Integer> sessionRoomMap = new ConcurrentHashMap<>();

    private Session session;
    private int gameId;
    private String userId;

    // 소켓의 onOpen은 클라이언트가 연결될때 호출되는 것으로, 이 부분은 무조건 매칭만 사용한다.
    @OnOpen
    public void onOpen(Session session) throws IOException {
        // 쿼리 스트링에서 gameId 파싱 (예: ?gameId=3)
        this.session = session;

        String query = session.getQueryString();
        this.gameId = Integer.parseInt(query.split("=")[1]);
        // 방에 세션 추가
        gameRoomMap.computeIfAbsent(gameId, k -> ConcurrentHashMap.newKeySet()).add(session);
        sessionRoomMap.put(session, gameId);

        Set<Session> sessions = gameRoomMap.get(gameId);
        System.out.println("[WebSocket] 연결됨 - gameId: " + gameId + ", 현재 인원: " + sessions.size());

        if (sessions.size() == 1) {
            JsonObject response = new JsonObject();
            response.addProperty("status", "WAITING");
            session.getBasicRemote().sendText(response.toString());
        } else if (sessions.size() == 2) {
            // 바로 MATCHED 브로드캐스트
            sendMatchedMessageToBoth(gameId, sessions);
        }
    }

    //match는 Onopen에서 이미 브로드 캐스트를 하고 있기 때문에 여기를 작성할 필요가 없다.
    //여기는 채팅이랑 오목만 분리하면 된다.
    @OnMessage
    public void onMessage(String message, Session session) throws IOException {
        Integer gameId = sessionRoomMap.get(session);
        if (gameId == null) return;

        Set<Session> sessions = gameRoomMap.get(gameId);
        if (sessions == null) return;

        JsonObject receivedJson = JsonParser.parseString(message).getAsJsonObject();
        String type = receivedJson.get("type").getAsString();

        log.info("type log : {}", type);

        switch (type) {
            //채팅 메세지를 어떻게 처리할지를 고민한다.
            case "chat":
                handleChatMessage(receivedJson, sessions);
                break;
            //오목돌 이동을 어떻게 처리할지를 고민한다.
            case "move":
                handleMoveMessage(receivedJson, sessions);
                break;
            case "gameover":
                handleGameoverMessage(receivedJson, sessions);
                break;
            default:
                log.warn("알 수 없는 type 수신됨: {}", type);
        }
    }

    // 소켓 실시간 양방향 매칭 - 구현 완료
    private void sendMatchedMessageToBoth(int gameId, Set<Session> sessions) throws IOException {
        GameDAO gameDAO = GameDAO.INSTANCE;
        UserDAO userDAO = UserDAO.INSTANCE;

        GameVO game = gameDAO.getGameById(gameId);
        game.setStatus(GameVO.GameStatus.PLAYING);
        gameDAO.updateGame(game);

        UserVO player1 = userDAO.findUserById(game.getPlayer1());
        UserVO player2 = userDAO.findUserById(game.getPlayer2());

        for (Session s : sessions) {
            if (!s.isOpen()) continue;

            String userId = (sessionRoomMap.get(s) == gameId && s == sessions.toArray()[0])
                    ? player1.getUserId() : player2.getUserId();

            UserVO you = userId.equals(player1.getUserId()) ? player1 : player2;
            UserVO opponent = userId.equals(player1.getUserId()) ? player2 : player1;

            JsonObject youJson = JsonBuilderUtil.getUserInfo(you);
            JsonObject opponentJson = JsonBuilderUtil.getUserInfo(opponent);

            JsonObject response = new JsonObject();
            response.addProperty("status", "MATCHED");
            response.add("you", youJson);
            response.add("opponent", opponentJson);

            //양쪽에 보낼때 이 정보를 보낸다.
            response.addProperty("player1", game.getPlayer1()); // ✅ 이 줄 추가!

            s.getBasicRemote().sendText(response.toString());
        }
    }

    //채팅 브로드캐스트
    //세창님께서 구현하신 @OnMessage 메서드에서 채팅 메시지를 처리하는 부분을 그대로 붙였습니다.
    private void handleChatMessage(JsonObject receivedJson, Set<Session> sessions) throws IOException {
        // 보낸 사람 ID → 세션에서 가져올 수도 있고, 메시지에 같이 보낼 수도 있음
        String senderId = receivedJson.get("senderId").getAsString();

        String text = receivedJson.get("message").getAsString();
        // JSON 문자열 이스케이프 (안정성 보완)
        String escaped = text
                .replaceAll("\\\\", "\\\\\\\\")
                .replaceAll("\"", "\\\\\"")
                .replaceAll("\n", "\\\\n");

        // JSON 형태로 재구성
        String payload = String.format(
                "{\"type\":\"chat\", \"senderId\":\"%s\", \"text\":\"%s\"}",
                senderId, escaped
        );

        synchronized (sessions) {
            for (Session s : sessions) {
                if (s.isOpen()) {
                    s.getBasicRemote().sendText(payload);
                }
            }
        }
    }

    //오목 이동 브로드캐스트
    //미완.... 개발하고 여기에 붙여야 한다.
    private void handleMoveMessage(JsonObject receivedJson, Set<Session> sessions) throws IOException {
        int x = receivedJson.get("x").getAsInt();
        int y = receivedJson.get("y").getAsInt();
        String userId = receivedJson.get("userId").getAsString();// 오목 돌 놓기 정보 브로드캐스트
        JsonObject response = new JsonObject();
        response.addProperty("type", "move");
        response.addProperty("x", x);
        response.addProperty("y", y);
        response.addProperty("userId", userId);

        synchronized (sessions) {
            for (Session s : sessions) {
                if (s.isOpen()) s.getBasicRemote().sendText(response.toString());
            }
        }
    }



    private void handleGameoverMessage(JsonObject receivedJson, Set<Session> sessions) throws IOException {
        String userId = receivedJson.get("userId").getAsString();

        JsonObject response = new JsonObject();
        response.addProperty("type", "gameover");
        response.addProperty("winnerId", userId);

        for (Session s : sessions) {
            if (s.isOpen()) s.getBasicRemote().sendText(response.toString());
        }
    }

    @OnClose
    public void onClose(Session session) {
        Integer gameId = sessionRoomMap.remove(session);
        if (gameId != null) {
            Set<Session> sessions = gameRoomMap.get(gameId);
            if (sessions != null) {
                sessions.remove(session);
                if (sessions.isEmpty()) {
                    gameRoomMap.remove(gameId);
                }
            }
        }
        System.out.println("[WebSocket] 연결 종료 - gameId: " + gameId);
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        System.err.println("[WebSocket] 에러 발생:");
        throwable.printStackTrace();
    }
}