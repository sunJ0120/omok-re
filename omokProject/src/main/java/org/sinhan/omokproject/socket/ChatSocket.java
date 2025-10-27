package org.sinhan.omokproject.socket;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

// 서버 엔드포인트로 /chat을 지정
@ServerEndpoint("/chat")
public class ChatSocket {
    // session 객체를 담을 집합 생성
    // synchronizedSet -> 여러 클라이언트가 존재할 때 꼬이는 걸 방지
    private static Set<Session> clients = Collections.synchronizedSet(new HashSet<>());

    // 소켓통신이 시작됐을 때 해당 세션을 clients 집합에 추가 후 그 세션의 id와 연결 성공 메세지를 출력
    @OnOpen
    public void onOpen(Session session) throws IOException {
        clients.add(session);
        // 반드시 session 하나에게만 보내야 함
        String init = String.format("{\"senderId\":\"%s\",\"text\":\"__INIT__\"}", session.getId());
        session.getBasicRemote().sendText(init);
    }

    // 클라이언트가 서버에 메세지를 보냈을 때 실행
    @OnMessage
    public void onMessage(Session session, String message) throws IOException {
        // 세션에서 senderId를 받아옴
        String senderId = session.getId();
        // 메세지에 쌍따옴표, 역슬레시, 개행자 포함 시 깨질 수 있기 때문에 replace
        String escaped = message
                // 1) 역슬래시
                .replaceAll("\\\\", "\\\\\\\\")
                // 2) 따옴표
                .replaceAll("\"", "\\\\\"")
                // 3) 개행문자
                .replaceAll("\n", "\\\\n");
        // json형태의 페이로드 생성 -> 클라이언트로 전송 후 js 객체로 변환할 것
        String payload = String.format(
                "{\"senderId\":\"%s\",\"text\":\"%s\"}", senderId, escaped
        );
        // 여러 클라이언트가 동시에 메세지를 보낼 때 순차적으로 받을거임 안정성 올라감
        synchronized (clients) {
            // clients에 있는 세션 객체들을 s에 담은 후 s가 오픈된 서버라면 + 보낸사람과 세션이 같지 않다면
            // !(s.equals(session)을 추가하면 내 메세지가 뜨지 않아서 삭제
            // 엔드포인트에 있는 메세지를 상대 클라이언트에게 보낸다. + 나한테도
            for (Session s : clients) {
                if(s.isOpen()) {
                    s.getBasicRemote().sendText(payload);
                }
            }
        }
    }

    // 웹소켓 연결이 종료될 때 해당 세션을 clients에서 제외 후 로그를 남긴다
    @OnClose
    public void onClose(Session session) {
        clients.remove(session);
        System.out.println("서버 연결 종료 " + session.getId());
    }
    // 메세지 처리 과정 중 에러 발생 시 printStackTrace
    @OnError
    public void onError(Session session, Throwable thr) {
        thr.printStackTrace();
    }
}