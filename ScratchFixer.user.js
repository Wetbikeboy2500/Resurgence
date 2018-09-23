/*
MIT License

Copyright (c) 2018 Matt

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
// @version      10.1
// @description  Tries to fix and improve certain aspects of Scratch
// @author       Wetbikeboy2500
// @match        https://scratch.mit.edu/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/2.5.0/jszip.min.js
// @require      https://cdn.rawgit.com/Stuk/jszip-utils/dfdd631c4249bc495d0c335727ee547702812aa5/dist/jszip-utils.min.js
// @resource     CSS https://raw.githubusercontent.com/Wetbikeboy2500/ScratchFixer/master/style.min.css
// @resource     CSSlight https://raw.githubusercontent.com/Wetbikeboy2500/ScratchFixer/master/style_light.min.css
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @updateURL    https://raw.githubusercontent.com/Wetbikeboy2500/ScratchFixer/master/ScratchFixer.user.js
// @run-at       document-start
// ==/UserScript==
(function () {
    'use strict';
    let url = window.location.href, users = [], userinfo = {}, l, ran_code = false, style = null, style1 = null, currentVersion = GM_info.script.version, pageType = "";
    if (inIframe() === false) {
        window.addEventListener("load", () => {
            if (ran_code === false) {
                console.log("window loaded");
                ran_code = true;
                run();
            }
        }, false);
        //make sure code runs if window loading dosn't work
        setTimeout(() => {
            if (ran_code === false) {
                console.log("load interval");
                ran_code = true;
                run();
            }
        }, 5000);//5 second wait for the page

        function run () {
            load_userinfo();
            if (url.includes("discuss")) {
                load_images();
                load_scratchblockcode();
                load_bbcode();
                add_bbbuttons();
            }
        }
        //adds my css to edit custom elements
        if (GM_getValue("theme", false) === "dark") {
            style1 = GM_addStyle(GM_getResourceText("CSS"));
        } else {
            GM_addStyle("#res-set > a {color: #fff} .box{background-color: #fff}}");
        }
        document.addEventListener("DOMContentLoaded", () => {
            var banner = '.title-banner{}';
            if (GM_getValue("bannerOff", true)) {
                banner = '.title-banner{display:none;}';
            }
            if (url.includes("discuss")) {
                load_custombb();
            }
            var styleTip = 'span[style="color:reslarge"] {font-weight:bold; font-size:30px;} ' + banner + '.postsignature {overflow: auto;} .tips a span { display: none; position: absolute; } .tips a:after { content: "' + GM_getValue("forumTitle", "Forums") + '"; visibility: visible; position: static; } .phosphorus { margin-left: 14px; margin-right: 14px; margin-top: 16px; } .my_select {height: 34px; line-height: 34px; vertical-align: middle; margin: 3px 0px 3px 0px; width: 110px;} .messages-social {width: 700px; right: 446.5px; left: 235.5px; position: relative; border: 0.5px solid #F0F0F0; border-top-left-radius: 5px; border-top-right-radius: 5px; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; background-color: #F2F2F2; } .messages-header {font-size: 24px; padding-left: 10px;} select[name="messages.filter"] {right: 720px; top: 20px; font-size: 24px; position: relative; border-top-left-radius: 5px; border-top-right-radius: 5px; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; background-color: #F2F2F2; visibility: visible;} #___gcse_0 {display: none;} .messages-details {margin-top: 40px;} .mod-messages {visibility: hidden; height: 0px; padding: 0px; margin: 0px;';
            GM_addStyle(styleTip);
            dark_theme();
            fix_nav();
            load_messages();
            add_player();
            add_search();
            load_extras();
            load_banner();
            load_newpage();
        });
    }
    function fix_nav () {
        //fixes navbar and adds bottom page link
        if (document.getElementById("navigation")) {
            //new theme
            pageType = "new";
            document.querySelector(".tips").childNodes[0].setAttribute("href", "/discuss");
            element("dd")
                .append(element("a").a("href", "/resurgence").t("Resurgence Userscript"))
                .ap(document.querySelector(".lists").querySelectorAll("dl")[1]);
        } else {
            //old theme
            pageType = "old";
            let tips = document.getElementsByClassName("site-nav")[0].childNodes[3].childNodes[0];
            tips.setAttribute("href", "/discuss");
            tips.innerHTML = GM_getValue("forumTitle", "Forums");
            element("li")
                .append(element("a").a("href", "/resurgence").t("Resurgence Userscript"))
                .ap(document.querySelector("footer-col").childNodes[3].childNodes[3]);
        }
    }
    function load_newpage () {
        console.log("load newpage");
        let displaySettingsModal = false, toggleModal = () => {
            if (displaySettingsModal) {
                $('body').attr('style', 'overflow-y:scroll;');
                $('#res-set-modal').hide(500);
                $('#res-set-modal-back').toggleClass('modal-hidden');
                displaySettingsModal = false;
            } else {
                $('body').attr('style', 'overflow-y:hidden;');
                $('#res-set-modal').show(500);
                $('#res-set-modal-back').toggleClass('modal-hidden');
                if (GM_getValue("extras", true)) {
                    $("#extrasIO").prop('checked', "checked");
                }
                if (GM_getValue("msg", true)) {
                    $("#msgIO").prop('checked', "checked");
                }
                if (GM_getValue("timer", true)) {
                    $("#timerIO").prop('checked', "checked");
                }
                if (GM_getValue("blockCode", true)) {
                    $("#blocksIO").prop('checked', "checked");
                }
                if (GM_getValue("embedFeature", true)) {
                    $("#embedIO").prop('checked', "checked");
                }
                if (GM_getValue("bannerOff", true)) {
                    $("#bannerIO").prop('checked', "checked");
                }
                $("#playerIO").val(GM_getValue("player", "D"));
                $("#themeIO").val(GM_getValue("theme", "light"));
                $("#posIO").val(GM_getValue("pos", "top"));
                $("#disText").val(GM_getValue("forumTitle", "Forums"));
                displaySettingsModal = true;
            }
        };
        //adds popup settings modal
        GM_addStyle('.modal-hidden {display:none;} #res-set-modal {position:fixed; background-color:#00000000; width:40%; height:80%; border-radius:5px; outline:none; left:30%; top:10%; z-index: 9999; color: black !important; padding:20px; text-align:center;} #res-set-modal-back {position:fixed; width: 100%; height: 100%; background-color:#212121; left:0; top:0; z-index:9998; opacity:.5;}');
        $('body').append('<div id="res-set-modal" class="modal-hidden" tabindex="1">');
        $('#res-set-modal').load("https://raw.githubusercontent.com/Wetbikeboy2500/ScratchFixer/master/modal.html");

        $('body').append('<div id="res-set-modal-back" class="modal-hidden">');
        $('#res-set-modal-back').click(toggleModal);
        //IO for sliders
        $(document).on("click", "#extrasIO", (event) => {
            if (GM_getValue("extras", true)) {
                GM_setValue("extras", false);
            } else {
                GM_setValue("extras", true);
            }
        });
        $(document).on("click", "#msgIO", (event) => {
            if (GM_getValue("msg", true)) {
                GM_setValue("msg", false);
            } else {
                GM_setValue("msg", true);
            }
        });
        $(document).on("click", "#timerIO", (event) => {
            if (GM_getValue("timer", true)) {
                GM_setValue("timer", false);
            } else {
                GM_setValue("timer", true);
            }
        });
        $(document).on("click", "#blocksIO", (event) => {
            if (GM_getValue("blockCode", true)) {
                GM_setValue("blockCode", false);
            } else {
                GM_setValue("blockCode", true);
            }
        });
        $(document).on("click", "#embedIO", (event) => {
            if (GM_getValue("embedFeature", true)) {
                GM_setValue("embedFeature", false);
            } else {
                GM_setValue("embedFeature", true);
            }
        });
        $(document).on("click", "#bannerIO", (event) => {
            if (GM_getValue("bannerOff", true)) {
                GM_setValue("bannerOff", false);
            } else {
                GM_setValue("bannerOff", true);
            }
        });
        $(document).on("change", "#playerIO", (event) => {
            console.log(document.getElementById("playerIO").value);
            GM_setValue("player", document.getElementById("playerIO").value);
        });
        $(document).on("change", "#disText", (event) => {
            GM_setValue("forumTitle", document.getElementById("disText").value);
        });
        $(document).on("change", "#themeIO", (event) => {
            GM_setValue("theme", document.getElementById("themeIO").value);
            dark_theme();
        });
        $(document).on("change", "#posIO", (event) => {
            GM_setValue("pos", document.getElementById("posIO").value);
        });
        if (pageType === "new") {
            let test = setInterval(() => {
                if (document.querySelector(".dropdown")) {
                    $('.divider').before('<li id="res-set"><a>Resurgence Settings');
                    $('#res-set').click(toggleModal);
                    clearInterval(test);
                }
            }, 1000);
        } else {
            let test = setInterval(() => {
                if (document.getElementById("logout")) {
                    $('#logout').before('<li id="res-set"><a>Resurgence Settings');
                    $('#res-set').click(toggleModal);
                    clearInterval(test);
                }
            }, 1000);
        }
        //adds the new page
        if ("https://scratch.mit.edu/resurgence" === url) {
            GM_addStyle('.box-content li {width: 50%; position: relative; left: 25%; text-align: left;} .box-content {padding-bottom: 10px;}');
            let main = document.getElementsByClassName("box-content")[0];
            main.innerHTML = "";
            element("h4").t("Resurgence Userscript")
                .ap(document.getElementsByClassName("box-head")[0]).setAttribute("style", "padding: 10px 0px 0px 7px !important;");

            element("p").t("Made By ")
                .append(element("a").t("Wetbikeboy2500").a("href", "https://scratch.mit.edu/users/Wetbikeboy2500/"))
                .ap(main);
            element("p").t("Special thanks to ")
                .append(element("a").t("NitroCipher").a("href", "https://scratch.mit.edu/users/NitroCipher/"))
                .ap(main);
            element("p").t("Resurgence Userscript (previously named ScratchFixer until NitroCipher suggested its current name) was originally going to be a chrome extension, but I ended up going with a userscript since it was going to be easier to update and change. The userscript started out by just adding the forums button, messages to the main page, and letting you use the Phosphorus player for projects. Since then, more features have been added to the userscript with more to come in the future.")
                .ap(main);
            element("p")
                .append(element("a").t("Click this to go to the forum post").a("href", "http://scriftj.x10host.com/ScratchBrowser/userscripts/resurgence.html"))
                .ap(main);
            element("p")
                .append(element("a").t("Click this to go to the Github repo").a("href", "https://github.com/Wetbikeboy2500/ScratchFixer"))
                .ap(main);

            element("h3").t("Features").ap(main);

            element("ul")
                .append(element("li").t("Forums tab instead of tips tab"))
                .append(element("li").t("Customization of Forum tab name"))
                .append(element("li").t("Adds messages to the main page"))
                .append(element("li").t("Switch between Scratch player, Phosphorus player, Sulfurous player, and the Scratch 3 player"))
                .append(element("li").t("Adds google search so you can search the whole Scratch site with google"))
                .append(element("li").t("Quick info when hovering over usernames"))
                .append(element("li").t("When you click on Scratch Blocks in the forums it will show the original Scrachblock code"))
                .append(element("li").t("Click on a new button “BBCode” to switch between the BBCode and the original post"))
                .append(element("li").t("Changes the messages area to look like how it use to look"))
                .append(element("li").t("Adds this page to Scratch"))
                .append(element("li").t("Adds option for Dark Theme for Scratch"))
                .append(element("li").t("Enlarge photos in forum posts"))
                .append(element("li").t("Settings pop-up on all pages"))
                .append(element("li").t("Add extras BBcode Features"))
                .append(element("li").t("Embed Featured projects on user page"))
                .append(element("li").t("Embed Gist content"))
                .ap(main);

            element("h3").t("Special Features/Extras").ap(main);

            element("Extras")
                .append(element("li").t("Holiday countdown timer"))
                .append(element("li").t("Falling leaves on the homepage"))
                .append(element("li")
                    .append(element("a").t("DeleteThisAcount").a("href", "https://scratch.mit.edu/users/DeleteThisAcount/")))
                .ap(main);

            element("button").t("Extras").a("title", "Enables/disables display of leaves/deletos")
                .e("click", () => {
                    if (GM_getValue("extras", true)) {
                        GM_setValue("extras", false);
                        alert('Extras are now disabled.');
                    } else {
                        GM_setValue("extras", true);
                        alert('Extras are now enabled.');
                    }
                }).ap(main);

            element("select").a("style", "color: #fff !important; border-color: #1f2227!important; background-color: #2d3035!important; height: 30px;")
                .e("change", (event) => {
                    GM_setValue("player", event.currentTarget.value);
                })
                .o({
                    D: "Default",
                    P: "Phosphorus",
                    S: "Sulfurous",
                    "S3": "Scratch 3"
                }, GM_getValue("player", "D"))
                .ap(main);
        }

        //embeds users featured project
        if (GM_getValue("embedFeature", true)) {
            if (url.includes("/users/")) {
                var featProject = $("#featured-project").attr("href").substr(9);
                var projectPlayer = '<iframe allowtransparency="true" width="282" height="220" src="//scratch.mit.edu/projects/embed' + featProject + '?autostart=false" frameborder="0" allowfullscreen>';
                $("div.stage").replaceWith(projectPlayer);
                //alert(featProject);
            }
        }
    }
    function add_player () {
        //adds the different players using a dropdown menu
        if (url.includes("projects") && !url.includes("all") && !url.includes("search") && !url.includes("studios")) {
            let change = (a) => {
                if (document.querySelector(".phosphorus")) {
                    document.querySelector(".phosphorus").parentNode.removeChild(document.querySelector(".phosphorus"));
                } else {
                    document.getElementById("player").style = "display: none;";
                }
                switch (a) {
                    case "D":
                        document.getElementById("player").style = "display: block;";
                        break;
                    case "P":
                        element("script").a("src", "https://phosphorus.github.io/embed.js?id=" + document.getElementById("project").getAttribute("data-project-id") + "&auto-start=false&light-content=false")
                            .ap(document.getElementsByClassName("stage")[0]);
                        break;
                    case "S":
                        element("script").a("src", "https://sulfurous.aau.at/js/embed.js?id=" + document.getElementById("project").getAttribute("data-project-id") + "&resolution-x=480&resolution-y=360&auto-start=true&light-content=false")
                            .ap(document.getElementsByClassName("stage")[0]);
                        break;
                    case "S3":
                        element("div").a("id", "player").a("style", "width:500px;height:410px;overflow:hidden;position:relative;left:7px;top:7px; margin: 0px;").a("class", "phosphorus")
                            .append(element("object").a("style", "position:absolute;top:-51px;left:-2065px").a("class", "int-player").a("width", "2560").a("height", "1440").a("data", "https://llk.github.io/scratch-gui/#" + document.getElementById("project").getAttribute("data-project-id")).a("scrolling", "no"))
                            .ap(document.getElementsByClassName("stage")[0]);
                        break;
                    default:
                        document.getElementById("player").style = "display: block;";
                        break;
                }
            };
            console.log("Project page");
            element("select").a("class", "my_select").e("change", (event) => {
                change(document.getElementsByClassName("my_select")[0].value);
            }, false)
                .o({
                    D: "Default",
                    P: "Phosphorus",
                    S: "Sulfurous",
                    "S3": "Scratch 3"
                }, GM_getValue("player", "D"))
                .ap(document.querySelector("#share-bar") ? document.querySelectorAll(".buttons")[1] : document.querySelector(".buttons"));
            change(GM_getValue("player", "D"));

            //add download button to page
            element("button").a("class", "my_select").t("Download").e("click", (event) => {
                //first going to get project id
                let projectID = url.split("/")[url.split("/").indexOf("projects") + 1];

                download_project(projectID);

                //Welcome to my own scratch project downloader
                var costumes = [], sounds = [], status = 0;
                function download_project (id = 211651365, return_value = false) {
                    costumes = [];
                    sounds = [];
                    status = 0;
                    let xhttp = new XMLHttpRequest();
                    xhttp.onreadystatechange = () => {
                        if (xhttp.readyState == 4 && xhttp.status == 200) {
                            let zip = new JSZip(), return_array = [];

                            console.log(xhttp.responseText);
                            let json = JSON.parse(xhttp.responseText);
                            console.log(json);
                            //I only need yo get the coustumes and sounds that is in the satge and in the sprite children
                            genenerate_sounds(json);
                            //this is the order so the ids are correct for the svg and png images
                            //pen layer
                            costumes.push(json["penLayerMD5"]);
                            json["penLayerID"] = 0;
                            //all sprites
                            json["children"].forEach((a, i) => { //all the sprites
                                return_array = get_costumes(a, costumes);
                                a = return_array[1];
                                costumes = return_array[0];
                            });
                            return_array = get_costumes(json, costumes); //all the backdrops
                            costumes = return_array[0];
                            json = return_array[1];


                            //updated way to deal with sounds that are in the json
                            return_array = genenerate_sounds(json);
                            json = return_array[0];
                            sounds = return_array[1];

                            let batch = [];
                            costumes.forEach((a) => {
                                batch.push(load_resource(a));
                            });
                            Promise.all(batch)
                                .then((assets) => {
                                    assets.forEach((a) => {
                                        if (a !== null) {
                                            zip.file(costumes.indexOf(a.name) + a.name.slice(a.name.indexOf("."), a.name.length), a.file, { binary: true });
                                            console.log(costumes.indexOf(a.name) + a.name.slice(a.name.indexOf("."), a.name.length));
                                        }

                                    });
                                    status++;
                                    if (status == 2) {
                                        generateSB2(zip, json, id, return_value);
                                    }
                                })
                                .catch((e) => {
                                    console.warn(e);
                                });

                            batch = [];
                            sounds.forEach((a) => {
                                batch.push(load_resource(a));
                            });
                            Promise.all(batch)
                                .then((assets) => {
                                    assets.forEach((a) => {
                                        if (a !== null) {
                                            zip.file(sounds.indexOf(a.name) + a.name.slice(a.name.indexOf("."), a.name.length), a.file, { binary: true });
                                            console.log(sounds.indexOf(a.name) + a.name.slice(a.name.indexOf("."), a.name.length));
                                        }
                                    });
                                    status++;
                                    if (status == 2) {
                                        generateSB2(zip, json, id, return_value);
                                    }
                                })
                                .catch((e) => {
                                    console.warn(e);
                                });
                        }
                    }
                    xhttp.open("GET", "https://projects.scratch.mit.edu/internalapi/project/" + id + "/get/?format=json", true);
                    xhttp.send();
                }

                function get_costumes (json, array) {
                    let total_sprites = array;
                    if (json.hasOwnProperty("costumes")) {
                        //go through each layer a sprite has and get the id and layer
                        json["costumes"].forEach((a, i) => {
                            if (total_sprites.includes(a["baseLayerMD5"]) == false) {
                                total_sprites.push(a["baseLayerMD5"]);
                            }
                        });
                        //go through each layer and set its id
                        json["costumes"].forEach((a, i) => {
                            a["baseLayerID"] = total_sprites.indexOf(a["baseLayerMD5"]);
                        });
                    }
                    return [total_sprites, json];
                }

                function load_resource (name) {
                    return new Promise((resolve, reject) => {
                        JSZipUtils.getBinaryContent("https://cdn.assets.scratch.mit.edu/internalapi/asset/" + name + "/get/", (err, data) => {
                            if (err) {
                                resolve(null);
                            } else {
                                resolve({
                                    name: name,
                                    file: data
                                });
                            }
                        });
                    });
                }

                function load_project_info (id) {
                    return new Promise((resolve, reject) => {
                        let xhttp = new XMLHttpRequest();
                        xhttp.onreadystatechange = () => {
                            if (xhttp.readyState == 4 && xhttp.status == 200) {
                                let json = JSON.parse(xhttp.responseText);
                                resolve(json.title + ".sb2");

                            }
                        }
                        xhttp.onerror = () => {
                            resolve("Untitled.sb2");
                        }
                        xhttp.open("GET", "https://api.scratch.mit.edu/projects/" + id, true);
                        xhttp.send();
                    });
                }

                function genenerate_sounds (json) { //take in pure json
                    let sound_list = [];
                    json["children"].forEach((a, i) => { //then going to go through each child element
                        if (a.hasOwnProperty("sounds")) {
                            a["sounds"].forEach((a1, i1) => { //go through sounds of each child element
                                if (sound_list.indexOf(a1["md5"]) == -1) {
                                    sound_list.push(a1["md5"]);
                                }
                                //set the id of that element
                                json["children"][i]["sounds"][i1]["soundID"] = sound_list.indexOf(a1["md5"]);
                            });
                        }
                    });
                    //then going to go through the sounds of the stage
                    if (json.hasOwnProperty("sounds")) {
                        json["sounds"].forEach((a, i) => {
                            if (sound_list.indexOf(a["md5"]) == -1) {
                                sound_list.push(a["md5"]);
                            }
                            //set the id of that element
                            console.log(sound_list.indexOf(a["md5"]));
                            json["sounds"][i]["soundID"] = sound_list.indexOf(a["md5"]);
                        });
                    }
                    return [json, sound_list];
                }

                function generateSB2 (zip, json, id, return_value) {
                    //turn json into a string
                    zip.file("project.json", JSON.stringify(json));

                    //generate final file
                    let sb2 = zip.generate({ type: "blob" });

                    load_project_info(id)
                        .then((a) => {
                            if (return_value == false) {
                                save(sb2, a);
                            } else {
                                save(sb2, a);
                                _generate_offline(sb2);
                            }
                        });
                }

                function save (file, name) {
                    let a = document.createElement("a");
                    a.setAttribute("download", name);
                    a.setAttribute("href", window.URL.createObjectURL(file));
                    document.body.appendChild(a);
                    a.addEventListener("click", () => {
                        document.body.removeChild(a);
                    });
                    a.click();
                }
            }).ap(document.getElementsByClassName("stats")[0]);
            document.getElementsByClassName("stats")[0].getElementsByClassName("last")[0].setAttribute("style", "padding: 5px 15px; border-right: 1px solid #bbb;");
            document.getElementsByClassName("stats")[0].getElementsByClassName("last")[0].getElementsByTagName("a")[0].setAttribute("style", "margin: -7px;");
        }
    }
    function add_search () {
        //adds google to the search
        if (url.includes("/search/")) {
            console.log("search");
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

            element("a").e("click", () => {
                //make button look selected
                document.getElementsByClassName("active")[0].removeAttribute("class");
                document.getElementById("active").setAttribute("class", "active");
                //need to clear current searches
                display.childNodes[0].style.display = "none";
                display.childNodes[1].style.display = "none";
                document.getElementById("___gcse_0").style.display = "block";
            }, false)
                .append(element("li").a("id", "active")
                    .append(element("img").a("class", "tab-icon").a("style", "height: 24px;"))
                    .append(element("span").t("Google")))
                .ap(document.getElementsByClassName("sub-nav tabs")[0]);
        }
    }
    //adds dark theme button
    function dark_theme () {
        console.log(GM_getValue("theme", false));
        if (style !== null) { //remove any styles that are already in use
            style.parentElement.removeChild(style);
            if (style1 !== null) {
                style1.parentElement.removeChild(style1);
            }
            style = null;
        }
        if (GM_getValue("theme", false) === "dark") {
            //want dark theme
            style = GM_addStyle(GM_getResourceText("CSS"));
        } else if (GM_getValue("theme", false) === "newLight") {
            style = GM_addStyle(GM_getResourceText("CSSlight"));
        }
    }
    let messages = {
        get_session: () => {
            return new Promise((resolve, reject) => {
                let xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = () => {
                    if (xhttp.status == 200 && xhttp.readyState == 4) {
                        let html = xhttp.responseText;
                        let js = JSON.parse(html);
                        resolve({
                            token: js.user.token,
                            username: js.user.username
                        });
                    }
                };
                xhttp.onerror = (err) => {
                    reject("Error getting userinfo " + err);
                };
                xhttp.open("GET", "https://scratch.mit.edu/session/", true);
                xhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                xhttp.send(null);
            });
        },
        //this should instead see if the newest messgae equals our newesst message
        check_unread: (user) => {
            return new Promise((resolve, reject) => {
                let r = new XMLHttpRequest();
                r.onreadystatechange = () => {
                    if (r.status == 200 && r.readyState == 4) {
                        let rec = JSON.parse(r.responseText);
                        let mes = JSON.parse(GM_getValue("message", true));
                        user.has_messages = GM_getValue("message", true) === true || GM_getValue("username", true) != user.username || mes[0].datetime_created !== rec[0].datetime_created;
                        resolve(user);
                    }
                };
                r.onerror = (error) => {
                    reject("Error checking unread messgaes" + error);
                };
                r.open("GET", "https://api.scratch.mit.edu/users/" + user.username + "/messages?limit=1&offset=0", true);
                r.setRequestHeader("X-Token", user.token);
                r.send(null);
            });
        },
        get_message: (user) => {
            return new Promise((resolve, reject) => {
                if (user.has_messages) { //load new messages
                    let xhttp = new XMLHttpRequest();
                    xhttp.onreadystatechange = () => {
                        if (xhttp.status == 200 && xhttp.readyState == 4) {
                            user.messages = xhttp.responseText;
                            resolve(user);
                        }
                    };
                    xhttp.onerror = (error) => {
                        reject("Error loading messages" + error);
                    };
                    xhttp.open("GET", "https://api.scratch.mit.edu/users/" + user.username + "/messages?limit=40&offset=0", true);
                    xhttp.setRequestHeader("X-Token", user.token);
                    xhttp.send(null);
                } else { //load form presave
                    user.messages = GM_getValue("message", {});
                    resolve(user);
                }
            });
        }
    };

    //custom banner to display information that the user may want
    function load_banner () {
        if (url == "https://scratch.mit.edu/" && GM_getValue("pos", "top") != "none") {//on main page
            console.log("loading banner");
            let box = element("div").a("class", "box")
                .append(element("div").a("class", "box-header")
                    .append(element("h4").t("Resurgence Userscript Info"))
                    .append(element("h5"))
                    .append(element("p")
                        .append(element("a").a("href", "https://github.com/Wetbikeboy2500/Resurgence").t("Resurgence Github"))
                    )
                )
                .append(element("div").a("class", "box-content")
                    .append(element("p").t("Current Version: " + currentVersion).a("style", "margin: 0;"))
                    .append(element("p").a("style", "margin: 0;").t("Recent Version:").a("id", "recent_version"))
                    .append(element("div").a("id", "changelog").a("style", "position: relative; left: 60%; top: -54px; width: 40%; height: 54px; margin-bottom: -54px; border: 1px solid gray; background-color: white; overflow: hidden;")
                        .append(element("div").a("style", "width: 100%; height: 100%; overflow-y: scroll; position: absolute; top: 0px; left: 0px;")
                            .append(element("h5").t("Changes in 10.1").a("style", "margin: 0px; display: inline-block"))
                            .append(element("button").a("style", "display: inline-block; height: 20px; line-height: 15px; text-align: vertical;").t("Expand").a("data-expanded", "false")
                                .e("click", (e) => {
                                    let target = document.getElementById("changelog");
                                    if (e.currentTarget.getAttribute("data-expanded") == "false") {
                                        e.currentTarget.parentElement.style.height = "";
                                        e.currentTarget.parentElement.style["overflow-y"] = "";
                                        const height = e.currentTarget.parentElement.getBoundingClientRect().height;
                                        target.style.height = height + "px";
                                        target.style["margin-bottom"] = (-1 * height) + "px";
                                        e.currentTarget.setAttribute("data-expanded", "true");
                                        e.currentTarget.innerHTML = "Collapse";
                                    } else {
                                        e.currentTarget.parentElement.style.height = "100%";
                                        e.currentTarget.parentElement.style["overflow-y"] = "scroll";
                                        target.style.height = 54 + "px";
                                        target.style["margin-bottom"] = -54 + "px";
                                        e.currentTarget.setAttribute("data-expanded", "false");
                                        e.currentTarget.innerHTML = "Expand"
                                    }
                                })
                            )
                            .append(element("ul").a("style", "padding-right: 5px;")
                                .append(element("li").t("Countdowns to multiple holidays"))
                                .append(element("li").t("There is now a change log you can view (if I decide to update this)"))
                                .append(element("li").t("Recent version now displays correctly"))
                                .append(element("li").t("Updated code to use fetch instead of xhttprequests with promises"))
                                .append(element("li").t("Changed run order for better loading"))
                                .append(element("li").t("Numerous chnages to the code be less buggy"))
                            )
                        )
                    )
                );
            if (GM_getValue("pos", "top") == "top") {
                document.getElementsByClassName("mod-splash")[0].insertBefore(box.dom, document.getElementsByClassName("mod-splash")[0].children[0]);
            } else {
                box.apthis(document.getElementsByClassName("mod-splash")[0]);
            }

            //gets the current version of the code from the github page
            fetch("https://raw.githubusercontent.com/Wetbikeboy2500/Resurgence/master/ScratchFixer.user.js")
                .then((response) => { return response.text() })
                .then((text) => {
                    const version = text.substring(text.indexOf("@version") + 9, text.indexOf("// @description") - 1);
                    let tmpVersion = Number(version);
                    if (tmpVersion != currentVersion) {
                        if (tmpVersion < GM_info.script.version) {
                            document.getElementById("recent_version").innerHTML = "Recent Version: " + version + " ";
                            element("a").a("href", "https://raw.githubusercontent.com/Wetbikeboy2500/Resurgence/master/ScratchFixer.user.js").t("Downgrade (Your version is too revolutionary)").apthis(document.getElementById("recent_version"));
                        } else {
                            document.getElementById("recent_version").innerHTML = "Recent Version: " + version + " ";
                            element("a").a("href", "https://raw.githubusercontent.com/Wetbikeboy2500/Resurgence/master/ScratchFixer.user.js").t("Update").apthis(document.getElementById("recent_version"));
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

    function load_messages () {
        if (url == "https://scratch.mit.edu/" && GM_getValue("msg", true)) {
            let load = setInterval(() => {
                if (document.querySelector(".activity")) {
                    clearInterval(load);
                    messages.get_session()
                        .then(user => messages.check_unread(user))
                        .then(user => messages.get_message(user))
                        .then(user => load_message(user))
                        .catch((error) => console.warn(error));
                }
            }, 1000);

        }
    }

    function load_message (users) {
        GM_addStyle(".activity .box-content{ overflow-y: scroll; height: 248px;} .username_link {cursor: pointer; color: #6b6b6b !important; text-decoration: none;}");
        let html = JSON.parse(users.messages);
        let decodetext = (text) => {
            let txt = element("textarea").dom;
            txt.innerHTML = text;
            return txt.value;
        };
        GM_setValue("username", users.username);
        GM_setValue("message", users.messages);
        let ul = element("ul");
        for (let a of html) {
            switch (a.type) {
                case "forumpost":
                    ul.append(element("li")
                        .append(element("span").t("There are new posts in the forum: "))
                        .append(element("a").t(a.topic_title).a("href", "/discuss/topic/" + a.topic_id + "/unread/"))
                        .append(element("span").t(calcSmallest(new Date(Date.parse(a.datetime_created))))));
                    break;
                case "studioactivity":
                    ul.append(element("li")
                        .append(element("span").t("There was new activity in "))
                        .append(element("a").t(a.title).a("href", "/studios/" + a.gallery_id))
                        .append(element("span").t(calcSmallest(new Date(Date.parse(a.datetime_created))))));
                    break;
                case "favoriteproject":
                    ul.append(element("li")
                        .append(element("a").t(a.actor_username).a("href", "/users/" + a.actor_username).a("class", "username_link"))
                        .append(element("span").t(" favorited your project "))
                        .append(element("a").t(a.project_title).a("href", "/projects/" + a.project_id))
                        .append(element("span").t(calcSmallest(new Date(Date.parse(a.datetime_created))))));
                    break;
                case "loveproject":
                    ul.append(element("li")
                        .append(element("a").t(a.actor_username).a("href", "/users/" + a.actor_username).a("class", "username_link"))
                        .append(element("span").t(" loved your project "))
                        .append(element("a").t(a.title).a("href", "/projects/" + a.project_id))
                        .append(element("span").t(calcSmallest(new Date(Date.parse(a.datetime_created))))));
                    break;
                case "followuser":
                    ul.append(element("li")
                        .append(element("a").t(a.actor_username).a("href", "/users/" + a.actor_username).a("class", "username_link"))
                        .append(element("span").t(" followed you"))
                        .append(element("span").t(calcSmallest(new Date(Date.parse(a.datetime_created))))));
                    break;
                case "remixproject":
                    ul.append(element("li")
                        .append(element("a").t(a.actor_username).a("href", "/users/" + a.actor_username).a("class", "username_link"))
                        .append(element("span").t(" remixed your project "))
                        .append(element("a").t(a.parent_title).a("href", "/projects/" + a.parent_id))
                        .append(element("span").t(" as "))
                        .append(element("a").t(a.title).a("href", "/projects/" + a.project_id))
                        .append(element("span").t(calcSmallest(new Date(Date.parse(a.datetime_created))))));
                    break;
                case "addcomment":
                    if (a.comment_type === 0) { //project
                        ul.append(element("li")
                            .append(element("a").a("href", "/users/" + a.actor_username).a("class", "username_link").t(a.actor_username))
                            .append(element("span").t(' commented "' + decodetext(a.comment_fragment) + '" on your project '))
                            .append(element("a").a("href", "/projects/" + a.comment_obj_id + "/#comments-" + a.comment_id).t(a.comment_obj_title))
                            .append(element("span").t(calcSmallest(new Date(Date.parse(a.datetime_created))))));
                    } else if (a.comment_type === 1) { //profile page
                        ul.append(element("li")
                            .append(element("a").a("href", "/users/" + a.actor_username).a("class", "username_link").t(a.actor_username))
                            .append(element("span").t(' commented "' + decodetext(a.comment_fragment) + '" on your profile '))
                            .append(element("a").a("href", "/users/" + a.comment_obj_title + "/#comments-" + a.comment_id).t(a.comment_obj_title))
                            .append(element("span").t(calcSmallest(new Date(Date.parse(a.datetime_created))))));
                    } else if (a.comment_type === 2) {
                        ul.append(element("li")
                            .append(element("a").a("href", "/users/" + a.actor_username).a("class", "username_link").t(a.actor_username))
                            .append(element("span").t(' commented "' + decodetext(a.comment_fragment) + '" on your studio '))
                            .append(element("a").a("href", "/studios/" + a.comment_obj_id + "/#comments-" + a.comment_id).t(a.comment_obj_title))
                            .append(element("span").t(calcSmallest(new Date(Date.parse(a.datetime_created))))));
                    } else {
                        console.warn("Comment type not found");
                    }
                    break;
                case "curatorinvite":
                    ul.append(element("li")
                        .append(element("a").a("href", "/users/" + a.actor_username).a("class", "username_link").t(a.actor_username))
                        .append(element("span").t(' invited you to curate '))
                        .append(element("a").a("href", "/studios/" + a.gallery_id).t(a.gallery_title))
                        .append(element("span").t(calcSmallest(new Date(Date.parse(a.datetime_created))))));
                    break;
                case "becomeownerstudio":
                    ul.append(element("li")
                        .append(element("a").a("href", "/users/" + a.actor_username).a("class", "username_link").t(a.actor_username))
                        .append(element("span").t(' promoted you to manager in '))
                        .append(element("a").a("href", "/studios/" + a.gallery_id).t(a.gallery_title))
                        .append(element("span").t(calcSmallest(new Date(Date.parse(a.datetime_created))))));
                    break;
                case "userjoin":
                    ul.append(element("li")
                        .append("span").t('Welcome to Scratch')
                        .append(element("span").t(calcSmallest(new Date(Date.parse(a.datetime_created))))));
                    break;
                default:
                    console.warn(a, "Not Found");
            }
        }
        let happening = document.getElementsByClassName("box activity")[0];
        happening.childNodes[0].childNodes[0].innerHTML = "Messages";
        happening.childNodes[1].childNodes[0].style.display = "none";
        ul.a("id", "messages").ap(happening.childNodes[1]);

        set_unread(users);
    }

    function set_unread (user) {
        if (user.has_messages) {
            let x = new XMLHttpRequest();
            x.onreadystatechange = () => {
                if (x.readyState == 4 && x.status == 200) {
                    let count = JSON.parse(x.responseText).count;
                    let messages = document.getElementById("messages").getElementsByTagName("li");
                    for (let i = 0; i < count; i++) {
                        if (GM_getValue("theme", false) === "dark") {
                            messages[i].setAttribute("style", "background-color: #36393f; opacity: 1;");
                        } else {
                            messages[i].setAttribute("style", "background-color: #eed; opacity: 1;");
                        }

                    }
                }
            };
            x.open("GET", "https://api.scratch.mit.edu/users/" + user.username + "/messages/count", true);
            x.send();
        }
    }

    function load_userinfo () {
        if (document.getElementsByTagName("a").length !== 0) {
            let userlinks = false;
            userinfo = GM_getValue("user", {});
            console.log("New profile loader");
            let links = document.getElementsByTagName("a");
            for (let a of links) {
                if (a.hasAttribute("href") && a.getAttribute("href").includes("/users/")) {
                    userlinks = true;
                    if (!users.includes(a.getAttribute("href")) && !userinfo.hasOwnProperty(a.getAttribute("href"))) {
                        users.push(a.getAttribute("href"));
                        console.log("load new user info");
                    }
                }
            }

            userinfo.fulllength = users.length;
            userinfo.length = 0;
            if (!userlinks) {
                console.log("No user links");
            } else if (users.length === 0) {
                set_userinfo(links);
            } else {
                for (let i = 0; i < users.length; i++) {
                    let xhttp = new XMLHttpRequest();
                    xhttp.onreadystatechange = () => {
                        if (xhttp.status == 200 && xhttp.readyState == 4) {
                            userinfo.length += 1;
                            userinfo[String(users[i])] = JSON.parse(xhttp.responseText);
                            if (userinfo.fulllength === userinfo.length) {
                                set_userinfo(links);
                            }
                        }
                    };
                    let string = users[i];
                    if (users[i].lastIndexOf("/") + 1 === users[i].length) {
                        string = string.slice(0, -1);
                    }
                    if (users[i].includes("https://scratch.mit.edu/users/") || users[i].includes("http://scratch.mit.edu/users/")) {
                        xhttp.open("GET", "https://api.scratch.mit.edu/users/" + string.substring(string.indexOf("/users/") + 7), true);
                    } else {
                        xhttp.open("GET", "https://api.scratch.mit.edu" + string, true);
                    }
                    xhttp.send(null);
                }
            }
        }
    }

    function set_userinfo (links) {
        GM_setValue("user", userinfo);
        //run final code here
        for (let a of links) {
            if (userinfo.hasOwnProperty(a.getAttribute("href")) && !a.getAttribute("href").includes(GM_getValue("username", ""))) {
                a.addEventListener("mouseenter", (e) => {
                    const info = userinfo[a.getAttribute("href")], date = new Date(Date.parse(info.history.joined)), dif = calcDate(new Date(), date);
                    element("div").a("class", "userwindow").a("style", (GM_getValue("theme", false) === "dark") ? `position: absolute; left: ${e.pageX}px; top: ${(e.pageY + 10)}px; width: inherit; height: 20px; line-height: 20px; background-color: #000` : `position: absolute; left: ${e.pageX}px; top: ${(e.pageY + 10)}px; width: inherit; height: 20px; line-height: 20px; background-color: #fff`)
                    .t(`${info.username} joined ${dif} from ${info.profile.country}`)
                    .ap(document.body);
                });
                a.addEventListener("mouseleave", (e) => {
                    if (document.querySelector(".userwindow")) {
                        document.querySelector(".userwindow").parentElement.removeChild(document.querySelector(".userwindow"));
                    }
                });
            }
        }
        console.log("Finished user info");
    }

    function calcDate (date1, date2) {
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

    function calcSmallest (date2) {
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
    //adds scratchblockcode load support
    function load_scratchblockcode () {
        if (GM_getValue("blockCode", true)) {
            if (document.querySelector(".blocks")) {
                let blocks = [], blocks1 = [], blocks2 = [], blocks3 = [];
                console.log("contains scratch blocks");
                let xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = () => {
                    if (xhttp.status == 200 && xhttp.readyState == 4) {
                        let doc = xhttp.responseXML;
                        //only do the elements in post body html
                        let posts = document.getElementsByClassName("post_body_html");
                        let posts1 = doc.getElementsByClassName("post_body_html");
                        for (let a of posts) {
                            if (a.querySelector(".blocks")) {
                                for (let l = 0; l < a.getElementsByClassName("blocks").length; l++) {
                                    blocks.push(a.querySelectorAll(".blocks")[l]);
                                }
                            }
                        }
                        for (let a of posts1) {
                            if (a.querySelector(".blocks")) {
                                for (let l = 0; l < a.getElementsByClassName("blocks").length; l++) {
                                    blocks1.push(a.querySelectorAll(".blocks")[l]);
                                }
                            }
                        }
                        if (blocks.length > 0) {
                            for (let i = 0; i < blocks1.length; i++) {
                                blocks[i].setAttribute("id", i);
                                blocks[i].setAttribute("style", "cursor: pointer;");
                                blocks[i].addEventListener("click", (event) => {
                                    let target = event.currentTarget;
                                    target.parentElement.replaceChild(blocks1[target.id], blocks[target.id]);
                                }, false);
                            }
                        }
                        //do elements for signatures
                        posts = document.getElementsByClassName("postsignature");
                        posts1 = doc.getElementsByClassName("postsignature");
                        for (let a of posts) {
                            if (a.querySelector(".blocks")) {
                                for (let l = 0; l < a.getElementsByClassName("blocks").length; l++) {
                                    blocks2.push(a.querySelectorAll(".blocks")[l]);
                                }
                            }
                        }
                        for (let a of posts1) {
                            if (a.querySelector(".blocks")) {
                                for (let l = 0; l < a.getElementsByClassName("blocks").length; l++) {
                                    blocks3.push(a.querySelectorAll(".blocks")[l]);
                                }
                            }
                        }
                        if (blocks2.length > 0) {
                            for (let i = 0; i < blocks3.length; i++) {
                                blocks2[i].setAttribute("id", i);
                                blocks2[i].setAttribute("style", "cursor: pointer;");
                                blocks2[i].addEventListener("click", (event) => {
                                    let target = event.currentTarget;
                                    target.parentElement.replaceChild(blocks3[target.id], blocks2[target.id]);
                                }, false);
                            }
                        }
                        console.log("Finished ScratchBlocks");
                    }
                };
                xhttp.open("GET", url, true);
                xhttp.responseType = "document";
                xhttp.send(null);
            }
        }
    }

    function load_bbcode () {
        console.log("load bbcode");
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
    function load_images () {
        console.log("load images");

        GM_addStyle("#display_img {position: fixed; left: 0px; top: 50px; opacity: 0.6; background-color: #000; width: 100%; height: calc(100% - 50px); display: none;} .postright img {cursor: zoom-in;}");
        //adds the faded background
        let div = element("div").a("id", "display_img").apthis(document.getElementById("pagewrapper"));
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
    }

    function timer () {
        const currentYear = new Date().getFullYear(), currentMonth = new Date().getMonth(), currentDay = new Date().getDate(), newEvents = [{ date: "Jan 1", name: "New Year's Day" }, { date: "Feb 14", name: "Valentine's Day" }, { date: "Mar 17", name: "St. Patrick's Day" }, { newDate: "4,1,0", name: "Mother's Day" }, { newDate: "5,2,0", name: "Father's Day" }, { date: "Oct 31", name: "Halloween" }, { newDate: "10,3,4", name: "Thanksgiving" }, { date: "Dec 25", name: "Christmas Day" }, { date: "Dec 31", name: "New Year's Eve" }];
        let getDate = (year, inputString) => {
            const mwd = inputString.split(","),
                month = mwd[0],
                week = mwd[1],
                day = mwd[2];
            let firstDay = 1;
            if (week < 0) {
                month++;
                firstDay--;
            }
            let date = new Date(year, month, (week * 7) + firstDay);
            date.setDate(date.getDate() - date.getDay() + day);
            return date.getTime();
        }
        let ordered = newEvents.map((e) => {
            let holiDate = (e.hasOwnProperty("newDate")) ? getDate(currentYear, e.newDate) : new Date(e.date).setFullYear(currentYear);
            return {
                name: e.name,
                date: holiDate,
                dif: holiDate - new Date(currentYear, currentMonth, currentDay)
            }
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
            let load = setInterval(() => {
                if (document.querySelector(".box-header")) {
                    clearInterval(load);
                    let dateElement = element("span").a("style", "float: right; color: #f6660d; padding-right: 5px; font-size: .85rem; padding-top: 5px;").t("").apthis(document.querySelector(".box-header"));
                    let x = setInterval(() => {
                        const difference = holidayDate - new Date().getTime(),
                            days = Math.floor(difference / (1000 * 60 * 60 * 24)),
                            hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                            minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                            seconds = Math.floor((difference % (1000 * 60)) / 1000);

                        if (difference < 0) {
                            clearInterval(x);
                            span.innerHTML = "It's" + holidayName;
                        } else {
                            dateElement.innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s 'til " + holidayName;
                        }
                    }, 0);
                }
            }, 1000);
        } else {
            console.log("No holiday found");
        }
    }

    function create_falling (link, img, extreme, cursor = null, audio = false) {
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

    function load_extras () {
        if (GM_getValue("extras", true)) {
            create_falling("https://scratch.mit.edu/users/DeleteThisAcount/", ["http://scriftj.x10host.com/2aa.png"], true, "http://i.cubeupload.com/gIEPOl.png", "http://scriftj.x10host.com/Vaporwave.mp3");
        }
        if (GM_getValue("timer", true)) {
            timer();
        }
    }
    //add custom bbcode tags
    function load_custombb () {
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
    function add_bbbuttons () {
        $('<li class="markItUpButton markItUpButtonRes1" id="Res1"><a  title="Color" >Color</a></li>').insertAfter(".markItUpButton7")
            .find("a").css("background-image", "url(https://png.icons8.com/color-wheel/office/14/000000)");
        $('<li class="markItUpButton markItUpButtonRes2" id="Res2"><a  title="Code" >Code</a></li>').insertAfter(".markItUpButton11")
            .find("a").css("background-image", "url(https://png.icons8.com/code/office/16/000000)");
        $('<li class="markItUpButton markItUpButtonRes3" id="Res3"><a  title="Center" >Center</a></li>').insertAfter(".markItUpButton4")
            .find("a").css("background-image", "url(https://png.icons8.com/align-center/office/16/000000)");
        $('<li class="markItUpButton markItUpButtonRes4" id="Res4"><a  title="Project link" >Project Link</a></li>').insertAfter(".markItUpButton14")
            .find("a").css("background-image", "url(https://png.icons8.com/prototype/office/16/000000)");
        $('<li class="markItUpButton markItUpButtonRes5" id="Res5"><a  title="Very large" >Very Large</a></li>').insertAfter(".markItUpButton7")
            .find("a").css("background-image", "url(https://png.icons8.com/enlarge/office/14/000000)");
        $('<li class="markItUpButton markItUpButtonRes6" id="Res6"><a  title="Other IMG" >Other IMG</a></li>').insertAfter(".markItUpButton5")
            .find("a").css("background-image", "url(https://png.icons8.com/picture/office/14/000000)");
        $('<li class="markItUpButton markItUpButtonRes7" id="Res7"><a  title="Align Left" >Align Left</a></li>').insertAfter(".markItUpButtonRes3")
            .find("a").css("background-image", "url(https://png.icons8.com/align-text-left/office/16/000000)");
        $('<li class="markItUpButton markItUpButtonRes8" id="Res8"><a  title="Align Right" >Align Right</a></li>').insertAfter(".markItUpButtonRes7")
            .find("a").css("background-image", "url(https://png.icons8.com/align-text-right/office/16/000000)");
        $('<li class="markItUpButton markItUpButtonRes9" id="Res9"><a  title="Highlight" >Highlight</a></li>').insertAfter(".markItUpButtonRes1")
            .find("a").css("background-image", "url(https://png.icons8.com/highlight/office/14/000000)");
        document.onselectionchange = function () {
            document.stringyBB = getSelectionText();
        };
        $(document).on('click', '#Res1', function (event) {
            //alert(document.stringyBB);
            var BBstart = prompt("Enter a hexadecimal color w/ #:", "#FF0000");
            var constBB = "[color=" + BBstart + "]" + document.stringyBB + "[/color]";
            replaceIt($('textarea')[0], constBB)
        });
        $(document).on('click', '#Res2', function (event) {
            //alert(document.stringyBB);
            var BBstart = prompt("Enter a programming language:", "");
            var constBB = "[code=" + BBstart + "]" + document.stringyBB + "[/code]";
            replaceIt($('textarea')[0], constBB)
        });
        $(document).on('click', '#Res3', function (event) {
            var constBB = "[center]" + document.stringyBB + "[/center]";
            replaceIt($('textarea')[0], constBB)
        });
        $(document).on('click', '#Res4', function (event) {
            //alert(document.stringyBB);
            var BBstart = prompt("Enter a project ID:", "");
            var constBB = "[url=https://scratch.mit.edu/projects/" + BBstart + "/][img]https://cdn2.scratch.mit.edu/get_image/project/" + BBstart + "_282x210.png[/img][/url]";
            replaceIt($('textarea')[0], constBB)
        });
        $(document).on('click', '#Res5', function (event) {
            var constBB = "[color=res.large]" + document.stringyBB + "[/color]";
            alert("This will only appear on the main page, not the preview");
            replaceIt($('textarea')[0], constBB)
        });
        $(document).on('click', '#Res6', function (event) {
            var BBstart = prompt("Enter an img URL without http tag:", "");
            var constBB = "[color=transparent][color=res.img]" + BBstart + "[/color][/color]";
            alert("This will only appear on the main page, not the preview");
            replaceIt($('textarea')[0], constBB)
        });
        $(document).on('click', '#Res7', function (event) {
            var constBB = "[color=res.left]" + document.stringyBB + "[/color]";
            alert("This will only appear on the main page, not the preview");
            replaceIt($('textarea')[0], constBB)
        });
        $(document).on('click', '#Res8', function (event) {
            var constBB = "[color=res.right]" + document.stringyBB + "[/color]";
            alert("This will only appear on the main page, not the preview");
            replaceIt($('textarea')[0], constBB)
        });
        $(document).on('click', '#Res9', function (event) {
            var constBB = "[color=res.highlight]" + document.stringyBB + "[/color]";
            alert("This will only appear on the main page, not the preview");
            replaceIt($('textarea')[0], constBB)
        });
    }
    function getSelectionText () {
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
    function replaceIt (txtarea, newtxt) {
        $(txtarea).val(
            $(txtarea).val().substring(0, txtarea.selectionStart) +
            newtxt +
            $(txtarea).val().substring(txtarea.selectionEnd)
        );
    }
    function inIframe () {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }
    function element (name) {
        return new _element(name);
    }
    class _element {
        constructor(name) {
            this.dom = document.createElement(name);
        }
        a (name, value) {
            this.dom.setAttribute(name, value);
            return this;
        }
        t (text) {
            this.dom.appendChild(document.createTextNode(text));
            return this;
        }
        e (trigger, callback) {
            this.dom.addEventListener(trigger, callback);
            return this;
        }
        append (element2) {
            this.dom.appendChild(element2.dom);
            return this;
        }
        ap (dom) {
            dom.appendChild(this.dom);
            return dom;
        }
        apthis (dom) {
            dom.appendChild(this.dom);
            return this.dom;
        }
        o (options, selected) {
            for (let a in options) {
                if (options.hasOwnProperty(a)) {
                    console.log(a, options[a]);
                    let b = document.createElement("option");
                    b.setAttribute("value", a);
                    b.appendChild(document.createTextNode(options[a]));
                    if (selected == a) {
                        b.setAttribute("selected", true);
                    }
                    this.dom.appendChild(b);
                }
            }
            return this;
        }
    }
})();
