const d = new Set
  , c = new WeakSet;
let f, h, l = !1;
function m(e) {
    l || (l = !0,
    f ??= !1,
    h ??= "hover",
    g(),
    p(),
    w(),
    S())
}
function g() {
    for (const e of ["touchstart", "mousedown"])
        document.body.addEventListener(e, t=>{
            i(t.target, "tap") && s(t.target.href, {
                with: "fetch",
                ignoreSlowConnection: !0
            })
        }
        , {
            passive: !0
        })
}
function p() {
    let e;
    document.body.addEventListener("focusin", o=>{
        i(o.target, "hover") && t(o)
    }
    , {
        passive: !0
    }),
    document.body.addEventListener("focusout", n, {
        passive: !0
    }),
    u(()=>{
        for (const o of document.getElementsByTagName("a"))
            c.has(o) || i(o, "hover") && (c.add(o),
            o.addEventListener("mouseenter", t, {
                passive: !0
            }),
            o.addEventListener("mouseleave", n, {
                passive: !0
            }))
    }
    );
    function t(o) {
        const r = o.target.href;
        e && clearTimeout(e),
        e = setTimeout(()=>{
            s(r, {
                with: "fetch"
            })
        }
        , 80)
    }
    function n() {
        e && (clearTimeout(e),
        e = 0)
    }
}
function w() {
    let e;
    u(()=>{
        for (const t of document.getElementsByTagName("a"))
            c.has(t) || i(t, "viewport") && (c.add(t),
            e ??= y(),
            e.observe(t))
    }
    )
}
function y() {
    const e = new WeakMap;
    return new IntersectionObserver((t,n)=>{
        for (const o of t) {
            const r = o.target
              , a = e.get(r);
            o.isIntersecting ? (a && clearTimeout(a),
            e.set(r, setTimeout(()=>{
                n.unobserve(r),
                e.delete(r),
                s(r.href, {
                    with: "link"
                })
            }
            , 300))) : a && (clearTimeout(a),
            e.delete(r))
        }
    }
    )
}
function S() {
    u(()=>{
        for (const e of document.getElementsByTagName("a"))
            i(e, "load") && s(e.href, {
                with: "link"
            })
    }
    )
}
function s(e, t) {
    const n = t?.ignoreSlowConnection ?? !1;
    if (!L(e, n))
        return;
    if (d.add(e),
    (t?.with ?? "link") === "link") {
        const r = document.createElement("link");
        r.rel = "prefetch",
        r.setAttribute("href", e),
        document.head.append(r)
    } else
        fetch(e).catch(r=>{
            console.log(`[astro] Failed to prefetch ${e}`),
            console.error(r)
        }
        )
}
function L(e, t) {
    if (!navigator.onLine || !t && v())
        return !1;
    try {
        const n = new URL(e,location.href);
        return location.origin === n.origin && (location.pathname !== n.pathname || location.search !== n.search) && !d.has(e)
    } catch {}
    return !1
}
function i(e, t) {
    if (e?.tagName !== "A")
        return !1;
    const n = e.dataset.astroPrefetch;
    return n === "false" ? !1 : t === "tap" && (n != null || f) && v() ? !0 : n == null && f || n === "" ? t === h : n === t
}
function v() {
    if ("connection"in navigator) {
        const e = navigator.connection;
        return e.saveData || /2g/.test(e.effectiveType)
    }
    return !1
}
function u(e) {
    e();
    let t = !1;
    document.addEventListener("astro:page-load", ()=>{
        if (!t) {
            t = !0;
            return
        }
        e()
    }
    )
}
m();