function M2indApi(server)
{
    this.serverUrl = server || "http://api.m2ind.tk/";

    function setGameToken(token)
    {
        setCookie("game_token", token);
    }

    function setScoreId(id)
    {
        setCookie("score_id", id);
    }

    function getScoreId()
    {
        return getCookie("score_id");
    }

    this.restartGame = function() {
        setGameToken("");
    };

    this.getGameToken = function(){
        return getCookie("game_token");
    };

    this.validateGameToken = function(callback)
    {
        var game_token = this.getGameToken();
        if(!game_token) return;

        $.ajax({
            method: "get",
            url: this.serverUrl+"scores/"+game_token,
            error: function(data){
                if (callback) {
                    callback({
                        "success": data.success,
                        "error":  data.responseJSON ? data.responseJSON.error : null
                    })
                }else if(data.responseJSON ){
                    console.error(data.responseJSON.error)
                }
            },
            success: function(item) {
                if (item && item.user) {
                    setGameToken("");
                } else {
                    console.log("game unfinished", item);
                }
                if (callback) {
                    callback({
                        "success": true
                    })
                }
            }
        });
    };

    this.postNewTry = function(guessValue, callback)
    {
        $.ajax({
            method: "post",
            data: {
                game_token: this.getGameToken(),
                "try": guessValue
            },
            url: this.serverUrl + "game_tries",
            error: function (data) {
                if (callback) {
                    callback({
                        "success": false,
                        "error": data.responseJSON ? data.responseJSON.error : null
                    })
                } else if (data.responseJSON) {
                    console.error(data.responseJSON.error)
                }
            },
            success: function (data) {
                if (data.you_win) {
                    setScoreId(data.score);
                }
                if (callback) callback(data);
            }
        });
    };

    this.startNewGame = function(callback){
        $.ajax({
            method: "post",
            data: { num_pos: 5 },
            url: this.serverUrl+'games',
            error: function(data){
                if (callback) {
                    callback({
                        "success":false,
                        "error":  data.responseJSON ? data.responseJSON.error : null
                    })
                }else if(data.responseJSON ){
                    console.error(data.responseJSON.error)
                }
            },
            success: function(data){
                if(data.token){
                    setGameToken(data.token);
                    if (callback) {
                        callback(data);
                    }
                }else{
                    if (callback) {
                        callback({
                            "success": false,
                            "error":  data.error ? data.error : "No token present in the response"
                        })
                    }else{
                        console.error(data.error ? data.error : "No token present in the response")
                    }
                }
            }
        })
    };

    this.saveScoreUsername = function(username, callback)
    {
        $.ajax({
            method: "put",
            data: {
                game_token: this.getGameToken(),
                user: username
            },
            url: this.serverUrl + "scores/" + getScoreId(),
            error: function (data) {
                if (callback) {
                    callback({
                        "success": false,
                        "error": data.responseJSON ? data.responseJSON.error : null
                    })
                } else if (data.responseJSON) {
                    console.error(data.responseJSON.error)
                }
            },
            success: function (data) {
                if (data.success == undefined) {
                    data.success = false;
                }
                if (callback) callback({
                    "success": data.success
                });
            }
        });
    };

    this.getTriesForGame  = function (callback){
        $.ajax({
            method: 'get',
            data: {game_token: this.getGameToken()},
            url: this.serverUrl + "game_tries.json",
            error: function (data) {
                if (callback) {
                    callback({
                        "success": data.success,
                        "error": data.responseJSON ? data.responseJSON.error : null
                    })
                } else if (data.responseJSON) {
                    console.error(data.responseJSON.error)
                }
            },
            success: function (data) {
                if (callback) {
                    callback({
                        "success": true,
                        "data": data
                    });
                }
            }
        })
    };

    this.preValidateTry = function(newTry, callback){
        $.ajax({
            method: 'get',
            data: {
                game_token: this.getGameToken(),
                check_try: newTry
            },
            url: this.serverUrl + "game_tries.json",
            error: function (data) {
                if (callback) {
                    callback({
                        "success": false,
                        "error": data.responseJSON ? data.responseJSON.error : null
                    })
                } else if (data.responseJSON) {
                    console.error(data.responseJSON.error)
                }
            },
            success: function (data) {
                if (callback) {
                    callback({
                        "success": true,
                        "data": data
                    });
                }
            }
        })
    };

    this.askForHint = function(callback)
    {
        $.ajax({
            method: "post",
            data: {game_token: this.getGameToken()},
            url: this.serverUrl + 'game_hints',
            error: function (data) {
                if (callback) {
                    callback({
                        "success": false,
                        "error": data.responseJSON ? data.responseJSON.error : null
                    })
                } else if (data.responseJSON) {
                    console.error(data.responseJSON.error)
                }
            },
            success: function (data) {
                if (callback) callback({
                    "success": data.success,
                    "hint": data.hint,
                    "hint_pos": data.hint_pos,
                    "hints_left": data.hints_left,
                    "error": data.responseJSON ? data.responseJSON.error : null
                });
            }
        })
    };

    this.getHints = function(callback)
    {
        $.ajax({
            method: "get",
            data: {game_token: this.getGameToken()},
            url: this.serverUrl + 'game_hints',
            error: function (data) {
                if (callback) {
                    callback({
                        "success": data.success,
                        "error": data.responseJSON ? data.responseJSON.error : null
                    })
                } else if (data.responseJSON) {
                    console.error(data.responseJSON.error)
                }
            },
            success: function (data) {
                if (callback) callback({
                    "success": data.success,
                    "hints": data.hints,
                    "hints_left": data.hints_left,
                    "hints_pos": data.hints_pos,
                    "error": data.responseJSON ? data.responseJSON.error : null
                });
            }
        })
    };

    this.getScores = function(callback){
        $.ajax({
            method: 'get',
            data: {},
            url: this.serverUrl + "scores.json",
            error: function (data) {
                if (callback) {
                    callback({
                        "success": data.success,
                        "error": data.responseJSON ? data.responseJSON.error : null
                    })
                } else if (data.responseJSON) {
                    console.error(data.responseJSON.error)
                }
            },
            success: function (data) {
                var result = [];
                for (var i = 0; i < data.length; i++) {
                    item = data[i];
                    result.push({
                        rank: i + 1,
                        user: item.user,
                        points: item.points,
                        lema: item.tries + ' tries on ' + Math.round(item.seconds / 60) + ' minutes'
                    });
                }
                if (callback) {
                    callback({
                        "success": true,
                        "data": result
                    });
                }
            }
        })
    };

}