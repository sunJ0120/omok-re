package org.sinhan.omokproject.util;

import com.google.gson.JsonObject;
import org.sinhan.omokproject.domain.GameVO;
import org.sinhan.omokproject.domain.UserVO;

public class JsonBuilderUtil {
    public static JsonObject getGameInfo(GameVO game) {
        JsonObject json = new JsonObject();
        json.addProperty("gameId", game.getGameId());
        json.addProperty("status", game.getStatus().toString());
        json.addProperty("player1", game.getPlayer1());
        json.addProperty("player2", game.getPlayer2());
        return json;
    }

    public static JsonObject getUserInfo(UserVO user) {
        JsonObject json = new JsonObject();
        json.addProperty("id", user.getUserId());
        json.addProperty("rate", user.getRate());
        json.addProperty("img", user.getImage());
        return json;
    }
}