(() => {
  const canvas = document.querySelector('#porcelain-background');
  const picker = document.querySelector('#background-choice');
  if (!canvas || !picker) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const palettes = {
    blue: { grout:'#bab7ad', glaze:['#fffef4','#e5edf0'], ink:'#28548b', edge:'#ffffff', wash:'rgba(248,247,238,.13)' },
    celadon: { grout:'#acb8ab', glaze:['#e8f2df','#aac9ba'], ink:'#467b69', edge:'#f7ffeb', wash:'rgba(223,239,222,.12)' },
    night: { grout:'#07101d', glaze:['#25496b','#142b48'], ink:'#84b4db', edge:'#3f6585', wash:'rgba(6,15,29,.12)' },
  };
  let mode = 'blue';
  try { const saved = localStorage.getItem('personal-library-background'); if (Object.hasOwn(palettes, saved) || saved === 'plain') mode = saved; } catch (_) { /* Storage is optional. */ }
  function render() {
    if (mode === 'plain') return;
    const width = window.innerWidth, height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    let seed = 71635;
    const rand = () => { seed = (Math.imul(seed,1664525)+1013904223) >>> 0; return seed / 4294967296; };
    const palette = palettes[mode];
    ctx.fillStyle = palette.grout; ctx.fillRect(0,0,width,height);
    const step = width < 600 ? 96 : 138;
    const points = [];
    for (let y=-step;y<height+step*2;y+=step) for(let x=-step;x<width+step*2;x+=step) points.push({x:x+(rand()-.5)*step*.85,y:y+(rand()-.5)*step*.85});
    // Voronoi cells give each porcelain shard its own irregular broken edge.
    function cell(p) {
      let polygon=[[-step,-step],[width+step,-step],[width+step,height+step],[-step,height+step]];
      for(const q of points) {
        if(p===q || Math.hypot(p.x-q.x,p.y-q.y)>step*3.5) continue;
        const nx=q.x-p.x,ny=q.y-p.y,c=(q.x*q.x+q.y*q.y-p.x*p.x-p.y*p.y)/2;
        const next=[];
        for(let i=0;i<polygon.length;i++) {
          const a=polygon[i], b=polygon[(i+1)%polygon.length];
          const da=a[0]*nx+a[1]*ny-c, db=b[0]*nx+b[1]*ny-c;
          if(da<=0) next.push(a);
          if((da<=0)!==(db<=0)) { const t=da/(da-db); next.push([a[0]+t*(b[0]-a[0]),a[1]+t*(b[1]-a[1])]); }
        }
        polygon=next; if(!polygon.length) break;
      }
      return polygon.map(([x,y])=>[p.x+(x-p.x)*.957,p.y+(y-p.y)*.957]);
    }
    for(const p of points) {
      const poly=cell(p); if(poly.length<3) continue;
      ctx.save();ctx.beginPath();poly.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();
      const glaze=ctx.createLinearGradient(p.x-step/2,p.y-step/2,p.x+step/2,p.y+step/2);
      glaze.addColorStop(0,palette.glaze[0]);glaze.addColorStop(1,palette.glaze[1]);
      ctx.fillStyle=glaze;ctx.fill();ctx.strokeStyle=palette.edge;ctx.lineWidth=1.7;ctx.stroke();ctx.clip();
      ctx.translate(p.x,p.y);ctx.rotate(rand()*Math.PI*2);ctx.strokeStyle=palette.ink;ctx.fillStyle=palette.ink;
      ctx.globalAlpha=.65;ctx.lineWidth=1.5;
      const pattern=Math.floor(rand()*4);
      if(pattern===0) {
        // Broken rim fragments: concentric cobalt bands and scalloped wave marks.
        for(let r=28;r<step*1.4;r+=12) { ctx.beginPath();ctx.arc(-35,-28,r,0,Math.PI*2);ctx.stroke(); }
        ctx.lineWidth=5;ctx.beginPath();ctx.arc(-35,-28,step*.6,0,Math.PI*2);ctx.stroke();
      } else if(pattern===1) {
        for(let k=0;k<9;k++) { ctx.save();ctx.rotate(k*Math.PI*2/9);ctx.beginPath();ctx.ellipse(0,23,8,23,0,0,Math.PI*2);ctx.stroke();ctx.restore(); }
        ctx.beginPath();ctx.arc(0,0,7,0,Math.PI*2);ctx.fill();
        for(let r=58;r<90;r+=9){ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.stroke();}
      } else if(pattern===2) {
        ctx.beginPath();ctx.moveTo(-60,55);ctx.bezierCurveTo(25,20,-35,-20,65,-55);ctx.stroke();
        for(let k=-3;k<=3;k++){ctx.save();ctx.translate(k*14,-k*12);ctx.rotate(k%2?1:-.8);ctx.beginPath();ctx.ellipse(12,0,14,4,0,0,Math.PI*2);ctx.fill();ctx.restore();}
      } else {
        for(let y=-100;y<110;y+=23) for(let x=-100;x<110;x+=32){ctx.beginPath();ctx.arc(x+(y%2)*10,y,18,Math.PI,Math.PI*2);ctx.stroke();}
      }
      ctx.restore();
    }
    ctx.fillStyle=palette.wash;ctx.fillRect(0,0,width,height);
  }
  function apply() {
    document.body.dataset.background=mode;picker.value=mode;render();
  }
  picker.addEventListener('change',()=>{mode=picker.value;try{localStorage.setItem('personal-library-background',mode);}catch(_){}apply();});
  let timer;window.addEventListener('resize',()=>{clearTimeout(timer);timer=setTimeout(render,150);});
  apply();
})();
