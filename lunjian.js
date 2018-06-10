// ==UserScript==
// @name         lunjian
// @namespace    http://mingy.org/
// @version      1.1.0.06
// @description  lunjian extension
// @updateURL    https://github.com/wuzhengmao/wsmud-userscript/raw/master/lunjian.js
// @author       Mingy
// @match        http://sword-direct1.yytou.cn/*
// @match        http://sword-server1.yytou.cn/*
// @match        http://sword-server1-360.yytou.cn/*
// @run-at       document-idle
// @require      https://github.com/wuzhengmao/wsmud-userscript/raw/master/lunjian-lib.js#v5
// @grant        unsafeWindow
// ==/UserScript==
// v1.0.0.02 2018.05.24 增加逃犯的触发器#t+ taofan
// v1.0.0.04 2018.05.24 增加手机长按打开命令行的功能
// v1.0.0.05 2018.05.24 修复在部分房间首次登入方向指令错误的BUG
// v1.0.0.06 2018.05.25 F1对于没有阵法的江湖绝学也能一起释放
// v1.0.0.07 2018.06.03 增加了双击锁定攻击目标的功能
// v1.0.0.08 2018.06.03 阻止长按事件冒泡
// v1.0.0.09 2018.06.03 BUG修复
// v1.0.0.10 2018.06.03 改为点击锁定攻击目标
// v1.0.0.11 2018.06.03 优化锁定攻击的算法，增加#connect指令
// v1.0.0.12 2018.06.04 增加自动重连的触发器#t+ connect
// v1.1.0.00 2018.06.07 增加了#t+ qinglong #t+ biaoche #t+ party #t+ guild #t+ task #question #heal等功能
// v1.1.0.01 2018.06.07 改进#t+ pintu，增加#t+ snoop
// v1.1.0.02 2018.06.08 增加自动每日#daily
// v1.1.0.03 2018.06.09 完善一键日常功能
// v1.1.0.04 2018.06.09 在状态页面增加脚本按钮，#t+ party和#t+ guild改成#party和#guild
//                      直接在奇侠页面后增加领取朱果的链接，改进天剑谷
// v1.1.0.05 2018.06.09 为物品窗口增加了全卖、全分解、全合成的功能
// v1.1.0.06 2018.06.10 修复每日冰月3的BUG，修复自动锁定目标的BUG，增强秘境的扫荡按钮

(function(window) {
    'use strict';
    
    if (self != top) {
        top.location.href = location.href;
        return;
    }
    
    setTimeout(function() {
	if (!window.gSocketMsg || !window.gSocketMsg2) {
		return;
	}
	if (!g_obj_map.get('msg_attrs')) {
		clickButton('attrs');
		return;
	}
	var aliases = new Map();
	aliases.put('l', 'look');
	aliases.put('i', 'items');
	aliases.put('k', 'kill');
	aliases.put('h', 'halt');
	aliases.put('e', 'east');
	aliases.put('s', 'south');
	aliases.put('w', 'west');
	aliases.put('n', 'north');
	aliases.put('se', 'southeast');
	aliases.put('sw', 'southwest');
	aliases.put('ne', 'northeast');
	aliases.put('nw', 'northwest');
	aliases.put('u', 'up');
	aliases.put('d', 'down');
	aliases.put('jiali', 'enforce');
	aliases.put('lz', 'items use snow_qiannianlingzhi');
	aliases.put('sk1', 'enable mapped_skills restore go 1');
	aliases.put('sk2', 'enable mapped_skills restore go 2');
	aliases.put('sk3', 'enable mapped_skills restore go 3');
	aliases.put('share', 'share_ok 1;share_ok 2;share_ok 3;share_ok 4;share_ok 5;share_ok 6;share_ok 7');
	aliases.put('tiaoya', 'nw;w;sw;w;n;n;w;w;w;s;w;nw;ne;ne;ne;e;e;e;e;e;s;e');
	aliases.put('cailian', 'fly 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;n;n;n;w');
	aliases.put('xuantie', 'fly 35;nw;nw;nw;n;ne;nw\nw;nw;e;e;e;e;e;se;n;n;w;n;w;event_1_53278632');
	aliases.put('toushi', 'fly 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;ne;ne;se;n');
	aliases.put('shilian', 'fly 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e;e;n;ne');
	aliases.put('shejian', 'fly 28;n;w;w;w;w;w;w;nw;ne;nw;ne;nw;ne;e');
	aliases.put('tingqin', 'fly 5;n;n;n;n;n;n;n;n;w;w;w;s;e;e;s;s;e;e;s;s;s');
	aliases.put('tianshan1', 'fly 39;ne;e;n;ne;ne;n;ne;nw');
	aliases.put('tianshan2', 'nw;n;ne;nw;nw;w;n;n');
	aliases.put('wudu1', 'fly 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se');
	aliases.put('wudu2', 'se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n');
	aliases.put('dishi', 'fly 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;s;s;s;s;e;event_1_2215721');
	var friend_list = [ 'u2819948', 'u2771755', 'u3324214', 'u2626349',
			'u2634663', 'u2612522', 'u3019083', 'u2860723', 'u2617077',
			'u2617092', 'u2616450', 'u2637402', 'u2617579', 'u2616211',
			'u3444969', 'u6099572', 'u5903155', 'u2619076', 'u2617955',
			'u2617521', 'u4643196', 'u2747758', 'u2615809', 'u2616994',
			'u3093166', 'u3827219', 'u3288641', 'u2756496', 'u3071047',
			'u2863851', 'u3884564', 'u2637468', 'u2790969', 'u3399330',
			'u3892886' ];
    var snoop_list = [ '寒夜·斩', '绕指·云', '魏娇', '剑仙', '阿不', '绘羽', '末日召唤', '花云', '清楚',
            '红枣', '南英', '李寻花', '索命梵音', '苏妙玲', '庄梦蝶', '承影剑', '奈何离歌', '藏锋·破',
            '抓狂', '纵横老野猪', '阿含', '老猫', '慕容九州', '飞鱼', '江海玥', '王老实', '糖醋排骨', '若心',
            '王有财', '奇门遁甲', '幽冥姬', '陳慧琳', '纵横天下', '阿福', '梅大霸', '~陌上花开~', '神神·道道',
            '孤烟', '画中画云里雾', '裴旻', '渡铁',	'鎏金黑玉锥', '暗月·刀', '一一YII', '凡星' ];
    var snoop_ignore_list = [ '金甲符兵', '玄阴符兵', '段老大', '二娘', '岳老三', '云老四', '流寇', '恶棍',
            '剧盗', '翻云刀神', '覆雨剑神', '织冰女侠', '排云狂神', '九天老祖', '天玑剑客', '天璇剑客', '天权剑客',
            '玉衡剑客', '开阳剑客', '瑶光剑客', '北斗剑灵', '天枢剑客', '护卫', '小兵', '李信', '赫造基',
            '独龙寨土匪', '土匪头目', '独龙寨军师', '傅一镖', '乱石强盗', '桃花弟子', '摇船老者', '祁空瑶','掌舵手',
            '商人', '船员', '假船员', '船老大', '钓鱼老者', '念经僧人', '海蟹', '突厥骑兵', '寻宝贼', '闻元化及',
            '楼兰遗民', '楼兰族长', '噬人蚁', '嗜血蜥蜴', '黑毒沙蝎', '沙漠王蛇', '戈壁凶狼', '沙漠悍匪', '突厥王子',
            '毒医', '毒蜘蛛', '毒蚂蚁', '毒青蛙', '毒蜈蚣', '毒蝎子', '奔狂骁', '琦行', '吐蕃国师', '汝阳王', '宋喉',
            '便衣*', '*队长', '叛贼', '黑衣守卫', '黑衣刀客', '地道看守', '倒茶老头', '紫薇教香主', '紫薇教长老',
            '紫薇教掌教', '后土教香主', '后土教长老', '后土教掌教', '勾陈教香主', '勾陈教长老', '勾陈教掌教',
            '长生教香主', '长生教长老', '长生教掌教', '紫薇真人', '后土真人', '勾陈真人', '长生真人', '太书令',
            '少府卿', '执金吾', '羽林卫', '黄门丞', '大鸿胪', '舞乐令', '彩衣女官', '羽林中郎将', '车郎将', '户郎将',
            '骑郎将', '公主家令', '公主丞', '紫衣侍女', '未央公主', '镇殿神兽', '守殿神兽', '镇谷神兽', '守谷神兽',
            '镇潭神兽', '守潭神兽', '镇山神兽', '守山神兽', '幽荧幼崽', '幽荧兽魂', '幽荧王', '幽荧分身', '幽荧战神',
            '螣蛇幼崽', '螣蛇兽魂', '螣蛇王', '螣蛇分身', '螣蛇战神', '应龙幼崽', '应龙兽魂', '应龙王', '应龙分身',
            '应龙战神', '饕餮幼崽', '饕餮兽魂', '饕餮王', '饕餮分身', '饕餮战神', '孽龙分身', '孽龙之灵', '赤豹死士',
            '黑鹰死士', '金狼死士', '金狼大将', '青衣盾卫', '飞羽神箭', '银狼近卫', '杀神寨头目', '杀神寨匪首',
            '金凤凰', '冰麟兽', '紫寒兽', '龙纹兽', '龙角兽', '白衣少女', '黑衣少年', '九幽魔灵', '混沌妖灵',
            '冰月仙人', '仙人分身', '玄武机关兽', '铁狼军', '银狼军', '金狼军', '金狼将', '十夫长', '百夫长',
            '黑羽敌将', '黑羽刺客', '阿保甲', '胡族军士', '乞利', '豹军主帅', '豹军侍卫', '虎军主帅', '虎军侍卫',
            '鹰军主帅', '鹰军侍卫', '中军侍卫', '颉利', '机关铜人', '九幽毒魔', '金锤力士', '断龙斧卫', '重甲矛士',
            '大夏神箭', '金锤虎将', '断龙斧将', '镇陵矛将', '黑衣弩将', '穆小哥', '楚大师兄', '辛怪人', '杨英雄',
            '韩马夫', '武壮士', '傅奇士', '渡云神识', '渡雨神识', '渡风神识' ];
	var show_target = true;
	var auto_attack = false;
	var auto_defence = false;
	var auto_fight = false;
	var user_id_pattern1 = /^u[0-9]+$/;
	var user_id_pattern2 = /^u[0-9]+\-/;
	var kuafu_name_pattern = /^\[[0-9]+\]/;
	var kuafu = '[1-5区]';
    var sorted_power_skills = ['九溪断月枪', '燎原百破', '昊云破周斧', '四海断潮斩', '天火飞锤', '玄胤天雷', '玄天杖法', '辉月杖法',
            '破军棍诀', '千影百伤棍', '十怒绞龙索', '拈花解语鞭', '飞刀绝技', '孔雀翎', '排云掌法', '如来神掌', '九天龙吟剑法',
            '覆雨剑法', '织冰剑法', '雪饮狂刀', '翻云刀法'];
	var skill_chains = [ '九天龙吟剑法', '覆雨剑法', '织冰剑法', '排云掌法', '如来神掌', '雪饮狂刀',
			'翻云刀法', '飞刀绝技', '孔雀翎', '道种心魔经', '生生造化功', '幽影幻虚步', '万流归一',
			'燎原百破', '九溪断月枪', '玄胤天雷', '天火飞锤', '四海断潮斩', '昊云破周斧',
			'千影百伤棍', '破军棍诀', '拈花解语鞭', '十怒绞龙索', '辉月杖法', '玄天杖法'];
	var force_skills = [ '道种心魔经', '生生造化功', '不动明王诀', '八荒功', '易筋经神功', '天邪神功',
			'紫霞神功', '葵花宝典', '九阴真经', '茅山道术', '蛤蟆神功', '碧血心法' ];
	var dodge_skills = [ '万流归一', '幽影幻虚步', '乾坤大挪移', '凌波微步', '无影毒阵', '九妙飞天术' ];
	var defence_patterns = [ /(.*)顿时被冲开老远，失去了攻击之势！/, /(.*)被(.*)的真气所迫，只好放弃攻击！/,
			/(.*)衣裳鼓起，真气直接将(.*)逼开了！/, /(.*)找到了闪躲的空间！/, /(.*)朝边上一步闪开！/,
			/面对(.*)的攻击，(.*)毫不为惧！/, /(.*)使出“(.*)”，希望扰乱(.*)的视线！/,
			/(.*)深深吸了几口气，脸色看起来好多了。/ ];
	var pozhao_ok_patterns = [ /(.*)的招式尽数被(.*)所破！/, /(.*)这一招正好击向了(.*)的破绽！/,
			/(.*)一不留神，招式被(.*)所破！/ ];
	var pozhao_fail_patterns = [ /(.*)的对攻无法击破(.*)的攻势，处于明显下风！/,
			/(.*)的招式并未有明显破绽，(.*)只好放弃对攻！/,
			/(.*)这一招并未奏效，仍被(.*)招式紧逼！/ ];
	var combo_patterns = [ /(.*)招式之间组合成了更为凌厉的攻势！/,
	        /(.*)这几招配合起来，威力更为惊人！/,
	        /(.*)将招式连成一片，令你眼花缭乱！/ ];
	var force_attack_pattern = /(.*)使出“.+”，一股内劲涌向(.*)(左手|右手|后心|左耳|右耳|两肋|左肩|右肩|左腿|右腿|左臂|右臂|腰间|左脸|右脸|小腹|颈部|头顶|左脚|右脚)！/;
    var qinglong_npcs = new Map();
    qinglong_npcs.put('打铁铺子', '王铁匠');
    qinglong_npcs.put('桑邻药铺', '杨掌柜');
    qinglong_npcs.put('书房', '柳绘心');
    qinglong_npcs.put('南市', '客商');
    qinglong_npcs.put('绣楼', '柳小花');
    qinglong_npcs.put('北大街', '卖花姑娘');
    qinglong_npcs.put('钱庄', '刘守财');
    qinglong_npcs.put('杂货铺', '方老板');
    qinglong_npcs.put('祠堂大门', '朱老伯');
    qinglong_npcs.put('厅堂', '方寡妇');
	var map_ids = new Map();
	map_ids.put('xueting', '1');
	map_ids.put('xt', '1');
	map_ids.put('luoyang', '2');
	map_ids.put('ly', '2');
	map_ids.put('huashancun', '3');
	map_ids.put('hsc', '3');
	map_ids.put('huashan', '4');
	map_ids.put('hs', '4');
	map_ids.put('yangzhou', '5');
	map_ids.put('yz', '5');
	map_ids.put('gaibang', '6');
	map_ids.put('gb', '6');
	map_ids.put('qiaoyin', '7');
	map_ids.put('qy', '7');
	map_ids.put('emei', '8');
	map_ids.put('em', '8');
	map_ids.put('hengshan', '9');
	map_ids.put('hs2', '9');
	map_ids.put('wudang', '10');
	map_ids.put('wd', '10');
	map_ids.put('wanyue', '11');
	map_ids.put('wy', '11');
	map_ids.put('shuiyan', '12');
	map_ids.put('sy', '12');
	map_ids.put('shaolin', '13');
	map_ids.put('sl', '13');
	map_ids.put('tangmen', '14');
	map_ids.put('tm', '14');
	map_ids.put('qingcheng', '15');
	map_ids.put('qc', '15');
	map_ids.put('xiaoyao', '16');
	map_ids.put('xy', '16');
	map_ids.put('kaifang', '17');
	map_ids.put('kf', '17');
	map_ids.put('mingjiao', '18');
	map_ids.put('mj', '18');
	map_ids.put('quanzhen', '19');
	map_ids.put('qz', '19');
	map_ids.put('gumu', '20');
	map_ids.put('gm', '20');
	map_ids.put('baituo', '21');
	map_ids.put('bt', '21');
	map_ids.put('songshan', '22');
	map_ids.put('ss', '22');
	map_ids.put('meizhuang', '23');
	map_ids.put('mz', '23');
	map_ids.put('taishan', '24');
	map_ids.put('ts', '24');
	map_ids.put('daqi', '25');
	map_ids.put('dq', '25');
	map_ids.put('dazhao', '26');
	map_ids.put('dz', '26');
	map_ids.put('heimuya', '27');
	map_ids.put('hmy', '27');
	map_ids.put('mojiao', '27');
	map_ids.put('mj2', '27');
	map_ids.put('xingxiu', '28');
	map_ids.put('xx', '28');
	map_ids.put('maoshan', '29');
	map_ids.put('ms', '29');
	map_ids.put('taohuadao', '30');
	map_ids.put('thd', '30');
	map_ids.put('tiexue', '31');
	map_ids.put('tx', '31');
	map_ids.put('murong', '32');
	map_ids.put('mr', '32');
	map_ids.put('dali', '33');
	map_ids.put('dl', '33');
	map_ids.put('duanjian', '34');
	map_ids.put('dj', '34');
	map_ids.put('binghuodao', '35');
	map_ids.put('bhd', '35');
	map_ids.put('xiakedao', '36');
	map_ids.put('xkd', '36');
	map_ids.put('jueqinggu', '37');
	map_ids.put('jqg', '37');
	map_ids.put('bihai', '38');
	map_ids.put('bh', '38');
	map_ids.put('tianshan', '39');
	map_ids.put('ts2', '39');
	map_ids.put('miaojiang', '40');
	map_ids.put('mj3', '40');
	map_ids.put('雪亭镇', '1');
	map_ids.put('洛阳', '2');
	map_ids.put('华山村', '3');
	map_ids.put('华山', '4');
	map_ids.put('扬州', '5');
	map_ids.put('丐帮', '6');
	map_ids.put('乔阴县', '7');
	map_ids.put('峨眉山', '8');
	map_ids.put('恒山', '9');
	map_ids.put('武当山', '10');
	map_ids.put('晚月庄', '11');
	map_ids.put('水烟阁', '12');
	map_ids.put('少林寺', '13');
	map_ids.put('唐门', '14');
	map_ids.put('青城山', '15');
	map_ids.put('逍遥林', '16');
	map_ids.put('开封', '17');
	map_ids.put('光明顶', '18');
	map_ids.put('全真教', '19');
	map_ids.put('古墓', '20');
	map_ids.put('白驼山', '21');
	map_ids.put('嵩山', '22');
	map_ids.put('寒梅庄', '23');
	map_ids.put('泰山', '24');
	map_ids.put('大旗门', '25');
	map_ids.put('大昭寺', '26');
	map_ids.put('魔教', '27');
	map_ids.put('星宿海', '28');
	map_ids.put('茅山', '29');
	map_ids.put('桃花岛', '30');
	map_ids.put('铁雪山庄', '31');
	map_ids.put('慕容山庄', '32');
	map_ids.put('大理', '33');
	map_ids.put('断剑山庄', '34');
	map_ids.put('冰火岛', '35');
	map_ids.put('侠客岛', '36');
	map_ids.put('绝情谷', '37');
	map_ids.put('碧海山庄', '38');
	map_ids.put('天山', '39');
	map_ids.put('苗疆', '40');
	var secrets = new Map();
	secrets.put("lvshuige", 1255);
	secrets.put("daojiangu", 1535);
	secrets.put("taohuadu", 1785);
	secrets.put("lvzhou", 2035);
	secrets.put("luanshishan", 2350);
	secrets.put("dilongling", 2385);
	secrets.put("fomenshiku", 2425);
	secrets.put("tianlongshan", 3100);
	secrets.put("dafuchuan", 3090);
	secrets.put("binhaigucheng", 3385);
	secrets.put("baguamen", 3635);
	secrets.put("nanmanzhidi", 3890);
	secrets.put("fengduguicheng", 3890);
	secrets.put("lianhuashanmai", 2980);
	secrets.put("dixiamigong", 2980);
	secrets.put("duzhanglin", 2980);
	secrets.put("langhuanyudong", 2980);
	secrets.put("shanya", 2980);
	secrets.put("qiaoyinxiaocun", 2980);
    
	var message_listeners = [];
	var listener_seq = 0;
	function add_listener(type, subtype, fn, is_pre) {
		var listener = {
			'id' : ++listener_seq,
			'type' : type,
			'subtype' : subtype,
			'fn' : fn,
			'is_pre' : !!is_pre
		};
		message_listeners.push(listener);
		return listener.id;
	}
	function remove_listener(id) {
		for ( var i = 0; i < message_listeners.length; i++) {
			if (message_listeners[i].id == id) {
				message_listeners.splice(i, 1);
			}
		}
	}
	var _dispatch_message = window.gSocketMsg.dispatchMessage;
	window.gSocketMsg.dispatchMessage = function(msg) {
        if (msg.get('type') == 'notice' && /^你使用3颗.+、50000银两合成了1颗.+。/.test(msg.get('msg'))) {
            msg.put('type', 'main_msg');
            msg.put('subtype', 'ctext');
        }
		for ( var i = 0; i < message_listeners.length; i++) {
			var listener = message_listeners[i];
			if (listener.is_pre
					&& (listener.type == msg.get('type') || (listener.type instanceof Array && $
							.inArray(msg.get('type'), listener.type) >= 0))
					&& (!listener.subtype
							|| listener.subtype == msg.get('subtype') || (listener.subtype instanceof Array && $
							.inArray(msg.get('subtype'), listener.subtype) >= 0))) {
				if (listener.fn(msg)) {
                    return;
                }
			}
		}
        if (msg.get('type') != 'main_msg' || msg.get('ctype') != 'text'
                || !/.+送出一支玫瑰花给本服的所有玩家，所有玩家经验\+15000、潜能\+15000/.test(msg.get('msg'))) {
            _dispatch_message.apply(this, arguments);
        }
		for ( var i = 0; i < message_listeners.length; i++) {
			var listener = message_listeners[i];
			if (!listener.is_pre
					&& (listener.type == msg.get('type') || (listener.type instanceof Array && $
							.inArray(msg.get('type'), listener.type) >= 0))
					&& (!listener.subtype
							|| listener.subtype == msg.get('subtype') || (listener.subtype instanceof Array && $
							.inArray(msg.get('subtype'), listener.subtype) >= 0))) {
				if (listener.fn(msg)) {
                    return;
                }
			}
		}
	};
    function log(text) {
        var msg = new Map();
        msg.put('type', 'main_msg');
        msg.put('ctype', 'text');
        msg.put('msg', HIG + text);
        _dispatch_message(msg);
        console.log(text);
    }
	var _click_button = window.clickButton, echo = false;
	window.clickButton = function(cmd, k) {
		if (cmd.substr(0, 1) == '#') {
			execute_cmd(cmd);
		} else {
            if (echo && cmd) {
                var msg = new Map();
                msg.put('type', 'main_msg');
                msg.put('ctype', 'text');
                msg.put('msg', HIY + cmd.replace(/\n/g, ';'));
                _dispatch_message(msg);
            }
			_click_button.apply(this, arguments);
		}
	};
	var _make_cmd = window.gSocketMsg.make_cmd;
	window.gSocketMsg.make_cmd = function(a, b, c, d) {
		if (c == 'combat_auto_fight') {
			clickButton('auto_fight 0');
		}
		if (c == 'combat_auto_fight' || c == 'combat_no_auto_fight') {
			if (auto_fight) {
				arguments[1] = '#stop';
				arguments[2] = 'combat_auto_fight';
			} else {
				arguments[1] = '#combat';
				arguments[2] = 'combat_no_auto_fight';
			}
		}
		return _make_cmd.apply(this, arguments);
	};
    
	window.Date.prototype.format = function (fmt) { //author: meizz
	    var o = {
	        "M+": this.getMonth() + 1, //月份
	        "d+": this.getDate(), //日
	        "H+": this.getHours(), //小时
	        "m+": this.getMinutes(), //分
	        "s+": this.getSeconds(), //秒
	        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
	        "S": this.getMilliseconds() //毫秒
	    };
	    if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
	    for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
	    return fmt;
	};
    
    var vs_text = '', defence_performed = false, attack_targets = [];
	add_listener(
			'vs',
			'',
			function(msg) {
				if (!show_target && !auto_attack && !auto_defence && attack_targets.length == 0) {
					return;
				}
				var subtype = msg.get('subtype');
				if (subtype == 'vs_info') {
                    $('td#vs11,td#vs12,td#vs13,td#vs14,td#vs15,td#vs16,td#vs17,td#vs18,td#vs21,td#vs22,td#vs23,td#vs24,td#vs25,td#vs26,td#vs27,td#vs28', '.out_top').each(function() {
                        var $e = $(this);
                        if ($e.children().length == 0) {
                            $e.removeClass('attack_target');
                            var i = attack_targets.indexOf($e.attr('id'));
                            if (i >= 0) {
                                attack_targets.splice(i, 1);
                            }
                        }
                    });
                } else if (subtype == 'die') {
                    var vid = msg.get('vid');
					var vs_info = g_obj_map.get('msg_vs_info');
                    var $e;
                    for (var i = 1; i <= 8; i++) {
                        if (vs_info.get('vs1_pos_v' + i) == vid) {
                            $e =  $('.out_top td#vs1' + i);
                            break;
                        }
                    }
                    if (!$e) {
                        for (var i = 1; i <= 8; i++) {
                            if (vs_info.get('vs2_pos_v' + i) == vid) {
                                 $e =  $('.out_top td#vs2' + i);
                                break;
                            }
                        }
                    }
                    if ($e) {
                        $e.removeClass('attack_target');
                        var i = attack_targets.indexOf($e.attr('id'));
                        if (i >= 0) {
                            attack_targets.splice(i, 1);
                        }
                    }
                } else if (subtype == 'text') {
					vs_text += msg.get('msg');
				} else if (subtype == 'add_xdz') {
					var my_id = g_obj_map.get('msg_attrs').get('id');
					if (msg.get('uid') == my_id) {
						defence_performed = false;
					}
				} else if (subtype == 'playskill' && parseInt(msg.get('ret')) == 0) {
					var my_id = g_obj_map.get('msg_attrs').get('id');
					var vs_info = g_obj_map.get('msg_vs_info');
					var pfm = removeSGR(msg.get('name'));
					if (!is_defence(vs_text)) {
						if (msg.get('uid') == my_id) {
							var vid = msg.get('vid');
							if (vs_info) {
								var v1, v2, p1, p2;
								for ( var i = 1; i <= 8; i++) {
									if (vs_info.get('vs1_pos_v' + i) == vid) {
										v1 = 'vs1';
										p1 = i;
										v2 = 'vs2';
										break;
									}
								}
								if (!v1) {
									for ( var i = 1; i <= 8; i++) {
										if (vs_info.get('vs2_pos_v' + i) == vid) {
											v1 = 'vs2';
											p1 = i;
											v2 = 'vs1';
											break;
										}
									}
								}
								for ( var i = 1; i <= 8; i++) {
									if (is_attack_target(vs_info, my_id, [v2, i], pfm, vs_text)) {
										if (show_target) {
											notify_fail(HIG + 'ATTACK: '
													+ vs_info.get(v2 + '_name' + i));
										}
										p2 = i;
										var id = vs_info.get(v2 + '_pos'
												+ i);
										if (auto_attack && is_player(id)
												&& get_friend_index(id) < 0) {
											auto_pfm(vs_info, pfm, v1, p1,
													v2, p2);
										} else if (attack_targets.indexOf(v2 + i) >= 0) {
											var xdz = parseInt(vs_info.get(v1 + '_xdz' + p1));
                                            select_perform(get_skill_buttons(xdz));
										}
										break;
									}
								}
							}
						} else {
							var pos1 = check_pos(vs_info, my_id);
							if (pos1) {
								var pos2 = check_pos(vs_info, msg.get('uid'));
								if (pos2 && pos1[0] != pos2[0]) {
                                    if (is_player(msg.get('uid'))) {
                                        var target = 0;
                                        for ( var i = 1; i <= 8; i++) {
                                            if (i == pos1[1]) {
                                                continue;
                                            }
                                            if (is_attack_target(vs_info, my_id, [pos1[0], i], pfm, vs_text)) {
                                                target = i;
                                                break;
                                            }
                                        }
                                        if (target == 0 && vs_text.indexOf('你') >= 0) {
                                            if (show_target) {
                                                notify_fail(HIG + 'DEFENCE: '
                                                            + vs_info.get(pos2[0] + '_name' + pos2[1]));
                                            }
                                            if (auto_defence && !defence_performed && has_npc(vs_info, pos1[0]) && has_npc(vs_info, pos2[0])) {
                                                var max_kee1 = parseInt(g_obj_map.get('msg_attrs').get('max_kee'));
                                                var max_kee2 = parseInt(vs_info.get(pos2[0] + '_max_kee' + pos2[1]));
                                                if (max_kee2 > max_kee1 * 0.8) {
                                                    var xdz = parseInt(vs_info.get(pos1[0] + '_xdz' + pos1[1]));
                                                    var buttons = get_skill_buttons(xdz);
                                                    for ( var i = 0; i < dodge_skills.length; i++) {
                                                        var k = $.inArray(dodge_skills[i], buttons);
                                                        if (k >= 0) {
                                                            clickButton('playskill ' + (k + 1));
                                                            defence_performed = true;
                                                            break;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if (attack_targets.indexOf(pos2[0] + pos2[1]) >= 0) {
                                        var xdz = parseInt(vs_info.get(pos1[0] + '_xdz' + pos1[1]));
                                        var uid = vs_info.get(pos2[0] + '_pos' + pos2[1]);
                                        select_perform(get_skill_buttons(xdz), is_player(uid));
                                    }
                                } else if (pos2) {
                                    for (var i = 0; i < attack_targets.length; i++) {
                                        var uid = vs_info.get(attack_targets[i].substring(0, 3) + '_pos' + attack_targets[i].substring(3));
                                        var name = vs_info.get(attack_targets[i].substring(0, 3) + '_name' + attack_targets[i].substring(3));
                                        if (!is_player(uid) && vs_text.indexOf(name) >= 0) {
                                            var xdz = parseInt(vs_info.get(pos1[0] + '_xdz' + pos1[1]));
                                            select_perform(get_skill_buttons(xdz));
                                        }
                                    }
                                }
							}
                        }
					}
                    vs_text = '';
				} else if (subtype == 'attack' && msg.get('aid') != 0) {
					vs_text = '';
				} else if (msg.get('subtype') == 'combat_result') {
                    vs_text = '';
                    attack_targets = [];
                }
			});
	function set_attack_target(target_id) {
		if (!window.is_fighting) {
			return;
		}
		var vs_info = g_obj_map.get('msg_vs_info');
		var pos = check_pos(vs_info, target_id);
		if (pos) {
            var $e = $('td#' + pos[0] + pos[1], '.out_top');
            if ($e.length > 0 && !$e.hasClass('attack_target')) {
                $e.click();
            }
		} else {
            console.log('target ' + target_id + ' not found');
        }
	}
	function is_defence(vs_text) {
		for ( var i = 0; i < defence_patterns.length; i++) {
			if (defence_patterns[i]
					.test(vs_text)) {
				return true;
			}
		}
		return false;
	}
	function is_pozhao_ok(vs_text) {
		for ( var i = 0; i < pozhao_ok_patterns.length; i++) {
			if (pozhao_ok_patterns[i]
					.test(vs_text)) {
				return true;
			}
		}
		return false;
	}
	function is_pozhao_fail(vs_text) {
		for ( var i = 0; i < pozhao_fail_patterns.length; i++) {
			if (pozhao_fail_patterns[i]
					.test(vs_text)) {
				return true;
			}
		}
		return false;
	}
	function is_combo(vs_text) {
		for ( var i = 0; i < combo_patterns.length; i++) {
			if (combo_patterns[i].test(vs_text)) {
				return true;
			}
		}
		return false;
	}
	function is_attack_target(vs_info, my_id, pos, pfm, vs_text) {
		var name = vs_info.get(pos[0] + '_name' + pos[1]);
		if (!name) {
			return false;
		}
		if (my_id.indexOf('-') >= 0
				&& kuafu_name_pattern.test(name)) {
			var j = name.indexOf(']');
			name = name.substr(0, j)
					+ '区'
					+ name.substr(j, name.length
							- j);
		}
		return vs_text.indexOf(name) >= 0;
	}
	var last_fight_time = 0;
	var last_kill_time = 0;
	function try_join_combat(vs_info, target, ignore_check) {
		var pos = check_pos(vs_info, target);
		if (!pos) {
			return false;
		} else if (parseInt(vs_info.get(pos[0] + '_kee' + pos[1])) <= 0) {
			return false;
		}
		var side = pos[0] == 'vs1' ? 'vs2' : 'vs1';
		var has_npc = false;
		var has_pos = false;
		var player_id = null;
		var k = -1;
		var pos1_name = removeSGR(vs_info.get(pos[0] + '_name' + pos[1]));
		if (pos1_name == '天剑真身' || pos1_name == '年兽') {
			has_npc = true;
		}
		for ( var i = 1; i <= 8; i++) {
			if (!has_npc || !has_pos) {
				var kee = vs_info.get(side + '_kee' + i);
				if (kee && parseInt(kee) > 0) {
					if (!has_npc && !is_player(vs_info.get(side + '_pos' + i))) {
						has_npc = true;
					}
				} else {
					has_pos = true;
				}
			}
			if (friend_list) {
				var kee = vs_info.get(pos[0] + '_kee' + i);
				if (kee && parseInt(kee) > 0) {
					var id = vs_info.get(pos[0] + '_pos' + i);
					if (is_player(id)) {
						if (!player_id) {
							player_id = id;
						}
						var j = get_friend_index(id);
						if (j >= 0 && (k < 0 || j < k)) {
							player_id = id;
							k = j;
						}
					}
				}
			}
		}
		if (!has_npc || (!ignore_check && !has_pos)) {
			return false;
		}
		var t = new Date().getTime();
		if (!ignore_check && player_id && t - last_fight_time >= 3000) {
			last_fight_time = t;
			send_cmd('fight ' + player_id);
		} else if (t - last_kill_time >= 1000) {
			last_kill_time = t;
			send_cmd('kill ' + target);
		}
		return true;
	}
	function check_pos(vs_info, target) {
		if (vs_info) {
			for ( var i = 1; i <= 8; i++) {
				if (vs_info.get('vs1_pos' + i) == target) {
					if (parseInt(vs_info.get('vs1_kee' + i)) > 0) {
						return [ 'vs1', i ];
					}
				} else if (vs_info.get('vs2_pos' + i) == target) {
					if (parseInt(vs_info.get('vs2_kee' + i)) > 0) {
						return [ 'vs2', i ];
					}
				}
			}
		}
		return null;
	}
	function is_player(id) {
		return user_id_pattern1.test(id) || user_id_pattern2.test(id);
	}
	function get_friend_index(id) {
		if (!friend_list) {
			return -1;
		}
		var i = id.indexOf('-');
		if (i >= 0) {
			id = id.substr(0, i);
		}
		return friend_list.indexOf(id);
	}
	function removeSGR(text) {
		return text ? text.replace(/\u001b\[[;0-9]+m/g, '') : '';
	}
	function removeLink(text) {
		return text ? text.replace(/\u0003[^\u0003]*\u0003/g, '') : '';
	}
	function auto_pfm(vs_info, pfm, v1, p1, v2, p2) {
		var xdz = parseInt(vs_info.get(v1 + '_xdz' + p1));
		var max_kee = parseInt(vs_info.get(v2 + '_max_kee' + p2));
		var kee = parseInt(vs_info.get(v2 + '_kee' + p2));
		var my_max_kee = parseInt(vs_info.get(v1 + '_max_kee' + p1));
		var k = 0;
		if (my_max_kee > 500000) {
			if (max_kee < 100000) {
				k = 0;
			} else if (max_kee < 200000) {
				k = 1;
			} else if (max_kee < 350000) {
				k = kee < 150000 ? 1 : 2;
			} else {
				k = 2;
			}
		} else if (my_max_kee > 300000) {
			if (max_kee < 30000) {
				k = 0;
			} else if (max_kee < 100000) {
				k = 1;
			} else if (max_kee < 300000) {
				k = kee < 100000 ? 1 : 2;
			} else {
				k = 2;
			}
		} else {
			k = 0;
		}
		if (LIBS.power_skills.containsKey(pfm)) {
			k = k > 0 ? k - 1 : 0;
		}
		if (k > 0) {
			var buttons = get_skill_buttons(xdz);
			if (k == 1) {
				var pfms = LIBS.power_skills.get(pfm);
				if (pfms) {
					for ( var i = 0; i < buttons.length; i++) {
						if (buttons[i] && pfms.indexOf(buttons[i]) >= 0) {
							clickButton('playskill ' + (i + 1));
							return;
						}
					}
				}
				for ( var i = 0; i < buttons.length; i++) {
					if (buttons[i] && LIBS.power_skills.containsKey(buttons[i])) {
						clickButton('playskill ' + (i + 1));
						break;
					}
				}
			} else if (k == 2) {
				var pfms = LIBS.power_skills.get(pfm);
				if (pfms) {
					for ( var i = 0; i < buttons.length; i++) {
						if (buttons[i] && pfms.indexOf(buttons[i]) >= 0) {
							clickButton('playskill ' + (i + 1));
							return;
						}
					}
				}
				select_perform(buttons);
			}
		}
	}
	function rejoin(change_side) {
		if (!window.is_fighting) {
			return;
		}
		var vs_info = g_obj_map.get('msg_vs_info');
		var my_id = g_obj_map.get('msg_attrs').get('id');
		var pos = check_pos(vs_info, my_id);
		if (pos) {
			var side = pos[0];
			if (!change_side) {
				side = side == 'vs1' ? 'vs2' : 'vs1';
			}
			var npc_id = null;
			for ( var i = 1; i <= 8; i++) {
				var kee = vs_info.get(side + '_kee' + i);
				if (kee && parseInt(kee) > 0) {
					var id = vs_info.get(side + '_pos' + i);
					if (!is_player(id)) {
						npc_id = id;
						break;
					}
				}
			}
			if (npc_id) {
				var cmd = 'escape\n';
				var force = parseInt(vs_info.get(pos[0] + '_force' + pos[1]));
				var max_force = parseInt(vs_info.get(pos[0] + '_max_force'
						+ pos[1]));
				if (max_force - force >= 20000) {
					for ( var i = 0; i < 3; i++) {
						cmd += 'items use snow_qiannianlingzhi\n';
					}
				}
				cmd += 'kill ' + npc_id;
				send_cmd(cmd);
			}
		}
	}
	var perform = function() {
		if (!window.is_fighting) {
			return false;
		}
		var my_id = g_obj_map.get('msg_attrs').get('id');
		var vs_info = g_obj_map.get('msg_vs_info');
		var pos = check_pos(vs_info, my_id);
		if (!pos) {
			return false;
		}
		var xdz = parseInt(vs_info.get(pos[0] + '_xdz' + pos[1]));
		return select_perform(get_skill_buttons(xdz));
	};
	function get_skill_buttons(xdz) {
		var buttons = [];
		for ( var i = 0; i < 4; i++) {
			var button = g_obj_map.get('skill_button' + (i + 1));
			if (button && parseInt(button.get('xdz')) <= xdz) {
				buttons.push(removeSGR(button.get('name')));
			} else {
				buttons.push('');
			}
		}
		return buttons;
	}
	function select_perform(buttons, no_combo) {
        for (var i = 0; i < sorted_power_skills.length; i++) {
            var j = buttons.indexOf(sorted_power_skills[i]);
            if (j < 0) {
                continue;
            }
            if (no_combo) {
                clickButton('playskill ' + (j + 1));
                return true;
            }
            var pfms = LIBS.power_skills.get(sorted_power_skills[i]);
            if (pfms) {
                for (var k = 1; k < buttons.length; k++) {
                    if (buttons[k] && k != j && pfms.indexOf(buttons[k]) >= 0) {
                        clickButton('playskill ' + (j + 1) + '\nplayskill '
                                    + (k + 1));
                        return true;
                    }
                }
                for (var k = i + 1; k < sorted_power_skills.length; k++) {
                    var l = buttons.indexOf(sorted_power_skills[k]);
                    if (l >= 0) {
                        clickButton('playskill ' + (j + 1) + '\nplayskill '
                                    + (l + 1));
                        return true;
                    }
                }
            }
        }
		return false;
	}
	function do_perform(buttons, performs) {
		for ( var i = 0; i < performs.length; i++) {
			for ( var j = 0; j < buttons.length; j++) {
				if (buttons[j] && performs[i] == buttons[j]) {
					clickButton('playskill ' + (j + 1));
					return true;
				}
			}
		}
		return false;
	}
	function has_npc(vs_info, side) {
		for (var i = 1; i <= 8; i++) {
			if (!is_player(vs_info.get(side + '_pos' + i))) {
				var kee = vs_info.get(side + '_kee' + i);
				if (kee && parseInt(kee) > 0) {
					return true;
				}
			}
		}
		return false;
	}
	function has_power_player(vs_info, side) {
		for (var i = 1; i <= 8; i++) {
			if (is_player(vs_info.get(side + '_pos' + i))) {
				var kee = vs_info.get(side + '_kee' + i);
				if (kee && parseInt(kee) > 0) {
					var max_kee = vs_info.get(side + '_max_kee' + i);
					if (max_kee > 500000) {
						return true;
					}
				}
			}
		}
		return false;
	}
	var h_interval, h_listener, is_started = false;
	var kill = function() {
		var npc = null;
		$('#out > span.out button.cmd_click2').each(function() {
			var $e = $(this);
			if ($e.text() == '杀死') {
				var onclick = $e.attr('onclick');
				var i = onclick.indexOf('\'');
				var j = onclick.indexOf('\'', i + 1);
				npc = onclick.substring(i + 6, j);
				return false;
			}
		});
		if (npc) {
			if (h_interval) {
				clearInterval(h_interval);
				h_interval = undefined;
				is_started = false;
				remove_listener(h_listener);
				h_listener = undefined;
			}
			h_listener = add_listener('vs', '',
					function(msg) {
						if (msg.get('subtype') == 'vs_info'
								|| (msg.get('subtype') == 'die' && msg
										.get('uid') != npc)) {
							var vs_info = g_obj_map.get('msg_vs_info');
							try_join_combat(vs_info, npc);
						}
					});
			last_kill_time = new Date().getTime();
			send_cmd('kill ' + npc + '\nwatch_vs ' + npc);
			var my_id = g_obj_map.get('msg_attrs').get('id');
			h_interval = setInterval(function() {
				var is_fighting = false;
				if (window.is_fighting) {
					var vs_info = g_obj_map.get('msg_vs_info');
					if (vs_info) {
						is_started = true;
						is_fighting = !!check_pos(vs_info, my_id);
					}
					if (is_fighting) {
						if (check_pos(vs_info, npc)) {
							clearInterval(h_interval);
							h_interval = undefined;
							is_started = false;
							remove_listener(h_listener);
							h_listener = undefined;
						} else {
							is_started = false;
							perform();
						}
					} else {
						try_join_combat(vs_info, npc, true);
					}
				} else if (is_started) {
					clearInterval(h_interval);
					h_interval = undefined;
					is_started = false;
					remove_listener(h_listener);
					h_listener = undefined;
				} else {
					last_kill_time = new Date().getTime();
					send_cmd('kill ' + npc + '\nwatch_vs ' + npc);
				}
			}, 150);
		}
	};
	function find_target(nameOrId, types) {
		var room = g_obj_map.get('msg_room');
		if (!room) {
			return null;
		}
		if (!types || $.inArray('npc', types) >= 0) {
			for ( var t, i = 1; (t = room.get('npc' + i)) != undefined; i++) {
				var s = t.split(',');
				if (s.length > 1) {
					s[1] = removeSGR(s[1]);
					if (s[0] == nameOrId || s[1] == nameOrId) {
						return [ s[0], s[1], 'npc' ];
					}
				} else {
					if (s[0] == nameOrId) {
						return [ s[0], null, 'npc' ];
					}
				}
			}
		}
		if (!types || $.inArray('item', types) >= 0) {
			for ( var t, i = 1; (t = room.get('item' + i)) != undefined; i++) {
				var s = t.split(',');
				if (s.length > 1) {
					s[1] = removeSGR(s[1]);
					if (s[0] == nameOrId || s[1] == nameOrId) {
						return [ s[0], s[1], 'item' ];
					}
				} else {
					if (s[0] == nameOrId) {
						return [ s[0], null, 'item' ];
					}
				}
			}
		}
		if (!types || $.inArray('user', types) >= 0) {
			for ( var t, i = 1; (t = room.get('user' + i)) != undefined; i++) {
				var s = t.split(',');
				if (s.length > 1) {
					s[1] = removeSGR(s[1]);
					if (s[0] == nameOrId || s[1] == nameOrId) {
						return [ s[0], s[1], 'user' ];
					}
				} else {
					if (s[0] == nameOrId) {
						return [ s[0], null, 'user' ];
					}
				}
			}
		}
		return null;
	}
	var task_h_timer, task_h_listener, connect_trigger, pintu_trigger, taofan_trigger,
            qinglong_trigger, biaoche_trigger, task_trigger, snoop_trigger;
	function stop_task(msg) {
		if (task_h_timer) {
			clearInterval(task_h_timer);
			task_h_timer = undefined;
			log(msg || 'task stopped.');
		} else if (task_h_listener) {
			auto_fight = false;
			var $b = $('button.cmd_combat_auto_fight');
			if ($b.length > 0) {
				$b.removeClass('cmd_combat_auto_fight');
				$b.addClass('cmd_combat_no_auto_fight');
				$b.onclick = 'clickButton("#combat", 0)';
			}
			remove_listener(task_h_listener);
			task_h_listener = undefined;
			log(msg || 'task stopped.');
		}
	}
	function add_task_timer(fn, interval) {
		stop_task();
		task_h_timer = setInterval(fn, interval);
	}
	function add_task_listener(type, subtype, fn, is_pre) {
		stop_task();
		task_h_listener = add_listener(type, subtype, fn, is_pre);
	}
    function todo(callback) {
        var h = add_listener(['main_msg', 'vs'], '', function(msg) {
            if (((msg.get('type') == 'main_msg' && msg.get('ctype') == 'text')
                    || (msg.get('type') == 'vs' && msg.get('subtype') == 'text'))
                    && msg.get('msg').indexOf('你自言自语不知道在说些什么') == 0) {
                remove_listener(h);
				if (typeof callback === 'function') {
					callback();
				} else {
					execute_cmd(callback);
				}
                return true;
            }
        }, true);
        send_cmd('say');
    }
	function execute_cmd(cmd) {
		if (cmd.substr(0, 6) == '#loop ') {
			cmd = $.trim(cmd.substr(6));
			if (cmd) {
				var interval = 500;
				var i = cmd.indexOf(' ');
				if (i >= 0) {
					var t = parseInt(cmd.substr(0, i));
					if (!isNaN(t)) {
						interval = t;
						cmd = $.trim(cmd.substr(i + 1));
					}
				}
				if (cmd) {
					log('starting loop...');
					var pc;
					add_task_timer(function() {
						if (!pc) {
							pc = process_cmdline(cmd);
						}
						if (pc && pc[0]) {
							send_cmd(pc[0]);
						}
					}, interval);
				}
			}
		} else if (cmd == '#stop') {
			stop_task();
			cmd_queue.splice(0, cmd_queue.length);
		} else if (cmd.substr(0, 6) == '#kill ') {
			var name = $.trim(cmd.substr(6));
			if (name) {
				log('starting auto kill...');
				var target = find_target(name, [ 'npc' ]);
				if (target) {
					clickButton('kill ' + target[0]);
					add_task_listener('jh', 'new_item', function(msg) {
						if (removeSGR(msg.get('name')) == target[1] + '的尸体') {
							clickButton('get ' + msg.get('id'));
							stop_task('ok!');
							if (target[1] == '年兽') {
								execute_cmd('#loop get ' + msg.get('id'));
							}
						}
					}, true);
                    if (target[1] == '年兽') {
                        var h = add_listener('vs', 'vs_info', function(msg) {
                            set_attack_target(target[0]);
                            remove_listener(h);
                        });
                    }
				} else {
					add_task_listener(
							'jh',
							'new_npc',
							function(msg) {
								if (msg.get('id') == name
										|| removeSGR(msg.get('name')) == name) {
									name = removeSGR(msg.get('name'));
                                    var target_id = msg.get('id');
									clickButton('kill ' + target_id);
									add_task_listener(
											'jh',
											'new_item',
											function(msg) {
												if (removeSGR(msg.get('name')) == name
														+ '的尸体') {
													clickButton('get '
															+ msg.get('id'));
													stop_task('ok!');
													if (name == '年兽') {
														execute_cmd('#loop get ' + msg.get('id'));
													}
												}
											}, true);
                                    if (name == '年兽') {
                                        var h = add_listener('vs', 'vs_info', function(msg) {
                                            set_attack_target(target_id);
                                            remove_listener(h);
                                        });
                                    }
                                }
							}, true);
				}
			}
		} else if (cmd.substr(0, 7) == '#fight ') {
			var name = $.trim(cmd.substr(7));
			if (name) {
				log('starting auto fight...');
				var target = find_target(name, [ 'npc' ]);
				if (target) {
					clickButton('fight ' + target[0]);
				} else {
					add_task_listener(
							'jh',
							'new_npc',
							function(msg) {
								if (msg.get('id') == name
										|| removeSGR(msg.get('name')) == name) {
									clickButton('fight ' + msg.get('id'));
									stop_task('ok!');
								}
							}, true);
				}
			}
		} else if (cmd.substr(0, 5) == '#get ') {
			var name = $.trim(cmd.substr(5));
			if (name) {
				var target = find_target(name, [ 'item' ]);
				if (target) {
					clickButton('get ' + target[0]);
				} else {
					log('starting auto get...');
					add_task_listener('jh', 'new_item', function(msg) {
						if (msg.get('id') == name
								|| removeSGR(msg.get('name')) == name) {
							clickButton('get ' + msg.get('id'));
							stop_task('ok!');
						}
					}, true);
				}
			}
		} else if (cmd == '#secret' || cmd.substr(0, 8) == '#secret ') {
			var msg_room = g_obj_map.get('msg_room');
			var accept;
			if (cmd == '#secret') {
				accept = secrets.get(msg_room.get('map_id'));
			} else {
				accept = parseInt($.trim(cmd.substr(8)));
			}
			if (!isNaN(accept)) {
				var saodang;
				for (var i = 1; ; i++) {
					if (!msg_room.containsKey('cmd' + i + '_name')) {
						break;
					}
					if (removeSGR(msg_room.get('cmd' + i + '_name')) == '扫荡') {
						saodang = msg_room.get('cmd' + i);
						break;
					}
				}
				if (saodang) {
					add_task_listener(
							'prompt',
							'',
							function(msg) {
								var r = msg.get('msg').match(/^您已经通关过此副本，可以扫荡完成，\n扫荡完成的奖励为：玄铁令x(\d+)、朱果x(\d+)。/);
								if (r) {
									if (parseInt(r[2]) > accept) {
										stop_task('ok!');
									} else {
										send_cmd(saodang);
									}
								}
							}, true);
					log('starting clean out secret...');
					send_cmd(saodang);
				} else {
					log('cannot clean out secret.');
				}
			} else {
				log('invalid command.');
			}
		} else if (cmd == '#tianjiangu') {
			log('starting tianjiangu combat...');
            var dirs = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'];
            var tracks = new Map(), members = [], is_leader = false, target;
			add_task_listener(['jh', 'team', 'look_npc', 'vs'], '', function(msg) {
                if (msg.get('type') == 'team' && msg.get('subtype') == 'info') {
                    members = [];
                    for (var i = 1; i <= parseInt(msg.get('max_member_num')); i++) {
                        var member = msg.get('member' + i);
                        if (member) {
                            members.push(removeSGR(member.split(',')[1]));
                        }
                    }
                    is_leader = !!msg.get('is_leader');
                    console.log('members: ' + members.join(',') + ', is_leader: ' + is_leader);
                } else if (msg.get('type') == 'jh' && msg.get('subtype') == 'info') {
					var room = g_obj_map.get('msg_room'), key = '|';
                    for (var i = 0; i < dirs.length; i++) {
                        var t = room.get(dirs[i]);
                        if (t) {
                            key += t + '|';
                        }
                    }
                    if (/\|峡谷\d+\|/.test(key)) {
                        target = undefined;
                        for (var i = 1; ; i++) {
                            var npc = room.get('npc' + i);
                            if (!npc) {
                                break;
                            }
                            var arr = npc.split(',');
                            if (arr.length > 1) {
                                arr[1] = removeSGR(arr[1]);
                                if (arr[1] == '天剑' || arr[1] == '虹风' || arr[1] == '虹雨'
                                    || arr[1] == '虹雷' || arr[1] == '虹电') {
                                    target = arr[0];
                                    break;
                                }
                            }
                        }
                        if (target) {
                            clickButton('look_npc ' + target);
                        } else if (is_leader) {
                            var track = tracks.get(room.get('short'));
                            if (!track) {
                                track = new Map();
                                tracks.put(room.get('short'), track);
                            }
                            var t = track.get(key);
                            if (!t) {
                                t = [];
                                track.put(key, t);
                            }
                            var spec_list = [], other_list = [];
                            for (var i = 0; i < dirs.length; i++) {
                                var name = room.get(dirs[i]);
                                if (name) {
                                    if (/^峡谷\d+/.test(name)) {
                                        other_list.push(i);
                                    } else {
                                        spec_list.push(i);
                                    }
                                }
                            }
                            var select = -1;
                            for (var i = 0; i < spec_list.length; i++) {
                                if (t.indexOf(spec_list[i]) < 0) {
                                    select = spec_list[i];
                                    break;
                                }
                            }
                            if (select < 0) {
                                for (var i = 0; i < other_list.length; i++) {
                                    if (t.indexOf(other_list[i]) < 0) {
                                        select = other_list[i];
                                        break;
                                    }
                                }
                            }
                            if (select < 0) {
                                other_list = other_list.concat(spec_list);
                                select = other_list[Math.floor(Math.random() * other_list.length)];
                            } else {
                                t.push(select);
                            }
                            console.log(room.get('short') + ': ' + key + ' ' + dirs[select]);
                            var cmd = 'go ' + dirs[select];
                            var random = room.get('go_random');
                            if (random) {
                                cmd += '.' + random;
                            }
                            send_cmd(cmd);
                        }
                    }
				} else if (msg.get('type') == 'look_npc' && msg.get('id') == target) {
                    var desc = msg.get('long');
                    var r = desc.match(/正与\s*(.+)\s*激烈争斗中/);
                    if (r) {
                        var arr = $.trim(removeSGR(r[1])).split(/\s+/), check_ok = true;
                        for (var i = 0; i < arr.length; i++) {
                            if (members.indexOf(arr[i]) < 0) {
                                check_ok = false;
                                break;
                            }
                        }
                        if (check_ok) {
                            clickButton('kill ' + target);
                        }
                    } else {
                        clickButton('kill ' + target);
                    }
				} else if (msg.get('type') == 'vs') {
					if (msg.get('subtype') == 'combat_result') {
						clickButton('prev_combat');
                        send_cmd('golook_room');
					} else if (msg.get('subtype') == 'vs_info' && !msg.get('is_watcher')) {
						set_attack_target(target);
					}
				}
			});
            send_cmd('team;prev;golook_room');
		} else if (cmd == '#question') {
            log('starting auto answer question...');
			add_task_listener('show_html_page', '', function(msg) {
				do_answer(msg, function() {
                    stop_task('finish!');
                });
			});
            send_cmd('question');
		} else if (cmd == '#combat') {
			log('starting auto combat...');
			auto_fight = true;
			var $b = $('button.cmd_combat_no_auto_fight');
			if ($b.length > 0) {
				$b.removeClass('cmd_combat_no_auto_fight');
				$b.addClass('cmd_combat_auto_fight');
				$b.onclick = 'clickButton("#stop", 0)';
			}
			add_task_listener('vs', '', function(msg) {
				var vs_info = g_obj_map.get('msg_vs_info');
				var my_id = g_obj_map.get('msg_attrs').get('id');
				auto_combat(vs_info, my_id, msg);
			});
		} else if (cmd == '#pozhao') {
			log('starting auto pozhao...');
			auto_fight = true;
			var $b = $('button.cmd_combat_no_auto_fight');
			if ($b.length > 0) {
				$b.removeClass('cmd_combat_no_auto_fight');
				$b.addClass('cmd_combat_auto_fight');
				$b.onclick = 'clickButton("#stop", 0)';
			}
			var vs_text = '', do_attack = false, t_pfm = 0;
			// var dalou_performs = [ '如来神掌', '覆雨剑法' ];
			var dalou_performs = [ '九溪断月枪', '九阴白骨爪' ];
			// var dalou_performs = [ '千影百伤棍', '霜寒十四棍' ];
			add_task_listener('vs', '', function(msg) {
				var vs_info = g_obj_map.get('msg_vs_info');
				var my_id = g_obj_map.get('msg_attrs').get('id');
				var pos = check_pos(vs_info, my_id);
				if (!pos) {
					return;
				}
				var subtype = msg.get('subtype');
				if (subtype == 'text') {
					vs_text += msg.get('msg');
				} else if (subtype == 'add_xdz' && msg.get('uid') == my_id) {
					var xdz = parseInt(vs_info.get(pos[0] + '_xdz' + pos[1]));
					if (do_attack) {
						if (xdz > 8 || new Date().getTime() - t_pfm > 100) {
							var buttons = get_skill_buttons(xdz);
							if (do_perform(buttons, dalou_performs)) {
								console.log('perform');
								do_attack = false;
							}
						}
					} else if (xdz > 6) {
						var buttons = get_skill_buttons(xdz);
						var kee = parseInt(vs_info.get(pos[0] + '_kee' + pos[1]));
						var max_kee = parseInt(g_obj_map.get('msg_attrs').get('max_kee'));
						var kee_percent = kee * 100 / max_kee;
						var neili = parseInt(vs_info.get(pos[0] + '_force' + pos[1]));
						var max_neili = parseInt(vs_info.get(pos[0] + '_max_force'
								+ pos[1]));
						var neili_percent = neili * 100 / max_neili;
						var target_neili = parseInt(vs_info.get((pos[0] == 'vs1' ? 'vs2' : 'vs1') + '_force1'));
						console.log('kee: ' + kee_percent + ', force: ' + neili_percent);
						if ((kee_percent > 80 || target_neili < 100)
								&& (neili_percent < 50 || (neili_percent < 75 && xdz > 8))
								&& do_perform(buttons, [ '不动明王诀' ])) {
							console.log('neili');
							do_attack = false;
						} else if (xdz > 8) {
							do_perform(buttons, dalou_performs);
							console.log('perform');
							do_attack = false;
						}
					}
				} else if (subtype == 'playskill' && parseInt(msg.get('ret')) == 0) {
					if (msg.get('uid') == my_id) {
						if (is_pozhao_fail(vs_text) && !is_pozhao_ok(vs_text)) {
							do_attack = true;
						}
					} else if (!do_attack && msg.get('uid') != my_id) {
						if (is_pozhao_ok(vs_text)) {
							do_attack = true;
						} else if (!is_pozhao_fail(vs_text) && !is_defence(vs_text)) {
							do_attack = true;
						}
					}
					console.log('do_attack = ' + do_attack);
					if (do_attack) {
						var xdz = parseInt(vs_info.get(pos[0] + '_xdz' + pos[1]));
						var buttons = get_skill_buttons(xdz);
						var neili = parseInt(vs_info.get(pos[0] + '_force' + pos[1]));
						var max_neili = parseInt(vs_info.get(pos[0] + '_max_force'
								+ pos[1]));
						var neili_percent = neili * 100 / max_neili;
						var target_neili = parseInt(vs_info.get((pos[0] == 'vs1' ? 'vs2' : 'vs1') + '_force1'));
						if (neili_percent > 25 || target_neili > 100) {
							if (msg.get('uid') == my_id || is_combo(vs_text)) {
								if (do_perform(buttons, dalou_performs)) {
									console.log('perform');
									do_attack = false;
								}
							} else {
								t_pfm = new Date().getTime();
							}
						/*} else {
							if (do_perform(buttons, [ '不动明王诀' ])) {
								console.log('neili');
								do_attack = false;
							} */
						}
					}
					vs_text = '';
				} else if (subtype == 'attack' && msg.get('aid') != 0) {
					vs_text = '';
					do_attack = false;
				} else if (subtype == 'combat_result') {
					vs_text = '';
					do_attack = false;
				}
			});
		} else if (cmd == '#team') {
			log('starting auto team combat...');
			var leader, target;
			add_task_listener(['main_msg', 'vs'], '', function(msg) {
				if (msg.get('type') == 'main_msg' && msg.get('ctype') == 'text') {
					var r = msg.get('msg').match(/(.+)对著(.+)喝道：「(.+)！今日不是你死就是我活！」/);
					if (r) {
						leader = find_target(removeSGR(r[1]), [ 'user' ]);
						target = find_target(removeSGR(r[2]), [ 'npc' ]);
						if (leader && target) {
							clickButton('kill ' + target[0]);
						}
					}
				} else if (leader && target && msg.get('type') == 'vs') {
					var vs_info = g_obj_map.get('msg_vs_info');
					var my_id = g_obj_map.get('msg_attrs').get('id');
					combo_pfm(vs_info, my_id, msg, leader[0]);
				}
			});
		} else if (cmd == '#pk') {
			log('starting auto pvp...');
			var vs_npc1 = false, vs_npc2 = false;
			add_task_listener('vs', '', function(msg) {
				var vs_info = g_obj_map.get('msg_vs_info');
				var my_id = g_obj_map.get('msg_attrs').get('id');
				var pos = check_pos(vs_info, my_id);
				if (!pos) {
					return;
				}
				var subtype = msg.get('subtype');
				var has_npc1 = has_npc(vs_info, pos[0]);
				var has_npc2 = has_npc(vs_info, pos[0] == 'vs1' ? 'vs2' : 'vs1');
				if (has_npc1 && has_npc2) {
					if (subtype == 'add_xdz' || subtype == 'playskill'
						|| subtype == 'attack') {
						var kee = parseInt(vs_info.get(pos[0] + '_kee' + pos[1]));
						var max_kee = parseInt(vs_info.get(pos[0] + '_max_kee'
								+ pos[1]));
						var percent = kee * 100 / max_kee;
						if (percent < 50 || (percent < 75 && has_power_player(vs_info, pos[0] == 'vs1' ? 'vs2' : 'vs1'))) {
							var xdz = parseInt(vs_info
									.get(pos[0] + '_xdz' + pos[1]));
							var buttons = get_skill_buttons(xdz);
							for ( var i = 0; i < force_skills.length; i++) {
								var k = $.inArray(force_skills[i], buttons);
								if (k >= 0) {
									clickButton('playskill ' + (k + 1));
									return;
								}
							}
						}
					}
				}
			});
		} else if (cmd == '#t+ pintu' && !pintu_trigger) {
			log('open pintu trigger...');
			var bad_npc, good_npc, target_id, action_state = 0;
			pintu_trigger = add_listener(['channel', 'jh', 'vs', 'main_msg', 'notice'], '', function(msg) {
                if (msg.get('type') == 'channel' && msg.get('subtype') == 'sys') {
                    var r = msg.get('msg').match(/【系统】(.+)对着(.+)叫道：.+，今天你可是在我的地盘，看来你是在劫难逃！/);
                    if (r) {
                        bad_npc = r[1];
                        good_npc = r[2];
                        var path;
                        var room = g_obj_map.get('msg_room');
                        if (room && room.get('map_id') == 'changan') {
                            if (room.get('short') == '地室') {
                                path = '';
                            } else if (room.get('short') == '万蛊堂') {
                                path = 's;';
                            } else if (room.get('short') == '千蛇窟') {
                                path = 'n;';
                            } else if (room.get('short') == '百毒池') {
                                path = 'e;';
                            } else if (room.get('short') == '十恶殿') {
                                path = 'w;';
                            } else {
                                path = 'jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;s;s;s;s;e;event_1_2215721;';
                            }
                        } else {
                            path = 'jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;s;s;s;s;e;event_1_2215721;';
                        }
                        if (bad_npc == '巫蛊王') {
                            path += 'n';
                        } else if (bad_npc == '夜千麟') {
                            path += 's';
                        } else if (bad_npc == '百毒旗主') {
                            path += 'w';
                        } else if (bad_npc == '十方恶神') {
                            path += 'e';
                        }
                        send_cmd(path);
                        action_state = 1;
                    }
                } else if (action_state == 1 && msg.get('type') == 'jh') {
                    if (msg.get('subtype') == 'info') {
                        for (var i = 1; ; i++) {
                            var npc = msg.get('npc' + i);
                            if (!npc) {
                                break;
                            } else {
                                var s = npc.split(',');
                                if (s.length > 1 && s[1] == good_npc) {
                                    target_id = s[0];
                                    clickButton('kill ' + target_id);
                                    action_state = 2;
                                    break;
                                }
                            }
                        }
                    } else if (msg.get('subtype') == 'new_npc' && msg.get('name') == good_npc) {
                        target_id = msg.get('id');
                        clickButton('kill ' + target_id);
                        action_state = 2;
                    }
                } else if (action_state == 2 && msg.get('type') == 'vs' && msg.get('subtype') == 'vs_info') {
                    var vs_info = g_obj_map.get('msg_vs_info');
                    var my_id = g_obj_map.get('msg_attrs').get('id');
                    var pos = check_pos(vs_info, my_id);
                    if (pos) {
                        set_attack_target(target_id);
                        action_state = 3;
                    }
                } else if (action_state == 2 && msg.get('type') == 'notice' && msg.get('subtype') == 'notify_fail'
                           && msg.get('msg').indexOf('已经太多人了，不要以多欺少啊。') == 0) {
                    console.log(msg.get('msg'));
                    if (bad_npc == '巫蛊王') {
                        send_cmd('s');
                    } else if (bad_npc == '夜千麟') {
                        send_cmd('n');
                    } else if (bad_npc == '百毒旗主') {
                        send_cmd('e');
                    } else if (bad_npc == '十方恶神') {
                        send_cmd('w');
                    }
                    action_state = 0;
                } else if (action_state == 2 && msg.get('type') == 'notice' && msg.get('subtype') == 'notify_fail') {
                    if (/^你今天完成的宝藏秘图任务数量已经超量了，明天继续吧。/.test(msg.get('msg'))) {
                        execute_cmd('#t- pintu');
                    }
                } else if (action_state == 3 && msg.get('type') == 'vs' && msg.get('subtype') == 'combat_result') {
                    action_state = 0;
                    if (bad_npc == '巫蛊王') {
                        send_cmd('s');
                    } else if (bad_npc == '夜千麟') {
                        send_cmd('n');
                    } else if (bad_npc == '百毒旗主') {
                        send_cmd('e');
                    } else if (bad_npc == '十方恶神') {
                        send_cmd('w');
                    }
                } else if (msg.get('type') == 'main_msg' && msg.get('ctype') == 'text') {
                    var r = removeSGR(msg.get('msg')).match(/^这是你今天完成的第(\d+)\/(\d+)场宝藏秘图之战！/);
                    if (r) {
                        console.log(r[0]);
                        if (parseInt(r[1]) >= parseInt(r[2])) {
                            execute_cmd('#t- pintu');
                        }
                    }
                }
            });
		} else if (cmd == '#t- pintu' && pintu_trigger) {
			log('pintu trigger closed');
			remove_listener(pintu_trigger);
			pintu_trigger = undefined;
        } else if (cmd == '#tr pintu') {
            if (!pintu_trigger) {
                execute_cmd('#t+ pintu');
            } else {
                execute_cmd('#t- pintu');
            }
		} else if ((cmd == '#t+ taofan' || cmd == '#t+ taofan 1' || cmd == '#t+ taofan 2') && !taofan_trigger) {
			log('open taofan trigger...');
			var taofan_target = kuafu + (cmd == '#t+ taofan 2' ? '段老大' : '无一'), taofan_id, action_state = 0;
			taofan_trigger = add_listener(['channel', 'main_msg', 'jh', 'vs', 'notice'], '', function(msg) {
                if (msg.get('type') == 'channel' && msg.get('subtype') == 'sys') {
                    if (removeSGR(msg.get('msg')).indexOf('【系统】' + kuafu + '段老大慌不择路，逃往了') >= 0) {
                        var r = msg.get('msg').match(/find_qinglong_road\s+(\d+)/);
                        if (r) {
                            console.log(new Date().format("HH:mm:ss") + ' goto taofan ' + r[0]);
                            clickButton(r[0]);
                            action_state = 1;
                        }
                    }
                } else if (action_state == 1 && msg.get('type') == 'jh') {
                    if (msg.get('subtype') == 'info') {
                        for (var i = 1; ; i++) {
                            var npc = msg.get('npc' + i);
                            if (!npc) {
                                break;
                            } else {
                                var s = npc.split(',');
                                if (s.length > 1 && removeSGR(s[1]) == taofan_target) {
                                    taofan_id = s[0];
                                    console.log(new Date().format("HH:mm:ss") + ' find taofan ' + taofan_id);
                                    action_state = 2;
                                    break;
                                }
                            }
                        }
                    } else if (msg.get('subtype') == 'new_npc' && removeSGR(msg.get('name')) == taofan_target) {
                        taofan_id = msg.get('id');
                        console.log(new Date().format("HH:mm:ss") + ' find taofan ' + taofan_id);
                        action_state = 2;
                    }
                } else if (action_state == 2 && msg.get('type') == 'main_msg' && msg.get('ctype') == 'text') {
                    if (removeSGR(msg.get('msg')).indexOf(kuafu + '无一对著' + kuafu + '段老大喝道：「臭贼！今日不是你死就是我活！」') >= 0) {
                        console.log(new Date().format("HH:mm:ss") + ' kill ' + taofan_id);
                        clickButton('kill ' + taofan_id);
                        action_state = 3;
                    }
                } else if (action_state == 3 && msg.get('type') == 'vs' && msg.get('subtype') == 'vs_info') {
                    var vs_info = g_obj_map.get('msg_vs_info');
                    var my_id = g_obj_map.get('msg_attrs').get('id');
                    var pos = check_pos(vs_info, my_id);
                    if (pos) {
                        set_attack_target(taofan_id);
                        var xdz = parseInt(vs_info.get(pos[0] + '_xdz' + pos[1]));
                        var buttons = get_skill_buttons(xdz);
                        select_perform(buttons, true);
                        action_state = 4;
                    }
                } else if (action_state == 3 && msg.get('type') == 'notice' && msg.get('subtype') == 'notify_fail'
                           && msg.get('msg').indexOf('已经太多人了，不要以多欺少啊。') == 0) {
                    console.log(msg.get('msg'));
                    action_state = 0;
                } else if (action_state == 2 && msg.get('type') == 'notice' && msg.get('subtype') == 'notify_fail') {
                    if (/^你今天的逃犯任务次数已达到上限，明天继续吧。/.test(msg.get('msg'))) {
                        execute_cmd('#t- taofan');
                    }
                } else if (action_state == 4 && msg.get('type') == 'vs' && msg.get('subtype') == 'combat_result') {
                    action_state = 0;
                    do_full('home');
                } else if (msg.get('type') == 'main_msg' && msg.get('ctype') == 'text') {
                    var r = removeSGR(msg.get('msg')).match(/^这是你今天完成的第(\d+)\/(\d+)场逃犯任务！/);
                    if (r) {
                        console.log(r[0]);
                        if (parseInt(r[1]) >= parseInt(r[2])) {
                            execute_cmd('#t- taofan');
                        }
                    }
                }
            });
		} else if (cmd == '#t- taofan' && taofan_trigger) {
			log('taofan trigger closed');
			remove_listener(taofan_trigger);
			taofan_trigger = undefined;
        } else if (cmd == '#tr taofan') {
            if (!taofan_trigger) {
                execute_cmd('#t+ taofan');
            } else {
                execute_cmd('#t- taofan');
            }
		} else if ((cmd == '#t+ qinglong' || cmd == '#t+ qinglong 1' || cmd == '#t+ qinglong 2') && !qinglong_trigger) {
			log('open qinglong trigger...');
            var qinglong_road, qinglong_target, target_id, action_state = 0;
			qinglong_trigger = add_listener(['main_msg', 'jh', 'vs', 'notice'], '',	function(msg) {
                if (msg.get('type') == 'main_msg' && msg.get('ctype') == 'text') {
                    var data = removeSGR(msg.get('msg'));
                    var r = data.match(/青龙会组织：(.+)正在(.+)施展力量，本会愿出(.+)的战利品奖励给本场战斗的最终获胜者。这是本大区第(\d+)个跨服青龙。/);
                    if (r) {
                        if (r[1].indexOf(kuafu) == 0) {
                            console.log(new Date().format("HH:mm:ss") + ' ' + removeLink(r[0]));
                            if (LIBS.equip_sets.get('T10').indexOf(r[3]) >= 0 || LIBS.equip_sets.get('T11').indexOf(r[3]) >= 0
                                    || LIBS.equip_sets.get('T12').indexOf(r[3]) >= 0) {
                                var s = r[2].match(/find_qinglong_road\s+(\d+)/);
                                if (s) {
                                    qinglong_road = s[0];
                                    clickButton(qinglong_road);
                                    if (cmd == '#t+ qinglong 1') {
                                        qinglong_target = r[1];
                                        action_state = 1;
                                    } else if (cmd == '#t+ qinglong 2') {
                                        qinglong_target = kuafu + qinglong_npcs.get(removeLink(r[2]));
                                        action_state = 1;
                                    }
                                }
                            }
                        }
                    } else {
                        r = data.match(/青龙会组织：(.+)正在(.+)施展力量，本会愿出(.+)的战利品奖励给本场战斗的最终获胜者。这是跨服第(\d+)个全服跨服青龙。/);
                        if (r && r[1].indexOf('[新区]') < 0) {
                            console.log(new Date().format("HH:mm:ss") + ' ' + removeLink(r[0]));
                            var s = r[2].match(/find_qinglong_road\s+(\d+)/);
                            if (s) {
                                qinglong_road = s[0];
                                clickButton(qinglong_road);
                            }
                        }
                    }
                } else if (action_state == 1 && msg.get('type') == 'jh') {
                    if (msg.get('subtype') == 'info') {
                        for (var i = 1; ; i++) {
                            var npc = msg.get('npc' + i);
                            if (!npc) {
                                break;
                            } else {
                                var s = npc.split(',');
                                if (s.length > 1 && removeSGR(s[1]) == qinglong_target) {
                                    target_id = s[0];
                                    clickButton('kill ' + target_id);
                                    action_state = 2;
                                    break;
                                }
                            }
                        }
                    } else if (msg.get('subtype') == 'new_npc' && removeSGR(msg.get('name')) == qinglong_target) {
                        target_id = msg.get('id');
                        clickButton('kill ' + target_id);
                        action_state = 2;
                    }
                } else if (action_state == 2 && msg.get('type') == 'vs' && msg.get('subtype') == 'vs_info') {
                    set_attack_target(target_id);
                    action_state = 3;
                } else if (action_state == 2 && msg.get('type') == 'notice' && msg.get('subtype') == 'notify_fail'
                           && msg.get('msg').indexOf('已经太多人了，不要以多欺少啊。') == 0) {
                    console.log(msg.get('msg'));
                    action_state = 0;
                } else if (action_state == 3 && msg.get('type') == 'vs' && msg.get('subtype') == 'combat_result') {
                    action_state = 0;
                    do_full(qinglong_road);
                }
            });
		} else if (cmd == '#t- qinglong' && qinglong_trigger) {
			log('qinglong trigger closed');
			remove_listener(qinglong_trigger);
			qinglong_trigger = undefined;
        } else if (cmd == '#tr qinglong') {
            if (!qinglong_trigger) {
                execute_cmd('#t+ qinglong');
            } else {
                execute_cmd('#t- qinglong');
            }
		} else if ((cmd == '#t+ biaoche' || cmd == '#t+ biaoche 1' || cmd == '#t+ biaoche 2') && !biaoche_trigger) {
			log('open biaoche trigger...');
            var biaoche_road, biaoche_target, target_id, action_state = 0;
			biaoche_trigger = add_listener(['main_msg', 'jh', 'vs', 'notice'], '', function(msg) {
                if (msg.get('type') == 'main_msg' && msg.get('ctype') == 'text') {
                    var data = removeSGR(msg.get('msg'));
                    var r = data.match(/荣威镖局:(.*)押运镖车行至跨服\-(.*)，忽入(.*)埋伏之中，哪位好汉能伸出援手，我荣威镖局必有重谢！/);
                    if (r && r[1].indexOf(kuafu) == 0) {
                        console.log(new Date().format("HH:mm:ss") + ' ' + removeLink(r[0]));
                        var s = r[2].match(/find_qinglong_road\s+(\d+)/);
                        if (s) {
                            biaoche_road = s[0];
                            clickButton(biaoche_road);
                            if (cmd == '#t+ biaoche 1') {
                                biaoche_target = r[3];
                                action_state = 1;
                            } else if (cmd == '#t+ biaoche 2') {
                                biaoche_target = r[1];
                                action_state = 1;
                            }
                        }
                    }
                } else if (action_state == 1 && msg.get('type') == 'jh') {
                    if (msg.get('subtype') == 'info') {
                        for (var i = 1; ; i++) {
                            var npc = msg.get('npc' + i);
                            if (!npc) {
                                break;
                            } else {
                                var s = npc.split(',');
                                if (s.length > 1 && removeSGR(s[1]) == biaoche_target) {
                                    target_id = s[0];
                                    clickButton('kill ' + target_id);
                                    action_state = 2;
                                    break;
                                }
                            }
                        }
                    } else if (msg.get('subtype') == 'new_npc' && removeSGR(msg.get('name')) == biaoche_target) {
                        target_id = msg.get('id');
                        clickButton('kill ' + target_id);
                        action_state = 2;
                    }
                } else if (action_state == 2 && msg.get('type') == 'vs' && msg.get('subtype') == 'vs_info') {
                    set_attack_target(target_id);
                    action_state = 3;
                } else if (action_state == 2 && msg.get('type') == 'notice' && msg.get('subtype') == 'notify_fail'
                           && msg.get('msg').indexOf('已经太多人了，不要以多欺少啊。') == 0) {
                    console.log(msg.get('msg'));
                    action_state = 0;
                } else if (action_state == 3 && msg.get('type') == 'vs' && msg.get('subtype') == 'combat_result') {
                    action_state = 0;
                    do_full(biaoche_road);
                }
            });
		} else if (cmd == '#t- biaoche' && biaoche_trigger) {
			log('biaoche trigger closed');
			remove_listener(biaoche_trigger);
			biaoche_trigger = undefined;
        } else if (cmd == '#tr biaoche') {
            if (!biaoche_trigger) {
                execute_cmd('#t+ biaoche');
            } else {
                execute_cmd('#t- biaoche');
            }
		} else if (cmd == '#party') {
			log('start auto party...');
            var action, area, rooms, npc, item, current_room, action_state = 0;
            add_task_listener(['main_msg', 'jh', 'vs'], '', function(msg) {
                if (msg.get('type') == 'main_msg' && msg.get('ctype') == 'text') {
                    var data = removeLink(removeSGR(msg.get('msg')));
                    if (data.indexOf('今天做的师门任务已过量，明天再来。') == 0) {
                        stop_task('finish!');
                        return;
                    }
                    if (data.indexOf('现在没有任务，好好练功吧！！') >= 0) {
                        setTimeout(function() {
                            send_cmd('family_quest');
                        }, 500);
                        return;
                    }
                    if (/^恭喜你完成师门任务，这是你连续完成的第\d+个师门任务！/.test(data)) {
                        send_cmd('home;family_quest');
                        return;
                    }
                    if (action_state == 1 && data.indexOf('你自言自语不知道在说些什么') == 0) {
                        if (rooms.length == 0) {
                            log('no room found');
                        } else {
                            var room = rooms.shift();
                            var path = current_room ? get_path_to(area, current_room, room) : get_path(area, room);
                            console.log('path: ' + path);
                            send_cmd(path + ';say');
                            current_room = room;
                            action_state = 2;
                        }
                        return;
                    }
                    if (action_state == 2 && data.indexOf('你自言自语不知道在说些什么') == 0) {
                        if (action == '战胜') {
                            var target = find_target(npc, [ 'npc' ]);
                            if (target) {
                                send_cmd('fight ' + target[0]);
                                action_state = 3;
                            } else {
                                send_cmd('say');
                                action_state = 1;
                            }
                        } else if (action == '杀') {
                            var target = find_target(npc, [ 'npc' ]);
                            if (target) {
                                send_cmd('kill ' + target[0]);
                                action_state = 3;
                            } else {
                                send_cmd('say');
                                action_state = 1;
                            }
                        } else if (!npc) {
                            var target = find_target(item, [ 'item' ]);
                            if (target) {
                                send_cmd('get ' + target[0] + ';home;give ' + get_master_id());
                                action_state = 0;
                            } else {
                                send_cmd('say');
                                action_state = 1;
                            }
                        } else {
                            var target = find_target(npc, [ 'npc' ]);
                            if (target) {
                                var sell_list = LIBS.sellers.get(target[0]);
                                if (sell_list) {
                                    var item_id = sell_list.get(item);
                                    if (item_id) {
                                        send_cmd('buy ' + item_id + ' from ' + target[0] + ';home;give ' + get_master_id());
                                        action_state = 0;
                                    } else {
                                        send_cmd('kill ' + target[0]);
                                        action_state = 4;
                                    }
                                } else {
                                    send_cmd('kill ' + target[0]);
                                    action_state = 4;
                                }
                            } else {
                                send_cmd('say');
                                action_state = 1;
                            }
                        }
                        return;
                    }
                    var r = data.match(/^.+道：给我在.+内(战胜|杀|寻找)(.+)。\n任务所在地方好像是：(.+)\n你已经连续完成了\d+个任务。\n你今天已完成(\d+)\/(\d+)个任务。$/m);
                    if (!r) {
                        r = data.match(/^你现在的任务是(战胜|杀|寻找)(.+)。\n任务所在地方好像是：(.+)\n你还剩下.+去完成。\n你已经连续完成了\d+个任务。\n你今天已完成(\d+)\/(\d+)个任务。$/m);
                    }
                    if (r) {
                        action_state = 0;
                        action = r[1];
                        var target = r[2];
                        var place = r[3];
                        if (parseInt(r[4]) + 1 == parseInt(r[5])) {
                            send_cmd('vip finish_family');
                        }
                        var arr = place.split('-');
                        if (/^\*.+\*$/.test(arr[1])) {
                            arr.splice(1,1);
                        }
                        var map = arr[0];
                        var room = $.trim(arr[1]);
                        if (action == '寻找') {
                            npc = arr.length > 2 ? $.trim(arr[2]) : null;
                            item = $.trim(target);
                        } else {
                            npc = $.trim(target);
                            item = null;
                        }
                        var spec = false;
                        if (map == '华山村' && npc == '黑狗') {
                            spec = true;
                        } else if (map == '全真教' && npc == '小道童') {
                            spec = true;
                        } else if (map == '古墓' && npc == '玉蜂') {
                            spec = true;
                        } else if (map == '大旗门' && npc == '宾奴') {
                            spec = true;
                        } else if (map == '大昭寺' && npc == '护寺藏尼') {
                            spec = true;
                        } else if (map == '桃花岛' && npc == '桃花岛弟子') {
                            spec = true;
                        } else if (map == '大理' && (npc == '采笋人' || npc == '农夫' || npc == '台夷商贩"')) {
                            spec = true;
                        }
                        area = get_area(map);
                        if (!area) {
                            log('map not found: ' + map);
                            return;
                        }
                        rooms = npc ? find_rooms_by_npc(area, npc) : find_rooms_by_item(area, item);
                        if (spec) {
                            for (var i = rooms.length - 1; i >= 0; i--) {
                                if (rooms[i].name != room) {
                                    rooms.splice(i, 1);
                                }
                            }
                        }
                        if (rooms.length == 0) {
                            log('room not found: ' + room);
                            return;
                        }
                        send_cmd('say');
                        current_room = undefined;
                        action_state = 1;
                    }
                } else if ((action_state == 3 || action_state == 4) && msg.get('type') == 'vs') {
                    var vs_info = g_obj_map.get('msg_vs_info');
                    var my_id = g_obj_map.get('msg_attrs').get('id');
                    if (msg.get('subtype') == 'add_xdz' && msg.get('uid') == my_id) {
                        fast_perform(vs_info, my_id);
                    }
                } else if (action_state == 4 && msg.get('type') == 'jh' && msg.get('subtype') == 'new_item') {
                    if (removeSGR(msg.get('name')) == npc + '的尸体') {
                        send_cmd('get ' + msg.get('id') + ';home;give ' + get_master_id());
                    }
                }
            });
            send_cmd('home;family_quest');
 		} else if (cmd == '#guild') {
			log('start auto guild...');
            var action, area, rooms, npc, item, current_room, action_state = 0;
            add_task_listener(['main_msg', 'jh', 'vs'], '', function(msg) {
                if (msg.get('type') == 'main_msg' && msg.get('ctype') == 'text') {
                    var data = removeLink(removeSGR(msg.get('msg')));
                    if (data.indexOf('今天做的帮派任务已过量，明天再来。') == 0) {
                        stop_task('finish!');
                        return;
                    }
                    if (data.indexOf('现在没有任务，好好练功吧！！') >= 0) {
                        setTimeout(function() {
                            send_cmd('clan task');
                        }, 500);
                        return;
                    }
                    if (/^恭喜你完成帮派任务，这是你连续完成的第\d+个帮派任务！/.test(data)) {
                        send_cmd('clan scene;clan task');
                        return;
                    }
                    if (action_state == 1 && data.indexOf('你自言自语不知道在说些什么') == 0) {
                        if (rooms.length == 0) {
                            log('no room found');
                        } else {
                            var room = rooms.shift();
                            var path = current_room ? get_path_to(area, current_room, room) : get_path(area, room);
                            console.log('path: ' + path);
                            send_cmd(path + ';say');
                            current_room = room;
                            action_state = 2;
                        }
                        return;
                    }
                    if (action_state == 2 && data.indexOf('你自言自语不知道在说些什么') == 0) {
                        if (action == '战胜') {
                            var target = find_target(npc, [ 'npc' ]);
                            if (target) {
                                send_cmd('fight ' + target[0]);
                                action_state = 3;
                            } else {
                                send_cmd('say');
                                action_state = 1;
                            }
                        } else if (action == '杀') {
                            var target = find_target(npc, [ 'npc' ]);
                            if (target) {
                                send_cmd('kill ' + target[0]);
                                action_state = 3;
                            } else {
                                send_cmd('say');
                                action_state = 1;
                            }
                        } else if (!npc) {
                            var target = find_target(item, [ 'item' ]);
                            if (target) {
                                send_cmd('get ' + target[0] + ';clan scene;clan submit_task');
                                action_state = 0;
                            } else {
                                send_cmd('say');
                                action_state = 1;
                            }
                        } else {
                            var target = find_target(npc, [ 'npc' ]);
                            if (target) {
                                var sell_list = LIBS.sellers.get(target[0]);
                                if (sell_list) {
                                    var item_id = sell_list.get(item);
                                    if (item_id) {
                                        send_cmd('buy ' + item_id + ' from ' + target[0] + ';clan scene;clan submit_task');
                                        action_state = 0;
                                    } else {
                                        send_cmd('kill ' + target[0]);
                                        action_state = 4;
                                    }
                                } else {
                                    send_cmd('kill ' + target[0]);
                                    action_state = 4;
                                }
                            } else {
                                send_cmd('say');
                                action_state = 1;
                            }
                        }
                        return;
                    }
                    var r = data.match(/^帮派使者：给我在.+内(战胜|杀|寻找)(.+)。\n任务所在地方好像是：(.+)\n你已经连续完成了\d+个任务。\n你今天已完成(\d+)\/(\d+)个任务。$/m);
                    if (!r) {
                        r = data.match(/^你现在的任务是(战胜|杀|寻找)(.+)。\n任务所在地方好像是：(.+)\n你还剩下.+去完成。\n你已经连续完成了\d+个任务。\n你今天已完成(\d+)\/(\d+)个任务。$/m);
                    }
                    if (r) {
                        action_state = 0;
                        action = r[1];
                        var target = r[2];
                        var place = r[3];
                        if (parseInt(r[4]) + 1 == parseInt(r[5])) {
                            send_cmd('vip finish_clan');
                        }
                        var arr = place.split('-');
                        if (/^\*.+\*$/.test(arr[1])) {
                            arr.splice(1,1);
                        }
                        var map = arr[0];
                        var room = $.trim(arr[1]);
                        if (action == '寻找') {
                            npc = arr.length > 2 ? $.trim(arr[2]) : null;
                            item = $.trim(target);
                        } else {
                            npc = $.trim(target);
                            item = null;
                        }
                        var spec = false;
                        if (map == '华山村' && npc == '黑狗') {
                            spec = true;
                        } else if (map == '全真教' && npc == '小道童') {
                            spec = true;
                        } else if (map == '古墓' && npc == '玉蜂') {
                            spec = true;
                        } else if (map == '大旗门' && npc == '宾奴') {
                            spec = true;
                        } else if (map == '大昭寺' && npc == '护寺藏尼') {
                            spec = true;
                        } else if (map == '桃花岛' && npc == '桃花岛弟子') {
                            spec = true;
                        } else if (map == '大理' && (npc == '采笋人' || npc == '农夫' || npc == '台夷商贩"')) {
                            spec = true;
                        }
                        area = get_area(map);
                        if (!area) {
                            log('map not found: ' + map);
                            return;
                        }
                        rooms = npc ? find_rooms_by_npc(area, npc) : find_rooms_by_item(area, item);
                        if (spec) {
                            for (var i = rooms.length - 1; i >= 0; i--) {
                                if (rooms[i].name != room) {
                                    rooms.splice(i, 1);
                                }
                            }
                        }
                        if (rooms.length == 0) {
                            log('room not found: ' + room);
                            return;
                        }
                        send_cmd('say');
                        current_room = undefined;
                        action_state = 1;
                    }
                } else if ((action_state == 3 || action_state == 4) && msg.get('type') == 'vs') {
                    var vs_info = g_obj_map.get('msg_vs_info');
                    var my_id = g_obj_map.get('msg_attrs').get('id');
                    if (msg.get('subtype') == 'add_xdz' && msg.get('uid') == my_id) {
                        fast_perform(vs_info, my_id);
                    }
                } else if (action_state == 4 && msg.get('type') == 'jh' && msg.get('subtype') == 'new_item') {
                    if (removeSGR(msg.get('name')) == npc + '的尸体') {
                        send_cmd('get ' + msg.get('id') + ';clan scene;clan submit_task');
                    }
                }
            });
            send_cmd('clan scene;clan task');
 		} else if (cmd == '#t+ task' && !task_trigger) {
			log('open task trigger...');
            var go_npc_patterns = [
                /^(.+)道：上次我不小心，竟然吃了(.+)\-(.+)的亏，.+去杀了.?！/,
                /^(.+)道：(.+)\-(.+)竟对我横眉瞪眼的，真想杀掉.?！/,
                /^(.+)道：(.+)\-(.+)昨天捡到了我几十辆银子，拒不归还。钱是小事，但人品可不好。.+去杀了.?！/,
                /^(.+)道：我十分讨厌那(.+)\-(.+)，.+替我去教训教训.?罢！/,
                /^(.+)道：(.+)\-(.+)竟敢得罪我，.+去让.?尝尝厉害吧！/,
                /^(.+)道：(.+)\-(.+)十分嚣张，去让.?见识见识厉害！/,
                /^(.+)道：(.+)\-(.+)好大胆，竟敢拿走了我的.+，去替我要回来可好？/,
                /^(.+)道：我有个.+被(.+)\-(.+)抢走了，去替我要回来吧！/,
                /^(.+)道：我有个事情想找(.+)\-(.+)，.+可否替我走一趟？/,
                /^(.+)道：我想找(.+)\-(.+)商量一点事情，.+替我找一下？/,
                /^(.+)道：(.+)\-(.+)看上去好生奇怪，.+可前去打探一番。/,
                /^(.+)道：(.+)\-(.+)鬼鬼祟祟的叫人生疑，.+去打探打探情况。/
            ];
            var go_room_patterns = [
                /^(.+)道：我将.+藏在了(.+)\-(.+)，.+可前去寻找。/
            ];
            var find_item_patterns = [
                /^(.+)道：突然想要一.?(.+)，.+可否帮忙找来？/,
                /^(.+)道：唉，好想要一.?(.+)啊。/
            ];
            var back_npc_patterns = [
                /^.+脚一蹬，死了。现在可以回去找(.+)交差了。/,
                /^.+说道：好，好，好，我知错了……你回去转告(.+)吧。/,
                /^.+说道：好，我知道了。你回去转告(.+)吧。/,
                /^.+老老实实将东西交了出来，现在可以回去找(.+)交差了。/,
                /^你一番打探，果然找到了一些线索，回去告诉(.+)吧。/,
                /^你一番搜索，果然找到了，回去告诉(.+)吧。/
            ];
            var _create_link = function(path, label, is_back) {
                var link = '<span style="color:red;">[<a style="text-decoration:underline;color:red;" href="javascript:send_cmd(\''
                        + path + '\', 0);">GO</a>]</span>';
                if (label) {
                    var $e = $('#out2 span.out2:last a');
                    if (!is_back) {
                        $e = $($e.get().reverse());
                    }
                    $e.each(function() {
                        var t = $(this).text();
                        if (t.indexOf('-') >= 0) {
                            t = t.substring(t.indexOf('-') + 1);
                        }
                        if (t == label) {
                            $(this).after(link);
                            return false;
                        }
                    });
                } else {
                    $('#out2 span.out2:last').append(link);
                }
            };
            var tasks = new Map(), action_state = 0;
            task_trigger = add_listener(['main_msg', 'notice'], '', function(msg) {
                if (msg.get('type') == 'main_msg' && msg.get('ctype') == 'text') {
                    var data = removeLink(removeSGR(msg.get('msg')));
                    var r = data.match(/^完成谜题\((\d+)\/(\d+)\)：(.+)的谜题，获得：\n经验x(\d+)\n潜能x(\d+)\n银两x(\d+)/m);
                    if (r) {
                        var path = tasks.get(r[3]);
                        if (path) {
                            _create_link(path);
                            tasks.remove(r[3]);
                        }
                        return;
                    }
                    if (/^\[谜题/.test(data)) {
                        return;
                    }
                    for (var i = 0; i < go_npc_patterns.length; i++) {
                        r = data.match(go_npc_patterns[i]);
                        if (r) {
                            if (r[1] != '一个声音说') {
                                var area = get_area_by_mapid(get_map_id());
                                if (area) {
                                    var room = get_room_by_npc(area, get_room_name(), r[1]);
                                    if (room) {
                                        var path = get_path(area, room);
                                        tasks.put(r[1], path);
                                        _create_link(path, r[1], true);
                                    }
                                }
                            }
                            var area = get_area(r[2]);
                            if (area) {
                                var rooms = find_rooms_by_npc(area, r[3]);
                                if (rooms.length > 0) {
                                    var path = get_path(area, rooms[0]);
                                    _create_link(path, r[3]);
                                }
                            }
                            return;
                        }
                    }
                    for (var i = 0; i < go_room_patterns.length; i++) {
                        r = data.match(go_room_patterns[i]);
                        if (r) {
                            if (r[1] != '一个声音说') {
                                var area = get_area_by_mapid(get_map_id());
                                if (area) {
                                    var room = get_room_by_npc(area, get_room_name(), r[1]);
                                    if (room) {
                                        var path = get_path(area, room);
                                        tasks.put(r[1], path);
                                        _create_link(path, r[1], true);
                                    }
                                }
                            }
                            var area = get_area(r[2]);
                            if (area) {
                                var rooms = find_rooms(area, r[3]);
                                if (rooms.length > 0) {
                                    var path = get_path(area, rooms[0]);
                                    _create_link(path, r[3]);
                                }
                            }
                            return;
                        }
                    }
                    for (var i = 0; i < find_item_patterns.length; i++) {
                        r = data.match(find_item_patterns[i]);
                        if (r) {
                            var area = get_area_by_mapid(get_map_id());
                            if (r[1] != '一个声音说') {
                                if (area) {
                                    var room = get_room_by_npc(area, get_room_name(), r[1]);
                                    if (room) {
                                        var path = get_path(area, room);
                                        tasks.put(r[1], path);
                                        _create_link(path, r[1], true);
                                    }
                                }
                            }
                            if (area) {
                                var list = [area];
                                var j = area.index;
                                area = get_area_by_index(j - 1);
                                if (area) {
                                    list.push(area);
                                }
                                area = get_area_by_index(j + 1);
                                if (area) {
                                    list.push(area);
                                }
                                area = get_area_by_index(j - 2);
                                if (area) {
                                    list.push(area);
                                }
                                area = get_area_by_index(j + 2);
                                if (area) {
                                    list.push(area);
                                }
                                area = get_area_by_index(j - 3);
                                if (area) {
                                    list.push(area);
                                }
                                area = get_area_by_index(j + 3);
                                if (area) {
                                    list.push(area);
                                }
                                area = get_area_by_index(j - 4);
                                if (area) {
                                    list.push(area);
                                }
                                area = get_area_by_index(j + 4);
                                if (area) {
                                    list.push(area);
                                }
                                for (var k = 0; k < list.length; k++) {
                                    area = list[k];
                                    var rooms = find_rooms_by_item(area, r[2], true);
                                    if (rooms.length > 0) {
                                        var path = get_path(area, rooms[0]);
                                        _create_link(path, r[2]);
                                        break;
                                    }
                                }
                            }
                            return;
                        }
                    }
                    for (var i = 0; i < back_npc_patterns.length; i++) {
                        r = data.match(back_npc_patterns[i]);
                        if (r) {
                            var path = tasks.get(r[1]);
                            if (path) {
                                _create_link(path, r[1], true);
                            }
                            return;
                        }
                    }
                } else if (msg.get('type') == 'notice') {
                    if (msg.get('msg').indexOf('清空谜题任务成功。') == 0) {
                        tasks.clear();
                        return;
                    }
                }
            });
		} else if (cmd == '#t- task' && task_trigger) {
			log('task trigger closed');
			remove_listener(task_trigger);
			task_trigger = undefined;
        } else if (cmd == '#tr task') {
            if (!task_trigger) {
                execute_cmd('#t+ task');
            } else {
                execute_cmd('#t- task');
            }
		} else if (cmd == '#t+ snoop' && !snoop_trigger) {
			log('open snoop trigger...');
			snoop_trigger = add_listener('channel', '', function(msg) {
                var data = removeSGR(msg.get('msg'));
                if (msg.get('subtype') == 'rumor') {
                    var r = data.match(/^【谣言】某人：听说(.+)被(.+)杀死了。/);
                    if (r && snoop_list.indexOf(r[2]) >= 0 && snoop_ignore_list.indexOf(r[1]) < 0) {
                        console.log(new Date().format("HH:mm:ss") + ' ' + r[0]);
                    }
                } else if (msg.get('subtype') == 'sys') {
                    var data = removeLink(data);
                    var r = data.match(/^【系统】青龙会组织：(.*)正在(.*)施展力量，本会愿出(.*)的战利品奖励给本场战斗的最终获胜者。这是(.+)青龙。/);
                    if (!r) {
                        r = data.match(/^【系统】跨服：(.*)逃到了跨服时空(.*)之中，青龙会组织悬赏(.*)惩治恶人，众位英雄快来诛杀。这是(.+)青龙。/);
                    }
                    if (r && (r[1].substr(0, 1) != '[' || r[1].indexOf(kuafu) == 0)) {
                        console.log(new Date().format("HH:mm:ss") + ' ' + r[0]);
                    }
                }
            });
		} else if (cmd == '#t- snoop' && snoop_trigger) {
			log('snoop trigger closed');
			remove_listener(snoop_trigger);
			snoop_trigger = undefined;
        } else if (cmd == '#tr snoop') {
            if (!snoop_trigger) {
                execute_cmd('#t+ snoop');
            } else {
                execute_cmd('#t- snoop');
            }
		} else if (cmd == '#mapid') {
            var room = g_obj_map.get('msg_room');
            if (room && room.get('map_id')) {
                log('map id: ' + room.get('map_id'));
            } else {
                log('no map id');
            }
		} else if (cmd == '#daily') {
            log('start auto daily...');
            var action_state = 0;
            add_task_listener(['main_msg', 'look_npc', 'jh', 'vs', 'show_html_page', 'notice', 'unknow_command'], '', function(msg) {
                if (msg.get('type') == 'main_msg' && msg.get('ctype') == 'text') {
                    if (/^你自言自语不知道在说些什么/.test(msg.get('msg'))) {
                        if (action_state == 1) {
                            var cmds = [];
                            cmds.push('work click maikuli');
                            cmds.push('work click duancha');
                            cmds.push('work click dalie');
                            cmds.push('work click baobiao');
                            cmds.push('work click maiyi');
                            cmds.push('work click xuncheng');
                            cmds.push('work click datufei');
                            cmds.push('work click dalei');
                            cmds.push('work click kangjijinbin');
                            cmds.push('work click zhidaodiying');
                            cmds.push('work click dantiaoqunmen');
                            cmds.push('work click shenshanxiulian');
                            cmds.push('work click jianmenlipai');
                            cmds.push('work click dubawulin');
                            cmds.push('work click youlijianghu');
                            cmds.push('work click yibangmaoxiang');
                            cmds.push('work click zhengzhanzhongyuan');
                            cmds.push('work click taofamanzu');
                            cmds.push('public_op3');
                            cmds.push('say');
                            send_cmd(cmds);
                            action_state = 2;
                        } else if (action_state == 2) {
                            var cmds = [];
                            cmds.push('vip drops');
                            for (var i = 0; i < 10; i++) {
                                cmds.push('vip finish_big_task');
                            }
                            for (var i = 0; i < 10; i++) {
                                cmds.push('vip finish_dig');
                            }
                            for (var i = 0; i < 10; i++) {
                                cmds.push('vip finish_diaoyu');
                            }
                            cmds.push('vip finish_fb dulongzhai');
                            cmds.push('vip finish_fb dulongzhai');
                            cmds.push('vip finish_fb junying');
                            cmds.push('vip finish_fb junying');
                            cmds.push('vip finish_fb beidou');
                            cmds.push('vip finish_fb beidou');
                            cmds.push('vip finish_fb youling');
                            cmds.push('vip finish_fb youling');
                            cmds.push('vip finish_fb siyu');
                            cmds.push('vip finish_fb changleweiyang');
                            cmds.push('say');
                            send_cmd(cmds);
                            action_state = 3;
                        } else if (action_state == 3) {
                            var cmds = [];
                            for (var i = 0; i < 20; i++) {
                                cmds.push('clan incense yx');
                            }
                            for (var i = 0; i < 10; i++) {
                                cmds.push('clan buy 703');
                            }
                            cmds.push('say');
                            send_cmd(cmds);
                            action_state = 4;
                        } else if (action_state == 4) {
                            var cmds = [];
                            cmds.push('cangjian get_all');
                            cmds.push('xueyin_shenbinggu blade get_all');
                            cmds.push('xueyin_shenbinggu unarmed get_all');
                            cmds.push('xueyin_shenbinggu throwing get_all');
                            cmds.push('xueyin_shenbinggu spear get_all');
                            cmds.push('xueyin_shenbinggu hammer get_all');
                            cmds.push('xueyin_shenbinggu axe get_all');
                            cmds.push('xueyin_shenbinggu whip get_all');
                            cmds.push('xueyin_shenbinggu stick get_all');
                            cmds.push('xueyin_shenbinggu staff get_all');
                            cmds.push('say');
                            send_cmd(cmds);
                            action_state = 5;
                        } else if (action_state == 5) {
                            send_cmd('jh 1;look_npc snow_mercenary');
                        } else if (action_state == 13) {
                            var cmds = [];
                            cmds.push('cangjian get_all');
                            cmds.push('swords select_member houshan_miejue');
                            cmds.push('swords select_member quanzhen_wantong');
                            cmds.push('swords select_member quanzhen_wang');
                            cmds.push('swords fight_test go');
                            send_cmd(cmds);
                        } else if (action_state == 15) {
                            send_cmd('jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;n;n;n;w;event_1_31320275;say');
                            action_state = 16;
                        } else if (action_state == 16) {
                            send_cmd('jh 14;w;n;n;n;n;event_1_32682066;event_1_48044005;kill bingyuegu_binglinshou');
                        } else if (action_state == 17) {
                            if (get_room_name() == '冰月之渊') {
                                send_cmd('event_1_41741346;kill bingyuegu_jiuyoumoling');
                            } else {
                                send_cmd('say');
                                action_state = 18;
                            }
                        } else if (action_state == 18) {
                            send_cmd('team quit;jh 26;w;w;n;n;event_1_14435995;s;e;e;event_1_18075497;w;w;w;w;say');
                            action_state = 19;
                        } else if (action_state == 19) {
                            if (get_room_name() == '阴山岩画') {
                                send_cmd('wield sword of windspring;event_1_12853448;auto_equip on;say');
                                action_state = 20;
                            } else {
                                send_cmd('jh 26;w;w;n;w;w;w;n;n;e;e;say');
                            }
                        } else if (action_state == 20) {
                            var attrs = g_obj_map.get('msg_attrs');
                            if (parseInt(attrs.get('str')) >= 87) {
                                var item = get_item('obj_baiyujian');
                                if (!item || parseInt(item[2]) < 50) {
                                    send_cmd('jh 15;s;s;s;s;w;look_npc qingcheng_weaponor');
                                } else {
                                    send_cmd('jh 28;n;w;w;w;w;w;w;nw;ne;nw;ne;nw;ne;e;shediao');
                                    action_state = 21;
                                }
                            } else {
                                send_cmd('jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;ne;ne;se;n;event_1_97487911;say');
                                action_state = 23;
                            }
                        } else if (action_state == 23) {
                            send_cmd('jh 35;nw;nw;nw;n;ne;nw\nw;nw;e;e;e;e;e;se;n;n;w;n;w;event_1_53278632;sousuo;sousuo;jh 36;yell;say');
                            action_state = 24;
                        } else if (action_state == 24) {
                            if (get_room_name() == '东海码头') {
                                setTimeout(function() {
                                    send_cmd('yell;say');
                                }, 2000);
                            }
                        } else if (action_state == 25) {
                            if (get_room_name() == '崖底') {
                                send_cmd('event_1_4788477;nw;w;sw;w;n;n;w;w;w;s;w;nw;ne;ne;ne;e;e;e;e;e;s;e;event_1_44025101;say');
                            } else {
                                send_cmd('event_1_36230918;e;e;s;event_1_77496481;say');
                                action_state = 26;
                            }
                        } else if (action_state == 26) {
                            if (get_room_name() == '澜沧江南岸') {
                                send_cmd('se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;w');
                                send_cmd('shop money_buy shop9_N_10;shop money_buy shop9_N_5;shop money_buy shop10_N_10;shop money_buy shop10_N_5;lianyao');
                            } else {
                                send_cmd('jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;say');
                            }
                        } else if (action_state == 27) {
                            if (get_room_name() == '失足岩') {
                                send_cmd('nw;n;ne;nw;nw;w;n;n;n;e;e;s;give tianshan_hgdz;ask tianshan_hgdz;ask tianshan_hgdz;s;event_1_34855843;say');
                                action_state = 28;
                            } else {
                                send_cmd('se;s;e;n;ne;nw;event_1_58460791;say');
                            }
                        } else if (action_state == 28) {
                            stop_task('finish');
                        }
                    } else if (action_state == 24 && /^大船终于抵达了南海岸边。你走下船来。/.test(msg.get('msg'))) {
                        send_cmd('e;ne;ne;ne;e;e;e;event_1_9179222;e;event_1_11720543;w;n;e;e;s;e;event_1_44025101;say');
                        action_state = 25;
                    }
                } else if (msg.get('type') == 'look_npc') {
                    if (action_state == 5 && msg.get('id') == 'snow_mercenary') {
                        for (var i = 1; ; i++) {
                            var name = msg.get('cmd' + i + '_name');
                            if (!name) {
                                break;
                            }
                            if (name != '兑换礼包' && name != '1元礼包' && /.+礼包$/.test(name)) {
                                send_cmd(msg.get('cmd' + i));
                            }
                        }
                        send_cmd('e;e;event_1_63788647;w;n;e;e;look_npc snow_fist_trainer');
                        action_state = 6;
                    } else if (action_state == 6 && msg.get('id') == 'snow_fist_trainer') {
                        send_cmd('event_1_44731074;event_1_8041045;event_1_8041045;event_1_29721519;e;e;n;look_npc snow_girl');
                        action_state = 7;
                    } else if (action_state == 7 && msg.get('id') == 'snow_girl') {
                        send_cmd('lq_lmyh_lb;lq_bysf_lb;lq_dlth_lb;s;w;w;w;w;n;w;items;look_npc snow_smith');
                        action_state = 8;
                    } else if (action_state == 8 && msg.get('id') == 'snow_smith') {
                        var item = get_item('yuhanyi');
                        if (!item) {
                            send_cmd('event_1_24319712');
                        }
                        send_cmd('jh 2;n;n;n;n;w;s;look_npc luoyang_hongniang');
                        action_state = 9;
                    } else if (action_state == 9 && msg.get('id') == 'luoyang_hongniang') {
                        send_cmd('lq_chunhui_lb;n;e;n;n;n;look_npc luoyang_luoyang3');
                        action_state = 10;
                    } else if (action_state == 10 && msg.get('id') == 'luoyang_luoyang3') {
                        send_cmd('lq_chunhui_lb;e;look_npc luoyang_luoyang4');
                        action_state = 11;
                    } else if (action_state == 11 && msg.get('id') == 'luoyang_luoyang4') {
                        send_cmd('tzjh_lq;jh 5;n;n;e;look_npc yangzhou_yangzhou9');
                        action_state = 12;
                    } else if (action_state == 12 && msg.get('id') == 'yangzhou_yangzhou9') {
                        for (var i = 1; ; i++) {
                            var name = msg.get('cmd' + i + '_name');
                            if (!name) {
                                break;
                            }
                            if (/.+礼包$/.test(name)) {
                                send_cmd(msg.get('cmd' + i));
                            }
                        }
                        send_cmd('w;n;w;sign7;home;say');
                        action_state = 13;
                    } else if (action_state == 20 && msg.get('id') == 'qingcheng_weaponor') {
                        send_cmd('event_1_69194627 go;items use obj_baiyujian_bao;items;say');
                    } else if (action_state == 22 && msg.get('id') == 'snow_herbalist') {
                        send_cmd('event_1_47493781;jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;ne;ne;se;n;event_1_97487911;say');
                        action_state = 23;
                    }
                } else if (msg.get('type') == 'jh' && msg.get('subtype') == 'new_npc') {
                    if (action_state == 6 && msg.get('id') == 'snow_fist_trainer') {
                        send_cmd('look_npc snow_fist_trainer');
                    } else if (action_state == 7 && msg.get('id') == 'snow_girl') {
                        send_cmd('look_npc snow_girl');
                    } else if (action_state == 8 && msg.get('id') == 'snow_smith') {
                        send_cmd('look_npc snow_smith');
                    } else if (action_state == 9 && msg.get('id') == 'luoyang_hongniang') {
                        send_cmd('look_npc luoyang_hongniang');
                    } else if (action_state == 10 && msg.get('id') == 'luoyang_luoyang3') {
                        send_cmd('look_npc luoyang_luoyang3');
                    } else if (action_state == 11 && msg.get('id') == 'luoyang_luoyang4') {
                        send_cmd('look_npc luoyang_luoyang4');
                    } else if (action_state == 20 && msg.get('id') == 'qingcheng_weaponor') {
                        send_cmd('look_npc qingcheng_weaponor');
                    } else if (action_state == 22 && msg.get('id') == 'snow_herbalist') {
                        send_cmd('look_npc snow_herbalist');
                    }
                } else if ((action_state == 13 || action_state == 16 || action_state == 17
                            || action_state == 19 || action_state == 21) && msg.get('type') == 'vs') {
                    var vs_info = g_obj_map.get('msg_vs_info');
                    var my_id = g_obj_map.get('msg_attrs').get('id');
                    var subtype = msg.get('subtype');
                    if (subtype == 'add_xdz' && msg.get('uid') == my_id) {
                        if (action_state == 19) {
                            send_cmd('escape');
                        }
                        fast_perform(vs_info, my_id);
                    } else if (subtype == 'combat_result') {
                        if (action_state == 13) {
                            send_cmd('swords fight_test go');
                        } else if (action_state == 16) {
                            var room = get_room_name();
                            if (room == '寒冰之湖') {
                                send_cmd('event_1_95129086;kill bingyuegu_xuanwujiguanshou');
                            } else if (room == '冰月湖心') {
                                send_cmd('event_1_17623983;say');
                                action_state = 17;
                            }
                        } else if (action_state == 17) {
                            var room = get_room_name();
                            if (room == '九幽之洞') {
                                send_cmd('s;kill bingyuegu_bingyuexianren');
                            } else if (room == '冰月湖底') {
                                send_cmd('say');
                                action_state = 18;
                            }
                        } else if (action_state == 19) {
                            send_cmd('say');
                        } else if (action_state == 21) {
                            send_cmd('jh 1;e;n;n;n;w;look_npc snow_herbalist');
                            action_state = 22;
                        }
                    }
                } else if (action_state == 14 && msg.get('type') == 'show_html_page') {
                    do_answer(msg, function() {
                        send_cmd('say');
                        action_state = 15;
                    });
                } else if (msg.get('type') == 'notice' && msg.get('subtype') == 'notify_fail') {
                    if (action_state == 13 && /^你今天试剑次数已达限额。/.test(msg.get('msg'))) {
                        send_cmd('question');
                        action_state = 14;
                    } else if (action_state == 14 && /^每日武林知识问答次数已经达到限额，请明天再来。/.test(msg.get('msg'))) {
                        send_cmd('say');
                        action_state = 15;
                    } else if (action_state == 16 && /^今天进入冰月谷的次数已达到上限。/.test(msg.get('msg'))) {
                        send_cmd('say');
                        action_state = 18;
                    } else if (action_state == 19 && /^目前无法走动去那里。/.test(msg.get('msg'))) {
                        send_cmd('say');
                        action_state = 20;
                    } else if (action_state == 21 && /^你今天已经收获累累，同时也消耗了大量元气和体力，请大侠隔日再来射雕。/.test(removeSGR(msg.get('msg')))) {
                        send_cmd('jh 1;e;n;n;n;w;look_npc snow_herbalist');
                        action_state = 22;
                    } else if (action_state == 26 && /^炼药的丹炉已经是滚得发烫，再炼下去恐怕就要裂了。明天再来吧！/.test(msg.get('msg'))) {
                        send_cmd('jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791;say');
                        action_state = 27;
                    }
                } else if (msg.get('type') == 'notice') {
                    if (action_state == 21 && /^(你对天空中移动的黑点瞄准了许久|你摩拳擦掌，鼓足力气，准备开始拉弓|你闭目许久后，突然开眼果断射出一箭|你迅捷地连射三箭|你一箭精准地直接贯穿白尾雕右翼)/.test(removeSGR(msg.get('msg')))) {
                        send_cmd('shediao');
                    } else if (action_state == 26 && /^你先把毒琥珀放置于丹炉之中，然后使用内力控制着火候，等待着下一步骤时机的到来。/.test(removeSGR(msg.get('msg')))) {
                        setTimeout(function() {
                            send_cmd('lianyao');
                        }, 6000);
                    }
                } else if (msg.get('type') == 'unknow_command') {
                    if (action_state == 16) {
                        send_cmd('say');
                        action_state = 18;
                    }
                }
            });
            var cmds = [ 'home' ];
            for (var i = 1; i <= 7; i++) {
                cmds.push('share_ok ' + i);
            }
            cmds.push('say');
            send_cmd(cmds);
            action_state = 1;
        } else if (cmd == '#heal') {
            do_full();
		} else if (cmd == '#t+ connect' && !connect_trigger) {
			log('open connect trigger...');
			connect_trigger = add_listener('disconnect', 'change', function(msg) {
                execute_cmd('#connect');
            });
		} else if (cmd == '#t- connect' && connect_trigger) {
			log('connect trigger closed');
			remove_listener(connect_trigger);
			connect_trigger = undefined;
        } else if (cmd == '#tr connect') {
            if (!connect_trigger) {
                execute_cmd('#t+ connect');
            } else {
                execute_cmd('#t- connect');
            }
		} else if (cmd == '#connect') {
            g_delay_connect = 0;
            connectServer();
		} else if (cmd == '#echo on') {
			log('set echo on.');
			echo = true;
		} else if (cmd == '#echo off') {
			log('set echo off.');
			echo = false;
		} else if (cmd == '#echo') {
			if (echo) {
				execute_cmd('#echo off');
			} else {
				execute_cmd('#echo on');
			}
		} else if (cmd.substr(0, 8) == '#resize ') {
            var r = $.trim(cmd.substr(8)).match(/(\d+)\s+(\d+)/);
            if (r) {
                resizeTo(parseInt(r[1]), parseInt(r[2]));
            }
		} else if (cmd.substr(0, 7) == '#alias ') {
			var alias = $.trim(cmd.substr(7));
			var key, value, i = alias.indexOf(' ');
			if (i >= 0) {
				key = $.trim(alias.substr(0, i));
				value = $.trim(alias.substr(i + 1));
			} else {
				key = alias;
				value = '';
			}
			if (value) {
				if (value != aliases.get(key)) {
					aliases.put(key, value);
					log("set alias ok.");
				}
			} else {
				if (aliases.containsKey(key)) {
					aliases.remove(key);
					log("alias removed.");
				}
			}
		} else if (cmd.substr(0, 1) == '#') {
			var i = cmd.indexOf(' ');
			if (i >= 0) {
				var times = parseInt(cmd.substr(1, i - 1));
				if (!isNaN(times)) {
					cmd = $.trim(cmd.substr(i + 1));
					for ( var j = 0; j < times; j++) {
						execute_cmd(cmd);
					}
				}
			}
		} else if (cmd) {
			var pc = process_cmdline(cmd);
			if (pc[1]) {
				// clickButton('go_chat');
			} else {
				// clickButton('quit_chat');
			}
			if (pc[0]) {
				send_cmd(pc[0]);
			}
		}
	}
	function auto_combat(vs_info, my_id, msg) {
		var pos = check_pos(vs_info, my_id);
		if (!pos) {
			return;
		}
		var subtype = msg.get('subtype');
		if (subtype == 'add_xdz'
				|| (subtype == 'attack' && msg.get('rid') == my_id)) {
			var kee = parseInt(vs_info.get(pos[0] + '_kee' + pos[1]));
			var max_kee = parseInt(g_obj_map.get('msg_attrs').get('max_kee'));
			if (kee * 100 / max_kee < 50) {
				var xdz = parseInt(vs_info
						.get(pos[0] + '_xdz' + pos[1]));
				var buttons = get_skill_buttons(xdz);
				for ( var i = 0; i < force_skills.length; i++) {
					var k = $.inArray(force_skills[i], buttons);
					if (k >= 0) {
						clickButton('playskill ' + (k + 1));
						break;
					}
				}
				return;
			}
		}
		if (subtype == 'add_xdz') {
			var xdz = parseInt(vs_info.get(pos[0] + '_xdz' + pos[1]));
			var buttons = get_skill_buttons(xdz);
			select_perform(buttons);
		}
	}
	function combo_pfm(vs_info, my_id, msg, leader) {
		var pos = check_pos(vs_info, my_id);
		if (!pos) {
			return;
		}
		var subtype = msg.get('subtype');
		if (subtype == 'add_xdz'
				|| (subtype == 'attack' && msg.get('rid') == my_id)) {
			var kee = parseInt(vs_info.get(pos[0] + '_kee' + pos[1]));
			var max_kee = parseInt(g_obj_map.get('msg_attrs').get('max_kee'));
			if (kee * 100 / max_kee < 50) {
				var xdz = parseInt(vs_info
						.get(pos[0] + '_xdz' + pos[1]));
				var buttons = get_skill_buttons(xdz);
				for ( var i = 0; i < force_skills.length; i++) {
					var k = $.inArray(force_skills[i], buttons);
					if (k >= 0) {
						clickButton('playskill ' + (k + 1));
						break;
					}
				}
				return;
			}
		}
		if (subtype == 'playskill' && parseInt(msg.get('ret')) == 0
				&& msg.get('uid') == leader) {
			var xdz = parseInt(vs_info.get(pos[0] + '_xdz' + pos[1]));
			var buttons = get_skill_buttons(xdz);
			var pfm = removeSGR(msg.get('name'));
			var pfms = LIBS.power_skills.get(pfm);
			if (pfms) {
				for ( var i = 0; i < buttons.length; i++) {
					if (buttons[i] && pfms.indexOf(buttons[i]) >= 0) {
						clickButton('playskill ' + (i + 1));
						return;
					}
				}
			}
			for ( var i = 0; i < buttons.length; i++) {
				if (buttons[i] && LIBS.power_skills.containsKey(buttons[i])) {
					clickButton('playskill ' + (i + 1));
					break;
				}
			}
		}
	}
    function fast_perform(vs_info, my_id) {
		var pos = check_pos(vs_info, my_id);
		if (!pos) {
			return;
		}
        var xdz = parseInt(vs_info.get(pos[0] + '_xdz' + pos[1]));
        var buttons = get_skill_buttons(xdz);
        var count = 0, max = 0;
        for (var i = 1; i <= 4; i++) {
            var kee = vs_info.get((pos[0] == 'vs1' ?  'vs2' : 'vs1') + '_kee' + i);
            if (kee && parseInt(kee) > 0) {
                max = Math.max(max, parseInt(kee));
                count++;
            }
        }
        if (count == 1) {
            if (max < 1000) {
                for (var i = 0; i < dodge_skills.length - 1; i++) {
                    var j = $.inArray(dodge_skills[i], buttons);
                    if (j >= 0) {
                        send_cmd('playskill ' + (j + 1));
                        return;
                    }
                }
            }
        } else if (count > 2) {
            var i = $.inArray('千影百伤棍', buttons);
            if (i < 0) {
                i = $.inArray('破军棍诀', buttons);
            }
            if (i >= 0) {
                send_cmd('playskill ' + (i + 1));
                return;
            }
        }
        if (!select_perform(buttons, true)) {
            send_cmd('playskill ' + (Math.floor(Math.random() * 4) + 1));
        }
    }
    function do_recovery(callback) {
        send_cmd('jh 1;e;n;n;n;w;attrs;say');
        var action_state = 1, heal_count = 0, dodge_count = 0;
        add_task_listener(['main_msg', 'vs'], '', function(msg) {
            if (msg.get('type') == 'main_msg' && msg.get('ctype') == 'text' && msg.get('msg').indexOf('你自言自语不知道在说些什么') == 0) {
                if (action_state == 0 || action_state == 1) {
                    var attrs = g_obj_map.get('msg_attrs');
                    var force = parseInt(attrs.get('force'));
                    var max_force = parseInt(attrs.get('max_force'));
                    console.log('force: ' + force);
                    if (max_force - force >= 5000) {
                        var n = Math.floor((max_force - force) / 5000 + 1);
                        var cmds = '';
                        for (var i = 0; i < Math.min(n, 3); i++) {
                            cmds += 'buy /map/snow/obj/qiannianlingzhi from snow_herbalist;items use snow_qiannianlingzhi;';
                        }
                        cmds += 'attrs;say';
                        send_cmd(cmds);
                    } else {
                        console.log('check force ok');
                        if (action_state == 1) {
                            send_cmd('e;s;s;s;say');
                            action_state = 2;
                        } else {
                            var check_ok = false;
                            for (var i = 1; i <= 4; i++) {
                                var button = g_obj_map.get('skill_button' + i);
                                if (button) {
                                    var skill = removeSGR(button.get('name'));
                                    if (skill == '万流归一' || skill == '幽影幻虚步') {
                                        check_ok = true;
                                        break;
                                    }
                                }
                            }
                            if (check_ok) {
                                send_cmd('e;s;s;s;fight snow_worker');
                                action_state = 4;
                            } else {
                                stop_task('finish!');
                                if (callback) {
                                    if (typeof callback === 'function') {
                                        callback();
                                    } else {
                                        execute_cmd(callback);
                                    }
                                }
                            }
                        }
                    }
                } else if (action_state == 2) {
                    var attrs = g_obj_map.get('msg_attrs');
                    var force = parseInt(attrs.get('force'));
                    if (force > 0) {
                        var kee = parseInt(attrs.get('kee'));
                        var max_kee = parseInt(attrs.get('max_kee'));
                        if (kee * 100 / max_kee < 80) {
                            send_cmd('fight snow_worker');
                            action_state = 3;
                        } else if (kee < max_kee) {
                            send_cmd('recovery;recovery;recovery;recovery;recovery;attrs;say');
                        } else {
                            console.log('check kee ok');
                            send_cmd('n;n;n;w;say');
                            action_state = 0;
                        }
                    } else {
                        console.log('no force');
                        send_cmd('n;n;n;w;say');
                        action_state = 1;
                    }
                }
            } else if (action_state == 3 && msg.get('type') == 'vs') {
                var vs_info = g_obj_map.get('msg_vs_info');
                var my_id = g_obj_map.get('msg_attrs').get('id');
                var pos = check_pos(vs_info, my_id);
                if (!pos) {
                    stop_task('failed to fight');
                    return;
                }
                var subtype = msg.get('subtype');
                if (subtype == 'combat_result') {
                    heal_count = 0;
                    send_cmd('attrs;say');
                    action_state = 2;
                } else if (subtype == 'add_xdz' && msg.get('uid') == my_id) {
                    var xdz = parseInt(vs_info.get(pos[0] + '_xdz' + pos[1]));
                    var buttons = get_skill_buttons(xdz);
                    for (var i = 0; i < force_skills.length; i++) {
                        var k = $.inArray(force_skills[i], buttons);
                        if (k >= 0) {
                            send_cmd('playskill ' + (k + 1));
                            break;
                        }
                    }
                    var kee = parseInt(vs_info.get(pos[0] + '_kee' + pos[1]));
                    var max_kee = parseInt(g_obj_map.get('msg_attrs').get('max_kee'));
                    if (kee * 100 / max_kee >= 80) {
                        send_cmd('escape');
                    }
                } else if (subtype == 'playskill' && parseInt(msg.get('ret')) == 0 && msg.get('uid') == my_id) {
                    if (++heal_count >= 3) {
                        send_cmd('escape');
                    }
                }
            } else if (action_state == 4 && msg.get('type') == 'vs') {
                var vs_info = g_obj_map.get('msg_vs_info');
                var my_id = g_obj_map.get('msg_attrs').get('id');
                var pos = check_pos(vs_info, my_id);
                if (!pos) {
                    stop_task('failed to fight');
                    return;
                }
                var subtype = msg.get('subtype');
                if (subtype == 'combat_result') {
                    if (dodge_count < 3) {
                        send_cmd('fight snow_worker');
                    } else {
                        console.log('dodge ok');
                        stop_task('finish!');
                        if (callback) {
                            if (typeof callback === 'function') {
                                callback();
                            } else {
                                execute_cmd(callback);
                            }
                        }
                    }
                } else if (subtype == 'add_xdz' && msg.get('uid') == my_id) {
                    var xdz = parseInt(vs_info.get(pos[0] + '_xdz' + pos[1]));
                    var buttons = get_skill_buttons(xdz);
                    for (var i = 0; i < buttons.length; i++) {
                        if (buttons[i] == '万流归一' || buttons[i] == '幽影幻虚步') {
                            send_cmd('playskill ' + (i + 1));
                            break;
                        }
                    }
                } else if (subtype == 'playskill' && parseInt(msg.get('ret')) == 0 && msg.get('uid') == my_id) {
                    dodge_count++;
                }
            }
        });
    }
    function do_full(callback) {
        send_cmd('attrs');
        todo(function() {
            var attrs = g_obj_map.get('msg_attrs');
            var force = parseInt(attrs.get('force'));
            var max_force = parseInt(attrs.get('max_force'));
            var kee = parseInt(attrs.get('kee'));
            var max_kee = parseInt(attrs.get('max_kee'));
            if (kee < max_kee || max_force - force >= 5000) {
                do_recovery(callback);
            } else {
                log('hp and force is full');
            }
        });
    }
    function do_answer(msg, fn) {
        var data = msg.get('msg');
        if (data) {
            var r = data.match(/知识问答第\s*(\d+)\s*\/\s*(\d+)\s*题/);
            if (r) {
                var count = parseInt(r[1]);
                var total = parseInt(r[2]);
                if (data.indexOf('回答正确！') >= 0) {
                    if (count < total) {
                        send_cmd('question');
                    } else {
                        fn();
                    }
                } else if (data.indexOf('回答错误！') >= 0) {
                    log('answer is wrong!');
                    if (count >= total) {
                        fn();
                    }
                } else {
                    var answer;
                    var q = LIBS.questions.keys();
                    for (var i in q) {
                        var k = q[i];
                        if (data.indexOf(k) >= 0) {
                            answer = LIBS.questions.get(k);
                            break;
                        }
                    }
                    if (answer) {
                        send_cmd('question ' + answer);
                    } else {
                        log('answer not found!');
                    }
                }
            }
        }
    }
    function get_item(name, in_store) {
        var items = g_obj_map.get('msg_items');
        for (var i = 1; i <= parseInt(items.get('max_bag_num')); i++) {
            var item = items.get((in_store ? 'stores' : 'items') + i);
            if (item) {
                var arr = item.split(',');
                if (arr[0] == name || removeSGR(arr[1]) == name) {
                    return arr;
                }
            }
        }
        return null;
    }
    function has_cmd(msg, name) {
        for (var i = 1; ; i++) {
            var cmd_name = msg.get('cmd' + i + '_name');
            if (!cmd_name) {
                break;
            }
            if (removeSGR(cmd_name) == name) {
                return true;
            }
        }
        return false;
    }
    function get_area(name) {
        if (name == '光明顶') {
            name = '明教';
        } else if (name == '白驼山') {
            name = '白驮山';
        } else if (name == '梅庄') {
            name = '寒梅庄';
        } else if (name == '铁血大旗门') {
            name = '大旗门';
        } else if (name == '黑木崖') {
            name = '魔教';
        }
        return LIBS.maps.get(name);
    }
    function get_area_by_index(index) {
        var list = LIBS.maps.values();
        for (var i = 0; i < list.length; i++) {
            if (list[i].index == index) {
                return list[i];
            }
        }
        return null;
    }
    function get_area_by_mapid(mapid) {
        var i = LIBS.mapids.indexOf(mapid);
        if (i >= 0) {
            return get_area_by_index(i - 1);
        }
        return null;
    }
    function find_rooms(area, name) {
        var rooms = [];
        for (var i = 0; i < area.rooms.length; i++) {
            var room = area.rooms[i];
            if (room.name == name) {
                rooms.push(room);
            }
        }
        return rooms;
    }
    function get_room_by_npc(area, name, npc) {
        var rooms = find_rooms(area, name);
        for (var i = 0; i < rooms.length; i++) {
            var room = rooms[i];
            var check_ok = false;
            for (var j = 0; j < room.npc.length; j++) {
                if (room.npc[j].name == npc) {
                    return room;
                }
            }
        }
        return null;
    }
    function find_rooms_by_npc(area, name) {
        var rooms = [];
        for (var i = 0; i < area.rooms.length; i++) {
            var room = area.rooms[i];
            var check_ok = false;
            for (var j = 0; j < room.npc.length; j++) {
                if (room.npc[j].name == name) {
                    check_ok = true;
                    break;
                }
            }
            if (check_ok) {
                rooms.push(room);
            }
        }
        return rooms;
    }
    function find_rooms_by_item(area, name, check_npc) {
        var rooms = [];
        for (var i = 0; i < area.rooms.length; i++) {
            var room = area.rooms[i];
            var check_ok = false;
            for (var j = 0; j < room.items.length; j++) {
                if (room.items[j] == name) {
                    check_ok = true;
                    break;
                }
            }
            if (!check_ok && check_npc) {
                for (var j = 0; j < room.npc.length; j++) {
                    for (var k = 0; k < room.npc[j].items.length; k++) {
                        if (room.npc[j].items[k] == name) {
                            check_ok = true;
                            break;
                        }
                    }
                    if (check_ok) {
                        break;
                    }
                }
            }
            if (check_ok) {
                rooms.push(room);
            }
        }
        return rooms;
    }
    function get_path(area, to) {
        var path = to.forward;
        for (var i = to.prev; i > 0;) {
            var room = area.rooms[i - 1];
            path = room.forward + ';' + path;
            i = room.prev;
        }
        return path;
    }
    function _get_all_prev(area, room) {
        var path = [];
        for (var i = room.prev; i > 0;) {
            path.push(i);
            i = area.rooms[i - 1].prev;
        }
        return path;
    }
    function get_path_to(area, from, to) {
        var list = _get_all_prev(area, from);
        list.unshift(area.rooms.indexOf(from) + 1);
        var path = to.forward;
        for (var i = to.prev; i > 0;) {
            if (list.indexOf(i) >= 0) {
                for (var j = 0; j < list.indexOf(i); j++) {
                    var room = area.rooms[list[j] - 1];
                    path = room.backward + ';' + path;
                }
                break;
            }
            var room = area.rooms[i - 1];
            path = room.forward + ';' + path;
            i = room.prev;
        }
        return path;
    }
    function get_master_id() {
        var attrs = g_obj_map.get('msg_attrs');
        return attrs.get('master_id');
    }
    function get_map_id() {
        var room = g_obj_map.get('msg_room');
        if (room && room.get('map_id')) {
            var map_id = room.get('map_id');
            if (LIBS.submaps.containsKey(map_id)) {
                return LIBS.submaps.get(map_id);
            } else {
                return map_id;
            }
        }
        return null;
    }
    function get_room_name() {
        var room = g_obj_map.get('msg_room');
        if (room) {
            return removeSGR(room.get('short'));
        }
        return null;
    }
/*	var hongbao_h_listener, hongbao_list = [], hongbao_timer, hongbao_full1 = false, hongbao_full2 = false;
	hongbao_h_listener = add_listener(['channel', 'notice'], '',
			function(msg) {
				if (msg.get('type') == 'channel' && msg.get('subtype') == 'hongbao') {
					var r = msg.get('msg').match(/hongbao qiang (.+) gn(\d+)/);
					if (r) {
						if ((r[1] == '1' && !hongbao_full1) || (r[1] == '2' && !hongbao_full2)) {
							hongbao_list.push(r[0]);
							if (!hongbao_timer) {
								hongbao_timer = setTimeout(get_hongbao, 100);
							}
						}
					}
				} else if (msg.get('type') == 'notice' && msg.get('subtype') == 'notify_fail') {
					if (!hongbao_full1 && /你就抢狗年红包的次数已达到上限了，明天再抢吧。/.test(msg.get('msg'))) {
						hongbao_full1 = true;
						hongbao_list = [];
					} else if (!hongbao_full2 && /你就抢新春红包的次数已达到上限了，明天再抢吧。/.test(msg.get('msg'))) {
						hongbao_full2 = true;
						hongbao_list = [];
					}
					if (hongbao_full1 && hongbao_full2) {
						remove_listener(hongbao_h_listener);
						hongbao_h_listener = undefined;
						if (hongbao_timer) {
							clearTimeout(hongbao_timer);
							hongbao_timer = undefined;
						}
					}
				}
			});
	function get_hongbao() {
		if (hongbao_list.length == 0) {
			return;
		}
		var i = Math.floor(Math.random() * hongbao_list.length);
		var cmd = hongbao_list[i];
		hongbao_list.splice(i, 1);
		send_cmd(cmd);
		if (hongbao_list.length > 0) {
			hongbao_timer = setTimeout(get_hongbao, 5000);
		} else {
			hongbao_timer = undefined;
		}
	} */
	function process_cmdline(line) {
		var pc = [ '', true ];
		var arr = line.split(';');
		for ( var i = 0; i < arr.length; i++) {
			var cmd = $.trim(arr[i]);
			if (cmd) {
				var c = process_cmd(cmd);
				if (!c[1]) {
					pc[1] = false;
				}
				if (c[0]) {
					if (pc[0]) {
						pc[0] += ';';
					}
					pc[0] += c[0];
				}
			}
		}
		return pc;
	}
	function process_cmd(cmd) {
		var args = [ '', '' ];
		var i = cmd.indexOf(' ');
		if (i >= 0) {
			args[0] = $.trim(cmd.substr(0, i));
			args[1] = $.trim(cmd.substr(i + 1));
		} else {
			args[0] = cmd;
		}
		var alias = aliases.get(args[0]);
		if (alias) {
			var line = alias;
			if (args[1]) {
				line += ' ' + args[1];
			}
			return process_cmdline(line);
		}
		var pc = [ '', translate(args) ];
		if (args[0]) {
			if (pc[0]) {
				pc[0] += ';';
			}
			if (args[1]) {
				pc[0] += args[0] + ' ' + args[1];
			} else {
				pc[0] += args[0];
			}
		}
		return pc;
	}
	function translate(args) {
		var is_chat = false;
		if (args[0] == 'look') {
			if (!args[1]) {
				args[0] = 'golook_room';
			} else {
				var target = find_target(args[1]);
				if (target) {
					if (target[2] == 'npc') {
						args[0] = 'look_npc';
						args[1] = target[0];
					} else if (target[2] == 'item') {
						args[0] = 'look_item';
						args[1] = target[0];
					} else {
						args[0] = 'score';
						args[1] = target[0];
					}
				} else {
					arg[0] = '';
				}
			}
		} else if (args[0] == 'fight' || args[0] == 'watch') {
			if (args[0] == 'watch') {
				args[0] = 'watch_vs';
			}
			var target = find_target(args[1], [ 'npc', 'user' ]);
			if (target) {
				args[1] = target[0];
			}
		} else if (args[0] == 'kill' || args[0] == 'ask' || args[0] == 'give'
				|| args[0] == 'buy') {
			var target = find_target(args[1], [ 'npc' ]);
			if (target) {
				args[1] = target[0];
			}
		} else if (args[0] == 'get') {
			var target = find_target(args[1], [ 'item' ]);
			if (target) {
				args[1] = target[0];
			}
		} else if (args[0] == 'loot') {
			var room = g_obj_map.get('msg_room');
			if (room) {
				args[1] = '';
				for ( var t, i = 1; (t = room.get('item' + i)) != undefined; i++) {
					var s = t.split(',');
					if (s.length > 1 && /.+的尸体$/.test(removeSGR(s[1]))) {
						if (args[1].length > 0) {
							args[1] += '\nget ';
						}
						args[1] += s[0];
					}
				}
				args[0] = args[1].length > 0 ? 'get' : '';
			}
		} else if (args[0] == 'east' || args[0] == 'south' || args[0] == 'west'
				|| args[0] == 'north' || args[0] == 'southeast'
				|| args[0] == 'southwest' || args[0] == 'northeast'
				|| args[0] == 'northwest' || args[0] == 'up'
				|| args[0] == 'down') {
			args[1] = args[0];
			args[0] = 'go';
			var room = g_obj_map.get('msg_room');
			if (room) {
				var random = room.get('go_random');
				if (random) {
					args[1] += '.' + random;
				}
			}
		} else if (args[0] == 'fly') {
			args[0] = 'jh';
			var id = map_ids.get(args[1]);
			if (id) {
				args[1] = id;
			}
		} else if (args[0] == 'tu') {
			args[0] = 'cangbaotu_op1';
			args[1] = '';
		} else if (args[0] == 'dig') {
			args[0] = 'dig go';
			args[1] = '';
		} else if (args[0] == 'halt') {
			args[0] = 'escape';
			args[1] = '';
		} else if (args[0] == 'heal') {
			args[0] = 'recovery';
			args[1] = '';
		} else if (args[0] == 'quest') {
			args[0] = 'family_quest';
			args[1] = '';
		} else if (args[0] == 'task') {
			args[0] = 'task_quest';
			if (args[1] == 'cancel') {
				args[0] = 'auto_tasks';
			}
		} else if (args[0] == 'map') {
			args[0] = 'client_map';
			args[1] = '';
		} else if (args[0] == 'chat' || args[0] == 'rumor') {
			if (!cmd[1]) {
				cmd[0] = '';
			}
			is_chat = true;
		}
		return is_chat;
	}
	var cmd_queue = [];
	var cmd_busy = false;
	window.send_cmd = function(cmd, k) {
		cmd_queue = cmd_queue.concat(cmd instanceof Array ? cmd : cmd.split(';'));
		if (!cmd_busy) {
			_send_cmd(k);
		}
	};
	var _send_cmd = function(k) {
		if (cmd_queue.length > 0) {
			cmd_busy = true;
			clickButton(cmd_queue.shift(), k);
			setTimeout(function() {
				_send_cmd(k);
			}, Math.floor(120 + Math.random() * 20));
		} else {
			cmd_busy = false;
		}
	};
	var cmdline = $('<div id="cmdline" style="position: fixed; left: 0px; top: 0px; width: 503px; height: 44px; border: 1px solid rgb(53, 37, 21);"><table align="center" border="0" style="width:100%"><tr><td style="width:65%" align="left"><input id="cmd_box" class="chat_input" type="text" value=""></td><td style="width:35%" align="left"><button type="button" cellpadding="0" cellspacing="0" class="cmd_click3"><span class="out2">发送</span></button></td></tr></table></div>');
	var cmdbox = $(':text', cmdline);
	var history_cmds = [];
	var select_index = -1;
	cmdline.keydown(function(e) {
		if (e.which == 27) { // ESC
			cmdline.detach();
			e.preventDefault();
		} else if (e.which == 13) { // ENTER
			$(':button', cmdline).click();
			e.preventDefault();
		} else if (e.which == 38) { // UP
			if (select_index > 0) {
				cmdbox.val(history_cmds[--select_index]);
				cmdbox.select();
				cmdbox.focus();
				e.preventDefault();
			}
		} else if (e.which == 40) { // DOWN
			if (select_index < history_cmds.length - 1) {
				cmdbox.val(history_cmds[++select_index]);
				cmdbox.select();
				cmdbox.focus();
				e.preventDefault();
			}
		}
	});
	$(':button', cmdline).click(function(e) {
		cmdline.detach();
		sendCommand();
	});
	$(window).resize(function() {
		if (cmdline.parent().is('body')) {
			cmdline.css('top', ($('#page').height() - 60) + 'px');
		}
	});
	function createCmdline() {
		$('body').append(cmdline);
		cmdline.css('top', ($('#page').height() - 60) + 'px');
		if (history_cmds.length > 0) {
			select_index = history_cmds.length - 1;
			cmdbox.val(history_cmds[select_index]);
			cmdbox.select();
			cmdbox.focus();
		} else {
			cmdbox.val('');
			cmdbox.focus();
		}
	}
	function sendCommand() {
		var cmd = $.trim(cmdbox.val());
		if (cmd == '') {
			return;
		}
		if (history_cmds.length == 0
				|| history_cmds[history_cmds.length - 1] != cmd) {
			history_cmds.push(cmd);
			if (history_cmds.length > 20) {
				history_cmds = history_cmds.slice(-20);
			}
		}
		execute_cmd(cmd);
	}
	$(document).keydown(
			function(e) {
				if (e.which == 120) { // F9
					kill();
					e.preventDefault();
				} else if (e.which == 121) { // F10
					if (h_interval) {
						clearInterval(h_interval);
						h_interval = undefined;
						is_started = false;
						remove_listener(h_listener);
						h_listener = undefined;
						e.preventDefault();
					}
				} else if (e.which == 114) { // F3
					rejoin(true);
					e.preventDefault();
				} else if (e.which == 115) { // F4
					rejoin(false);
					e.preventDefault();
				} else if (e.which == 117) { // F6
					show_target = !show_target;
					e.preventDefault();
				} else if (e.which == 118) { // F7
					auto_defence = !auto_defence;
					notify_fail('auto defence '
							+ (auto_defence ? 'starting' : 'stopped'));
					e.preventDefault();
				} else if (e.which == 119) { // F8
					auto_attack = !auto_attack;
					notify_fail('auto attack '
							+ (auto_attack ? 'starting' : 'stopped'));
					e.preventDefault();
				} else if (e.which == 97) {
					execute_cmd('southwest');
				} else if (e.which == 98) {
					execute_cmd('south');
				} else if (e.which == 99) {
					execute_cmd('southeast');
				} else if (e.which == 100) {
					execute_cmd('west');
				} else if (e.which == 102) {
					execute_cmd('east');
				} else if (e.which == 103) {
					execute_cmd('northwest');
				} else if (e.which == 104) {
					execute_cmd('north');
				} else if (e.which == 105) {
					execute_cmd('northeast');
				} else if (!e.isDefaultPrevented() && e.which == 13) { // ENTER
					var $e = $('#chat_msg');
					if ($e.length > 0 && document.activeElement == $e[0]) {
						return true;
					}
					createCmdline();
					e.preventDefault();
				} else if (e.which == 112) { // F1
					perform();
					e.preventDefault();
				}
				return true;
			});
	var h_long_press_timeout;
	$(document).on({
		touchstart: function(e) {
			if (e.isDefaultPrevented()) {
				return false;
			}
			h_long_press_timeout = setTimeout(function() {
				h_long_press_timeout = undefined;
				if (!cmdline.parent().is('body')) {
					createCmdline();
				} else {
					cmdline.detach();
				}
			}, 1000);
		},
		touchmove: function(e) {
			if (e.isDefaultPrevented()) {
				return false;
			}
			if (h_long_press_timeout) {
				clearTimeout(h_long_press_timeout); 
				h_long_press_timeout = undefined;
			}
		},
		touchend: function(e) {
			if (e.isDefaultPrevented()) {
				return false;
			}
			if (h_long_press_timeout) {
				clearTimeout(h_long_press_timeout); 
				h_long_press_timeout = undefined;
			}
		}
	});

    $('head').append('<style type="text/css">.attack_target {border: 1px solid red;}</style>');
    function enhance_combat() {
        $('td#vs11,td#vs12,td#vs13,td#vs14,td#vs15,td#vs16,td#vs17,td#vs18,td#vs21,td#vs22,td#vs23,td#vs24,td#vs25,td#vs26,td#vs27,td#vs28', '.out_top').click(function() {
            var vs_info = g_obj_map.get('msg_vs_info');
            if (!vs_info || vs_info.get('is_watcher')) {
                return;
            }
            var $e = $(this);
            var id = $e.attr('id');
            if ($e.hasClass('attack_target')) {
                console.log('remove target ' + id);
                $e.removeClass('attack_target');
                attack_targets.splice(attack_targets.indexOf(id), 1);
            } else {
                console.log('add target ' + id);
                $e.addClass('attack_target');
                attack_targets.push(id);
            }
        });
    }
    var _go_combat = window.gSocketMsg.go_combat;
	window.gSocketMsg.go_combat = function() {
		_go_combat.apply(this, arguments);
        enhance_combat();
	};
    enhance_combat();

    function append_button(btn) {
        var $tr = $('#out > span.out button.cmd_click2:last').parent('td').parent();
        if ($('> td', $tr).length >= 4) {
            var $tbl = $tr.parent();
            $tr = $('<tr></tr>');
            $tbl.append($tr);
        }
        $tr.append(btn);
    }
	var qixia_id_pattern = /^(langfuyu|wangrong|pangtong|liyufei|bujinghong|fengxingzhui|guoji|wuzhen|fengnan|huoyunxieshen|niwufeng|hucangyan|huzhu|xuanyueyan|langjuxu|liejiuzhou|mumiaoyu|yuwenwudi|lixuanba|babulongjiang|fengwuhen|licangruo|xiaqing|miaowuxin|wuyeju)_/;
	var _show_npc = window.gSocketMsg2.show_npc;
	window.gSocketMsg2.show_npc = function() {
		_show_npc.apply(this, arguments);
		var id = g_obj_map.get('msg_npc').get('id');
		if (qixia_id_pattern.test(id)) {
			var cmd = 'ask ' + id + '\\n' + 'ask ' + id + '\\n' + 'ask ' + id
					+ '\\n' + 'ask ' + id + '\\n' + 'ask ' + id;
			append_button('<td align="center"><button type="button" onclick="clickButton(\''
					+ cmd + '\', 1)" class="cmd_click2"><span style="color:red;">领朱果</span></button></td>');
		} else if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
			var $e, do_kill = false;
			$('#out > span.out button.cmd_click2').each(function() {
				$e = $(this);
				if ($e.text() == '杀死') {
					do_kill = true;
					return false;
				}
			});
			if (do_kill) {
				var $td = $('<td align="center"><button type="button" class="cmd_click2"><span style="color:red;">卡位</span></button></td>');
				$('button', $td).click(kill);
				append_button($td);
			}
		}
	};
    
	var _show_item_info = window.gSocketMsg2.show_item_info;
	window.gSocketMsg2.show_item_info = function() {
		_show_item_info.apply(this, arguments);
		var item = g_obj_map.get('msg_item');
        var re = new RegExp('(卖|分|合).+(' + item.get('unit') + '|次)'), need_arrange = false;
        $('#out > span.out button.cmd_click2').parent('td').each(function() {
            var label = $(this).text();
            if (label == '卖掉' && parseInt(item.get('amount')) > 1) {
                $(this).after('<td align="center"><button type="button" onclick="clickButton(\'client_prompt items sell '
					+ item.get('id') + '_N_' + item.get('amount')
                    + '\', 1)" class="cmd_click2"><span style="color:red;">全卖</span></button></td>');
                need_arrange = true;
            } else if (label == '分解' && parseInt(item.get('amount')) > 1) {
                $(this).after('<td align="center"><button type="button" onclick="clickButton(\'client_prompt items splite '
					+ item.get('id') + '_N_' + item.get('amount')
                    + '\', 1)" class="cmd_click2"><span style="color:red;">全分解</span></button></td>');
                need_arrange = true;
            } else if (label == '合成') {
                var i = Math.floor(parseInt(item.get('amount')) / 3);
                if (i > 1) {
                    $(this).after('<td align="center"><button type="button" onclick="clickButton(\'client_prompt items hecheng '
                              + item.get('id') + '_N_' + i
                              + '\', 1)" class="cmd_click2"><span style="color:red;">全合成</span></button></td>');
                    need_arrange = true;
                }
            } else if (re.test(label)) {
                $(this).detach();
                need_arrange = true;
            }
        });
        if (need_arrange) {
            var all = $('#out > span.out button.cmd_click2').parent('td');
            var tbl = all.parent().parent();
            all.detach();
            tbl.empty();
            for (var i = 0; i < all.length / 4; i++) {
                var $tr = $('<tr></tr>');
                tbl.append($tr);
                for (var j = 0; j < 4; j++) {
                    if (i * 4 + j < all.length) {
                        $tr.append(all[i * 4 + j]);
                    }
                }
            }
        }
	};
    
	var _show_room = window.gSocketMsg2.show_room;
	window.gSocketMsg2.show_room = function() {
		_show_room.apply(this, arguments);
		var room = g_obj_map.get('msg_room');
        if (has_cmd(room, '扫荡') && secrets.get(get_map_id())) {
            var $e = $('#out > span.out button.cmd_click3:contains("扫荡")');
            $e.removeAttr('onclick');
            $e.click(function() {
                execute_cmd('#secret');
            });
        }
	};

	var _show_html_page = window.gSocketMsg.show_html_page;
	window.gSocketMsg.show_html_page = function() {
		_show_html_page.apply(this, arguments);
        if ($('div#out > span.out > span.out3').text() == '江湖奇侠成长信息'
                && $('div#out > span.out tr td a:contains("朱果")').length > 0) {
            $('div#out > span.out tr').each(function() {
                var $td = $('td:first', this);
                var text = $td.text();
                if (text.indexOf('朱果') < 0) {
                    if (!/\(\d+\)/.test(text)) {
                        $td.append('&nbsp;');
                    }
                    var $a = $('a:first', $td);
                    var r = $a.attr('href').match(/clickButton\(\'(.+)\'\s*,\s*0\)/);
                    if (r) {
                        var link = $('<a style="text-decoration:underline;color:cyan" href="javascript:void(0);">朱果</a>');
                        $td.append(link);
                        link.click(function() {
                            clickButton(r[1]);
                            todo(function() {
                                var target = find_target($a.text(), [ 'npc' ]);
                                if (target) {
                                    var cmds = [];
                                    for (var i = 0; i < 5; i++) {
                                        cmds.push('ask ' + target[0]);
                                    }
                                    cmds.push('open jhqx');
                                    clickButton(cmds.join('\n'));
                                }
                            });
                        });
                    }
                }
            });
        }
    };
    
    function create_button(label, color, fn) {
        if (label.length > 3) {
            label = label.substring(0, 2) + '<br>' + label.substring(2);
        }
        var $td = $('<td><button type="button" onclick="return false;" class="cmd_click2"><span style="color:' + color + ';">' + label + '</span></button></td>');
        append_button($td);
        $('button', $td).click(fn);
    }
	var _show_score = window.gSocketMsg2.show_score;
	window.gSocketMsg2.show_score = function() {
		_show_score.apply(this, arguments);
        create_button('自动重连', 'lime', function() {
            if (!connect_trigger) {
                execute_cmd('#connect');
                execute_cmd('#t+ connect');
            } else {
                execute_cmd('#t- connect');
            }
        });
        create_button('回显指令', 'lime', function() {
            execute_cmd('#echo');
        });
        create_button('跨服青龙','lime', function() {
            execute_cmd('#tr qinglong');
        });
        create_button('跨服逃犯','lime', function() {
            execute_cmd('#tr taofan');
        });
        create_button('跨服镖车','lime', function() {
            execute_cmd('#tr biaoche');
        });
        create_button('拼图碎片', 'lime', function() {
            if (!pintu_trigger) {
                send_cmd('jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;s;s;s;s;e;event_1_2215721');
                execute_cmd('#t+ pintu');
            } else {
                execute_cmd('#t- pintu');
            }
        });
        create_button('谜题辅助', 'lime', function() {
            execute_cmd('#tr task');
        });
        create_button('一键每日', 'red', function() {
            execute_cmd('#daily');
        });
        create_button('自动师门', 'red', function() {
            execute_cmd('#party');
        });
        create_button('自动帮派', 'red', function() {
            execute_cmd('#guild');
        });
        create_button('天剑谷', 'red', function() {
            execute_cmd('#tianjiangu');
        });
        create_button('回血回内', 'red', function() {
            execute_cmd('#heal');
        });
        create_button('击杀年兽', 'red', function() {
            send_cmd('jh 1;e;n;n;n;n;n');
            execute_cmd('#kill 年兽');
        });
        create_button('停止任务', 'red', function() {
            execute_cmd('#stop');
        });
 	};
    
    log('addon loaded');
    }, 1000);
})(unsafeWindow);
