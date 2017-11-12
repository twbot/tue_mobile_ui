var rosUrl="ws://"+window.location.hostname+":9090",pingInterval=5e3,pingTimeout=2e3,ros;!function(){"use strict";function a(){b(),c(),console.log("ros-connect-amigo initialized")}function b(){e=$("#reconnect"),f=$("#modalConnectionLost"),e.click(function(){ros.connect(rosUrl)}),ros=new ROSLIB.Ros({url:rosUrl}),ros.addListener("connection",function(){console.log("rosbridge connection made"),e.button("loading")}),ros.addListener("close",function(){console.log("rosbridge connection closed"),e.button("reset"),f.modal("show")}),ros.addListener("error",function(){console.log("rosbridge connection error")}),ros.addListener("ping.ok",function(a){console.log("rosbridge ping with %i ms",a),f.modal("hide")}),ros.addListener("ping.timeout",function(a){console.log("rosbridge ping timeout of %i ms",a),ros.close()})}function c(){g=new ROSLIB.Service({ros:ros,name:"get_alive_nodes",serviceType:"node_alive/ListNodesAlive"});var a;ros.addListener("connection",function(){setTimeout(d,pingTimeout),a=setInterval(d,pingInterval)}),ros.addListener("close",function(){clearInterval(a)})}function d(){var a=new ROSLIB.ServiceRequest({}),b=new Date;setTimeout(function(){-1!==b&&ros.emit("ping.timeout",pingTimeout)},pingTimeout),g.callService(a,function(a){var c=new Date-b;b=-1,ros.emit("ping.ok",c)})}var e,f,g;$(document).ready(a)}();var canvas,ctx,draw,test,pingHistory,historyLength=6e5;!function(){"use strict";function a(){"undefined"!=typeof ros&&ros.addListener("ping.ok",function(a){pingHistory.push({t:+new Date,p:a}),localStorage.setItem("ping",JSON.stringify(pingHistory)),draw()}),canvas=$(".history-ping")[0],ctx=canvas.getContext("2d");try{var a=JSON.parse(localStorage.getItem("ping"))||[],b=+new Date;pingHistory=[];for(var c=0;c<a.length;c++){var d=+a[c].t,e=+a[c].p;e&&d>b-historyLength&&pingHistory.push({t:d,p:e})}}catch(f){console.error(f.message),console.log("no valid ping history found, clearing localStorage"),localStorage.setItem("ping",JSON.stringify(pingHistory))}draw()}draw=function(){var a=canvas.width,b=canvas.height;if(ctx.fillStyle="white",ctx.fillRect(0,0,a,b),!(pingHistory.length<3)){var c=pingHistory.map(function(a){return a.p}),d=Math.max.apply(null,c),e=Math.min.apply(null,c),f=(c.reduce(function(a,b){return a+b})/c.length).toFixed(1),g=+new Date,h=g-historyLength,i=ctx.createLinearGradient(0,b,0,0);i.addColorStop(0,"#040"),i.addColorStop(.3,"#080"),i.addColorStop(1,"#080");var j=ctx.createLinearGradient(0,b,0,0);j.addColorStop(0,"#040"),j.addColorStop(.3,"#080"),j.addColorStop(1,"#0c0");for(var k=0,l=0,m=0;a>m;m++){for(var n=h+historyLength*m/a;k+1<c.length&&pingHistory[k+1].t<n;)k++;var o;if(k===l&&k+1<pingHistory.length){ctx.fillStyle=j;var p=pingHistory[k].t,q=pingHistory[k+1].t,r=pingHistory[k].p,s=pingHistory[k+1].p;o=r+(s-r)*(n-p)/(q-p)}else ctx.fillStyle=i,l=k,o=pingHistory[k].p;ctx.fillRect(m,b,1,-o*b/d)}ctx.fillStyle="white",ctx.fillText("min/avg/max = "+e+"/"+f+"/"+d,4,b-4)}},test=function(){for(var a=+new Date-100;a<+new Date;){var b=2*Math.random()+4,c=Math.floor(15*Math.random()+30);pingHistory.push({t:Math.floor(a),p:c}),a+=b}draw()},$(document).ready(a)}();var TELEOP={};TELEOP.Teleop=function(a){a=a||{};var b=a.ros,c=a.topic||"cmd_vel",d=new ROSLIB.Topic({ros:b,name:c,messageType:"geometry_msgs/Twist"});this.sendTwist=function(a,b,c){var e=new ROSLIB.Message({angular:{x:0,y:0,z:c},linear:{x:a,y:b,z:0}});d.publish(e)}},TELEOP.Teleop.prototype.__proto__=EventEmitter2.prototype;var teleop,cursorImg;!function(){"use strict";function a(){teleop=new TELEOP.Teleop({ros:ros,topic:"base/references"})}function b(){function b(){o=!1,p=!1,s=!1,teleop.sendTwist(0,0,0),k()}l=$("#teleop-canvas")[0],m=l.getContext("2d"),c(),$(window).resize(d).resize();var f=Hammer(l,{touchAction:"none"});f.get("pan").set({direction:Hammer.DIRECTION_ALL}),f.on("pan",function(a){var c=a.center;a.eventType&Hammer.INPUT_START&&console.log("input start!!!"),a.eventType&Hammer.INPUT_MOVE&&(p=e(c.x,c.y),console.log("drag",p),k()),a.eventType&Hammer.INPUT_END&&b(),a.eventType&Hammer.INPUT_CANCEL&&b()}),f.on("panstart",function(a){var b=a.center;o=e(b.x,b.y),s=!0,k()}),a(),window.setInterval(j,100)}function c(){}function d(){n=$(l).offset(),l.width=$(window).width(),l.height=$(window).height()-50,window.scrollTo(0,1),g()}function e(a,b){return{x:a,y:b-50}}function f(a,b){var c,d;a&&(m.save(),m.translate(a.x,a.y),c=60,d=m.createRadialGradient(0,0,0,0,0,2*c),d.addColorStop(0,"rgba(0,0,0,0)"),d.addColorStop(.4,"rgba(0,0,0,0)"),d.addColorStop(.45,"rgba(0,0,0,1)"),d.addColorStop(.55,"rgba(0,0,0,1)"),d.addColorStop(.6,"rgba(0,0,0,0)"),d.addColorStop(1,"rgba(0,0,0,0)"),m.fillStyle=d,m.fillRect(-2*c,-2*c,4*c,4*c),m.restore()),b&&(m.save(),m.translate(b.x,b.y),c=45,d=m.createRadialGradient(0,0,0,0,0,c),d.addColorStop(0,"rgba(0,0,0,1)"),d.addColorStop(.9,"rgba(0,0,0,1)"),d.addColorStop(1,"rgba(0,0,0,0)"),m.fillStyle=d,m.fillRect(-c,-c,2*c,2*c),m.restore())}function g(){f(o,p)}function h(){m.fillStyle="#4D4D4D",m.clearRect(0,0,l.width,l.height)}function i(){if(p&&o){var a=p.x-o.x,b=p.y-o.y;q=-b/l.height,r=-a/l.width,teleop.sendTwist(q,0,r)}}function j(){s&&i()}function k(){h(),g()}var l,m,n,o,p,q,r,s=!1;$(document).ready(b)}(),$("#presentation").on("click","input",function(a){var b=new ROSLIB.ActionClient({ros:ros,serverName:"action_server/task",actionName:"action_server_msgs/TaskAction"}),c=a.currentTarget.value;switch(c){case"English":c="en";break;case"Dutch":c="nl";break;default:console.error("Unknown language")}var d={actions:[{action:"demo-presentation",language:c}]},e=new ROSLIB.Goal({actionClient:b,goalMessage:{recipe:JSON.stringify(d)}});e.send()}),$(document).ready(function(){var a=new Snap({element:document.getElementById("content")});$(window).bind("hashchange",function(){var b=window.location.hash;if(b){$("#main > .active").removeClass("active");var c=$(b);c.addClass("active"),a.close(),$("#toolbar h1").html(c.data("title"))}}).hashchange(),$("#open-left").click(function(){"left"===a.state().state?a.close():a.open("left")}),$("#toggle-options").click(function(){"right"===a.state().state?a.close():a.open("right")})}),function(a,b,c){if(c in b&&b[c]){var d,e=a.location,f=/^(a|html)$/i;a.addEventListener("click",function(a){for(d=a.target;!f.test(d.nodeName);)d=d.parentNode;"href"in d&&(d.href.indexOf("http")||~d.href.indexOf(e.host))&&(a.preventDefault(),e.href=d.href)},!1)}}(document,window.navigator,"standalone"),function(){"use strict";function a(a,b,c){c=c.split(",");for(var d=0;d<c.length;d++)c[d]=parseFloat(c[d]);b=b.split(","),console.log("device: ",a),console.log("name_arguments: ",b),console.log("position_arguments: ",c);var e=new ROSLIB.ActionClient({ros:ros,serverName:"body/joint_trajectory_action",actionName:"control_msgs/FollowJointTrajectoryAction",timeout:10}),f=new ROSLIB.Goal({actionClient:e,goalMessage:{trajectory:{joint_names:b,points:[{positions:c}]}}});f.send()}function b(a,b){var c=new ROSLIB.ActionClient({ros:ros,serverName:a+"/action",actionName:"tue_manipulation_msgs/GripperCommandAction",timeout:10}),d=new ROSLIB.Goal({actionClient:c,goalMessage:{command:{direction:parseInt(b,10),max_torque:50}}});d.send()}function c(a){var b=new ROSLIB.ActionClient({ros:ros,serverName:"head_ref/action_server",actionName:"head_ref/HeadReferenceAction",timeout:10});a=a.split(",");for(var c=0;c<a.length;c++)a[c]=parseFloat(a[c]);var d=new ROSLIB.Goal({actionClient:b,goalMessage:{goal_type:1,pan:a[0],tilt:a[1]}});d.send()}function d(a){var b=new ROSLIB.Topic({ros:ros,name:"text_to_speech/input",messageType:"std_msgs/String"}),c=new ROSLIB.Message({data:a});b.publish(c)}function e(a){var b=new ROSLIB.ActionClient({ros:ros,serverName:"execute_command",actionName:"amigo_skill_server/ExecuteAction"}),c=new ROSLIB.Goal({actionClient:b,goalMessage:{command:a}});c.send()}$(document).ready(function(){$("#main button").click(function(){var f=$(this).attr("data-src");if(!f)return void console.log("no suitable data-src");for(var g=f.split("|"),h=0;h<g.length;h++)g[h]=g[h].replace(/^\s\s*/,"").replace(/\s\s*$/,"");switch(g[0]){case"sensor_msgs/JointState":a(g[1],g[2],g[3]);break;case"head_ref/HeadReferenceAction":c(g[1],g[2]);break;case"amigo_msgs/AmigoGripperCommand":b(g[1],g[2]);break;case"Sound":d(g[1]);break;case"SkillCommand":e(g[1])}})})}(),$(document).ready(function(){function a(a){var b=new ROSLIB.Message({data:a});g.publish(b),f.prepend($('<a href="javascript:void(0)" class="list-group-item" data-action="say">'+a+"</a>"));var c=f.find("a").detach(),d=[];c=c.filter(function(a,b){var c=$(b).text();return-1===d.indexOf(c)?(d.push(c),!0):!1}),f.append(c)}function b(a){$("audio source").attr("src",a),console.log("Playing audio file "+a),$("audio")[0].load(),$("audio")[0].play()}var c=!1,d=$('#texttospeech form[data-action="tts"]'),e=$('#texttospeech input[data-action="tts"]'),f=$("#speech-log"),g=new ROSLIB.Topic({ros:ros,name:"text_to_speech/input",messageType:"std_msgs/String"});d.on("submit",function(b){b.preventDefault();var c=e.val();e.val(""),e.focus(),a(c)}),f.on('click [data-action="say"]',function(b){var c=$(b.target).text();a(c)}),g.subscribe(function(a){var d="http://tts-api.com/tts.mp3?q="+encodeURIComponent(a.data);c&&b(d)}),$("#toggle-audio").addClass("btn-warning"),$("#toggle-audio").click(function(){c?(c=!1,$(this).removeClass("btn-success"),$(this).addClass("btn-warning")):(c=!0,b("http://www.xamuel.com/blank-mp3-files/point1sec.mp3"),$(this).removeClass("btn-warning"),$(this).addClass("btn-success"))})});var set_battery;$(document).ready(function(){function a(){d.attr({"aria-valuemin":0,"aria-valuemax":100}),c=new ROSLIB.Topic({ros:ros,name:"battery_percentage",messageType:"std_msgs/Float32"}),c.subscribe(function(a){var b=a.data;set_battery(b),console.log("Received message on "+c.name+": "+a.data)})}function b(a){d.removeClass("progress-bar-"+f[e]),e=a,d.addClass("progress-bar-"+f[e])}var c;ros.addListener("connection",function(){a()});var d=$("#battery-bar"),e=0,f={0:"success",1:"warning",2:"danger"};set_battery=function(a){console.log("the battery is now at "+a+"%"),d.attr("aria-valuenow",60),d.css("width",a+"%"),d.text(a+"%"),b(40>a?1:0)}});var input,log;$(document).ready(function(){input=$("#amigohear input.continue").focus(),log=$("#hear-log"),$("form.continue").on("submit",function(a){a.preventDefault();var b=input.val();input.val(""),input.focus(),b=b.replace(/[^A-Za-z ]/g,""),b=b.toLowerCase(),b=b.replace("  "," ");var c=$('<li class="list-group-item">Amigo heard: '+b+"</li>");log.prepend(c);var d=new ROSLIB.Topic({ros:ros,name:"hmi/string",messageType:"std_msgs/String"}),e=new ROSLIB.Message({data:b});d.publish(e)})});