import "./hoisted.C9u26gLO.js";
const L = document.getElementById("search");
let r;
L.addEventListener("input", S);
async function S(o) {
    const t = o.target.value.trim().split(" ");
    if (t.length < 1 || o.target.value.trim() === "") {
        b();
        return
    }
    r || (r = JSON.parse(localStorage.getItem("courses")));
    let l = JSON.parse(localStorage.getItem("expires"));
    if (!r || !l || Date.now() > l) {
        const n = new Date().getTime().toString(16);
        r = await (await fetch("https://tcas67.s3.ap-southeast-1.amazonaws.com/mytcas/courses.json?ts=" + n)).json(),
        localStorage.setItem("expires", JSON.stringify(Date.now() + 36e5));
        try {
            localStorage.setItem("courses", JSON.stringify(r))
        } catch {}
    }
    let c = r.filter(n=>t.reduce((e,a)=>{
        const s = (n.university_name_th || "").indexOf(a) > -1
          , i = (n.faculty_name_th || "").indexOf(a) > -1
          , h = (n.campus_name_th || "").indexOf(a) > -1
          , _ = (n.field_name_th || "").indexOf(a) > -1
          , y = (n.program_name_th || "").indexOf(a) > -1
          , u = (n.major_name_th || "").indexOf(a) > -1
          , m = s || i || h || _ || y || u || n.university_id === "031" && (a || "").indexOf("กสพท") > -1;
        if (!m && a[a.length - 1] === "ะ") {
            const d = a.slice(0, a.length - 1)
              , I = (n.university_name_th || "").indexOf(d) > -1
              , O = (n.faculty_name_th || "").indexOf(d) > -1
              , x = (n.campus_name_th || "").indexOf(d) > -1
              , v = (n.field_name_th || "").indexOf(d) > -1
              , j = (n.program_name_th || "").indexOf(d) > -1
              , $ = (n.major_name_th || "").indexOf(d) > -1;
            return e && (I || O || x || v || j || $)
        }
        return e && m
    }
    , !0));
    C(c.length === r.length ? [] : c, t)
}
const b = ()=>{
    document.querySelector(".search-hide").classList.remove("active");
    const o = document.getElementById("results");
    o.classList.remove("active"),
    o.innerHTML = ""
}
  , C = (o,t)=>{
    document.querySelector(".search-hide").classList.add("active");
    const l = document.getElementById("results");
    l.innerHTML = "";
    let c = document.createElement("h2");
    c.innerHTML = `ผลการค้นหา TCAS67 ${o.length ? "<b>" + o.length + " หลักสูตร</b>" : ""}`,
    l.appendChild(c);
    let n = document.createElement("ul");
    n.classList.add("t-programs"),
    o.length === 0 ? n.innerHTML = "<li>ไม่พบข้อมูล</li>" : o.slice(0, 1e3).map((e,a)=>{
        const s = document.createElement("li")
          , i = document.createElement("a")
          , h = e.university_name_th + (e.campus_name_en === "Main Campus" ? "" : ` ${e.campus_name_th}`)
          , _ = e.program_name_th + (e.major_name_th ? ` สาขาวิชา${e.major_name_th}` : "");
        let y = `<img src="https://assets.mytcas.com/i/logo/${e.university_id}.png" alt="Logo" width="50" height="50" />`
          , u = `(${(_ || "").indexOf(e.program_type_name_th) === -1 ? e.program_type_name_th : ""})`;
        u = `<h3>${p(t, _).map(g).join("")} <small>${u}</small></h3>`;
        let m = `<b>${p(t, e.faculty_name_th).map(g).join("")} › `;
        m += `${p(t, e.field_name_th).map(g).join("")}</b>`,
        m += `<span>${p(t, h).map(g).join("")}</span>`,
        i.innerHTML = y + u + m,
        i.href = `https://course.mytcas.com/programs/${e.program_id}?${e.major_id ? `major=${e.major_id}` : ""}`,
        s.appendChild(i),
        n.appendChild(s)
    }
    ),
    l.appendChild(n),
    l.classList.add("active")
}
  , p = (o,t)=>{
    const l = o.reduce((c,n)=>{
        const e = t.indexOf(n);
        if (e === -1)
            return c;
        const a = e + n.length;
        return c.some(({start: s, end: i})=>f(e, s, i) || f(a, s, i)) ? c.map(({start: s, end: i})=>f(e, s, i) ? {
            start: s,
            end: a,
            word: t.slice(s, a)
        } : f(a, s, i) ? {
            start: e,
            end: i,
            word: t.slice(e, i)
        } : {
            start: s,
            end: i,
            word: t.slice(s, i)
        }) : c.concat([{
            start: e,
            end: a,
            word: t.slice(e, a)
        }])
    }
    , []).sort((c,n)=>c.start - n.start).slice().reduce((c,{start: n, end: e},a,s)=>{
        const i = a === s.length - 1 && e < t.length ? [{
            word: t.slice(e, t.length),
            bold: !1
        }] : [];
        if (!a)
            return (n > 0 ? [{
                word: t.slice(0, n),
                bold: !1
            }, {
                word: t.slice(n, e),
                bold: !0
            }] : [{
                word: t.slice(n, e),
                bold: !0
            }]).concat(i);
        const {end: h} = s[a - 1];
        return c.concat([{
            word: t.slice(h, n),
            bold: !1
        }, {
            word: t.slice(n, e),
            bold: !0
        }].concat(i))
    }
    , []);
    return l.length ? l : [{
        word: t,
        bold: !1
    }]
}
  , f = (o,t,l)=>(l || (l = t,
t = 0),
o >= t && o <= l)
  , g = ({word: o, bold: t},l)=>t ? `<strong>${o}</strong>` : `<span>${o}</span>`;

