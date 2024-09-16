import anime from "animejs";

const animation = anime.timeline({
    duration: 6000,
    elasticity: 1000,
    loop: true,
    direction: "normal",
});

document.querySelectorAll("#loader #tiles g").forEach((e, i) => {
    animation.add({
        rotateX: 360,
        targets: e,
    }, i * 200)
})