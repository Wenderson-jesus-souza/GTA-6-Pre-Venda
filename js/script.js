// OBJETIVO: dar comportamento ao site do GTA VI com JavaScript.

// Passos:
// 1. MENU QUE SOME AO ROLAR
//    - achar o menu no HTML
//    - escutar o evento de rolagem da janela
//    - se a página desceu mais de 50px, adicionar a classe "menu-rolado"
//    - se voltou pro topo, remover a classe

// 2. BLOCOS QUE APARECEM
//    - achar todos os elementos com a classe "aparecer"
//    - avisar quando cada um entrar na tela
//    - ao entrar, adicionar a classe "visivel"

// 3. VÍDEO QUE ANDA COM O SCROLL
//    - achar o vídeo da capa
//    - prender a capa na tela enquanto a pessoa rola
//    - sumir com o conteúdo da capa e revelar o vídeo
//    - avançar o tempo do vídeo conforme o scroll

const menu = document.getElementById("menu");
const blocos = document.querySelectorAll(".aparecer");
const video = document.querySelector(".capa-video");
const capa = document.querySelector(".capa");
const capaPainel = document.querySelector(".capa-painel");
const capaConteudo = document.querySelector(".capa-conteudo");
const capaBarra = document.querySelector(".capa-barra");
const capaSeta = document.querySelector(".capa-seta");

if (menu) {
    window.addEventListener("scroll", function () {
        if (window.scrollY > 50) {
            menu.classList.add("menu-rolado");
        } else {
            menu.classList.remove("menu-rolado");
        }
    });
}

if (blocos.length) {
    const observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
            if (entrada.isIntersecting) {
                entrada.target.classList.add("visivel");
            }
        });
    });

    blocos.forEach(function (bloco) {
        observador.observe(bloco);
    });
}

if (window.gsap && window.ScrollTrigger && video && capa && capaPainel && capaConteudo) {
    gsap.registerPlugin(ScrollTrigger);

    video.muted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "true");

    // Variáveis para controlar o scroll do mouse
    let isScrolling = false;
    let scrollTimeout;

    // Detecta quando o usuário está scrollando
    window.addEventListener("scroll", function () {
        isScrolling = true;

        // Limpar timeout anterior
        clearTimeout(scrollTimeout);

        // Definir novo timeout - quando scrolling parar
        scrollTimeout = setTimeout(function () {
            isScrolling = false;
            // Pausar o vídeo quando o scroll parar
            if (video && !video.paused && video.currentTime > 0) {
                video.pause();
            }
        }, 150); // Aguardar 150ms após o último evento de scroll
    });

    const tocarVideo = function () {
        const playPromise = video.play();

        if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(function () {
                // autoplay pode ser bloqueado até o usuário interagir
            });
        }
    };

    if (video.readyState >= 2) {
        // Não tocar automaticamente, esperar pelo scroll
        // tocarVideo();
    } else {
        video.addEventListener("loadeddata", function () {
            // Deixar pronto mas não tocar automaticamente
        }, { once: true });
    }

    const heroTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: capa,
            start: "top top",
            end: "+=1400",
            scrub: 1.3,
            pin: true,
            invalidateOnRefresh: true,
            onUpdate: function () {
                if (isScrolling && video.paused) {
                    tocarVideo();
                }
            }
        }
    });

    heroTimeline
        .to(video, {
            opacity: 1,
            scale: 1.08,
            ease: "none"
        }, 0)
        .to(video, {
            currentTime: function () {
                if (!video.duration || Number.isNaN(video.duration)) {
                    return 0;
                }

                return video.duration;
            },
            ease: "none"
        }, 0)
        .to(".capa-conteudo, .capa-barra, .capa-seta", {
            opacity: 0,
            y: -40,
            scale: 0.6,
            duration: 0.1,
            ease: "none",
        }, 0.1);
}

