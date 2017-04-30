$(function(){
    var qis, ip, als = {};

    // 接続ボタンclickイベント
    var connect = function(){
        // 入力IP取得
        ip = $('#ip').val();
        // NAOqi Session 生成
		if(qis) return;
        qis = new QiSession(ip);
        // 接続
        qis.socket()
        .on('connect', function(){
            // 接続成功
            console.log('[CONNECTED]');
            // ALTextToSpeechを使う
            qis.service('ALTextToSpeech').done(function(ins){
                als.alTextToSpeech = ins;
            });
			qis.service('ALMotion').done(function(ins){
                als.alMotion = ins;
            });
			qis.service('ALRobotPosture').done(function(ins){
                als.alRobotPosture = ins;
            });
			
			
        })
        .on('disconnect', function(){
            // 接続断
            console.log('[DISCONNECTED]');
        })
        .on('error', function(){
            // 接続エラー
            console.log('[CONNECTION ERROR]');
        });
    };

	var direct = 1;
	
    // テストボタンclickイベント
    $('#test-btn').on('click', function(){
		connect();
		
        // Pepperにしゃべらせる
        console.log('[TEST]');
         if(als.alTextToSpeech) als.alTextToSpeech.say('ペッパー！');
		
		if(als.alMotion) {
			var motion = als.alMotion;
			motion.openHand('RHand');
			
			move('LElbowYaw', 0.5);
			move('RElbowYaw', 0.5);
			
			move('RShoulderPitch', 0.5);
			move('RShoulderRoll', 0.5);
			move('RElbowYaw', 10);
			
			move('HeadYaw', 0.5);
			move('HeadPitch', 0.5);
			
			move('LWristYaw', 0.5);
			
			resetMotion();
		}
		
		
    });
	
	console.log(als);
	
	function move(names, changes) {
	var rangeEnd = 1;
			var motion = als.alMotion;
			
			
			// motion.setStiffnesses(names, 1.0);
			sleep(500);
			changes = (changes + parseFloat($('#change').val())) * direct;
			
			var fractionMaxSpeed = 0.05;
			
			var count = 0;
			while (true){
				console.log(names, changes);
				motion.changeAngles(names, changes, fractionMaxSpeed);
				
				count++;
				
				sleep(500);
				
				if(count == rangeEnd){
					break;
				}
			}			
			
			motion.setStiffnesses(names, 0.0);
			sleep(500);
	};
	
var resetMotion = function(){
	if(als.alRobotPosture){
		console.log("StandInit");
			var motion = als.alRobotPosture;
			motion.goToPosture("StandInit", 0.5);			
		}
}
			
// テストボタンclickイベント
    $('#reset-btn').on('click', function(){
		connect();
        // Pepperにしゃべらせる
        console.log('[RESET]');
		
		resetMotion();

    });
	
	$('#headL-btn').on('click', function(){
		connect();
        // Pepperにしゃべらせる
        console.log('[SUB]');
		
		direct = -1;
    });
	
	$('#headR-btn').on('click', function(){
		connect();
        // Pepperにしゃべらせる
        console.log('[ADD]');
		
		direct = 1;
    });
	

	
function sleep(delay) {
        var start = new Date().getTime();
        while (new Date().getTime() < start + delay);
      }
	  
});

