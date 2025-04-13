window.onload = function() {
                
    showPapers();

};

function showPapers(){
    var papers = PAPERS.replaceAll('\n','').replaceAll('{-}','-').split("@");
    var paperList = [];
    papers.forEach(function(p){
        if(p!==''){
            paperList.push(parsePaper(p));
        }
    });
    paperList.forEach(function(paper){
        var li = $('<li class="paper-li"/>').appendTo('#publication-list');
        var titleElement = $("<div/>",{
            "class" : "paper-title"
        }).appendTo(li);
        if (paper.url){
            $("<a/>",{target:"_blank", href:paper.url,text:paper.title+"."}).appendTo(titleElement);
        }
        else{
            $("<span/>",{text:paper.title+"."}).appendTo(titleElement);
        }
        if (paper.other.length>0){
            paper.other.forEach(function(o,i){
                var t = o.type;
                if (i==0){
                    t = "("+t;
                    if (paper.other.length>1){
                        t = t+",";
                    }
                }
                if(i==paper.other.length-1){
                    t = t+")";
                }
                $("<a/>",{target:"_blank", href:o.value,text:t,class:"other-link"}).appendTo(titleElement);
            });
        }

        var authorElement = $("<div/>",{
            "class" : "paper-author"
        }).appendTo(li);
        paper.author.forEach(function(a,i){
            if (i!==0){
                a = ", "+a;
            }
            if(i==paper.author.length-1){
                a = a+".";
            }
            if (a.indexOf("Xing Gao")>=0){
                $("<span/>",{text:a,class:"author-me"}).appendTo(authorElement);
            }
            else{
                $("<span/>",{text:a,class:"author-not-me"}).appendTo(authorElement);
            }
        });
        var infoElement = $("<div/>",{
            "class" : "paper-author"
        }).appendTo(li);
        $("<span/>",{text:"In "+paper.pub,class:"publisher "+paper.pub}).appendTo(infoElement);
        $("<span/>",{text:", "+paper.year+".",class:""}).appendTo(infoElement);
        
    });
    console.log(paperList);
}

function parsePaper(p){
    pJson= bibtexParse.toJSON("@"+p)[0];
    obj = {
        citationKey:pJson.citationKey,
        author:parseAuthor(pJson.entryTags.author),
        title:pJson.entryTags.title.replaceAll("{","\"").replaceAll("}","\""),
        entryType:pJson.entryType,
        pub:parsePublisher(pJson),
        year:pJson.entryTags.year,
        url:pJson.entryTags.url,
        other:parseOther(pJson.entryTags.other)

    };
    return obj;
}

function parseOther(o){
    other = [];
    if (o){
        oList= o.split(",");
        oList.forEach(function(entry){
            if(entry){
                entry = entry.replaceAll("{","").replaceAll("}","");
                entries=entry.split("=");
                other.push({type:entries[0],value:entries[1]});
            }
        });
    }
    return other;
}
function parsePublisher(p){
    pub = "";
    if (p.entryType=="inproceedings"){
        pub = p.entryTags.booktitle;
    }
    else if (p.entryType=="article"){
        pub = p.entryTags.journal;
    }
    
    return pub;
}

function parseAuthor(authorStr){
    authors = authorStr.split(" and ");
    authors.forEach(function(a,i){
        a = a.trim();
        if (a.indexOf(",")>0){
            names = a.split(",");
            authors[i] = names[1].trim()+" "+names[0];
        }
        else{
            authors[i]=a;
        }
    });
    return authors;
}



var PAPERS = `
@inproceedings{gao2023robust,
  title={Robust Matrix Sensing in the Semi-Random Model},
  author={Gao, Xing and Cheng, Yu},
  booktitle={Proceedings of the 37th Conference on Neural Information Processing Systems},
  year={2023},
  organization={Curran Associates},
  url={./doc/2023/7698_robust_matrix_sensing_in_the_s.pdf},
  other={poster={./doc/2023/7698_robust_matrix_sensing_in_the_s_poster.pdf},video={https://neurips.cc/virtual/2023/poster/70501}}
}
@inproceedings{10313487,
  author={Gao, Xing and Maranzatto, Thomas and Reyzin, Lev},
  booktitle={2023 59th Annual Allerton Conference on Communication, Control, and Computing (Allerton)}, 
  title={A Unified Analysis of Dynamic Interactive Learning}, 
  year={2023},
  volume={},
  number={},
  pages={1-8},
  doi={10.1109/Allerton58177.2023.10313487},
  url={./doc/2023/A_Unified_Analysis_of_Dynamic_Interactive_Learning.pdf}}
@inproceedings{gao2022interactive,
  title={An Interactive Search Game with Two Agents},
  author={Gao, Xing and Reyzin, Lev},
  booktitle={2022 58th Annual Allerton Conference on Communication, Control, and Computing (Allerton)},
  pages={1--8},
  year={2022},
  organization={IEEE},
  url={./doc/2022/An_Interactive_Search_Game_with_Two_Agents.pdf}
}
`

/*@article{gao2022unified,
  title={A Unified Analysis of Dynamic Interactive Learning},
  author={Gao, Xing and Maranzatto, Thomas and Reyzin, Lev},
  journal={arXiv preprint arXiv:2204.07071},
  year={2023},
  url={https://arxiv.org/abs/2204.07071},
  _other={test 1={https://arxiv.org/abs/2204.07071},test2={ddd},}
}*/