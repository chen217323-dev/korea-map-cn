(() => {
  const $ = s => document.querySelector(s);
  const els={input:$('#searchInput'),clear:$('#clearBtn'),sheet:$('#placeSheet'),name:$('#placeName'),address:$('#placeAddress'),toast:$('#toast'),status:$('#locationStatus')};
  let map,places,destination,destMarker,myMarker,myLocation,mode='traffic';
  function toast(msg){els.toast.textContent=msg;els.toast.classList.remove('hidden');clearTimeout(toast.t);toast.t=setTimeout(()=>els.toast.classList.add('hidden'),2600);}
  function init(){
    if(!window.kakao?.maps) return toast('Kakao 地图加载失败，请确认域名设置');
    kakao.maps.load(()=>{
      map=new kakao.maps.Map($('#map'),{center:new kakao.maps.LatLng(37.5665,126.9780),level:7});
      map.addControl(new kakao.maps.ZoomControl(),kakao.maps.ControlPosition.RIGHT);
      places=new kakao.maps.services.Places(); $('#map').classList.add('map-ready');
    });
  }
  function setDestination(p){
    destination=p; const pos=new kakao.maps.LatLng(p.lat,p.lng); map.setCenter(pos); map.setLevel(3);
    if(destMarker)destMarker.setMap(null); destMarker=new kakao.maps.Marker({map,position:pos});
    els.name.textContent=p.name;els.address.textContent=p.address||'韩国';els.sheet.classList.remove('hidden');
  }
  function search(q){
    q=q.trim();if(!q)return toast('请输入目的地');if(!places)return toast('地图仍在加载，请稍候');
    els.input.value=q;els.clear.classList.remove('hidden');toast('正在搜索目的地…');
    places.keywordSearch(q,(data,status)=>{
      if(status!==kakao.maps.services.Status.OK||!data.length)return toast('没有找到，请尝试输入韩文地点名');
      const p=data[0];setDestination({name:p.place_name||q,address:p.road_address_name||p.address_name,lat:Number(p.y),lng:Number(p.x),id:p.id});
    });
  }
  function locate(){
    if(!navigator.geolocation)return toast('此浏览器不支持定位');els.status.textContent='正在获取当前位置…';
    navigator.geolocation.getCurrentPosition(r=>{
      myLocation={lat:r.coords.latitude,lng:r.coords.longitude};const pos=new kakao.maps.LatLng(myLocation.lat,myLocation.lng);
      if(myMarker)myMarker.setMap(null);myMarker=new kakao.maps.Marker({map,position:pos});map.setCenter(pos);map.setLevel(4);
      els.status.textContent='● 已获取当前位置';els.status.classList.add('ready');toast('当前位置已更新');
    },()=>{els.status.textContent='○ 无法获取位置';toast('请在浏览器设置中允许定位权限');},{enableHighAccuracy:true,timeout:10000,maximumAge:30000});
  }
  function navigate(){
    if(!destination)return toast('请先搜索目的地');
    const to=`${encodeURIComponent(destination.name)},${destination.lat},${destination.lng}`;
    let url;
    if(myLocation){const from=`${encodeURIComponent('我的位置')},${myLocation.lat},${myLocation.lng}`;url=`https://map.kakao.com/link/by/${mode}/${from}/${to}`;}
    else url=`https://map.kakao.com/link/to/${to}`;
    location.href=url;
  }
  $('#searchForm').addEventListener('submit',e=>{e.preventDefault();search(els.input.value);});
  els.input.addEventListener('input',()=>els.clear.classList.toggle('hidden',!els.input.value));
  els.clear.addEventListener('click',()=>{els.input.value='';els.clear.classList.add('hidden');els.input.focus();});
  document.querySelectorAll('[data-place]').forEach(b=>b.addEventListener('click',()=>search(b.dataset.place)));
  document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.mode;document.querySelectorAll('[data-mode]').forEach(x=>x.classList.toggle('active',x===b));}));
  $('#locateBtn').addEventListener('click',locate);$('#locationStatus').addEventListener('click',locate);
  $('#closeSheet').addEventListener('click',()=>els.sheet.classList.add('hidden'));
  $('#centerBtn').addEventListener('click',()=>destination&&map.setCenter(new kakao.maps.LatLng(destination.lat,destination.lng)));
  $('#naverBtn').addEventListener('click',navigate);
  $('#savedBtn').addEventListener('click',()=>toast('收藏功能将在下一版加入'));
  $('#helpBtn').addEventListener('click',()=>toast('先定位，再搜索目的地，最后选择出行方式'));
  init();
})();
