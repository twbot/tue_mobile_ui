"use strict";function djb2(a){for(var b=5381,c=0;c<a.length;c++)b=(b<<5)+b+a.charCodeAt(c);return 0>b&&(b=-b),b}function handleMeshQueryResult(a){for(var b=0;b<a.entity_ids.length;b++){for(var c=a.entity_ids[b],d=new Uint16Array(a.meshes[b].vertices.length/3),e=0;e<d.length;e++)d[e]=e;for(var f=a.meshes[b],g=new Float32Array(a.meshes[b].vertices.length),e=0;e<f.vertices.length;e+=9){var h=[f.vertices[e+0],f.vertices[e+1],f.vertices[e+2]],i=[f.vertices[e+3],f.vertices[e+4],f.vertices[e+5]],j=[f.vertices[e+6],f.vertices[e+7],f.vertices[e+8]],k=SceneJS_math_subVec3(h,i,[]),l=SceneJS_math_subVec3(h,j,[]),m=SceneJS_math_normalizeVec3(SceneJS_math_cross3Vec3(k,l));g[e+0]=m[0],g[e+1]=m[1],g[e+2]=m[2],g[e+3]=m[0],g[e+4]=m[1],g[e+5]=m[2],g[e+6]=m[0],g[e+7]=m[1],g[e+8]=m[2]}var n=scene.getNode(c+"-material");n.removeNode(c+"-mesh"),n.addNode({type:"geometry",primitive:"triangles",positions:new Float32Array(a.meshes[b].vertices),indices:d,normals:g,id:c+"-mesh"})}}function edUpdate(a){for(var b=[],c={},d=0;d<a.entities.length;d++){var e=a.entities[d];if(e.has_pose){c[e.id]=!0;var f=SceneJS_math_newMat4FromQuaternion([e.pose.orientation.x,e.pose.orientation.y,e.pose.orientation.z,e.pose.orientation.w]);f[12]=e.pose.position.x,f[13]=e.pose.position.y,f[14]=e.pose.position.z,entity_poses[e.id]=f;var g=scene.getNode(e.id);if(g)g.parent.setElements(f);else{if(0==e.color.a)var h=djb2(e.id)%COLORS.length,i=COLORS[h][0],j=COLORS[h][1],k=COLORS[h][2];else i=e.color.r/255,j=e.color.g/255,k=e.color.b/255;scene.getNode("world").addNode({type:"matrix",elements:f}).addNode({type:"name",name:e.id,id:e.id}).addNode({type:"material",color:{r:i,g:j,b:k},id:e.id+"-material"}).addNode({type:"prims/box",id:e.id+"-mesh",xSize:.1,ySize:.1,zSize:.1}),b.push(e.id)}if(e.polygon.xs.length>0){for(var l=e.polygon.xs.length,m=new Float32Array(3*l+3*l+3*l*4),n=new Float32Array(m.length),o=0,p=0;l>p;p++)m[o]=e.polygon.xs[p],m[o+1]=e.polygon.ys[p],m[o+2]=e.polygon.z_max,n[o]=0,n[o+1]=0,n[o+2]=1,o+=3;for(var p=0;l>p;p++)m[o]=e.polygon.xs[p],m[o+1]=e.polygon.ys[p],m[o+2]=e.polygon.z_min,n[o]=0,n[o+1]=0,n[o+2]=-1,o+=3;for(var p=0;l>p;p++){for(var q=(p+1)%l,r=e.polygon.xs[q]-e.polygon.xs[p],s=e.polygon.ys[q]-e.polygon.ys[p],t=SceneJS_math_normalizeVec3(SceneJS_math_cross3Vec3([r,s,0],[0,0,1])),u=0;12>u;u+=3)n[o+u]=t[0],n[o+u+1]=t[1],n[o+u+2]=t[2];m[o++]=e.polygon.xs[p],m[o++]=e.polygon.ys[p],m[o++]=e.polygon.z_min,m[o++]=e.polygon.xs[p],m[o++]=e.polygon.ys[p],m[o++]=e.polygon.z_max,m[o++]=e.polygon.xs[q],m[o++]=e.polygon.ys[q],m[o++]=e.polygon.z_min,m[o++]=e.polygon.xs[q],m[o++]=e.polygon.ys[q],m[o++]=e.polygon.z_max}for(var v=new Uint16Array(3*(l-2)+3*(l-2)+2*l*3),w=0,p=0;l-2>p;p++)v[w++]=0,v[w++]=p+1,v[w++]=p+2;for(var p=0;l-2>p;p++)v[w++]=l,v[w++]=l+p+1,v[w++]=l+p+2;for(var p=0;4*l>p;p+=4)v[w++]=2*l+p,v[w++]=2*l+p+1,v[w++]=2*l+p+3,v[w++]=2*l+p+3,v[w++]=2*l+p+2,v[w++]=2*l+p;var g=scene.getNode(e.id+"-material");g.removeNode(e.id+"-mesh"),g.addNode({type:"geometry",primitive:"triangles",positions:m,indices:v,normals:n,id:e.id+"-mesh"})}}}var x={};for(var y in entity_poses)y in c?x[y]=entity_poses[y]:scene.getNode(y).parent.removeNode(y);if(entity_poses=x,b.length>0){var z=new ROSLIB.ServiceRequest({entity_ids:b});clientQueryMeshes.callService(z,function(a){handleMeshQueryResult(a)})}}function onEntityClick(a){selectedEntity=scene.getNode(a.nodeId);var b=scene.getNode("selection-box"),c=entity_poses[selectedEntity.id];c[14]=2,b.setElements(c);var d=new ROSLIB.ServiceRequest({id:selectedEntity.id});clientGetEntityInfo.callService(d,function(a){selectedEntity.data=a,updateEntityView()})}function updateEntityView(){""!=selectedEntity.data.measurement_image?$("#entity-info-thumbnail img").attr("src","data:image/png ;base64,"+selectedEntity.data.measurement_image):$("#entity-info-thumbnail img").attr("src","https://d1luk0418egahw.cloudfront.net/static/images/guide/NoImage_592x444.jpg"),$("#entity-info-id").html(selectedEntity.id+" ("+selectedEntity.data.type+")");var a="";for(var b in selectedEntity.data.affordances)a+='<option value="'+selectedEntity.data.affordances[b]+'">'+selectedEntity.data.affordances[b]+"</option>";$("#entity-info-affordances").html(a),a="";for(var c in selectedEntity.data.property_names)a+="<tr><td>"+selectedEntity.data.property_names[c]+"</td><td>"+selectedEntity.data.property_values[c]+"</td></tr>";$("#entity-info-table").html(a)}!function(){function a(a){var b,c,d;a.size?(b=a.size[0],c=a.size[1],d=a.size[2]):(b=a.xSize||1,c=a.ySize||1,d=a.zSize||1);var e="prims/box_"+b+"_"+c+"_"+d+(a.wire?"wire":"_solid");return this.getScene().hasCore("geometry",e)?{type:"geometry",coreId:e}:{type:"geometry",primitive:a.wire?"lines":"triangles",coreId:e,positions:new Float32Array([b,c,d,-b,c,d,-b,-c,d,b,-c,d,b,c,d,b,-c,d,b,-c,-d,b,c,-d,b,c,d,b,c,-d,-b,c,-d,-b,c,d,-b,c,d,-b,c,-d,-b,-c,-d,-b,-c,d,-b,-c,-d,b,-c,-d,b,-c,d,-b,-c,d,b,-c,-d,-b,-c,-d,-b,c,-d,b,c,-d]),normals:new Float32Array([0,0,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0,1,0,0,1,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,0,-1,0,0,-1,0,0,-1,0,0,-1]),uv:new Float32Array([b,c,0,c,0,0,b,0,0,c,0,0,b,0,b,c,b,0,b,c,0,c,0,0,b,c,0,c,0,0,b,0,0,0,b,0,b,c,0,c,0,0,b,0,b,c,0,c]),indices:new Uint16Array([0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23])}}SceneJS.Types.addType("prims/box",{construct:function(b){this.addNode(a.call(this,b))}})}(),SceneJS.Types.addType("ed_camera",{construct:function(a){function b(a,b){h-=a*m,i+=b*n,f()}function c(a,b){var c=a*j*.002,d=b*j*.002,e=Math.sin(.0174532925*h),f=Math.cos(.0174532925*h);s.x+=e*c-f*d,s.y+=-f*c-e*d}function d(a){j=a,f()}function e(a){a&&(0>a?j*=1+o:j/=1+o),f()}function f(){void 0!==k&&k>i&&(i=k),void 0!==l&&i>l&&(i=l);var a=SceneJS_math_rotationMat4v(.0174532925*i,[0,-1,0]),b=SceneJS_math_transformPoint3(a,[j,0,0]),c=SceneJS_math_rotationMat4v(.0174532925*h,[0,0,1]),d=SceneJS_math_transformPoint3(c,b);g.setEye({x:d[0]+s.x,y:d[1]+s.y,z:d[2]+s.z}),g.setLook(s)}var g=this.addNode({type:"lookAt",nodes:a.nodes}),h=a.yaw||0,i=a.pitch||0,j=a.zoom||10,k=a.minPitch,l=a.maxPitch,m=a.yawSensitivity||.1,n=a.pitchSensitivity||.1,o=a.zoomSensitivity||.9,p=0,q=0,r=a.eye||{x:0,y:0,z:0},s=a.look||{x:0,y:0,z:0};g.set({eye:{x:r.x,y:r.y,z:-j},look:{x:s.x,y:s.y,z:s.z},up:{x:0,y:0,z:1}}),f();var t=this.getScene().getCanvas();$(t).contextmenu(function(){return!1});var u=new Hammer.Manager(t),v=new Hammer.Tap,w=new Hammer.Pinch,x=new Hammer.Pan,y=new Hammer.Pan({event:"doublepan",pointers:2});x.recognizeWith(v),y.recognizeWith(w),u.add([v,w,x,y]),u.on("tap",function(a){var b=a.center.x,c=a.center.y;scene.pick(b,c)});var z;u.on("pinchstart",function(){z=j}),u.on("pinch",function(a){d(z/a.scale)}),u.on("panstart",function(){p=0,q=0}),u.on("pan",function(a){var c=a.deltaX,d=a.deltaY;b(c-p,d-q),p=c,q=d}),u.on("doublepanstart",function(){p=0,q=0}),u.on("doublepan",function(a){var b=a.deltaX,d=a.deltaY;c(b-p,d-q,0),p=b,q=d}),$(t).mousedown(function(a){switch(a.which){case 2:p=a.pageX,q=a.pageY;break;case 3:}}),$(t).mousemove(function(a){var b="none";if(a.buttons)switch(a.buttons){case 4:b="middle";break;case 2:b="right"}if(a.which)switch(a.which){case 2:b="middle";break;case 3:b="right"}switch(b){case"middle":var d=a.pageX,e=a.pageY;c(d-p,e-q),f(),p=d,q=e;break;case"right":}}),$(t).mousewheel(function(a){e(a.deltaY)})},setLook:function(){},destruct:function(){}}),SceneJS.setConfigs({pluginPath:"scenejs_plugins"});var scene,ros,selectedEntity=null,clientQueryMeshes,clientGetEntityInfo,clientInteract,clientActionServer,clientEdReset,entity_poses={},COLORS=[[.6,.6,.6],[.6,.6,.4],[.6,.6,.2],[.6,.4,.6],[.6,.4,.4],[.6,.4,.2],[.6,.2,.6],[.6,.2,.4],[.6,.2,.2],[.4,.6,.6],[.4,.6,.4],[.4,.6,.2],[.4,.4,.6],[.4,.4,.4],[.4,.4,.2],[.4,.2,.6],[.4,.2,.4],[.4,.2,.2],[.2,.6,.6],[.2,.6,.4],[.2,.6,.2],[.2,.4,.6],[.2,.4,.4],[.2,.4,.2],[.2,.2,.6],[.2,.2,.4],[.2,.2,.2]];$(document).ready(function(){scene=SceneJS.createScene({id:"viewer",canvasId:"viewer-canvas",nodes:[{type:"ed_camera",yaw:0,pitch:45,zoom:10,zoomSensitivity:.2,minPitch:1,maxPitch:89,yawSensitivity:.2,pitchSensitivity:.2,nodes:[{type:"matrix",elements:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],id:"world"}]}]}),scene.getNode("world").addNode({type:"matrix",id:"selection-box",elements:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,2,1]}).addNode({type:"material",color:{r:0,g:1,b:0}}).addNode({type:"prims/box",xSize:.01,ySize:.01,zSize:2}),scene.on("pick",function(a){onEntityClick(a)});var a=window.location.search.substr(1).split("&").map(function(a){return a.split("=")});a=a.reduce(function(a,b){return a[b[0]]=b[1],a},{});var b=window.location.hostname;a.ws&&(b=a.ws);var c="ws://"+b+":9090";ros=new ROSLIB.Ros({url:c}),console.log("ROS: Connecting to "+c);var d=new ROSLIB.Topic({ros:ros,name:"ed/gui/entities",messageType:"ed_gui_server/EntityInfos"});d.subscribe(function(a){edUpdate(a)}),clientQueryMeshes=new ROSLIB.Service({ros:ros,name:"/amigo/ed/gui/query_meshes",serviceType:"ed_gui_server/QueryMeshes"}),clientGetEntityInfo=new ROSLIB.Service({ros:ros,name:"/amigo/ed/gui/get_entity_info",serviceType:"ed_gui_server/GetEntityInfo"}),clientInteract=new ROSLIB.Service({ros:ros,name:"/amigo/ed/gui/interact",serviceType:"ed_gui_server/Interact"}),clientActionServer=new ROSLIB.Service({ros:ros,name:"/amigo/action_server/add_action",serviceType:"action_server/AddAction"}),clientEdReset=new ROSLIB.Service({ros:ros,name:"/amigo/ed/reset",serviceType:"std_srvs/Empty"})}),$(document).ready(function(){$("#entity-info-affordances-go").click(function(){var a=$("#entity-info-affordances").find(":selected").text(),b=new ROSLIB.ServiceRequest({action:a,parameters:"{ entity: "+selectedEntity.id+" }"}),c=selectedEntity.id;/\d/.test(c)&&(c="Object");var d=["Yes sir!","Roger that!","Copy sir!","Your wish is my command!","If you say so!","I'm on my way!","Hmmmkay!","I love it when you give me commands!","For you always sir!"];switch(handleSpeech(d[Math.floor(Math.random()*d.length)]),a){case"navigate-to":handleSpeech("I will "+a+" the "+c+" !");break;case"pick-up":handleSpeech("I will "+a+" the "+c+" !");break;case"place":handleSpeech("I will "+a+" the object on the"+c+" !")}clientActionServer.callService(b,function(a){console.log("#entity-info-affordances-go - Result from server: "+a.action_uuid+", "+a.error_msg),""!=a.error_msg&&$("#entity-info-affordances-alert").html('<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">ÃÂÃÂÃÂÃÂ</button><strong>Oh snap!</strong> '+a.error_msg+"</div>")})}),$("#reset-world-model").click(function(){var a=new ROSLIB.ServiceRequest({});clientEdReset.callService(a,function(){console.log("Reset called :)")})}),$("#entity-info-store-measurement").click(function(){var a=prompt("Please enter measurement type",""),b=new ROSLIB.ServiceRequest({command_yaml:"{ action: store, id: "+selectedEntity.id+", type: "+a+" }"});clientInteract.callService(b,function(a){console.log("Result from server: "+a.result_json)})})});var handleSpeech;!function(){function a(a,b,c){c=c.split(",");for(var d=0;d<c.length;d++)c[d]=parseFloat(c[d]);b=b.split(",");var e=new ROSLIB.Topic({ros:ros,name:a+"/references",messageType:"sensor_msgs/JointState"}),f=new ROSLIB.Message({position:c,name:b});e.publish(f)}function b(a,b){var c=new ROSLIB.Topic({ros:ros,name:a+"/references",messageType:"amigo_msgs/AmigoGripperCommand"}),d=new ROSLIB.Message({direction:parseInt(b,10),max_torque:50});c.publish(d)}function c(a){var b=new ROSLIB.ActionClient({ros:ros,serverName:"execute_command",actionName:"amigo_skill_server/ExecuteAction"}),c=new ROSLIB.Goal({actionClient:b,goalMessage:{command:a}});c.send()}handleSpeech=function(a){var b=new ROSLIB.Topic({ros:ros,name:"text_to_speech/input",messageType:"std_msgs/String"}),c=new ROSLIB.Message({data:a});b.publish(c)},$(document).ready(function(){$("#robot-poses button").click(function(){var d=$(this).attr("data-src");if(!d)return void console.log("no suitable data-src");for(var e=d.split("|"),f=0;f<e.length;f++)e[f]=e[f].replace(/^\s\s*/,"").replace(/\s\s*$/,"");switch(e[0]){case"sensor_msgs/JointState":a(e[1],e[2],e[3]);break;case"amigo_msgs/AmigoGripperCommand":b(e[1],e[2]);break;case"Sound":handleSpeech(e[1]);break;case"TextToSpeech":handleSpeech($("#texttospeech textarea").val());break;case"SkillCommand":c(e[1])}})})}();var TELEOP={};TELEOP.Teleop=function(a){a=a||{};var b=a.ros,c=a.topic||"cmd_vel",d=new ROSLIB.Topic({ros:b,name:c,messageType:"geometry_msgs/Twist"});this.sendTwist=function(a,b,c){var e=new ROSLIB.Message({angular:{x:0,y:0,z:c},linear:{x:a,y:b,z:0}});d.publish(e)}},TELEOP.Teleop.prototype.__proto__=EventEmitter2.prototype;var teleop,cursorImg;!function(){function a(){teleop=new TELEOP.Teleop({ros:ros,topic:"base/references"})}function b(){function b(){o=!1,p=!1,s=!1,teleop.sendTwist(0,0,0),k()}l=$("#teleop-canvas")[0],m=l.getContext("2d"),c(),$(window).resize(d).resize();var f=Hammer(l,{touchAction:"none"});f.get("pan").set({direction:Hammer.DIRECTION_ALL}),f.on("pan",function(a){var c=a.center;a.eventType&Hammer.INPUT_START&&console.log("input start!!!"),a.eventType&Hammer.INPUT_MOVE&&(p=e(c.x,c.y),console.log("drag",p),k()),a.eventType&Hammer.INPUT_END&&b(),a.eventType&Hammer.INPUT_CANCEL&&b()}),f.on("panstart",function(a){var b=a.center;o=e(b.x,b.y),s=!0,k()}),a(),window.setInterval(j,100)}function c(){}function d(){n=$(l).offset(),l.width=$(window).width(),l.height=$(window).height()-50,window.scrollTo(0,1),g()}function e(a,b){return{x:a,y:b-50}}function f(a,b){var c,d;a&&(m.save(),m.translate(a.x,a.y),c=60,d=m.createRadialGradient(0,0,0,0,0,2*c),d.addColorStop(0,"rgba(0,0,0,0)"),d.addColorStop(.4,"rgba(0,0,0,0)"),d.addColorStop(.45,"rgba(0,0,0,1)"),d.addColorStop(.55,"rgba(0,0,0,1)"),d.addColorStop(.6,"rgba(0,0,0,0)"),d.addColorStop(1,"rgba(0,0,0,0)"),m.fillStyle=d,m.fillRect(-2*c,-2*c,4*c,4*c),m.restore()),b&&(m.save(),m.translate(b.x,b.y),c=45,d=m.createRadialGradient(0,0,0,0,0,c),d.addColorStop(0,"rgba(0,0,0,1)"),d.addColorStop(.9,"rgba(0,0,0,1)"),d.addColorStop(1,"rgba(0,0,0,0)"),m.fillStyle=d,m.fillRect(-c,-c,2*c,2*c),m.restore())}function g(){f(o,p)}function h(){m.fillStyle="#4D4D4D",m.clearRect(0,0,l.width,l.height)}function i(){if(p&&o){var a=p.x-o.x,b=p.y-o.y;q=-b/l.height,r=-a/l.width,teleop.sendTwist(q,0,r)}}function j(){s&&i()}function k(){h(),g()}var l,m,n,o,p,q,r,s=!1;$(document).ready(b)}();