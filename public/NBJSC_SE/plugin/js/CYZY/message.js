// 注册监听
if (window.addEventListener) {
    //为window注册message事件并绑定监听函数
    window.addEventListener('message', receiveMsg, false);
}else {
    window.attachEvent('message', receiveMsg);
}

let timeout;

// 监听函数，接收一个参数--Event事件对象
function receiveMsg(e) {
    let obj = e.data;
	// gisLayerMessage
	if(obj.type == "gisLayerMessage"){
		switch(obj.data.key){
			case "changeAreaByName":
				if(obj.data.value) changeAreaByName(obj.data.value.name);
				break;
			case "changeLayerByOption":
				if(obj.data.value){
					// 定时器
					clearTimeout(timeout);
					timeout = setTimeout(function(){
						changeLayerByOption(obj.data.value.option);
					}, 100);
				} 
				break;
			case "changeTDTLayerByType":
				if(obj.data.value) changeTDTLayerByType(obj.data.value.type);
				break;
			case "lastArea":
				if(obj.data.value.lastArea) lastArea();
				break;
			default:
				return;
		}
	}else if(obj.type == "gisMapMessage"){
		switch(obj.data.key){
			case "measureByType":
				if(obj.data.value) measureByType(obj.data.value.measureByType);
				break;
			case "closeMeasure":
				if(obj.data.value.closeMeasure) closeMeasure();
				break;
			case "clearMeasure":
				if(obj.data.value.clearMeasure) clearMeasure();
				break;
			default:
				return;
		}
	}
}

// 发送消息
function sendMessage(type,data){
	// 向父页面传递消息
	if(window.parent != window){
		window.parent.postMessage({type: type, data: data}, '*');
	}
}