window.HELP_IMPROVE_VIDEOJS = false;


$(document).ready(function () {
    // Check for click events on the navbar burger icon

    var options = {
        slidesToScroll: 1,
        slidesToShow: 1,
        loop: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 5000,
    }

    // Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    bulmaSlider.attach();

    const scenes = {
        bonsai: {
            base: "static/images/bonsai.png",
            mid: "static/images/bonsai_aug.png",
            top: "static/images/bonsai_gt.png"
        },
        counter: {
            base: "static/images/counter.png",
            mid: "static/images/counter_aug.png",
            top: "static/images/counter_gt.png"
        },
        bicycle: {
            base: "static/images/bicycle.png",
            mid: "static/images/bicycle_aug.png",
            top: "static/images/bicycle_gt.png"
        },
        garden: {
            base: "static/images/garden.png",
            mid: "static/images/garden_aug.png",
            top: "static/images/garden_gt.png"
        },
        truck: {
            base: "static/images/truck.png",
            mid: "static/images/truck_aug.png",
            top: "static/images/truck_gt.png"
        },
        drjohnson: {
            base: "static/images/drjohnson.png",
            mid: "static/images/drjohnson_aug.png",
            top: "static/images/drjohnson_gt.png"
        },
    };
    const scenes_dc = {
        bonsai: {
            base: "static/images/bonsai_basic.png",
            mid: "static/images/bonsai_2DGS.png",
            top: "static/images/bonsai_proj.png"
        },
        counter: {
            base: "static/images/counter_basic.png",
            mid: "static/images/counter_2DGS.png",
            top: "static/images/counter_proj.png"
        },
    }

    // 预加载对比图像
    function preloadTripleCompareImages(data) {
        const urls = new Set();

        Object.values(data).forEach(item => {
            urls.add(item.base);
            urls.add(item.mid);
            urls.add(item.top);
        });

        urls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }
    window.addEventListener("load", () => {
        preloadTripleCompareImages(scenes);
        preloadTripleCompareImages(scenes_dc)
    });


    const imgBase = document.getElementById("img-base");
    const imgMid = document.getElementById("img-mid");
    const imgTop = document.getElementById("img-top");
    const tabs = document.querySelectorAll("#scene-tabs .scene-tab");

    const imgBase_dc = document.getElementById("img-base-dc");
    const imgMid_dc = document.getElementById("img-mid-dc");
    const imgTop_dc = document.getElementById("img-top-dc");
    const tabs_dc = document.querySelectorAll("#scene-tabs-dc .scene-tab");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const scene = tab.dataset.scene;
            const data = scenes[scene];

            imgBase.src = data.base;
            imgMid.src = data.mid;
            imgTop.src = data.top;

            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
        });
    });
    tabs_dc.forEach(tab => {
        tab.addEventListener("click", () => {
            const scene = tab.dataset.scene;
            const data = scenes_dc[scene];

            imgBase_dc.src = data.base;
            imgMid_dc.src = data.mid;
            imgTop_dc.src = data.top;

            tabs_dc.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
        });
    });

    function initTripleCompare(selector, init1 = 35, init2 = 70) {
        const box = document.querySelector(selector);
        if (!box) return;

        const layerBase = box.querySelector(".layer-base");
        const layerMid = box.querySelector(".layer-mid");
        const layerTop = box.querySelector(".layer-top");
        const h1 = box.querySelector(".handle-1");
        const h2 = box.querySelector(".handle-2");
        if (!layerMid || !layerTop || !h1 || !h2) return;

        let p1 = init1; // 中图分界
        let p2 = init2; // 顶图分界

        const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

        const render = () => {
            // 图1：显示左边到 p1
            layerBase.style.clipPath = `inset(0 ${100 - p1}% 0 0)`;

            // 图2：只显示 p1 到 p2 之间
            layerMid.style.clipPath = `inset(0 ${100 - p2}% 0 ${p1}%)`;

            // 图3：显示 p2 到右边
            layerTop.style.clipPath = `inset(0 0 0 ${p2}%)`;

            h1.style.left = `calc(${p1}% - 2px)`;
            h2.style.left = `calc(${p2}% - 2px)`;
        };

        function bindDrag(handle, which) {
            let dragging = false;

            handle.addEventListener("pointerdown", (e) => {
                dragging = true;
                handle.setPointerCapture(e.pointerId);
            });

            handle.addEventListener("pointermove", (e) => {
                if (!dragging) return;
                const rect = box.getBoundingClientRect();
                let x = ((e.clientX - rect.left) / rect.width) * 100;
                x = clamp(x, 0, 100);

                if (which === 1) {
                    p1 = Math.min(x, p2 - 1); // 保证 h1 在 h2 左边
                } else {
                    p2 = Math.max(x, p1 + 1);
                }
                render();
            });

            handle.addEventListener("pointerup", () => dragging = false);
            handle.addEventListener("pointercancel", () => dragging = false);
        }

        bindDrag(h1, 1);
        bindDrag(h2, 2);
        render();
    }

    initTripleCompare("#triple-compare", 25, 75);
    initTripleCompare("#triple-compare-dc", 25, 75);

})
