"use strict";function djb2(a){for(var b=5381,c=0;c<a.length;c++)b=(b<<5)+b+a.charCodeAt(c);return 0>b&&(b=-b),b}function handleMeshQueryResult(a){for(var b=0;b<a.entity_ids.length;b++){for(var c=a.entity_ids[b],d=new Uint16Array(a.meshes[b].vertices.length/3),e=0;e<d.length;e++)d[e]=e;for(var f=a.meshes[b],g=new Float32Array(a.meshes[b].vertices.length),e=0;e<f.vertices.length;e+=9){var h=[f.vertices[e+0],f.vertices[e+1],f.vertices[e+2]],i=[f.vertices[e+3],f.vertices[e+4],f.vertices[e+5]],j=[f.vertices[e+6],f.vertices[e+7],f.vertices[e+8]],k=SceneJS_math_subVec3(h,i,[]),l=SceneJS_math_subVec3(h,j,[]),m=SceneJS_math_normalizeVec3(SceneJS_math_cross3Vec3(k,l));g[e+0]=m[0],g[e+1]=m[1],g[e+2]=m[2],g[e+3]=m[0],g[e+4]=m[1],g[e+5]=m[2],g[e+6]=m[0],g[e+7]=m[1],g[e+8]=m[2]}var n=scene.getNode(c+"-material");n.removeNode(c+"-mesh"),n.addNode({type:"geometry",primitive:"triangles",positions:new Float32Array(a.meshes[b].vertices),indices:d,normals:g,id:c+"-mesh"})}}function edUpdate(a){for(var b=[],c={},d=0;d<a.entities.length;d++){var e=a.entities[d];c[e.id]=!0;var f=SceneJS_math_newMat4FromQuaternion([e.pose.orientation.x,e.pose.orientation.y,e.pose.orientation.z,e.pose.orientation.w]);f[12]=e.pose.position.x,f[13]=e.pose.position.y,f[14]=e.pose.position.z,entity_poses[e.id]=f;var g=scene.getNode(e.id);if(g)g.parent.setElements(f);else{if(0==e.color.a)var h=djb2(e.id)%COLORS.length,i=COLORS[h][0],j=COLORS[h][1],k=COLORS[h][2];else i=e.color.r/255,j=e.color.g/255,k=e.color.b/255;scene.getNode("world").addNode({type:"matrix",elements:f}).addNode({type:"name",name:e.id,id:e.id}).addNode({type:"material",color:{r:i,g:j,b:k},id:e.id+"-material"}).addNode({type:"prims/box",id:e.id+"-mesh",xSize:.1,ySize:.1,zSize:.1}),b.push(e.id)}if(e.polygon.xs.length>0){for(var l=e.polygon.xs.length,m=new Float32Array(3*l+3*l+3*l*4),n=new Float32Array(m.length),o=0,p=0;l>p;p++)m[o]=e.polygon.xs[p],m[o+1]=e.polygon.ys[p],m[o+2]=e.polygon.z_max,n[o]=0,n[o+1]=0,n[o+2]=1,o+=3;for(var p=0;l>p;p++)m[o]=e.polygon.xs[p],m[o+1]=e.polygon.ys[p],m[o+2]=e.polygon.z_min,n[o]=0,n[o+1]=0,n[o+2]=-1,o+=3;for(var p=0;l>p;p++){for(var q=(p+1)%l,r=e.polygon.xs[q]-e.polygon.xs[p],s=e.polygon.ys[q]-e.polygon.ys[p],t=SceneJS_math_normalizeVec3(SceneJS_math_cross3Vec3([r,s,0],[0,0,1])),u=0;12>u;u+=3)n[o+u]=t[0],n[o+u+1]=t[1],n[o+u+2]=t[2];m[o++]=e.polygon.xs[p],m[o++]=e.polygon.ys[p],m[o++]=e.polygon.z_min,m[o++]=e.polygon.xs[p],m[o++]=e.polygon.ys[p],m[o++]=e.polygon.z_max,m[o++]=e.polygon.xs[q],m[o++]=e.polygon.ys[q],m[o++]=e.polygon.z_min,m[o++]=e.polygon.xs[q],m[o++]=e.polygon.ys[q],m[o++]=e.polygon.z_max}for(var v=new Uint16Array(3*(l-2)+3*(l-2)+2*l*3),w=0,p=0;l-2>p;p++)v[w++]=0,v[w++]=p+1,v[w++]=p+2;for(var p=0;l-2>p;p++)v[w++]=l,v[w++]=l+p+1,v[w++]=l+p+2;for(var p=0;4*l>p;p+=4)v[w++]=2*l+p,v[w++]=2*l+p+1,v[w++]=2*l+p+3,v[w++]=2*l+p+3,v[w++]=2*l+p+2,v[w++]=2*l+p;var g=scene.getNode(e.id+"-material");g.removeNode(e.id+"-mesh"),g.addNode({type:"geometry",primitive:"triangles",positions:m,indices:v,normals:n,id:e.id+"-mesh"})}}var x={};for(var y in entity_poses)y in c?x[y]=entity_poses[y]:scene.getNode(y).parent.removeNode(y);if(entity_poses=x,b.length>0){var z=new ROSLIB.ServiceRequest({entity_ids:b});clientQueryMeshes.callService(z,function(a){handleMeshQueryResult(a)})}}function onEntityClick(a){selectedEntity=scene.getNode(a.nodeId);var b=scene.getNode("selection-box"),c=entity_poses[selectedEntity.id];c[14]=2,b.setElements(c);var d=new ROSLIB.ServiceRequest({id:selectedEntity.id});clientGetEntityInfo.callService(d,function(a){selectedEntity.data=a,updateEntityView()})}function updateEntityView(){""!=selectedEntity.data.measurement_image?$("#entity-info-thumbnail img").attr("src","data:image/png ;base64,"+selectedEntity.data.measurement_image):$("#entity-info-thumbnail img").attr("src","https://d1luk0418egahw.cloudfront.net/static/images/guide/NoImage_592x444.jpg"),$("#entity-info-id").html(selectedEntity.id+" ("+selectedEntity.data.type+")");var a="";for(var b in selectedEntity.data.affordances)a+='<option value="'+selectedEntity.data.affordances[b]+'">'+selectedEntity.data.affordances[b]+"</option>";$("#entity-info-affordances").html(a),a="";for(var c in selectedEntity.data.property_names)a+="<tr><td>"+selectedEntity.data.property_names[c]+"</td><td>"+selectedEntity.data.property_values[c]+"</td></tr>";$("#entity-info-table").html(a)}!function(){function a(a){var b,c,d;a.size?(b=a.size[0],c=a.size[1],d=a.size[2]):(b=a.xSize||1,c=a.ySize||1,d=a.zSize||1);var e="prims/box_"+b+"_"+c+"_"+d+(a.wire?"wire":"_solid");return this.getScene().hasCore("geometry",e)?{type:"geometry",coreId:e}:{type:"geometry",primitive:a.wire?"lines":"triangles",coreId:e,positions:new Float32Array([b,c,d,-b,c,d,-b,-c,d,b,-c,d,b,c,d,b,-c,d,b,-c,-d,b,c,-d,b,c,d,b,c,-d,-b,c,-d,-b,c,d,-b,c,d,-b,c,-d,-b,-c,-d,-b,-c,d,-b,-c,-d,b,-c,-d,b,-c,d,-b,-c,d,b,-c,-d,-b,-c,-d,-b,c,-d,b,c,-d]),normals:new Float32Array([0,0,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0,1,0,0,1,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,0,-1,0,0,-1,0,0,-1,0,0,-1]),uv:new Float32Array([b,c,0,c,0,0,b,0,0,c,0,0,b,0,b,c,b,0,b,c,0,c,0,0,b,c,0,c,0,0,b,0,0,0,b,0,b,c,0,c,0,0,b,0,b,c,0,c]),indices:new Uint16Array([0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23])}}SceneJS.Types.addType("prims/box",{construct:function(b){this.addNode(a.call(this,b))}})}(),SceneJS.Types.addType("ed_camera",{construct:function(a){function b(a){l=a.clientX,m=a.clientY,w=a.button,2===a.button&&scene.pick(a.clientX,a.clientY)}function c(a){a.preventDefault()}function d(a){l=a.targetTouches[0].clientX,m=a.targetTouches[0].clientY,w=1}function e(){w=-1}function f(){w=-1}function g(a){var b=a.clientX,c=a.clientY;i(b,c,w)}function h(a){var b=a.targetTouches[0].clientX,c=a.targetTouches[0].clientY;i(b,c,a.button)}function i(a,b,c){if(w>=0){if(0===c)o-=(a-l)*t,p+=(b-m)*u;else if(1===c){var d=(a-l)*q*.002,e=(b-m)*q*.002,f=Math.sin(.0174532925*o),g=Math.cos(.0174532925*o);y.x+=f*d-g*e,y.y+=-g*d-f*e}k(),l=a,m=b}}function j(a){var b=0;a||(a=window.event),a.wheelDelta?(b=a.wheelDelta/120,window.opera&&(b=-b)):a.detail&&(b=-a.detail/3),b&&(0>b?q*=1+v:q/=1+v),a.preventDefault&&a.preventDefault(),a.returnValue=!1,k()}function k(){void 0!==r&&r>p&&(p=r),void 0!==s&&p>s&&(p=s);var a=SceneJS_math_rotationMat4v(.0174532925*p,[0,-1,0]),b=SceneJS_math_transformPoint3(a,[q,0,0]),c=SceneJS_math_rotationMat4v(.0174532925*o,[0,0,1]),d=SceneJS_math_transformPoint3(c,b);n.setEye({x:d[0]+y.x,y:d[1]+y.y,z:d[2]+y.z}),n.setLook(y)}var l,m,n=this.addNode({type:"lookAt",nodes:a.nodes}),o=a.yaw||0,p=a.pitch||0,q=a.zoom||10,r=a.minPitch,s=a.maxPitch,t=a.yawSensitivity||.1,u=a.pitchSensitivity||.1,v=a.zoomSensitivity||.9,w=-1,x=a.eye||{x:0,y:0,z:0},y=a.look||{x:0,y:0,z:0};n.set({eye:{x:x.x,y:x.y,z:-q},look:{x:y.x,y:y.y,z:y.z},up:{x:0,y:0,z:1}}),k();var z=this.getScene().getCanvas();z.addEventListener("mousedown",b,!0),z.addEventListener("mousemove",g,!0),z.addEventListener("mouseup",e,!0),z.addEventListener("touchstart",d,!0),z.addEventListener("touchmove",h,!0),z.addEventListener("touchend",f,!0),z.addEventListener("mousewheel",j,!0),z.addEventListener("contextmenu",c,!0),z.addEventListener("DOMMouseScroll",j,!0)},setLook:function(){},destruct:function(){}}),SceneJS.setConfigs({pluginPath:"scenejs_plugins"});var scene,selectedEntity=null,clientQueryMeshes,clientGetEntityInfo,clientInteract,clientActionServer,clientEdReset,entity_poses={},COLORS=[[.6,.6,.6],[.6,.6,.4],[.6,.6,.2],[.6,.4,.6],[.6,.4,.4],[.6,.4,.2],[.6,.2,.6],[.6,.2,.4],[.6,.2,.2],[.4,.6,.6],[.4,.6,.4],[.4,.6,.2],[.4,.4,.6],[.4,.4,.4],[.4,.4,.2],[.4,.2,.6],[.4,.2,.4],[.4,.2,.2],[.2,.6,.6],[.2,.6,.4],[.2,.6,.2],[.2,.4,.6],[.2,.4,.4],[.2,.4,.2],[.2,.2,.6],[.2,.2,.4],[.2,.2,.2]];$(document).ready(function(){scene=SceneJS.createScene({id:"viewer",canvasId:"viewer-canvas",nodes:[{type:"ed_camera",yaw:0,pitch:45,zoom:10,zoomSensitivity:.2,minPitch:1,maxPitch:89,yawSensitivity:.2,pitchSensitivity:.2,nodes:[{type:"matrix",elements:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],id:"world"}]}]}),scene.getNode("world").addNode({type:"matrix",id:"selection-box",elements:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,2,1]}).addNode({type:"material",color:{r:0,g:1,b:0}}).addNode({type:"prims/box",xSize:.01,ySize:.01,zSize:2}),scene.on("pick",function(a){onEntityClick(a)});var a="ws://"+window.location.hostname+":9090",b=new ROSLIB.Ros({url:a});console.log("ROS: Connecting to "+a);var c=new ROSLIB.Topic({ros:b,name:"/ed/gui/entities",messageType:"ed_gui_server/EntityInfos"});c.subscribe(function(a){edUpdate(a)}),clientQueryMeshes=new ROSLIB.Service({ros:b,name:"/ed/gui/query_meshes",serviceType:"ed_gui_server/QueryMeshes"}),clientGetEntityInfo=new ROSLIB.Service({ros:b,name:"/ed/gui/get_entity_info",serviceType:"ed_gui_server/GetEntityInfo"}),clientInteract=new ROSLIB.Service({ros:b,name:"/ed/gui/interact",serviceType:"ed_gui_server/Interact"}),clientActionServer=new ROSLIB.Service({ros:b,name:"/action_server/add_action",serviceType:"action_server/AddAction"}),clientEdReset=new ROSLIB.Service({ros:b,name:"/ed/reset",serviceType:"std_srvs/Empty"})}),$(document).ready(function(){$("#entity-info-affordances-go").click(function(){var a=$("#entity-info-affordances").find(":selected").text(),b=new ROSLIB.ServiceRequest({action:a,parameters:"{ entity: "+selectedEntity.id+" }"});clientActionServer.callService(b,function(a){console.log("#entity-info-affordances-go - Result from server: "+a.action_uuid+", "+a.error_msg),""!=a.error_msg&&$("#entity-info-affordances-alert").html('<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">×</button><strong>Oh snap!</strong> '+a.error_msg+"</div>")})}),$("#reset-world-model").click(function(){clientEdReset.callService(req,function(){console.log("Reset called :)")})})});