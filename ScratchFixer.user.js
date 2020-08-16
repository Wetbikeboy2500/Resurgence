/*
MIT License

Copyright (c) 2020 Matt

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
// ==UserScript==
// @name         ResurgenceUserscript
// @namespace    http://tampermonkey.net/
// @version      11.6
// @description  Tries to fix and improve certain aspects of Scratch
// @author       Wetbikeboy2500
// @match        https://scratch.mit.edu/*
// @match        https://projects.scratch.mit.edu/resurgence
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/2.5.0/jszip.min.js
// @require      https://cdn.rawgit.com/Stuk/jszip-utils/dfdd631c4249bc495d0c335727ee547702812aa5/dist/jszip-utils.min.js
// @require      https://raw.githubusercontent.com/pawelgrzybek/siema/master/dist/siema.min.js
// @require      https://cdn.jsdelivr.net/npm/vanilla-lazyload@17.1.0/dist/lazyload.min.js
// @resource     CSS https://raw.githubusercontent.com/Wetbikeboy2500/ScratchFixer/master/style.min.css
// @resource     CSSlight https://raw.githubusercontent.com/Wetbikeboy2500/ScratchFixer/master/style_light.min.css
// @resource     Modal https://raw.githubusercontent.com/Wetbikeboy2500/ScratchFixer/master/modal.html
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @updateURL    https://raw.githubusercontent.com/Wetbikeboy2500/ScratchFixer/master/ScratchFixer.user.js
// @run-at       document-start
// ==/UserScript==
(function () {
    'use strict';
    let url = location.protocol + '//' + location.host + location.pathname, style = null, style1 = null, editorStyle = null, currentVersion = GM_info.script.version, pageType = "", accountInfo = {}, themeTweakStyle = null;
    const getCookie = (cname) => {
        const name = cname + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let cookie of ca) {
            while (cookie.charAt(0) == ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(name) == 0) {
                return cookie.substring(name.length, cookie.length);
            }
        }
        return "";
    };
    if (!inIframe()) {
        editorTheme();

        if (url.includes('/editor')) {
            document.addEventListener("DOMContentLoaded", () => {
                betterDesign();

                projectPageClick();
            });
        } else {
            if (GM_getValue("theme", false) === "dark") {
                style1 = GM_addStyle(GM_getResourceText("CSS"));
            } else {
                GM_addStyle("#res-set > a {color: #fff} .box{background-color: #fff}}");
            }
            document.addEventListener("DOMContentLoaded", () => {
                editorClick();

                load_account();
                load_userinfo();
                if (url == "https://scratch.mit.edu/" && GM_getValue("bannerOff", false)) {
                    GM_addStyle(".title-banner{display:none;}");
                }
                if (url.includes("discuss") && url.includes("/topic")) {
                    load_custombb();
                    load_images();
                    load_scratchblockcode();
                    load_bbcode();
                    add_bbbuttons();
                }
                if (url.includes("https://scratch.mit.edu/messages") && GM_getValue("messageTheme", false)) {
                    GM_addStyle(`.messages-social {width: 700px; right: 446.5px; left: 235.5px; position: relative; border: 0.5px solid #F0F0F0; border-top-left-radius: 5px; border-top-right-radius: 5px; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; background-color: #F2F2F2; } .messages-header {font-size: 24px; padding-left: 10px;} select[name="messages.filter"] {right: 720px; top: 20px; font-size: 24px; position: relative; border-top-left-radius: 5px; border-top-right-radius: 5px; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; background-color: #F2F2F2; visibility: visible;} #___gcse_0 {display: none;} .messages-details {margin-top: 40px;} .mod-messages {visibility: hidden; height: 0px; padding: 0px; margin: 0px;} .messages-social-loadmore {width: calc(100% - 20px);}`);
                }
                if (url == "https://scratch.mit.edu/discuss/" || url == "https://scratch.mit.edu/discuss/#") {
                    GM_addStyle(".forumicon {display: none;} td .tclcon {margin: 0px;} #idx1 > .box .box-head > h4 {width: 100%;} #djangobbwrap .box-head h4 {margin-left: 0px;}");//fixes style left by icons that don't exsist and the expand and retract icons are to the left of the forum
                }
                let styleTip = 'span[style="color:reslarge"] {font-weight:bold; font-size:30px;} .postsignature {overflow: auto;} .ideas a span { display: none; position: absolute; } .ideas a:after { content: "' + GM_getValue("forumTitle", "Forums") + '"; visibility: visible; position: static; } .phosphorus { margin-left: 14px; margin-right: 14px; margin-top: 16px; } .my_select {height: 34px; line-height: 34px; vertical-align: middle; margin: 3px 0px 3px 0px; width: 110px;}';
                styleTip += `.svg-icon {width: 20px;height: 20px;}.svg-icon path,.svg-icon polygon,.svg-icon rect {fill: #554747;}.svg-icon circle {stroke: #554747;stroke-width: 1;}`;//svg styling
                GM_addStyle(styleTip);
                dark_theme();
                fix_nav();
                add_search();
                load_extras();
                load_banner();
                load_newpage();
                theme_tweaks();

                if (url == "https://scratch.mit.edu/") {
                    waitTillLoad(".splash-header")
                        .then(() => {
                            load_messages_panel();
                            build_carousel();
                        });
                }
            });
        }
    }
    //this function needs to be fixed with a more dynamic calls and tests
    function fix_nav() {
        //fixes navbar and adds bottom page link
        if (document.getElementById("navigation")) {
            //new theme
            pageType = "new";
            document.querySelector(".ideas").childNodes[0].setAttribute("href", "/discuss");
        } else {
            //old theme
            pageType = "old";
            const tips = document.querySelector('.site-nav > :nth-child(3) > a');
            tips.setAttribute("href", "/discuss");
            tips.innerHTML = GM_getValue("forumTitle", "Forums");
        }
    }

    function load_account() {
        fetch("https://scratch.mit.edu/session/", {
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(response => response.json())
            .then(response => {
                accountInfo = response;
            })
            .catch(error => console.error('Error:', error));
    }

    function betterDesign() {
        let design = GM_getValue("design", 3);

        //uses a new promise that will wait for it to be loaded to help async actions
        waitTillLoad("[class^=menu-bar_main-menu] [class^=button_outlined-button]")
            .then((a) => {
                GM_addStyle(".reversed {flex-Direction: row-reverse;}");

                const adjustDesign = (action = "toggle") => {
                    const classLists = [
                        document.querySelector('[class^=target-pane_target-pane]').classList,
                        document.querySelector('[class^=gui_flex-wrapper]').classList,
                        document.querySelector("[class^=stage-header_stage-menu-wrapper]").classList,
                        document.querySelector("[class^=stage-header_stage-size-row]").classList
                    ];

                    switch (action) {
                        case "toggle":
                            classLists.forEach((b) => {
                                b.toggle("reversed");
                            })
                            break;
                        case "remove":
                            classLists.forEach((b) => {
                                b.remove("reversed");
                            });
                            break;
                        case "add":
                            classLists.forEach((b) => {
                                b.add("reversed");
                            })
                            break;
                    }
                };

                if (design == 3) {
                    adjustDesign("remove");
                } else if (design == 2) {
                    adjustDesign("add");
                }

                element("div").a("class", a.parentElement.classList.item(0))
                    .add("span").a("class", [a.classList.item(0), a.classList.item(1), "design_toggle"].join(" ")).a("style", "background: hsla(30, 100%, 55%, 1);")
                    .e("click", (e) => {
                        adjustDesign();

                        if (document.querySelector('[class^=target-pane_target-pane]').classList.contains("reversed")) {
                            GM_setValue("design", 2);
                            document.querySelector(".design_toggle span").innerHTML = "3.0 Design";
                        } else {
                            GM_setValue("design", 3);
                            document.querySelector(".design_toggle span").innerHTML = "2.0 Design";
                        }
                    })
                    .add("div")
                    .add("span").t("2.0 Design")
                    .close()
                    .aftap(document.querySelector("[class^=menu-bar_main-menu] div:nth-child(6)"));
            })
            .catch((err) => {
                console.warn(err);
            })
    }

    function editorClick() {
        waitTillLoad('.see-inside-button')
            .then(a => {
                console.log('loaded the click button');
                a.addEventListener('click', () => {
                    removeTheme();
                    betterDesign();
                    projectPageClick();
                });
            });
    }

    function projectPageClick() {
        waitTillLoad('[class^=menu-bar_main-menu] [class*=community-button_community-button][role=button]')
            .then((b) => {
                b.addEventListener('click', () => {
                    dark_theme();
                    editorClick();
                });
            });
    }

    function build_carousel() {
        if (GM_getValue('carousel', false)) {
            //changes how projects are cycled through with them no longer using the same theme
            fetch("https://api.scratch.mit.edu/proxy/featured")
                .then((response) => response.json())
                .then((json) => {
                    //mark the old boxes to remove in future
                    let elements = document.querySelectorAll(".splash .inner .box");

                    for (const a of elements) {
                        const name = a.querySelector(".box-header > h4").innerHTML.trim();
                        const list = ["Featured Projects", "Featured Studios", "Projects Curated", "Scratch Design Studio", "What the Community is Remixing", "What the Community is Loving"];
                        const list2 = [`Projects by Scratchers I'm Following`, `Projects in Studios I'm Following`];
                        let found = false;
                        for (const b of list) {
                            if (name.toLowerCase().includes(b.toLowerCase())) {
                                a.classList.add("marked");
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            for (const b of list2) {
                                if (name.toLowerCase().includes(b.toLowerCase())) {
                                    a.classList.add("markedSecond");
                                    found = true;
                                    break;
                                }
                            }
                        }
                    }

                    const target = (document.querySelector('.custom-messages')) ? '.custom-messages' : '.splash-header';

                    const templates = [
                        {
                            id: 'featuredProjects',
                            name: 'Featured Projects',
                            contentID: 'customfeatured',
                            json: json["community_featured_projects"],
                            jsonType: 'project',
                            siema: () => siema1,
                        },
                        {
                            id: 'featuredStudios',
                            name: 'Featured Studios',
                            contentID: 'featuredStudiosContent',
                            json: json["community_featured_studios"],
                            jsonType: 'studio',
                            siema: () => siema2,
                        },
                        {
                            id: 'curatedProjects',
                            name: `Projects Curated by ${json["curator_top_projects"][0]["curator_name"]}`,
                            contentID: 'customCuratedProjects',
                            link: {
                                href: '/studios/386359/',
                                name: 'Learn More',
                            },
                            json: json["curator_top_projects"],
                            jsonType: 'project',
                            siema: () => siema3,
                        },
                        {
                            id: 'designStudio',
                            name: `Scratch Design Studio - ${json["scratch_design_studio"][0]["gallery_title"]}`,
                            contentID: 'designStudioProjects',
                            link: {
                                href: `/studios/${json["scratch_design_studio"][0]["gallery_id"]}/`,
                                name: 'Visit Studio',
                            },
                            json: json["scratch_design_studio"],
                            jsonType: 'project',
                            siema: () => siema4,
                        },
                        {
                            id: 'communityRemixing',
                            name: `What is being remixed`,
                            contentID: 'communityRemixingProjects',
                            json: json["community_most_remixed_projects"],
                            jsonType: 'project',
                            siema: () => siema5,
                        },
                        {
                            id: 'communityLoving',
                            name: `What is being loved`,
                            contentID: 'communityLovingProjects',
                            json: json["community_most_loved_projects"],
                            jsonType: 'project',
                            siema: () => siema6,
                        },
                    ]

                    const buildTemplate = (_templates, _height = '160px') => {
                        //build all the scrolls
                        element().each(_templates, (elem, template) => {
                            elem.add('div').a({ "class": "box", "id": template.id })
                                .add("div").a("class", "box-header")
                                .addDom(svg("leftCircle", { "style": "float: left; cursor: pointer;" }, (e) => { template.siema().prev(5); }))
                                .add("h4").t(template.name).a("style", "padding: 1.5px 10px 0px 10px; user-select: none;").f()
                                .addDom(svg("rightCircle", { "style": "cursor: pointer;" }, (e) => { template.siema().next(5); }))
                                .add("a").a({ "style": "float: right", href: (template.link) ? template.link.href : '#' }).t((template.link) ? template.link.name : '').f().f()
                                .add("div").a({ "class": "box-content", "id": template.contentID, "style": `height: ${_height};` })
                                .each(template.json, (elem, data) => {
                                    if (template.jsonType === 'project') {
                                        elem.add('div').a({ "style": "width: 156px; box-shadow: 1px 1.5px 1px rgba(0, 0, 0, 0.12); margin-left: -5px;" })
                                            .add("div").a({ "style": "width: 146px; height: 150px; padding: 5px;" })
                                            .add("a").a("href", `/projects/${data["id"]}/`)
                                            .add("img").a({ "data-src": data["thumbnail_url"], "alt": "...", "style": "width: 156px; height: 115px; position: relative; bottom: 5px; right: 5px; cursor: pointer;", "class": "lazy" }).f()
                                            .f()
                                            .add("a").t(data["title"]).a({ "href": `/projects/${data["id"]}/`, "title": data["title"], "style": "width: 100%; overflow: hidden; display: inline-block; height: 25px; line-height: 25px; white-space: nowrap; position: relative; bottom: 9px; float: left;" }).f()
                                            .add("a").t(data["creator"]).a({ "href": `/users/${data["creator"]}/`, "title": data["creator"], "style": "max-width: 100%; overflow: hidden; display: inline-block; font-size: .8462em; height: 20px; line-height: 20px; white-space: nowrap; position: relative; bottom: 12px; " }).f()
                                            .close();
                                    } else if (template.jsonType === 'newProject') {
                                        //this is to support the independent calls with use a different format
                                        elem.add('div').a({ "style": "width: 170px; box-shadow: 1px 1.5px 1px rgba(0, 0, 0, 0.12); margin-left: -10px;" })
                                            .add("div").a({ "style": "width: 160px; height: 140px; padding: 5px;" })
                                            .add("a").a("href", `/projects/${data["id"]}/`)
                                            .add("img").a({ "data-src": data["image"], "alt": "...", "style": "width: 170px; height: 100px; position: relative; bottom: 5px; right: 5px; cursor: pointer;", "class": "lazy" }).f()
                                            .f()
                                            .add("a").t(data["title"]).a({ "href": `/projects/${data["id"]}/`, "title": data["title"], "style": "width: 100%; overflow: hidden; display: inline-block; height: 25px; line-height: 25px; white-space: nowrap; position: relative; bottom: 9px; float: left;" }).f()
                                            .add("a").t(data["author"]["username"]).a({ "href": `/users/${data["author"]["username"]}/`, "title": data["author"]["username"], "style": "max-width: 100%; overflow: hidden; display: inline-block; font-size: .8462em; height: 20px; line-height: 20px; white-space: nowrap; position: relative; bottom: 12px; " }).f()
                                            .close();
                                    } else {
                                        elem.add('div').a({ "style": "width: 170px; box-shadow: 1px 1.5px 1px rgba(0, 0, 0, 0.12); margin-left: -10px;" })
                                            .add("div").a({ "style": "width: 160px; height: 120px; padding: 5px;" })
                                            .add("a").a("href", `/studios/${data["id"]}/`)
                                            .add("img").a({ "data-src": data["thumbnail_url"], "alt": "...", "style": "width: 170px; height: 100px; position: relative; bottom: 5px; right: 5px; cursor: pointer;", "class": "lazy" }).f()
                                            .f()
                                            .add("a").t(data["title"]).a({ "href": `/studios/${data["id"]}/`, "title": data["title"], "style": "max-width: 100%; overflow: hidden; display: inline-block; height: 25px; line-height: 25px; white-space: nowrap; position: relative; bottom: 9px; float: left;" }).f()
                                            .close();
                                    }
                                })
                                .close();
                        }).aftap(document.querySelector(target));
                    };

                    buildTemplate(templates);

                    //these need to be called after content is added to current dom since there is no delay for the selector
                    const siema1 = new Siema({
                        selector: "#" + templates[0].contentID,
                        perPage: 5,
                        loop: false
                    }),
                        siema2 = new Siema({
                            selector: "#" + templates[1].contentID,
                            perPage: 5,
                            loop: false
                        }),
                        siema3 = new Siema({
                            selector: "#" + templates[2].contentID,
                            perPage: 5,
                            loop: false
                        }),
                        siema4 = new Siema({
                            selector: "#" + templates[3].contentID,
                            perPage: 5,
                            loop: false
                        }),
                        siema5 = new Siema({
                            selector: "#" + templates[4].contentID,
                            perPage: 5,
                            loop: false
                        }),
                        siema6 = new Siema({
                            selector: "#" + templates[5].contentID,
                            perPage: 5,
                            loop: false
                        });

                    //lazy loading for the images
                    let myLazyLoad = new LazyLoad({
                        elements_selector: ".lazy"
                    });

                    GM_addStyle(".marked {display: none;}");

                    //load in the other two scrolls
                    _waitTillLoad(() => accountInfo.hasOwnProperty("user")).then(async () => {
                        const [userFollowed, studioFollowed] = await Promise.all([
                            fetch(`https://api.scratch.mit.edu/users/${accountInfo.user.username}/following/users/projects`, {
                                method: 'GET',
                                headers: {
                                    'X-Token': accountInfo.user.token
                                }
                            }).then(r => r.json()),
                            fetch(`https://api.scratch.mit.edu/users/${accountInfo.user.username}/following/studios/projects`, {
                                method: 'GET',
                                headers: {
                                    'X-Token': accountInfo.user.token
                                }
                            }).then(r => r.json()),
                        ]);

                        const info = [
                            {
                                id: 'followedProjects',
                                name: 'Projects by Scratchers You Follow',
                                contentID: 'followedProjectsContent',
                                json: userFollowed,
                                jsonType: 'newProject',
                                siema: () => siema10,
                            },
                            {
                                id: 'followedStudios',
                                name: 'Projects From Studios You Follow',
                                contentID: 'followedStudiosContent',
                                json: studioFollowed,
                                jsonType: 'newProject',
                                siema: () => siema11,
                            },
                        ];

                        buildTemplate(info, '150px');

                        const siema10 = new Siema({
                            selector: "#" + info[0].contentID,
                            perPage: 5,
                            loop: false
                        }),
                            siema11 = new Siema({
                                selector: "#" + info[1].contentID,
                                perPage: 5,
                                loop: false
                            });

                        myLazyLoad.update();

                        GM_addStyle(".markedSecond {display: none;}");
                    });
                })
                .catch((e) => {
                    console.warn("An error occured in theme tweaks in fetch", e);
                });
        }
    }

    //a specific tweak that can chnage how a lot of the theme looks
    function theme_tweaks() {
        //prevent null value
        if (GM_getValue('tweakTheme', null) == null) {
            GM_setValue('tweakTheme', false);
        }

        //removes theme tweak
        if (GM_getValue("tweakTheme", null) == false) {
            if (themeTweakStyle) {
                themeTweakStyle.parentElement.removeChild(themeTweakStyle);
                themeTweakStyle = null;
            }
            return;
        }

        themeTweakStyle = GM_addStyle(".box {border: 0px; box-shadow: 1px 1.5px 1px rgba(0, 0, 0, 0.12);}");
    }

    function load_newpage() {
        let displaySettingsModal = false, toggleModal = () => {
            if (displaySettingsModal) {
                document.body.setAttribute('style', 'overflow-y:scroll;');
                $('#res-set-modal').hide(500);
                document.querySelector('#res-set-modal-back').classList.toggle('modal-hidden');
                displaySettingsModal = false;
            } else {
                document.body.setAttribute('style', 'overflow-y:hidden;');
                $('#res-set-modal').show(500);
                document.querySelector('#res-set-modal-back').classList.toggle('modal-hidden');

                try {
                    document.querySelector('#extrasIO').checked = GM_getValue("extras", true);
                    document.querySelector('#msgIO').checked = GM_getValue("msg", true);
                    document.querySelector('#timerIO').checked = GM_getValue("timer", true);
                    document.querySelector('#blocksIO').checked = GM_getValue("blockCode", true);
                    document.querySelector('#embedIO').checked = GM_getValue("embedFeature", true);
                    document.querySelector('#bannerIO').checked = GM_getValue("bannerOff", true);
                    document.querySelector('#messageThemeIO').checked = GM_getValue("messageTheme", false);
                    document.querySelector('#tweakThemeIO').checked = GM_getValue("tweakTheme", false);

                    document.querySelector('#themeIO').value = GM_getValue("theme", "light");
                    document.querySelector('#editorThemeIO').value = GM_getValue("editorTheme", "default");
                    document.querySelector('#posIO').value = GM_getValue("pos", "top");
                    document.querySelector('#disText').value = GM_getValue("forumTitle", "Forums");

                    //put the newest modal values at the bottom since they will throw an error in dev and prevent other values from being set
                    document.querySelector('#carouselIO').checked = GM_getValue("carousel", false);
                } catch (e) {
                    console.log('Error with setting modal values', e);
                }

                displaySettingsModal = true;
            }
        };
        //adds popup settings modal
        GM_addStyle('.modal-hidden {display:none;} #res-set-modal {position:fixed; background-color:#00000000; width:40%; height:80%; border-radius:5px; outline:none; left:30%; top:10%; z-index: 9999; color: black !important; padding:20px; text-align:center;} #res-set-modal-back {position:fixed; width: 100%; height: 100%; background-color:#212121; left:0; top:0; z-index:9998; opacity:.5;}');

        element('div').a({ id: 'res-set-modal', class: 'modal-hidden', tabindex: '1' })
            .addDom(document.createRange().createContextualFragment(GM_getResourceText("Modal")))
            .close()
            .add('div').a({ id: 'res-set-modal-back', class: 'modal-hidden' })
            .e('click', toggleModal)
            .close()
            .ap(document.body);

        //IO for sliders
        try {
            document.querySelector('#extrasIO').addEventListener('click', (event) => GM_setValue("extras", event.currentTarget.checked));
            document.querySelector('#msgIO').addEventListener('click', (event) => GM_setValue("msg", event.currentTarget.checked));
            document.querySelector('#timerIO').addEventListener('click', (event) => GM_setValue("timer", event.currentTarget.checked));
            document.querySelector('#blocksIO').addEventListener('click', (event) => GM_setValue("blockCode", event.currentTarget.checked));
            document.querySelector('#embedIO').addEventListener('click', (event) => GM_setValue("embedFeature", event.currentTarget.checked));
            document.querySelector('#bannerIO').addEventListener('click', (event) => GM_setValue("bannerOff", event.currentTarget.checked));
            document.querySelector('#messageThemeIO').addEventListener('click', (event) => GM_setValue("messageTheme", event.currentTarget.checked));
            document.querySelector('#tweakThemeIO').addEventListener('click', (event) => GM_setValue("tweakTheme", event.currentTarget.checked));
            document.querySelector('#carouselIO').addEventListener('click', (event) => GM_setValue("carousel", event.currentTarget.checked));
        } catch (e) {
            console.log('Error adding modal event' + e);
        }

        //IO for dropdowns
        try {
            document.querySelector('#disText').addEventListener('change', (event) => GM_setValue("forumTitle", event.currentTarget.value));
            document.querySelector('#themeIO').addEventListener('change', (event) => {
                GM_setValue("theme", event.currentTarget.value);
                dark_theme();
            });
            document.querySelector('#editorThemeIO').addEventListener('change', (event) => {
                GM_setValue("editorTheme", event.currentTarget.value);
                editorTheme();
            });
            document.querySelector('#posIO').addEventListener('change', (event) => GM_setValue("pos", event.currentTarget.value));
        } catch (e) {
            console.log('Error adding modal event' + e);
        }

        //adds settings option for user panel
        if (pageType == 'new') {
            waitTillLoad('.dropdown').then((elem) => {
                const divider = elem.querySelector('.divider');
                const dom = element('li').a('id', 'res-set')
                    .e('click', toggleModal)
                    .add('a').t('Resurgence Settings').close().dom;
                divider.parentElement.insertBefore(dom, divider);
            });
        } else {
            waitTillLoad('#logout').then((elem) => {
                const dom = element('li').a('id', 'res-set')
                    .e('click', toggleModal)
                    .add('a').t('Resurgence Settings').close().dom;

                elem.parentElement.insertBefore(dom, elem);
            });
        }

        //embeds users featured project
        if (GM_getValue("embedFeature", true)) {
            if (url.includes("/users/")) {
                const featuredProject = new URL(document.querySelector('#featured-project').href).pathname.substr(9);
                const height = 220;
                const width = Math.round(1.2 * 220);
                const dom = element('iframe').a({
                    allowtransparency: 'true',
                    width: width.toString(),
                    height: height.toString(),
                    src: '//scratch.mit.edu/projects/embed' + featuredProject + '?autostart=false',
                    frameborder: '0',
                    allowfullscreen: '',
                    scrolling: 'no',
                }).f().dom;
                const stage = document.querySelector('div.stage');
                stage.replaceWith(dom);
            }
        }
    }

    function add_search() {
        //adds google to the search
        if (url.includes("/search/")) {
            //first load new search
            let search = document.createElement("gcse:searchresults-only");
            let display = document.getElementById("projectBox");
            display.appendChild(search);

            let cx = '005257552979626070807:ejqzgnmerl0';
            let gcse = document.createElement('script');
            gcse.type = 'text/javascript';
            gcse.async = true;
            gcse.src = 'https://cse.google.com/cse.js?cx=' + cx;
            let s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(gcse, s);

            element('a').e('click', () => {
                //make button look selected
                document.getElementsByClassName("active")[0].removeAttribute("class");
                document.getElementById("active").setAttribute("class", "active");
                //need to clear current searches
                display.childNodes[0].style.display = "none";
                display.childNodes[1].style.display = "none";
                document.getElementById("___gcse_0").style.display = "block";
            })
                .add('li').a('id', 'active')
                .add('img').a({ 'class': 'tab-icon', 'style': 'height: 24px;' }).f()
                .add('span').t('Google').f()
                .close()
                .ap(document.getElementsByClassName("sub-nav tabs")[0]);
        }
    }
    //adds dark theme button
    function dark_theme() {
        removeTheme();
        if (GM_getValue("theme", false) === "dark") {
            //want dark theme
            style = GM_addStyle(GM_getResourceText("CSS"));
        } else if (GM_getValue("theme", false) === "newLight") {
            style = GM_addStyle(GM_getResourceText("CSSlight"));
        }
    }

    function removeTheme() {
        if (style !== null && style.parentElement !== null) { //remove any styles that are already in use
            style.parentElement.removeChild(style);
            style = null;
        }

        if (style1 !== null && style1.parentElement !== null) {
            style1.parentElement.removeChild(style1);
            style1 = null;
        }
    }

    //adds dark theme for 3.0 editor
    function editorTheme() {
        //3.0 Theme Userscript Framework by infinitytec modified by Wetbikeboy2500. Released under the MIT license.
        if (url.includes('/projects')) {
            let css = [];
            const mainBG = '#111111';
            const secondaryBG = '#151515';
            const accent = '#202020';
            const text = '#bfbfbf';

            switch (GM_getValue('editorTheme', 'default')) {
                case 'dark':
                    //TODO: check editor with dark theme
                    if (editorStyle === null) {
                        //Set colors for the editor. Names should explain what they are. They will automatically be applied to different parts of the editor. For the purpose of simplification, the red cancel button and the hover/active/focus effects are hard-coded. The effects use filters so they should be good-to-go in most cases.
                        css.push(`:root {--main-bg: ${mainBG}; --secondary-bg: ${secondaryBG}; --accent: ${accent}; --text: ${text};}`);
                        //Main UI bar, similar bars, and dropdown menu
                        css.push(".menu-bar_main-menu_3wjWH, .modal_header_1h7ps, .menu-bar_account-info-group_MeJZP, .menu_menu_3k7QT, .project-title-input_title-field_en5Gd:focus {background: var(--accent) !important;}");
                        //Main background
                        css.push(".gui_body-wrapper_-N0sA, .blocklySvg {background: var(--main-bg) !important;}");
                        //Scripting area background
                        css.push(".blocklyMainBackground{fill: var(--secondary-bg) !important;}");
                        //Right-click & pop-ups
                        css.push(".context-menu_context-menu_2SJM-, .blocklyWidgetDiv .goog-menu, .Popover-body {background: var(--accent) !important; color: var(--text) !important; border: 1px solid white !important;} .goog-menuitem-content, .color-picker_row-header_173LQ {color: var(--text) !important;} /*Highlight*/ .blocklyWidgetDiv .goog-menuitem-highlight, .blocklyWidgetDiv .goog-menuitem-hover, .context-menu_menu-item_3cioN:hover {background-color:#ffffff33 !important;}");
                        //Palette
                        css.push(".blocklyFlyoutBackground {fill: var(--accent) !important;}");
                        //Palette text
                        css.push(".blocklyFlyoutLabelText{fill: var(--text) !important;}");
                        //Toolbox, extension connection box
                        css.push(".connection-modal_bottom-area_AHeQ3, .connection-modal_body_3YO9j, .blocklyToolboxDiv, .scratchCategoryMenu {background: var(--accent) !important; color: var(--text) !important;}");
                        //Selected category
                        css.push(".scratchCategoryMenuItem.categorySelected {background: #ffffff22 !important;}");
                        //Sprite and stage selection area
                        css.push(".sprite-selector_sprite-selector_2KgCX, .stage-selector_stage-selector_3oWOr, .stage-selector_label_1MCfr, .stage-selector_count_2QK7D {background: var(--accent) !important; color: var(--text) !important;}");
                        css.push(".sprite-info_sprite-info_3EyZh, .stage-selector_header_2GVr1, .stage-selector_header-title_33xCt, .stage-selector_header-title_33xCt, .sprite-selector-item_sprite-selector-item_kQm-i:hover {background: var(--secondary-bg) !important; color: var(--text) !important;}");
                        //Palette Buttons
                        css.push(".blocklyFlyoutButtonBackground {fill: var(--accent) !important;}.blocklyFlyoutButtonBackground:hover, .blocklyFlyoutButton:hover {fill: var(--accent) !important; filter: brightness(110%) !important;}");
                        css.push("blocklyFlyoutButton > text.blocklyText {fill: var(--text) !important;}");
                        //Text fill of "Make A" buttons
                        css.push(".blocklyFlyoutButton .blocklyText {fill: var(--text) !important;");
                        //Backpack header
                        css.push(".backpack_backpack-header_6ltCS {background: var(--accent) !important; color: var(--text) !important;}");
                        //Backpack
                        css.push(".backpack_backpack-list-inner_10a2A {background: var(--secondary-bg) !important;} .backpack_backpack-item_hwqzQ, .sprite-selector-item_sprite-image-outer_Xs0wN, .backpack_backpack-item_hwqzQ > div {background: var(--main-bg) !important;} .backpack_backpack-item_hwqzQ img {mix-blend-mode: normal !important;}");
                        //Paint & sound editor sidebar
                        css.push(".selector_list-area_1Xbj_{background: var(--accent) !important;} .selector_new-buttons_2qHDd::before {background: none !important;}");
                        //Paint & sound editor main
                        css.push(".asset-panel_wrapper_366X0{background: var(--secondary-bg) !important; color: var(--text) !important;} .sound-editor_effect-button_2zuzT, .sound-editor_trim-button_lSENI {color: var(--text) !important;}");
                        //Paint and sound editor buttons
                        css.push("img.tool-select-base_tool-select-icon_tJ-rr, .sound-editor_trim-button_lSENI{filter: brightness(2) !important;}");
                        //Sprite costume selector text
                        css.push(".selector_list-item_3N_u7, .sprite-selector-item_sprite-name_1PXjh, .sprite-selector-item_sprite-details_2UVpA {color: var(--text) !important;}");
                        //Tabs
                        css.push(".gui_tab_27Unf.gui_is-selected_sHAiu{background: var(--accent) !important; color: var(--text) !important;}.gui_tab_27Unf{background: var(--secondary-bg) !important; color: var(--text) !important;} .gui_tab_27Unf:hover{background: var(--accent) !important; filter: brightness(90%) !important; color: var(--text) !important;}");
                        //New variable/list/custom block
                        css.push(".prompt_body_18Z-I, .custom-procedures_body_SQBv6, div.custom-procedures_option-card_BtHt3 {background: var(--accent) !important; color: var(--text) !important;} .custom-procedures_button-row_2jBu3 > button:nth-child(1), .prompt_button-row_3Wc5Z > button:nth-child(1),.prompt_button-row_3Wc5Z > button:nth-child(1) {background: #ff3a5b !important;}");
                        //Fullscreen view
                        css.push(".stage_stage-wrapper-overlay_fmZuD, .stage-header_stage-header-wrapper-overlay_5vfJa{background: black !important;} .stage_stage-overlay-content_ePv_6 {border: none !important;} ");
                        //Library background
                        css.push(".library_library-scroll-grid_1jyXm, .modal_modal-content_1h3ll.modal_full-screen_FA4cr {background: var(--accent) !important; color: var(--text) !important;} ");
                        //Library items & filter bar
                        css.push(".library-item_library-item-extension_3xus9, .library-item_library-item_1DcMO, .library_filter-bar_1W0DW {background: var(--accent) !important;} .library-item_library-item-extension_3xus9 span, .library-item_featured-extension-metadata_3D8E8, .library-item_library-item-name_2qMXu {color: var(--text) !important;}");
                        //Text input
                        css.push("input[type=text], .input_input-form_1Y0wX, .prompt_variable-name-text-input_1iu8- {background: var(--accent) !important; color: var(--text) !important;} input[type=text]:hover, input[type=text]:focus {background: var(--accent) !important; filter: brightness(90%) !important;}");
                        //Buttons (inverted for dark theme)
                        css.push(".blocklyZoom,  .stage-header_stage-button_hkl9B, .sound-editor_round-button_3NLcW, .sound-editor_button-group_SFPoV {filter: invert(100) hue-rotate(180deg) !important;}");
                        //Set the selected costume/backdrop to have a transparent background as default
                        css.push(".sprite-selector-item_is-selected_24tQj {background:transparent !important;}");
                        //Fixing white area around the paint editor
                        css.push(".paint-editor_canvas-container_x2D0a {border: 1px solid var(--accent) !important; overflow: hidden !important; }");
                        //Tweaks for updated paint editor
                        css.push(".paper-canvas_paper-canvas_1y588 {background-color: var(--secondary-bg) !important; border-radius: .4rem !important;} .paint-editor_canvas-container_x2D0a {border: 2px solid var(--accent) !important; border-radius: .4rem !important; }");
                        editorStyle = GM_addStyle(css.join(" "));
                    }
                    break;
                default:
                    if (editorStyle !== null && editorStyle.parentElement !== null) {
                        editorStyle.parentElement.remove(editorStyle);
                        editorStyle = null;
                    }
                    break;
            }
        }
    }

    function load_messages_panel() {
        const box = element('div')
            .a('class', 'box custom-messages')
            .add('div').a('class', 'box-header')
            .add('h4').t('Messages').f().f()
            .add('div').a('class', 'box-content').f();

        GM_addStyle('.custom-messages .box-content { overflow-y: scroll; height: 285px; } .custom-messages .username_link {cursor: pointer; color: #6b6b6b !important; text-decoration: none;}');

        box.aftap(document.querySelector('.splash-header'));

        _waitTillLoad(() => accountInfo.hasOwnProperty("user")).then(() => {
            //local reference
            let user = { token: accountInfo.user.token, username: accountInfo.user.username };

            const checkUnread = (response) => {
                let request = JSON.parse(response);
                const stored = JSON.parse(GM_getValue("message", null));

                if (stored == null) {
                    return true;
                }

                //comapre newest comment by time
                return request[0].datetime_created !== stored[0].datetime_created;
            };

            const decodetext = (text) => {
                let txt = element("textarea").dom;
                txt.innerHTML = text;
                return txt.value;
            };

            const loadMessages = (messages) => {
                if (messages == null)
                    return;

                let html = JSON.parse(messages);
                GM_setValue("message", messages);
                let ul = element("ul").a("id", "messages")
                for (let a of html) {
                    let timePassed = calcSmallest(new Date(Date.parse(a.datetime_created)));
                    switch (a.type) {
                        case "forumpost":
                            ul.add("li")
                                .add("span").t("There are new posts in the forum: ").f()
                                .add("a").t(a.topic_title).a("href", "/discuss/topic/" + a.topic_id + "/unread/").f()
                                .add("span").t(timePassed).f()
                                .f();
                            break;
                        case "studioactivity":
                            ul.add("li")
                                .add("span").t("There was new activity in ").f()
                                .add("a").t(a.title).a("href", "/studios/" + a.gallery_id).f()
                                .add("span").t(timePassed).f()
                                .f();
                            break;
                        case "favoriteproject":
                            ul.add("li")
                                .add("a").t(a.actor_username).a("href", "/users/" + a.actor_username).a("class", "username_link").f()
                                .add("span").t(" favorited your project ").f()
                                .add("a").t(a.project_title).a("href", "/projects/" + a.project_id).f()
                                .add("span").t(timePassed).f()
                                .f();
                            break;
                        case "loveproject":
                            ul.add("li")
                                .add("a").t(a.actor_username).a("href", "/users/" + a.actor_username).a("class", "username_link").f()
                                .add("span").t(" loved your project ").f()
                                .add("a").t(a.title).a("href", "/projects/" + a.project_id).f()
                                .add("span").t(timePassed).f()
                                .f();
                            break;
                        case "followuser":
                            ul.add("li")
                                .add("a").t(a.actor_username).a("href", "/users/" + a.actor_username).a("class", "username_link").f()
                                .add("span").t(" followed you").f()
                                .add("span").t(timePassed).f()
                                .f();
                            break;
                        case "remixproject":
                            ul.add("li")
                                .add("a").t(a.actor_username).a("href", "/users/" + a.actor_username).a("class", "username_link").f()
                                .add("span").t(" remixed your project ").f()
                                .add("a").t(a.parent_title).a("href", "/projects/" + a.parent_id).f()
                                .add("span").t(" as ").f()
                                .add("a").t(a.title).a("href", "/projects/" + a.project_id).f()
                                .add("span").t(timePassed).f()
                                .f();
                            break;
                        case "addcomment":
                            if (a.comment_type === 0) { //project
                                ul.add("li")
                                    .add("a").a("href", "/users/" + a.actor_username).a("class", "username_link").t(a.actor_username).f()
                                    .add("span").t(' commented "' + decodetext(a.comment_fragment) + '" on your project ').f()
                                    .add("a").a("href", "/projects/" + a.comment_obj_id + "/#comments-" + a.comment_id).t(a.comment_obj_title).f()
                                    .add("span").t(timePassed).f()
                                    .f();
                            } else if (a.comment_type === 1) { //profile page
                                ul.add("li")
                                    .add("a").a("href", "/users/" + a.actor_username).a("class", "username_link").t(a.actor_username).f()
                                    .add("span").t(' commented "' + decodetext(a.comment_fragment) + '" on your profile ').f()
                                    .add("a").a("href", "/users/" + a.comment_obj_title + "/#comments-" + a.comment_id).t(a.comment_obj_title).f()
                                    .add("span").t(timePassed).f()
                                    .f();
                            } else if (a.comment_type === 2) {
                                ul.add("li")
                                    .add("a").a("href", "/users/" + a.actor_username).a("class", "username_link").t(a.actor_username).f()
                                    .add("span").t(' commented "' + decodetext(a.comment_fragment) + '" on your studio ').f()
                                    .add("a").a("href", "/studios/" + a.comment_obj_id + "/#comments-" + a.comment_id).t(a.comment_obj_title).f()
                                    .add("span").t(timePassed).f()
                                    .f();
                            } else {
                                console.warn("Comment type not found");
                            }
                            break;
                        case "curatorinvite":
                            ul.add("li")
                                .add("a").a("href", "/users/" + a.actor_username).a("class", "username_link").t(a.actor_username).f()
                                .add("span").t(' invited you to curate ').f()
                                .add("a").a("href", "/studios/" + a.gallery_id).t(a.gallery_title).f()
                                .add("span").t(timePassed).f()
                                .f();
                            break;
                        case "becomeownerstudio":
                            ul.add("li")
                                .add("a").a("href", "/users/" + a.actor_username).a("class", "username_link").t(a.actor_username).f()
                                .add("span").t(' promoted you to manager in ').f()
                                .add("a").a("href", "/studios/" + a.gallery_id).t(a.gallery_title).f()
                                .add("span").t(timePassed).f()
                                .f();
                            break;
                        case "userjoin":
                            ul.add("li")
                                .add("span").t('Welcome to Scratch').f()
                                .add("span").t(timePassed).f()
                                .f();
                            break;
                        default:
                            console.warn(a, "Not Found");
                    }
                }

                ul.ap(document.querySelector('.custom-messages .box-content'));

                return;
            };

            const setUnread = (text) => {
                const count = JSON.parse(text).count;
                const messages = document.querySelectorAll('.custom-messages li');

                if (count <= 0) {
                    return;
                }

                for (let i = 0; i < count; i++) {
                    if (GM_getValue("theme", false) === "dark") {
                        messages[i].setAttribute("style", "background-color: #36393f; opacity: 1;");
                    } else {
                        messages[i].setAttribute("style", "background-color: #eed; opacity: 1;");
                    }

                }

                //add the clear messgaes button
                element("button").t("Clear Messages").a({ "style": "float: right;" })
                    .e("click", () => {
                        fetch("https://scratch.mit.edu/site-api/messages/messages-clear/", {
                            method: "POST",
                            headers: {
                                'X-CSRFToken': getCookie("scratchcsrftoken")
                            }
                        })
                            .then((res) => res.text())
                            .then((res) => console.log(res))
                            .catch((err) => {
                                console.warn(err);
                            })
                    })
                    .ap(document.querySelector(".custom-messages > .box-header"));
            };


            fetch(`https://api.scratch.mit.edu/users/${user.username}/messages?limit=1&offset=0`, {
                method: 'GET',
                headers: {
                    'X-Token': user.token
                }
            })
                .then(response => response.text())
                .then(checkUnread)
                .then((response) => {
                    if (response) {
                        return fetch(`https://api.scratch.mit.edu/users/${user.username}/messages?limit=40&offset=0`, {
                            method: 'GET',
                            headers: {
                                'X-Token': user.token
                            }
                        }).then((response) => response.text());
                    } else {
                        return GM_getValue("message", null);
                    }
                })
                .then(loadMessages)
                .then(() => fetch(`https://api.scratch.mit.edu/users/${user.username}/messages/count`).then(response => response.text()))
                .then(setUnread)
                .catch((e) => console.log(e));
        });
    }

    //custom banner to display information that the user may want
    function load_banner() {
        if (url == "https://scratch.mit.edu/" && GM_getValue("pos", "top") != "none") {//on main page
            let newsUpdatesExpanded = false;

            let svgCircle = svg("downCircle");
            svgCircle.setAttribute("style", "width: 20px; height: 20px; vertical-align: middle; padding-bottom: 2px;");
            svgCircle.setAttribute("id", "expandCollapse");

            //this displays the new changes that I made to element creation(the old stuff still works but is obsolete to this)
            let box = element("div").a("class", "box")
                .add("div").a("class", "box-header")
                .add("h4").t("Resurgence Userscript Info").f()
                .add("p").add("a").a("href", "https://github.com/Wetbikeboy2500/Resurgence").t("Resurgence Github").f().f()
                .f()

                .add("div").a("class", "box-content")
                .add("p").t("Current Version: " + currentVersion).a("style", "margin: 0px;").f()
                .add("p").a("style", "margin: 0;").t("Recent Version:").a("id", "recent_version").f()
                .f()
                .add("div").a({ "class": "box-content", "style": "padding: 0px; border-top: 1px solid #d9d9d9; text-align: center; user-select: none; cursor: pointer;" })
                .add("div").a({ "id": "newsUpdates", "style": "height: 0px; overflow: hidden;" })
                .add("div").a({ "style": "text-align: left; user-select: text; cursor: auto; border-bottom: 1px solid #d9d9d9; padding: 0px 20px 10px 20px; overflow: hidden;" })
                .add("h3").a("style", "margin: 0px; text-align: center;").t("Updates and News").f()
                .add("p").a("style", "margin: 0px;").t("Updates:").f()
                .add("ul").a("style", "margin: 0px;")
                .add("li").t("Smooth transitions and reskins for many pages").a("style", "margin: 0px;").f()
                .add("li").t("A material like theme is applied if theme tweaks is enabled").a("style", "margin: 0px;").f()
                .add("li").t("A better changelog").a("style", "margin: 0px;").f()
                .add("li").t("Drafts tab in forums (This is currently a placeholder)").a("style", "margin: 0px;").f()
                .add("li").t("Fixed theme with messages page").a("style", "margin: 0px;").f()
                .add("li").t("Added a clear message button (this hasn't been tested much)").a("style", "margin: 0px;").f()
                .add("li").t("Fixed issues with countdown timer").a("style", "margin: 0px;").f()
                .add("li").t("Fixed any interference with the new editor").a("style", "margin: 0px;").f()
                .add("li").t("Refactoring of a lot of code").a("style", "margin: 0px;").f()
                .f()
                .add("p").a("style", "margin: 0px;").t("11.1:").f()
                .add("ul").a("style", "margin: 0px;")
                .add("li").t("Removed different project players and download button").a("style", "margin: 0px;").f()
                .f()
                .add("p").a("style", "margin: 0px;").t("11.2:").f()
                .add("ul").a("style", "margin: 0px;")
                .add("li").t("2.0 design for editor").a("style", "margin: 0px;").f()
                .add("li").t("Fixed issues with url for editor").a("style", "margin: 0px;").f()
                .f()
                .add("p").a("style", "margin: 0px;").t("11.3:").f()
                .add("ul").a("style", "margin: 0px;")
                .add("li").t("Saved design for editor with better management of its changes in code").a("style", "margin: 0px;").f()
                .f()
                .add("p").a("style", "margin: 0px;").t("11.4:").f()
                .add("ul").a("style", "margin: 0px;")
                .add("li").t("Theme tweaks setting should now work as intended").a("style", "margin: 0px;").f()
                .f()
                .add("p").a("style", "margin: 0px;").t("11.5:").f()
                .add("ul").a("style", "margin: 0px;")
                .add("li").t("Fixed dark theme on some pages").a("style", "margin: 0px;").f()
                .add("li").t("Fixed dark theme persisting when switching between project and see inside").a("style", "margin: 0px;").f()
                .add("li").t("Fixed bugs involving theme changes").a("style", "margin: 0px;").f()
                .f()
                .add("p").a("style", "margin: 0px;").t("11.6:").f()
                .add("ul").a("style", "margin: 0px;")
                .add("li").t("Added dark theme setting for editor").a("style", "margin: 0px;").f()
                .add('a').a('href', 'https://infinitytec.github.io/index.html').t("Thanks to infinitytec's Userscripts for themes").f()
                .f()
                .add("p").a("style", "margin: 0px;").t("News:").f()
                .add("p").t("This is the news and rant section. I spent way too long to make this update and a lot of things are still partially done. I have also done a lot with the code with it going from 1638 lines to 2378+ lines with over 24 commits. This is even after trying to condense a lot of it down. It was all worth it though. I am trying to focus more on the looks now instead of just slapping together some half-baked UI. Userscripts are banned from promotion on this site which really was a sad day. The ATs have really died down with most of it being necroposting. I'm getting off topic but where else can I say anything about this userscript. I at least know infinitytec and NitroCipher is helping out. This is just a thought but there should be a topic on the ATs that only have really cryptic sayings. Worst case, it gets lost in the many pages or it has no interest. I just need something to do on the ATs. That is enough from me. I'll update this in the next big update (maybe). - Wetbikeboy2500").f()
                .f().f()
                .add("p").t("Read More").a("style", "margin: 0px; font-size: 15px; line-height: 20px; margin-top: 2px;").addDom(svgCircle)
                .e("click", (e) => {
                    if (!newsUpdatesExpanded) {
                        newsUpdatesExpanded = true;
                        let svgCircleUp = svg("upCircle");
                        svgCircleUp.setAttribute("style", "width: 20px; height: 20px; vertical-align: middle; padding-bottom: 2px;");
                        svgCircleUp.setAttribute("id", "expandCollapse");
                        document.querySelector("#expandCollapse").parentElement.replaceChild(svgCircleUp, document.querySelector("#expandCollapse"));

                        let target = document.querySelector("#newsUpdates");
                        target.style.borderBottom = "1px solid #d9d9d9";
                        target.style.display = "block";
                        const height = calculate_height_children(target);
                        let currentHeight = 0;
                        let interval = height * (10 / 500);
                        let time = setInterval(() => {
                            if (currentHeight >= height) {
                                clearInterval(time);
                                currentHeight = height;
                            } else {
                                currentHeight += interval;
                            }
                            target.style.height = currentHeight + "px";
                        }, 10);
                    } else {
                        newsUpdatesExpanded = false;
                        collapse_full(10, document.querySelector("#newsUpdates"), 500);
                        document.querySelector("#expandCollapse").parentElement.replaceChild(svgCircle, document.querySelector("#expandCollapse"));
                    }
                }).f()
                .f();
            if (GM_getValue("pos", "top") == "top") {
                document.querySelector('.mod-splash').prepend(box.dom);
            } else {
                box.ap(document.getElementsByClassName("mod-splash")[0]);
            }

            //gets the current version of the code from the github page
            fetch("https://raw.githubusercontent.com/Wetbikeboy2500/Resurgence/master/ScratchFixer.user.js")
                .then(response => response.text())
                .then((text) => {
                    const version = text.substring(text.indexOf("@version") + 9, text.indexOf("// @description") - 1);
                    let tmpVersion = Number(version);
                    if (tmpVersion != currentVersion) {
                        if (tmpVersion < GM_info.script.version) {
                            document.getElementById("recent_version").innerHTML = "Recent Version: " + version + " ";
                            element("a").a("href", "https://raw.githubusercontent.com/Wetbikeboy2500/Resurgence/master/ScratchFixer.user.js").t("Downgrade (Your version is too revolutionary)").ap(document.getElementById("recent_version"));
                        } else {
                            document.getElementById("recent_version").innerHTML = "Recent Version: " + version + " ";
                            element("a").a("href", "https://raw.githubusercontent.com/Wetbikeboy2500/Resurgence/master/ScratchFixer.user.js").t("Update").ap(document.getElementById("recent_version"));
                        }
                    } else {
                        document.getElementById("recent_version").innerHTML = "Recent Version: " + version;
                    }
                })
                .catch((e) => {
                    console.warn("An error occured while getting the version", e);
                });
        }
    }

    function load_userinfo() {
        const loadMap = () => new Map(JSON.parse(GM_getValue('userinfo', '[]')));
        const saveMap = (map) => GM_setValue('userinfo', JSON.stringify(Array.from(map.entries())));
        const setUserInfo = (dom, info) => {
            dom.addEventListener("mouseenter", (e) => {
                if (document.querySelector('.userwindow')) {
                    $('.userwindow').remove();
                }

                const date = new Date(Date.parse(info.history.joined)), dif = calcDate(new Date(), date);
                element('div').a({ 'class': 'userwindow', 'style': (GM_getValue("theme", false) === "dark") ? `position: absolute; left: ${e.pageX}px; top: ${(e.pageY + 10)}px; width: inherit; height: 20px; line-height: 20px; background-color: #000` : `position: absolute; left: ${e.pageX}px; top: ${(e.pageY + 10)}px; width: inherit; height: 20px; line-height: 20px; background-color: #fff` })
                    .t(`${info.username} joined ${dif} from ${info.profile.country}`)
                    .ap(document.body);
            });
            dom.addEventListener("mouseleave", (e) => {
                if (document.querySelector(".userwindow")) {
                    $('.userwindow').remove();
                }
            });
        };

        if (document.querySelector('a')) {
            let userinfo = loadMap();

            let htmlUrls = document.querySelectorAll('a');

            let finalUrls = {};

            const filter = ['/studio', '/projects', '/followers', '/following', '/favorites'];

            //TODO: this needs to first determine all the user urls and compile those so it only does a single request for the user info for multiple of the same user links
            for (const a of htmlUrls) {
                if (a.hasAttribute('href') && a.getAttribute('href').includes('/users/') && !filter.some((value) => a.getAttribute('href').includes(value))) {
                    let url = a.getAttribute('href');

                    //remove last slash
                    if (url.lastIndexOf('/') === url.length) {
                        url = url.slice(0, -1);
                    }

                    //convert to a safe call
                    if (url.includes(`http://scratch.mit.edu/users/`)) {
                        url = url.replace(`http://`, `https://`);
                    }

                    url = url.replace(`https://scratch.mit.edu`, ``);

                    if (finalUrls.hasOwnProperty(url)) {
                        finalUrls[url].push(a);
                    } else {
                        finalUrls[url] = [a];
                    }
                }
            }

            for (const key in finalUrls) {
                const value = finalUrls[key];

                //check if already loaded
                if (userinfo.has(key)) {
                    console.log('info already exists', key);
                    for (const a of value) {
                        setUserInfo(a, userinfo.get(key));
                    }
                } else {
                    //make new request
                    fetch(`https://api.scratch.mit.edu${key}`)
                        .then(response => response.json())
                        .then(json => {
                            userinfo.set(key, json);
                            for (const a of value) {
                                setUserInfo(a, json);
                            }
                            saveMap(userinfo);
                        }).catch(e => console.log(e));
                }
            }
        }
    }

    function calcDate(date1, date2) {
        let diff = Math.floor(date1.getTime() - date2.getTime());
        let day = 1000 * 60 * 60 * 24;
        let months = Math.ceil(Math.floor(diff / day) / 31);
        let years = Math.floor(months / 12);
        months -= years * 12;
        let message = "";
        if (years > 0) {
            if (years == 1) {
                message += "1 year";
            } else {
                message += years + " years";
            }
            if (months > 0) {
                message += ", "
            }
        }
        if (months > 0) {
            if (months == 1) {
                message += "1 month";
            } else {
                message += months + " months";
            }
        } else if (years == 0) {
            message += "1 month";
        }

        message += " ago";
        return message;
    }

    function calcSmallest(date2) {
        let date1 = new Date(), time, unit;
        if (date1.getFullYear() == date2.getFullYear()) {
            if (date1.getMonth() == date2.getMonth()) {
                if (date1.getDate() == date2.getDate()) {
                    if (date1.getHours() == date2.getHours()) {
                        time = date1.getMinutes() - date2.getMinutes();
                        unit = " minute";
                    } else {
                        time = date1.getHours() - date2.getHours();
                        unit = " hour";
                    }
                } else {
                    time = date1.getDate() - date2.getDate();
                    unit = " day";
                }
            } else {
                time = date1.getMonth() - date2.getMonth();
                unit = " month";
            }
        } else {
            time = date1.getFullYear() - date2.getFullYear();
            unit = " year";
        }
        if (time == 1) {
            return " " + time + unit + " ago";
        } else {
            return " " + time + unit + "s ago";
        }
    }

    //TODO: look into an addall for these blocks
    //adds scratchblockcode load support
    function load_scratchblockcode() {
        if (GM_getValue("blockCode", true)) {
            if (document.querySelector(".blocks")) {
                let blocks = [], blocks1 = [], blocks2 = [], blocks3 = [];

                fetch(url)
                .then(r => r.text())
                .then((r) => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(r, 'text/html');
                    let originalPost = [], displayedPost = [], originalDescription = [], displayedDescription = [];

                    let posts = document.querySelectorAll('.post_body_html');
                    for (const a of posts) {
                        if (a.querySelector('.blocks')) {
                            displayedPost.push(...a.querySelectorAll('.blocks'));
                        }
                    }

                    posts = doc.querySelectorAll('.post_body_html');
                    for (const a of posts) {
                        if (a.querySelector('.blocks')) {
                            originalPost.push(...a.querySelectorAll('.blocks'));
                        }
                    }

                    if (displayedPost.length > 0) {
                        let i = 0;
                        for (const elem of displayedPost) {
                            let id = i;
                            elem.setAttribute('style', 'cursor: pointer;');
                            elem.addEventListener('click', (event) => {
                                event.currentTarget.replaceWith(originalPost[id]);
                            });
                            originalPost[id].setAttribute('title', 'Double-Click to Restore');
                            originalPost[id].addEventListener('dblclick', (event) => {
                                event.currentTarget.replaceWith(elem);
                            });
                            ++i;
                        }
                    }

                    posts = doc.querySelectorAll('.postsignature');
                    for (const a of posts) {
                        if (a.querySelector('.blocks')) {
                            originalDescription.push(...a.querySelectorAll('.blocks'));
                        }
                    }
                    
                    posts = document.querySelectorAll('.postsignature');
                    for (const a of posts) {
                        if (a.querySelector('.blocks')) {
                            displayedDescription.push(...a.querySelectorAll('.blocks'));
                        }
                    }

                    if (displayedDescription.length > 0) {
                        let i = 0;
                        for (const elem of displayedDescription) {
                            let id = i;
                            elem.setAttribute('style', 'cursor: pointer;');
                            elem.addEventListener('click', (event) => {
                                event.currentTarget.replaceWith(originalDescription[id]);
                            });
                            originalDescription[id].setAttribute('title', 'Double-Click to Restore');
                            originalDescription[id].addEventListener('dblclick', (event) => {
                                event.currentTarget.replaceWith(elem);
                            });
                            ++i;
                        }
                    }

                });
            }
        }
    }

    function load_bbcode() {
        let posts = document.getElementsByClassName("blockpost");
        for (let a of posts) {
            fetch(`https://scratch.mit.edu${a.querySelector(".box-head").querySelector("a").getAttribute("href")}source/`)
                .then((response) => {
                    if (response.status === 200) {
                        return response.text();
                    } else {
                        throw new Error("Issue loading BBCode from server");
                    }
                })
                .then((text) => {
                    const originalText = text, originalHtml = a.querySelector(".post_body_html").innerHTML;
                    element("button").a("style", "height: 15px; line-height: 14px; margin-top: -1px;").a("data-text", "html").t("BBCode")
                        .e("click", (e) => {
                            if (e.currentTarget.getAttribute("data-text") === "html") {
                                e.currentTarget.setAttribute("data-text", "text");
                                e.currentTarget.innerHTML = "Original";
                                a.querySelector(".post_body_html").innerHTML = originalText;
                            } else {
                                e.currentTarget.setAttribute("data-text", "html");
                                e.currentTarget.innerHTML = "BBCode";
                                a.querySelector(".post_body_html").innerHTML = originalHtml;
                            }
                        })
                        .ap(a.querySelector(".box-head"));
                })
                .catch((e) => {
                    console.warn("Error in BBcode loading", e);
                });
        }
    }
    //enlarging images on scratch
    function load_images() {
        console.log("load images");

        GM_addStyle("#display_img {position: fixed; left: 0px; top: 50px; opacity: 0.6; background-color: #000; width: 100%; height: calc(100% - 50px); display: none;} .postright img {cursor: zoom-in;}");
        //adds the faded background
        waitTillLoad('#pagewrapper').then(() => {
            let div = element("div").a("id", "display_img").ap(document.getElementById("pagewrapper"));
            //div that holds the image
            let div1 = document.createElement("div");
            div1.setAttribute("style", "position: fixed; left: 0px; top: 50px; width: 100%; height: calc(100% - 50px); text-align: center; display: none; cursor: zoom-out;");
            //the img element that will display the image
            let img = document.createElement("img");
            img.setAttribute("src", "");
            img.setAttribute("id", "display_img_img");
            div1.appendChild(img);
            //this causes the faded background and image to disappear
            document.getElementById("pagewrapper").appendChild(div1);
            div1.addEventListener("click", (event) => {
                div.style.display = "none";
                div1.style.display = "none";
            });

            let posts = document.getElementsByClassName("postright");
            for (let a of posts) {
                let imgs = a.getElementsByTagName("img");
                for (let b of imgs) {
                    b.addEventListener("click", (event) => {
                        img.setAttribute("src", event.currentTarget.src);
                        //gets current image size
                        let img_width = event.currentTarget.clientWidth;
                        let img_height = event.currentTarget.clientHeight;
                        //going to be used for the dialation
                        let scale_factor = 1.5;//this is the maximun a small image can be scalled up
                        const display_width = window.innerWidth;
                        const display_height = window.innerHeight - 50;
                        let final_height = 0, final_width = 0;

                        final_height = img_height * scale_factor;
                        final_width = img_width * scale_factor;

                        //this is the best solution to deal with all different screen sizes and images sizes
                        //It have tried making multilayer if/else statemanets but they don't work well for this
                        while (final_height > display_height || final_width > display_width) {
                            scale_factor -= 0.1;
                            final_height = img_height * scale_factor;
                            final_width = img_width * scale_factor;
                        }
                        //makes it cerntered vertically and makes sure it has right hieght and width
                        img.setAttribute("style", "width:" + final_width + "px; height:" + final_height + "px; position: relative; top:" + (((display_height) / 2) - (final_height / 2)) + "px;");

                        div.style.display = "block";
                        div1.style.display = "block";
                    });
                }
            }
        });
    }

    function timer() {
        const currentYear = new Date().getFullYear(), currentMonth = new Date().getMonth(), currentDay = new Date().getDate(), newEvents = [{ date: "Jan 1", name: "New Year's Day" }, { date: "Feb 14", name: "Valentine's Day" }, { date: "Mar 17", name: "St. Patrick's Day" }, { newDate: "May 9, 2021", name: "Mother's Day" }, { newDate: "Jun 20, 2021", name: "Father's Day" }, { date: "Oct 31", name: "Halloween" }, { newDate: "Nov 26, 2020", name: "Thanksgiving" }, { date: "Dec 25", name: "Christmas Day" }, { date: "Dec 31", name: "New Year's Eve" }];
        let ordered = newEvents.map((e) => {
            let holiDate = (e.hasOwnProperty("newDate")) ? new Date(e.newDate).getTime() : new Date(e.date).setFullYear(currentYear);
            return {
                name: e.name,
                date: holiDate,
                dif: holiDate - new Date(currentYear, currentMonth, currentDay)
            }
        });
        ordered = ordered.sort((a, b) => {
            return a.dif - b.dif;
        });
        let Holiday;
        for (let a of ordered) {
            if (a.dif >= 0) {
                Holiday = a;
                break;
            }
        }

        if (Holiday) {
            const holidayDate = Holiday.date, holidayName = Holiday.name;
            waitTillLoad('.box-header').then(() => {
                let dateElement = element("span").a("style", "float: right; color: #f6660d; padding-right: 5px; font-size: .85rem; padding-top: 5px;").t("").ap(document.querySelector(".box-header"));
                let x = setInterval(() => {
                    const difference = holidayDate - new Date().getTime(),
                        days = Math.floor(difference / (1000 * 60 * 60 * 24)),
                        hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                        minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                        seconds = Math.floor((difference % (1000 * 60)) / 1000);

                    if (difference < 0) {
                        clearInterval(x);
                        dateElement.innerHTML = "It's " + holidayName;
                    } else {
                        dateElement.innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s 'til " + holidayName;
                    }
                }, 900);
            });
        } else {
            console.log("No holiday found");
        }
    }

    function create_falling(link, img, extreme, cursor = null, audio = false) {
        if (url == link) {
            let we = [];
            let leaves = function (i) {
                this.x = Math.random() * 90;
                this.y = Math.random() * 90;
                this.z = Math.random() * 90;
                this.px = Math.random() * window.innerWidth;
                this.py = 40 * Math.random() * -1;
                this.r = true;
                this.index = i;

                this.img = document.createElement("img");
                this.img.src = img[Math.floor(Math.random() * img.length)];
                this.img.setAttribute("style", "position: absolute; width: 25px; height: 25px; left: " + this.px + "px; top:" + this.py + "px;");
                document.body.appendChild(this.img);
                this.render = () => {
                    if (this.py > window.innerHeight) {
                        this.r = false;
                        document.body.removeChild(this.img);
                    }
                    this.x += Math.random() * 0.5;
                    this.y += Math.random() * 0.5;
                    this.z += Math.random() * 0.5;
                    this.py += Math.random() * 0.5;
                    this.img.setAttribute("style", "position: fixed; index: -1; width: 25px; height: 25px; left: " + this.px + "px; top:" + this.py + "px; transform: rotateX(" + this.x + "deg) rotateY(" + this.y + "deg) rotateZ(" + this.z + "deg);");

                };
            };
            let create = true;
            window.addEventListener("blur", () => {
                create = false;
            });
            window.addEventListener("focus", () => {
                create = true;
            });
            setInterval(() => {
                if (create) {
                    for (let i = 0; i < 5; i++) {
                        we.push(new leaves(we.length));
                    }
                }
            }, 1000);
            setInterval(() => {
                we.forEach((a) => {
                    if (a.r) {
                        a.render();
                    }
                });
            }, 1);

            if (extreme) {
                if (audio) {
                    let d = new Audio(audio);
                    d.play();
                    d.addEventListener("ended", () => {
                        d.play();
                    });
                }
                GM_addStyle("body,a:-webkit-any-link{cursor:url(" + cursor + "),auto;cursor:url(" + cursor + "),pointer;}#pagewrapper{background:linear-gradient(top,#ff3232 0,#fcf528 16%,#28fc28 32%,#28fcf8 50%,#272ef9 66%,#ff28fb 82%,#ff3232 100%);background:-moz-linear-gradient(top,#ff3232 0,#fcf528 16%,#28fc28 32%,#28fcf8 50%,#272ef9 66%,#ff28fb 82%,#ff3232 100%);background:-webkit-gradient(linear,left top,left bottom,color-stop(0%,#ff3232),color-stop(16%,#fcf528),color-stop(32%,#28fc28),color-stop(50%,#28fcf8),color-stop(66%,#272ef9),color-stop(82%,#ff28fb),color-stop(100%,#ff3232));background:-webkit-linear-gradient(top,#ff3232 0,#fcf528 16%,#28fc28 32%,#28fcf8 50%,#272ef9 66%,#ff28fb 82%,#ff3232 100%);background-size:1000%;-moz-background-size:1000%;-webkit-background-size:1000%;animation-name:fun-time-awesome;animation-duration:15s;animation-timing-function:linear;animation-iteration-count:infinite;animation-direction:alternate;animation-play-state:running;-moz-animation-name:fun-time-awesome;-moz-animation-duration:15s;-moz-animation-timing-function:linear;-moz-animation-iteration-count:infinite;-moz-animation-direction:alternate;-moz-animation-play-state:running;-webkit-animation-name:fun-time-awesome;-webkit-animation-duration:20s;-webkit-animation-timing-function:linear;-webkit-animation-iteration-count:infinite;-webkit-animation-direction:alternate;-webkit-animation-play-state:running}@keyframes fun-time-awesome{0%{background-position:left top}100%{background-position:left bottom}}@-moz-keyframes fun-time-awesome{0%{background-position:left top}100%{background-position:left bottom}}@-webkit-keyframes fun-time-awesome{0%{background-position:left top}100%{background-position:left bottom}}");
            }
        }
    }

    function load_extras() {
        if (GM_getValue("extras", true)) {
            create_falling("https://scratch.mit.edu/users/DeleteThisAcount/", ["https://vignette.wikia.nocookie.net/operation-fortress/images/c/ca/Deletos.png/revision/latest?cb=20160815232601"], true, "http://i.cubeupload.com/gIEPOl.png", false);
        }
        if (GM_getValue("timer", true)) {
            timer();
        }
    }
    //add custom bbcode tags
    function load_custombb() {
        document.querySelectorAll('span[style="color:resimg"]').forEach(e => {
            $(e).replaceWith(`<img src="https://${e.innerHTML}"></img>`);
        });
        document.querySelectorAll('span[style="color:reshighlight"]').forEach(e => {
            $(e).replaceWith(`<mark>${e.innerHTML}</mark>`);
        });
        document.querySelectorAll('span[style="color:resleft"]').forEach(e => {
            $(e).replaceWith(`<p align="left">${e.innerHTML}</p>`);
        });
        document.querySelectorAll('span[style="color:resright"]').forEach(e => {
            $(e).replaceWith(`<p align="right">${e.innerHTML}</p>`);
        });
        document.querySelectorAll('a[href^="https://gist.github.com/"]').forEach(e => {
            var url = encodeURI('data:text/html;charset=utf-8,<body><script src="' + $(e).attr("href") + ".js" + '"></script></body>');
            $(e).append(`<br><iframe src='` + url + `' width="100%" height="400" scrolling="auto" frameborder="no" align="center"></iframe>`);
        });
    }
    //add extras bbcode buttons
    function add_bbbuttons() {
        console.log("added BB Buttons", document.querySelector(".markItUpContainer"));
        waitTillLoad(".markItUpContainer")
            .then(a => {
                $(`<li class="markItUpButton custombb" id="Res1"><a title="Color" style="background-image: url('https://img.icons8.com/metro/26/000000/paint-palette.png'); background-size: 16px 16px;" >Color</a></li>`)
                    .on("click", (e) => {
                        let BBstart = prompt("Enter a hexadecimal color w/ #:", "#FF0000"), constBB = "[color=" + BBstart + "]" + document.stringyBB + "[/color]";
                        replaceIt($('textarea')[0], constBB);
                    })
                    .insertAfter(".markItUpButton7");
                $(`<li class="markItUpButton custombb" id="Res2"><a title="Code" style="background-image: url('https://img.icons8.com/metro/26/000000/code.png'); background-size: 16px 16px;" >Code</a></li>`)
                    .on("click", (e) => {
                        let BBstart = prompt("Enter a programming language:", ""), constBB = "[code=" + ((BBstart) ? BBstart : "") + "]" + document.stringyBB + "[/code]";
                        replaceIt($('textarea')[0], constBB);
                    })
                    .insertAfter(".markItUpButton11");
                $(`<li class="markItUpButton custombb" id="Res3"><a title="Center" style="background-image: url('https://img.icons8.com/metro/26/000000/align-center.png'); background-size: 16px 16px;" >Center</a></li>`)
                    .on("click", (e) => {
                        let constBB = "[center]" + document.stringyBB + "[/center]";
                        replaceIt($('textarea')[0], constBB);
                    })
                    .insertAfter(".markItUpButton4");
                $(`<li class="markItUpButton custombb" id="Res4"><a title="Project link" style="background-image: url('https://img.icons8.com/metro/26/000000/prototype.png'); background-size: 16px 16px;" >Project Link</a></li>`)
                    .on("click", (e) => {
                        let BBstart = prompt("Enter a project ID:", ""), constBB = "[url=https://scratch.mit.edu/projects/" + BBstart + "/][img]https://cdn2.scratch.mit.edu/get_image/project/" + BBstart + "_282x210.png[/img][/url]";
                        replaceIt($('textarea')[0], constBB);
                    })
                    .insertAfter(".markItUpButton14");
                $(`<li class="markItUpButton custombb" id="Res5"><a title="Very large" style="background-image: url('https://img.icons8.com/metro/26/000000/l.png'); background-size: 16px 16px;" >Very Large</a></li>`)
                    .on("click", (e) => {
                        let constBB = "[color=res.large]" + document.stringyBB + "[/color]";
                        alert("This will only appear on the main page, not the preview");
                        replaceIt($('textarea')[0], constBB);
                    })
                    .insertAfter(".markItUpButton7");
                $(`<li class="markItUpButton custombb" id="Res6"><a title="Other IMG" style="background-image: url('https://img.icons8.com/metro/26/000000/image-file.png'); background-size: 16px 16px;" >Other IMG</a></li>`)
                    .on("click", (e) => {
                        let BBstart = prompt("Enter an img URL without http tag:", ""), constBB = "[color=transparent][color=res.img]" + BBstart + "[/color][/color]";
                        alert("This will only appear on the main page, not the preview");
                        replaceIt($('textarea')[0], constBB);
                    })
                    .insertAfter(".markItUpButton5");
                $(`<li class="markItUpButton custombb" id="Res7"><a title="Align Left" style="background-image: url('https://img.icons8.com/metro/26/000000/align-left.png'); background-size: 16px 16px;" >Align Left</a></li>`)
                    .on("click", (e) => {
                        let constBB = "[color=res.left]" + document.stringyBB + "[/color]";
                        alert("This will only appear on the main page, not the preview");
                        replaceIt($('textarea')[0], constBB);
                    })
                    .insertAfter("#Res3");
                $(`<li class="markItUpButton custombb" id="Res8"><a title="Align Right" style="background-image: url('https://img.icons8.com/metro/26/000000/align-right.png'); background-size: 16px 16px;" >Align Right</a></li>`)
                    .on("click", (e) => {
                        let constBB = "[color=res.right]" + document.stringyBB + "[/color]";
                        alert("This will only appear on the main page, not the preview");
                        replaceIt($('textarea')[0], constBB);
                    })
                    .insertAfter("#Res7");
                $(`<li class="markItUpButton custombb" id="Res9"><a title="Highlight" style="background-image: url('https://img.icons8.com/metro/26/000000/marker-pen.png'); background-size: 16px 16px;" >Highlight</a></li>`)
                    .on("click", (e) => {
                        let constBB = "[color=res.highlight]" + document.stringyBB + "[/color]";
                        alert("This will only appear on the main page, not the preview");
                        replaceIt($('textarea')[0], constBB);
                    })
                    .insertAfter("#Res1");

                document.onselectionchange = () => {
                    document.stringyBB = getSelectionText();
                };
            });
    }

    function getSelectionText() {
        if (window.getSelection) {
            try {
                var ta = $('textarea').get(0);
                return ta.value.substring(ta.selectionStart, ta.selectionEnd);
            } catch (e) {
                console.log('Cant get selection text')
            }
        }
        // For IE
        if (document.selection && document.selection.type != "Control") {
            return document.selection.createRange().text;
        }
    }

    function replaceIt(txtarea, newtxt) {
        $(txtarea).val(
            $(txtarea).val().substring(0, txtarea.selectionStart) +
            newtxt +
            $(txtarea).val().substring(txtarea.selectionEnd)
        );
    }

    function inIframe() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }
    //Tansitions and other cool functions
    function collapse_full(speed, element, time) { //this function will collapse margin, padding, and width in order (this will ignore the border)
        const totalTime = time;
        let totalHeight = element.getBoundingClientRect().height;
        //sets up data for each layer
        const elementNames = ["marginBottom", "paddingBottom", "height", "paddingTop", "marginTop"];
        let heights = elementNames.map((a) => {
            return window.getComputedStyle(element, null)[a].slice(0, -2);
        });
        let newElementNames = [];
        heights = heights.filter((a, i) => {
            if (a > 0) {
                newElementNames.push(elementNames[i]);
            }
            return a > 0;
        })
        let percentageTime = heights.map((a) => {
            return a / totalHeight;
        });
        let runTime = percentageTime.map((a) => {
            return totalTime * a;
        });
        let intervalSpeeds = runTime.map((a, i) => {
            return heights[i] * (speed / a) || 0;
        });

        console.log(newElementNames, heights, percentageTime, runTime, intervalSpeeds);

        if (newElementNames.length > 0) {
            let run = (id) => {
                let height = heights[id];
                let running = setInterval(() => {
                    height -= intervalSpeeds[id];
                    element.style[newElementNames[id]] = height + "px";
                }, speed);
                setTimeout(() => {
                    clearInterval(running);
                    height = 0;
                    element.style[newElementNames[id]] = height + "px";
                    id += 1;
                    if (id > newElementNames.length) {
                        element.style.display = "none";
                    } else {
                        run(id);
                    }
                }, runTime[id]);
            };
            run(0);
        } else {
            element.style.display = "none";
        }
    }

    function calculate_height_children(domElement) {
        let height = 0;
        let children = domElement.children;
        for (let a of children) {
            const elementNames = ["marginBottom", "paddingBottom", "height", "paddingTop", "marginTop"];
            elementNames.forEach((b) => {
                if (a.style.hasOwnProperty(b)) {
                    height += Number(window.getComputedStyle(a, null)[b].slice(0, -2)) || 0;
                }
            });
        }

        return height;
    }
    //this function is for svg elements
    function svg(name, attr, action) {
        const svgMap = new Map([
            ["write", `<svg class="svg-icon" viewBox="0 0 20 20"><path d="M18.303,4.742l-1.454-1.455c-0.171-0.171-0.475-0.171-0.646,0l-3.061,3.064H2.019c-0.251,0-0.457,0.205-0.457,0.456v9.578c0,0.251,0.206,0.456,0.457,0.456h13.683c0.252,0,0.457-0.205,0.457-0.456V7.533l2.144-2.146C18.481,5.208,18.483,4.917,18.303,4.742 M15.258,15.929H2.476V7.263h9.754L9.695,9.792c-0.057,0.057-0.101,0.13-0.119,0.212L9.18,11.36h-3.98c-0.251,0-0.457,0.205-0.457,0.456c0,0.253,0.205,0.456,0.457,0.456h4.336c0.023,0,0.899,0.02,1.498-0.127c0.312-0.077,0.55-0.137,0.55-0.137c0.08-0.018,0.155-0.059,0.212-0.118l3.463-3.443V15.929z M11.241,11.156l-1.078,0.267l0.267-1.076l6.097-6.091l0.808,0.808L11.241,11.156z"></path></svg>`]
            , ["downCircle", `<svg class="svg-icon" viewBox="0 0 20 20"><path d="M13.962,8.885l-3.736,3.739c-0.086,0.086-0.201,0.13-0.314,0.13S9.686,12.71,9.6,12.624l-3.562-3.56C5.863,8.892,5.863,8.611,6.036,8.438c0.175-0.173,0.454-0.173,0.626,0l3.25,3.247l3.426-3.424c0.173-0.172,0.451-0.172,0.624,0C14.137,8.434,14.137,8.712,13.962,8.885 M18.406,10c0,4.644-3.763,8.406-8.406,8.406S1.594,14.644,1.594,10S5.356,1.594,10,1.594S18.406,5.356,18.406,10 M17.521,10c0-4.148-3.373-7.521-7.521-7.521c-4.148,0-7.521,3.374-7.521,7.521c0,4.147,3.374,7.521,7.521,7.521C14.148,17.521,17.521,14.147,17.521,10"></path></svg>`]
            , ["upCircle", `<svg class="svg-icon" viewBox="0 0 20 20"><path d="M13.889,11.611c-0.17,0.17-0.443,0.17-0.612,0l-3.189-3.187l-3.363,3.36c-0.171,0.171-0.441,0.171-0.612,0c-0.172-0.169-0.172-0.443,0-0.611l3.667-3.669c0.17-0.17,0.445-0.172,0.614,0l3.496,3.493C14.058,11.167,14.061,11.443,13.889,11.611 M18.25,10c0,4.558-3.693,8.25-8.25,8.25c-4.557,0-8.25-3.692-8.25-8.25c0-4.557,3.693-8.25,8.25-8.25C14.557,1.75,18.25,5.443,18.25,10 M17.383,10c0-4.07-3.312-7.382-7.383-7.382S2.618,5.93,2.618,10S5.93,17.381,10,17.381S17.383,14.07,17.383,10"></path></svg>`]
            , ["rightCircle", `<svg class="svg-icon" viewBox="0 0 20 20"><path d="M12.522,10.4l-3.559,3.562c-0.172,0.173-0.451,0.176-0.625,0c-0.173-0.173-0.173-0.451,0-0.624l3.248-3.25L8.161,6.662c-0.173-0.173-0.173-0.452,0-0.624c0.172-0.175,0.451-0.175,0.624,0l3.738,3.736C12.695,9.947,12.695,10.228,12.522,10.4 M18.406,10c0,4.644-3.764,8.406-8.406,8.406c-4.644,0-8.406-3.763-8.406-8.406S5.356,1.594,10,1.594C14.643,1.594,18.406,5.356,18.406,10M17.521,10c0-4.148-3.374-7.521-7.521-7.521c-4.148,0-7.521,3.374-7.521,7.521c0,4.147,3.374,7.521,7.521,7.521C14.147,17.521,17.521,14.147,17.521,10"></path></svg>`]
            , ["leftCircle", `<svg class="svg-icon" viewBox="0 0 20 20"><path d="M11.739,13.962c-0.087,0.086-0.199,0.131-0.312,0.131c-0.112,0-0.226-0.045-0.312-0.131l-3.738-3.736c-0.173-0.173-0.173-0.454,0-0.626l3.559-3.562c0.173-0.175,0.454-0.173,0.626,0c0.173,0.172,0.173,0.451,0,0.624l-3.248,3.25l3.425,3.426C11.911,13.511,11.911,13.789,11.739,13.962 M18.406,10c0,4.644-3.763,8.406-8.406,8.406S1.594,14.644,1.594,10S5.356,1.594,10,1.594S18.406,5.356,18.406,10 M17.521,10c0-4.148-3.373-7.521-7.521-7.521c-4.148,0-7.521,3.374-7.521,7.521c0,4.148,3.374,7.521,7.521,7.521C14.147,17.521,17.521,14.148,17.521,10"></path></svg>`]
        ]);

        let dom = document.createRange().createContextualFragment(svgMap.get(name)).firstChild;

        if (attr && attr.constructor === {}.constructor) {
            for (let a in attr) {
                dom.setAttribute(a, attr[a]);
            }
        }

        if (action) {
            dom.addEventListener("click", action);
        }

        return dom;
    }

    //uses a selector, has a timeout, and take in a update speed
    function waitTillLoad(selector, timeout = 60000, updateSpeed = 100) {
        return _waitTillLoad(() => document.querySelector(selector), timeout, updateSpeed);
    }

    function _waitTillLoad(func, timeout = 60000, updateSpeed = 100) {
        return new Promise((resolve, reject) => {
            let found = false;

            if (func()) {
                found = true;
                resolve(func());
            } else {
                let _loading = setInterval(() => {
                    if (func()) {
                        found = true;
                        resolve(func());
                    }
                }, updateSpeed)

                if (!found) {
                    setTimeout(() => {
                        if (!found) {
                            clearInterval(_loading);
                            reject("Didn't load in time")
                        }
                    }, timeout);
                }
            }
        })
    }


    /*
    dom-creation 1.2.1-modified https://github.com/Wetbikeboy2500/dom-creation

    MIT License

    Copyright (c) 2020 Matt

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
    */

    /**
     * Creates an element
     * @param {string} name Name of the DOM to be created
     * @param {string} ns Namespace, if any, that the element needs to be created
     */
    function element(name, ns) {
        if (name) {
            return new _element(name, ns, new _element());
        } else {
            return new _element();
        }
    }

    class _element {
        constructor(name, ns = null, pointer) {
            if (name) {
                if (pointer) {
                    this.pointer = pointer;
                }

                if (ns) {
                    this.dom = document.createElementNS(ns, name);
                } else {
                    this.dom = document.createElement(name);
                }
            } else {
                this.dom = document.createDocumentFragment();
            }
        }
        /**
         * Accepts a name/value or a json object to create the dom's attributes
         * @param {*} name-or-json
         * @param {string} value 
         */
        a(name, value = '') {
            if (name.constructor === {}.constructor) {
                for (const a in name) {
                    this.dom.setAttribute(a, name[a]);
                }
            } else {
                this.dom.setAttribute(name, value);
            }

            return this;
        }
        /**
         * Adds text to dom element
         * @param {String} text 
         */
        t(text) {
            this.dom.appendChild(document.createTextNode(text));
            return this;
        }
        /**
         * Adds an event listener to the dom element
         * @param {string} trigger Name of the event
         * @param {function} callback The function that is called when the event occurs
         */
        e(trigger, callback) {
            this.dom.addEventListener(trigger, callback);
            return this;
        }
        /**
         * Appends current element to given DOM element
         * @param {object} dom DOM element that this element will be appended to
         */
        ap(dom) {
            dom.appendChild(this.dom);
            return this;
        }
        /**
         * Preappends current element to given DOM element
         * @param {object} dom DOM element that this element will be preappended to
         */
        preap(dom) {
            dom.insertBefore(this.dom, dom.firstChild);
            return this;
        }
        /**
         * Appends after current DOM element as a sibling of it
         * @param {object} dom DOM element that this element added after
         */
        aftap(dom) {
            dom.parentElement.insertBefore(this.dom, dom.nextSibling);
            return this;
        }
        /**
         * Adds an element to current element
         * @param {string} name The element's name
         * @param {string} ns Namespace if needed for that element
         */
        add(name, ns = null) {
            return new _element(name, ns, this);
        }
        /**
         * Adds a dom element to current element
         * @param {object} dom DOM object that will be added
         */
        addDom(dom) {
            this.dom.appendChild(dom);
            return this;
        }
        /**
         * Closes current element and returns next element up
         * This will only work if the element is not on the top level
         */
        f() {
            if (this.pointer == null) {
                console.warn('Called .f() on a top level element');
                return this;
            } else {
                this.pointer.dom.appendChild(this.dom);
                return this.pointer;
            }
        }
        /**
         * Cloes all elements up to the top layer
         */
        close() {
            if (this.pointer) {
                this.pointer.dom.appendChild(this.dom);
                return this.pointer.close();
            } else {
                return this;
            }
        }
        /**
         * Runs through a list of data to add dynamically add elements
         * @param {list} data Accepts a list that will be run through
         * @param {function} func Function that will be run
         * The first parameter is the current element
         * The second is an item from the data list
         * If a truthy value is returned by the function, it will break out of the loop
         */
        each(data, func) {
            //avoids running if nothing is given
            if (data) {
                if (data.length === 0) {
                    //Avoids running if nothing is given
                    return this;
                }
                for (const d of data) {
                    if (func(this, d)) {
                        break;
                    }
                }
            }
            return this;
        }
    }
})();