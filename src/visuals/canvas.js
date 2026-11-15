/** A canvas sized to its element (HiDPI-aware) that knows whether it's on screen. */
export function makeCanvas(el) {
  const c = el.getContext("2d");
  const o = { el, c, w: 0, h: 0, dpr: 1, visible: true };
  const size = () => {
    o.dpr = Math.min(devicePixelRatio || 1, 1.75);
    o.w = el.clientWidth; o.h = el.clientHeight;
    el.width = Math.round(o.w * o.dpr); el.height = Math.round(o.h * o.dpr);
    c.setTransform(o.dpr, 0, 0, o.dpr, 0, 0);
  };
  size();
  addEventListener("resize", size);
  new IntersectionObserver(([e]) => (o.visible = e.isIntersecting)).observe(el);
  return o;
}
