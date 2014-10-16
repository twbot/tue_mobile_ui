"use strict";function djb2(a){for(var b=5381,c=0;c<a.length;c++)b=(b<<5)+b+a.charCodeAt(c);return 0>b&&(b=-b),b}function handleMeshQueryResult(a){for(var b=0;b<a.entity_ids.length;b++){for(var c=a.entity_ids[b],d=new Uint16Array(a.meshes[b].vertices.length/3),e=0;e<d.length;e++)d[e]=e;for(var f=a.meshes[b],g=new Float32Array(a.meshes[b].vertices.length),e=0;e<f.vertices.length;e+=9){var h=[f.vertices[e+0],f.vertices[e+1],f.vertices[e+2]],i=[f.vertices[e+3],f.vertices[e+4],f.vertices[e+5]],j=[f.vertices[e+6],f.vertices[e+7],f.vertices[e+8]],k=SceneJS_math_subVec3(h,i,[]),l=SceneJS_math_subVec3(h,j,[]),m=SceneJS_math_normalizeVec3(SceneJS_math_cross3Vec3(k,l));g[e+0]=m[0],g[e+1]=m[1],g[e+2]=m[2],g[e+3]=m[0],g[e+4]=m[1],g[e+5]=m[2],g[e+6]=m[0],g[e+7]=m[1],g[e+8]=m[2]}var n=scene.getNode(c+"-material");n.removeNode(c+"-mesh"),n.addNode({type:"geometry",primitive:"triangles",positions:new Float32Array(a.meshes[b].vertices),indices:d,normals:g,id:c+"-mesh"})}}function edUpdate(a){for(var b=[],c=0;c<a.entities.length;c++){var d=a.entities[c],e=SceneJS_math_newMat4FromQuaternion([d.pose.orientation.x,d.pose.orientation.y,d.pose.orientation.z,d.pose.orientation.w]);e[12]=d.pose.position.x,e[13]=d.pose.position.y,e[14]=d.pose.position.z,entity_poses[d.id]=e;var f=scene.getNode(d.id);if(f)f.parent.setElements(e);else{if(0==d.color.a)var g=djb2(d.id)%COLORS.length,h=COLORS[g][0],i=COLORS[g][1],j=COLORS[g][2];else h=d.color.r/255,i=d.color.g/255,j=d.color.b/255;scene.getNode("world").addNode({type:"matrix",elements:e}).addNode({type:"name",name:d.id,id:d.id}).addNode({type:"material",color:{r:h,g:i,b:j},id:d.id+"-material"}).addNode({type:"prims/box",id:d.id+"-mesh",xSize:.1,ySize:.1,zSize:.1}),b.push(d.id)}if(d.polygon.xs.length>0){for(var k=d.polygon.xs.length,l=new Float32Array(3*k+3*k+3*k*4),m=new Float32Array(l.length),n=0,o=0;k>o;o++)l[n]=d.polygon.xs[o],l[n+1]=d.polygon.ys[o],l[n+2]=d.polygon.z_max,m[n]=0,m[n+1]=0,m[n+2]=1,n+=3;for(var o=0;k>o;o++)l[n]=d.polygon.xs[o],l[n+1]=d.polygon.ys[o],l[n+2]=d.polygon.z_min,m[n]=0,m[n+1]=0,m[n+2]=-1,n+=3;for(var o=0;k>o;o++){for(var p=(o+1)%k,q=d.polygon.xs[p]-d.polygon.xs[o],r=d.polygon.ys[p]-d.polygon.ys[o],s=SceneJS_math_normalizeVec3(SceneJS_math_cross3Vec3([q,r,0],[0,0,1])),t=0;12>t;t+=3)m[n+t]=s[0],m[n+t+1]=s[1],m[n+t+2]=s[2];l[n++]=d.polygon.xs[o],l[n++]=d.polygon.ys[o],l[n++]=d.polygon.z_min,l[n++]=d.polygon.xs[o],l[n++]=d.polygon.ys[o],l[n++]=d.polygon.z_max,l[n++]=d.polygon.xs[p],l[n++]=d.polygon.ys[p],l[n++]=d.polygon.z_min,l[n++]=d.polygon.xs[p],l[n++]=d.polygon.ys[p],l[n++]=d.polygon.z_max}for(var u=new Uint16Array(3*(k-2)+3*(k-2)+2*k*3),v=0,o=0;k-2>o;o++)u[v++]=0,u[v++]=o+1,u[v++]=o+2;for(var o=0;k-2>o;o++)u[v++]=k,u[v++]=k+o+1,u[v++]=k+o+2;for(var o=0;4*k>o;o+=4)u[v++]=2*k+o,u[v++]=2*k+o+1,u[v++]=2*k+o+3,u[v++]=2*k+o+3,u[v++]=2*k+o+2,u[v++]=2*k+o;var f=scene.getNode(d.id+"-material");f.removeNode(d.id+"-mesh"),f.addNode({type:"geometry",primitive:"triangles",positions:l,indices:u,normals:m,id:d.id+"-mesh"})}}if(b.length>0){var w=new ROSLIB.ServiceRequest({entity_ids:b});clientQueryMeshes.callService(w,function(a){handleMeshQueryResult(a)})}}function onEntityClick(a){selectedEntity=scene.getNode(a.nodeId);var b=scene.getNode("selection-box"),c=entity_poses[selectedEntity.id];c[14]=2,b.setElements(c);var d=new ROSLIB.ServiceRequest({id:selectedEntity.id});clientGetEntityInfo.callService(d,function(a){selectedEntity.data=a,updateEntityView()})}function updateEntityView(){""!=selectedEntity.data.measurement_image?$("#entity-info-thumbnail img").attr("src","data:image/png ;base64,"+selectedEntity.data.measurement_image):$("#entity-info-thumbnail img").attr("src","https://d1luk0418egahw.cloudfront.net/static/images/guide/NoImage_592x444.jpg"),$("#entity-info-id").html(selectedEntity.id+" ("+selectedEntity.data.type+")");var a="";for(var b in selectedEntity.data.affordances)a+='<option value="'+selectedEntity.data.affordances[b]+'">'+selectedEntity.data.affordances[b]+"</option>";$("#entity-info-affordances").html(a),a="";for(var c in selectedEntity.data.property_names)a+="<tr><td>"+selectedEntity.data.property_names[c]+"</td><td>"+selectedEntity.data.property_values[c]+"</td></tr>";$("#entity-info-table").html(a)}!function(){function a(a){var b,c,d;a.size?(b=a.size[0],c=a.size[1],d=a.size[2]):(b=a.xSize||1,c=a.ySize||1,d=a.zSize||1);var e="prims/box_"+b+"_"+c+"_"+d+(a.wire?"wire":"_solid");return this.getScene().hasCore("geometry",e)?{type:"geometry",coreId:e}:{type:"geometry",primitive:a.wire?"lines":"triangles",coreId:e,positions:new Float32Array([b,c,d,-b,c,d,-b,-c,d,b,-c,d,b,c,d,b,-c,d,b,-c,-d,b,c,-d,b,c,d,b,c,-d,-b,c,-d,-b,c,d,-b,c,d,-b,c,-d,-b,-c,-d,-b,-c,d,-b,-c,-d,b,-c,-d,b,-c,d,-b,-c,d,b,-c,-d,-b,-c,-d,-b,c,-d,b,c,-d]),normals:new Float32Array([0,0,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0,1,0,0,1,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,0,-1,0,0,-1,0,0,-1,0,0,-1]),uv:new Float32Array([b,c,0,c,0,0,b,0,0,c,0,0,b,0,b,c,b,0,b,c,0,c,0,0,b,c,0,c,0,0,b,0,0,0,b,0,b,c,0,c,0,0,b,0,b,c,0,c]),indices:new Uint16Array([0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23])}}SceneJS.Types.addType("prims/box",{construct:function(b){this.addNode(a.call(this,b))}})}(),SceneJS.Types.addType("ed_camera",{construct:function(a){function b(a){l=a.clientX,m=a.clientY,w=a.button,2===a.button&&scene.pick(a.clientX,a.clientY)}function c(a){a.preventDefault()}function d(a){l=a.targetTouches[0].clientX,m=a.targetTouches[0].clientY,w=1}function e(){w=-1}function f(){w=-1}function g(a){var b=a.clientX,c=a.clientY;i(b,c,w)}function h(a){var b=a.targetTouches[0].clientX,c=a.targetTouches[0].clientY;i(b,c,a.button)}function i(a,b,c){if(w>=0){if(0===c)o-=(a-l)*t,p+=(b-m)*u;else if(1===c){var d=(a-l)*q*.002,e=(b-m)*q*.002,f=Math.sin(.0174532925*o),g=Math.cos(.0174532925*o);y.x+=f*d-g*e,y.y+=-g*d-f*e}k(),l=a,m=b}}function j(a){var b=0;a||(a=window.event),a.wheelDelta?(b=a.wheelDelta/120,window.opera&&(b=-b)):a.detail&&(b=-a.detail/3),b&&(0>b?q*=1+v:q/=1+v),a.preventDefault&&a.preventDefault(),a.returnValue=!1,k()}function k(){void 0!==r&&r>p&&(p=r),void 0!==s&&p>s&&(p=s);var a=SceneJS_math_rotationMat4v(.0174532925*p,[0,-1,0]),b=SceneJS_math_transformPoint3(a,[q,0,0]),c=SceneJS_math_rotationMat4v(.0174532925*o,[0,0,1]),d=SceneJS_math_transformPoint3(c,b);n.setEye({x:d[0]+y.x,y:d[1]+y.y,z:d[2]+y.z}),n.setLook(y)}var l,m,n=this.addNode({type:"lookAt",nodes:a.nodes}),o=a.yaw||0,p=a.pitch||0,q=a.zoom||10,r=a.minPitch,s=a.maxPitch,t=a.yawSensitivity||.1,u=a.pitchSensitivity||.1,v=a.zoomSensitivity||.9,w=-1,x=a.eye||{x:0,y:0,z:0},y=a.look||{x:0,y:0,z:0};n.set({eye:{x:x.x,y:x.y,z:-q},look:{x:y.x,y:y.y,z:y.z},up:{x:0,y:0,z:1}}),k();var z=this.getScene().getCanvas();z.addEventListener("mousedown",b,!0),z.addEventListener("mousemove",g,!0),z.addEventListener("mouseup",e,!0),z.addEventListener("touchstart",d,!0),z.addEventListener("touchmove",h,!0),z.addEventListener("touchend",f,!0),z.addEventListener("mousewheel",j,!0),z.addEventListener("contextmenu",c,!0),z.addEventListener("DOMMouseScroll",j,!0)},setLook:function(){},destruct:function(){}}),SceneJS.setConfigs({pluginPath:"scenejs_plugins"});var scene,selectedEntity=null,clientQueryMeshes,clientGetEntityInfo,clientInteract,clientActionServer,clientEdReset,entity_poses={},COLORS=[[.6,.6,.6],[.6,.6,.4],[.6,.6,.2],[.6,.4,.6],[.6,.4,.4],[.6,.4,.2],[.6,.2,.6],[.6,.2,.4],[.6,.2,.2],[.4,.6,.6],[.4,.6,.4],[.4,.6,.2],[.4,.4,.6],[.4,.4,.4],[.4,.4,.2],[.4,.2,.6],[.4,.2,.4],[.4,.2,.2],[.2,.6,.6],[.2,.6,.4],[.2,.6,.2],[.2,.4,.6],[.2,.4,.4],[.2,.4,.2],[.2,.2,.6],[.2,.2,.4],[.2,.2,.2]];$(document).ready(function(){scene=SceneJS.createScene({id:"viewer",canvasId:"viewer-canvas",nodes:[{type:"ed_camera",yaw:0,pitch:45,zoom:10,zoomSensitivity:.2,minPitch:1,maxPitch:89,yawSensitivity:.2,pitchSensitivity:.2,nodes:[{type:"matrix",elements:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],id:"world"}]}]}),scene.getNode("world").addNode({type:"matrix",id:"selection-box",elements:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,2,1]}).addNode({type:"material",color:{r:0,g:1,b:0}}).addNode({type:"prims/box",xSize:.01,ySize:.01,zSize:2}),scene.on("pick",function(a){onEntityClick(a)});var a="ws://"+window.location.hostname+":9090",b=new ROSLIB.Ros({url:a});console.log("ROS: Connecting to "+a);var c=new ROSLIB.Topic({ros:b,name:"/ed/gui/entities",messageType:"ed_gui_server/EntityInfos"});c.subscribe(function(a){edUpdate(a)}),clientQueryMeshes=new ROSLIB.Service({ros:b,name:"/ed/gui/query_meshes",serviceType:"ed_gui_server/QueryMeshes"}),clientGetEntityInfo=new ROSLIB.Service({ros:b,name:"/ed/gui/get_entity_info",serviceType:"ed_gui_server/GetEntityInfo"}),clientInteract=new ROSLIB.Service({ros:b,name:"/ed/gui/interact",serviceType:"ed_gui_server/Interact"}),clientActionServer=new ROSLIB.Service({ros:b,name:"/action_server/add_action",serviceType:"action_server/AddAction"}),clientEdReset=new ROSLIB.Service({ros:b,name:"/ed/reset",serviceType:"std_srvs/Empty"})}),$(document).ready(function(){$("#entity-info-affordances-go").click(function(){var a=$("#entity-info-affordances").find(":selected").text(),b=new ROSLIB.ServiceRequest({action:a,parameters:"{ entity: "+selectedEntity.id+" }"});clientActionServer.callService(b,function(a){console.log("#entity-info-affordances-go - Result from server: "+a.action_uuid+", "+a.error_msg),""!=a.error_msg&&$("#entity-info-affordances-alert").html('<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">×</button><strong>Oh snap!</strong> '+a.error_msg+"</div>")})}),$("#reset-world-model").click(function(){clientEdReset.callService(req,function(){console.log("Reset called :)")})})});