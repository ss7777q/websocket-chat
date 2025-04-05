 UserInfoManager: [function(e, t, i) {
        "use strict";
        cc._RF.push(t, "87d1aOCmJVE9ZdhALJs+PJe", "UserInfoManager");
        var a = {
            ROLE_ATTR_KEYS: ["hp", "atk", "healHp", "hitVal", "crit", "lucky", "break", "mp", "def", "healMp", "dodge", "tenacity", "guardian", "protect"],
            SMELT_EQUIP_QUALITY_CHANGE: {
                5: 6,
                9: 26
            },
            ATTR_CAL_PET_RIDE: {
                atk: {
                    name: "攻击",
                    quality: "strQuality",
                    calType: 1
                },
                def: {
                    name: "防御",
                    quality: "dexQuality",
                    calType: 1
                },
                hp: {
                    name: "生命",
                    quality: "vitQuality",
                    calType: 1
                },
                healHp: {
                    name: "回血",
                    quality: "luckQuality",
                    calType: 1
                },
                hitVal: {
                    name: "命中",
                    quality1: "strQuality",
                    quality2: "dexQuality"
                },
                crit: {
                    name: "暴击",
                    quality1: "strQuality",
                    quality2: "dexQuality"
                },
                lucky: {
                    name: "幸运",
                    quality1: "strQuality",
                    quality2: "luckQuality"
                },
                dodge: {
                    name: "闪避",
                    quality1: "vitQuality",
                    quality2: "dexQuality"
                },
                tenacity: {
                    name: "韧性",
                    quality1: "vitQuality",
                    quality2: "luckQuality"
                },
                guardian: {
                    name: "守护",
                    quality1: "vitQuality",
                    quality2: "luckQuality"
                },
                break: {
                    name: "穿透"
                },
                protect: {
                    name: "减伤"
                },
                energy: {
                    name: "体力",
                    direct: !0
                },
                energyAdd: {
                    name: "回体",
                    direct: !0
                }
            },
            HERO_POWER_CALC_ID: 1,
            PET_POWER_CALC_ID: 2,
            RIDE_POWER_CALC_ID: 3,
            MONSTER_TYPE: {
                ride: "ride",
                pet: "pet"
            },
            LANGUAGE_CH: {
                ride: "坐骑",
                pet: "宠物",
                1: "一",
                2: "二",
                3: "三",
                4: "四",
                5: "五",
                6: "六",
                7: "七",
                8: "八",
                9: "九",
                10: "十",
                11: "十一",
                12: "十二",
                13: "十三",
                14: "十四",
                15: "十五",
                16: "十六",
                17: "十七",
                18: "十八",
                19: "十九",
                20: "二十",
                21: "二十一",
                22: "二十二",
                energyAdd: "回体",
                atk: "攻击",
                def: "防御",
                hp: "生命",
                healHp: "回血",
                mp: "魔法",
                healMp: "回魔",
                energy: "体力",
                hitVal: "命中",
                dodge: "闪避",
                crit: "暴击",
                tenacity: "韧性",
                lucky: "幸运",
                guardian: "守护",
                break: "穿透",
                protect: "减伤",
                petHole: "葬灵洞",
                petTower: "万灵塔",
                petArena: "斗宠竞技"
            }
        }
          , n = {
            equip: "equip",
            item: "item",
            materials: "materials",
            consumables: "consumables",
            fashion: "fashion",
            rogueItem: "rogueItem",
            danqi: "danqi",
            danyuan: "danyuan",
            rogueMoney: "rogueMoney",
            stone: "stone",
            magic: "magic",
            bindMoney: "bindMoney",
            money: "money",
            spirit: "spirit",
            rogueLikeCrysta: "rogueLikeCrysta",
            ride: "ride",
            stageItem: "stageItem",
            stageSupply: "stageSupply",
            rideEquip: "rideEquip",
            petEquip: "petEquip",
            petArenaMoney: "petArenaMoney",
            expPet: "expPet",
            expRide: "expRide"
        };
        window.UserInfoManager = {
            isTrace: !1
        },
        UserInfoManager.getUserFightPower = function(e, t) {
            var i = this.getUserInfo(e, t);
            return this.calFightPower(i)
        }
        ,
        UserInfoManager.calFightPower = function(e) {
            var t = 0
              , i = dataApi.powerAttribute.findById(1);
            for (var a in i)
                if (i.hasOwnProperty(a)) {
                    var n = i[a];
                    if ("id" == a)
                        continue;
                    e.hasOwnProperty(a) && (t += e[a] * n)
                }
            return t = Math.floor(t)
        }
        ,
        UserInfoManager.getUserInfo = function(e, t) {
            var i = {};
            this.isTrace && console.log("record,heroId :", e, t);
            var a = e.lv
              , n = e.fixHeartList
              , o = this.getHero(e, t)
              , s = o.equipments
              , r = o.fashions
              , l = e.fashionInfo || {
                id: 0
            }
              , c = this.getAttriByNeiDan_attr(o.neiDanList.pages[o.neiDanList.curPage])
              , h = [];
            e.titles && e.titles.list && (h = Object.keys(e.titles.list));
            for (var d = this.getAttriByTitles(h, a), m = [], g = e.magicsBag.items, u = 0; u < g.length; u++) {
                var p = g[u];
                m.push(this.getAttriByMaigc(p))
            }
            var f = e.wingBag.items || []
              , y = [];
            e.p1 && (t == e.p1.heroId && e.p1.wingId > 0 && (y = o.feathers || []));
            e.p2 && (t == e.p2.heroId && e.p2.wingId > 0 && (y = o.feathers || []));
            var v = e.galaxyInfo || {}
              , _ = e.lv >= e.worldLv ? e.lv : e.worldLv
              , C = this.calAllYanXingProperty(v, _)
              , M = this.getEquipSmeltAttr({
                equipments: o.equipments,
                smeltData: o.smelt
            });
            return this.calUserInfo(t, i, a, n, s, r, c, d, m, l, f, y, e.trainingList || [], e.matrix, C, e.meridians, M),
            this.isTrace && console.log("userInfo", i),
            i
        }
        ,
        UserInfoManager.getHero = function(e, t) {
            for (var i = e.heroList.heros, a = 0; a < i.length; a++) {
                var n = i[a];
                if (n.id == t)
                    return n
            }
            return null
        }
        ,
        UserInfoManager.calUserInfo = function(e, t, i, a, n, o, s, r, l, c, h, d, m, g, u, p, f) {
            if (this.calAttribute_lv(e, t, i),
            this.isTrace)
                for (var y in console.log("<<---------------------------"),
                t)
                    if (t.hasOwnProperty(y)) {
                        var v = t[y];
                        console.log("11--- :", y, v)
                    }
            if (this.round(t),
            this.calAttribute_xf(t, a),
            this.isTrace)
                for (var _ in t)
                    if (t.hasOwnProperty(_)) {
                        var C = t[_];
                        console.log("12--- :", _, C)
                    }
            if (this.round(t),
            this.calAttribute_equipment(t, n),
            this.round(t),
            this.isTrace)
                for (var M in t)
                    if (t.hasOwnProperty(M)) {
                        var S = t[M];
                        console.log("13a--- :", M, S)
                    }
            if (this.calAttribute_suit(t, n, e),
            this.round(t),
            this.isTrace)
                for (var b in t)
                    if (t.hasOwnProperty(b)) {
                        var I = t[b];
                        console.log("13--- :", b, I)
                    }
            if (this.calAttribute_fashion(t, o, c),
            this.round(t),
            this.isTrace)
                for (var T in t)
                    if (t.hasOwnProperty(T)) {
                        var k = t[T];
                        console.log("14--- :", T, k)
                    }
            if (this.calAttribute_neidan(t, s),
            this.round(t),
            this.isTrace)
                for (var w in t)
                    if (t.hasOwnProperty(w)) {
                        var P = t[w];
                        console.log("15--- :", w, P)
                    }
            if (this.calAttribute_neidan(t, r, !0),
            this.round(t),
            this.isTrace)
                for (var L in t)
                    if (t.hasOwnProperty(L)) {
                        var B = t[L];
                        console.log("16--- :", L, B)
                    }
            for (var E = 0; E < l.length; E++) {
                var N = l[E];
                this.calAttribute_neidan(t, N, !0)
            }
            if (this.round(t),
            this.isTrace) {
                for (var A in t)
                    if (t.hasOwnProperty(A)) {
                        var D = t[A];
                        console.log("17--- :", A, D)
                    }
                console.log("---------------------------\x3e>")
            }
            var R = this.getUserAllWingsAttrsAndPower(h).attrs;
            for (var F in R)
                R.hasOwnProperty(F) && (0 == t.hasOwnProperty(F) && (t[F] = 0),
                t[F] += R[F]);
            this.round(t);
            var x = this.getUserAllFeatherAttrsAndPower(d).attrs;
            for (var U in x)
                x.hasOwnProperty(U) && (0 == t.hasOwnProperty(U) && (t[U] = 0),
                t[U] += x[U]);
            for (var O = 0; O < m.length; O++) {
                var G = m[O];
                this.calAttribute_xianpo(t, G)
            }
            var H = this.calAllMatrixFightPower(g).attrs;
            for (var V in H)
                H.hasOwnProperty(V) && (0 == t.hasOwnProperty(V) && (t[V] = 0),
                t[V] += H[V]);
            for (var W in u)
                u.hasOwnProperty(W) && (0 == t.hasOwnProperty(W) && (t[W] = 0),
                t[W] += u[W]);
            var j = this.calAllMeridiansightPower(p).attrs;
            for (var q in j)
                j.hasOwnProperty(q) && (0 == t.hasOwnProperty(q) && (t[q] = 0),
                t[q] += j[q]);
            for (var Y in f)
                f.hasOwnProperty(Y) && (t[Y] += f[Y]);
            this.round(t)
        }
        ,
        UserInfoManager.calAttribute_lv = function(e, t, i) {
            for (var a = dataApi.monster.findById(e), n = ["atk", "def", "hp", "healHp", "healMp", "mp", "hitVal", "dodge", "crit", "tenacity", "lucky", "guardian", "break", "protect"], o = dataApi.exp.findBy("level", i)[0], s = 0; s < n.length; s++) {
                var r = n[s];
                t[r] = a[r] * o[r]
            }
            var l = a.resist;
            l = l || [];
            for (var c = 0; c < l.length; c++) {
                var h = l[c];
                t[this.getResistObjById(h[0]).fieldName] = h[1]
            }
        }
        ,
        UserInfoManager.calAttribute_xf = function(e, t) {
            for (var i in t)
                if (t.hasOwnProperty(i)) {
                    var a = t[i];
                    if (a > 0) {
                        var n = dataApi.heart.findBy("level", a)[0][i];
                        e[i] || (e[i] = 0),
                        e[i] += n
                    }
                }
        }
        ,
        UserInfoManager.calAttribute_equipment = function(e, t) {
            for (var i in t)
                if (t.hasOwnProperty(i)) {
                    var a = t[i].data;
                    if (a) {
                        for (var n in a.attr)
                            if (a.attr.hasOwnProperty(n)) {
                                var o = a.attr[n];
                                e[n] || (e[n] = 0),
                                e[n] += o
                            }
                        for (var s in a.affixAttr)
                            if (a.affixAttr.hasOwnProperty(s)) {
                                var r = a.affixAttr[s];
                                e[s] || (e[s] = 0),
                                e[s] += r
                            }
                        var l = t[i];
                        if (l.lv > 0) {
                            var c = this.calEquipUpgradeValue(a, l.lv);
                            for (var h in c)
                                if (c.hasOwnProperty(h)) {
                                    var d = c[h];
                                    e[h] || (e[h] = 0),
                                    e[h] += d
                                }
                        }
                    }
                    var m = t[i];
                    if (m.stone)
                        for (var g = 0; g < m.stone.length; g++) {
                            var u = m.stone[g];
                            if (u) {
                                if (!(u < 0 || g >= m.data.hole))
                                    for (var p = dataApi.stone.findById(u), f = 0; f < p.attribute.length; f++) {
                                        var y = p.attribute[f]
                                          , v = p.attributeValue[f];
                                        e[y] || (e[y] = 0),
                                        e[y] += v
                                    }
                            } else
                                console.error("stone-出问题！！-----", u)
                        }
                }
        }
        ,
        UserInfoManager.calAttribute_suit = function(e, t, i) {
            var a = {};
            for (var n in t)
                if (t.hasOwnProperty(n)) {
                    var o = t[n].data;
                    if (o) {
                        var s = dataApi.equip.findById(o.id);
                        if (s.suitAttribute && s.suitAttribute.length > 0) {
                            var r = s.suitAttribute[0];
                            s.suitAttribute.length > 1 && (r = s.suitAttribute[i - 1]),
                            0 == a.hasOwnProperty(r) && (a[r] = 0),
                            a[r]++
                        }
                    }
                }
            for (var l in a)
                for (var c = a[l], h = dataApi.equipSuitAttribute.findById(l), d = h.number.length - 1; d >= 0; d--) {
                    if (h.number[d] <= c) {
                        for (var m = 0; m < h.attribute[d].length; m++) {
                            var g = h.attribute[d][m]
                              , u = h.attributeValue[d][m];
                            e[g] || (e[g] = 0),
                            e[g] += u
                        }
                        break
                    }
                }
        }
        ,
        UserInfoManager.calAttribute_fashion = function(e, t, i) {
            var a = {};
            for (var n in t)
                if (t.hasOwnProperty(n)) {
                    var o = t[n];
                    if (o) {
                        var s = dataApi.equipFashion.findById(o.id);
                        if (s)
                            for (var r = s.attribute, l = s.attributeValue, c = 0; c < r.length; c++) {
                                var h = r[c];
                                0 == a.hasOwnProperty(h) && (a[h] = 0),
                                a[h] += l[c]
                            }
                    }
                }
            var d = {};
            for (var m in this.calAttribute_fashion_baozhu(i.id, d),
            a)
                if (a.hasOwnProperty(m)) {
                    var g = a[m];
                    0 == e.hasOwnProperty(m) && (e[m] = 0);
                    var u = g * (1 + (d[m] || 0));
                    e[m] += u
                }
        }
        ,
        UserInfoManager.calAttribute_fashion_baozhu = function(e, t) {
            for (var i = 0; i <= e; ) {
                var a = dataApi.equipFashionBall.findById(i);
                if (a) {
                    var n = a.attributeValue;
                    for (var o in n)
                        if (n.hasOwnProperty(o)) {
                            var s = n[o];
                            0 == t.hasOwnProperty(o) && (t[o] = 0),
                            t[o] += s
                        }
                }
                i++
            }
        }
        ,
        UserInfoManager.calAttribute_neidan = function(e, t) {
            var i = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
            if (t)
                for (var a in t)
                    if (t.hasOwnProperty(a)) {
                        var n = t[a];
                        0 == e.hasOwnProperty(a) && (e[a] = 0),
                        e[a] += i ? Math.floor(n) : n
                    }
        }
        ,
        UserInfoManager.calMagicWeaponSoul = function(e) {
            var t = e.lv
              , i = e.spell
              , a = {}
              , n = 0;
            if (!i)
                return {
                    addPower: n,
                    attr: a
                };
            for (var o in i)
                for (var s = dataApi.magicWeaponSoul.findById(i[o].id), r = s.attribute, l = s.attributeValue, c = 0; c < r.length; ++c)
                    a[r[c]] || (a[r[c]] = 0),
                    a[r[c]] += l[c] * t;
            return {
                addPower: n = UserInfoManager.calFightPower(a),
                attr: a
            }
        }
        ,
        UserInfoManager.getAttriByNeiDan_attr = function(e) {
            for (var t = {}, i = e.danqi, a = 0; a < i.length; a++) {
                var n = i[a];
                if (n)
                    for (var o in n.attr)
                        if (n.attr.hasOwnProperty(o)) {
                            var s = n.attr[o];
                            void 0 == t[o] && (t[o] = 0),
                            t[o] += s
                        }
            }
            return t
        }
        ,
        UserInfoManager.getAttriByTitles = function(e, t) {
            var i = this
              , a = {};
            return e.forEach(function(e) {
                e = parseInt(e);
                var n = i.getTitileAddZhanLiById(e, t).attrs;
                for (var o in n)
                    if (n.hasOwnProperty(o)) {
                        var s = n[o];
                        a[o] || (a[o] = 0),
                        a[o] += s
                    }
            }),
            a
        }
        ,
        UserInfoManager.getAttriByMaigc = function(e) {
            var t = {};
            if (e) {
                var i = e.id
                  , a = dataApi.magicWeapon.findById(i);
                if (a) {
                    var n = e.growth
                      , o = e.blessing.indexOf(4) > -1 ? 1 : 0
                      , s = e.blessing.indexOf(3) > -1 ? 1 : 0
                      , r = e.blessing.indexOf(1) > -1 ? 1 : 0
                      , l = e.blessing.indexOf(5) > -1 ? 1 : 0;
                    t.hp = Math.floor(.5 + a.hp + n * (1 + .5 * o) * a.hpAdd * e.lv),
                    t.mp = Math.floor(.5 + a.mp + n * (1 + .5 * s) * a.mpAdd * e.lv),
                    t.atk = Math.floor(.5 + a.atk + n * (1 + .5 * r) * a.atkAdd * e.lv),
                    t.def = Math.floor(.5 + a.def + n * (1 + .5 * l) * a.defAdd * e.lv),
                    t.healHp = Math.floor(.5 + a.healHp + n * a.healHpAdd * e.lv),
                    t.healMp = Math.floor(.5 + a.healMp + n * a.healMpAdd * e.lv)
                }
                if (e.soulData) {
                    var c = UserInfoManager.calMagicWeaponSoul(e.soulData);
                    UserInfoManager.calAttribute_neidan(t, c.attr)
                }
            }
            return t
        }
        ,
        UserInfoManager.getTitileAddZhanLiById = function(e, t) {
            var i = dataApi.title.findById(e)
              , a = dataApi.powerAttribute.findById(1)
              , n = 0;
            if (!i)
                return {
                    addZhanLiNum: n
                };
            for (var o = UserInfoManager.getTitleAttrByButeId(i.buteId, t), s = o.attribute || [], r = o.attributeValue || [], l = {}, c = 0; c < s.length; ++c) {
                var h = a[s[c]] || 0
                  , d = r[c] || 0;
                n += h * d,
                l[s[c]] = d
            }
            return {
                addZhanLiNum: n,
                attrs: l
            }
        }
        ,
        UserInfoManager.getTitleAttrByButeId = function(e, t) {
            for (var i = dataApi.titleAttribute.findByOpts({
                buteId: e
            }), a = 0; a < i.length; a++)
                if (i[a].level >= t)
                    return {
                        attribute: i[a].attribute,
                        attributeValue: i[a].attributeValue
                    };
            return {}
        }
        ,
        UserInfoManager.getResistObjById = function(e) {
            for (var t = [{
                name: "光抗",
                fieldName: "lightResist",
                id: 1,
                icon: "comm2.guang",
                tip: "光系抗性"
            }, {
                name: "暗抗",
                fieldName: "darkResist",
                id: 2,
                icon: "comm2.an",
                tip: "暗系抗性"
            }, {
                name: "水抗",
                fieldName: "waterResist",
                id: 3,
                icon: "comm2.shui",
                tip: "水系抗性"
            }, {
                name: "火抗",
                fieldName: "fireResist",
                id: 4,
                icon: "comm2.huo",
                tip: "火系抗性"
            }, {
                name: "木抗",
                fieldName: "woodResist",
                id: 5,
                icon: "comm2.mu",
                tip: "木系抗性"
            }, {
                name: "风抗",
                fieldName: "windResist",
                id: 6,
                icon: "comm2.feng",
                tip: "风系抗性"
            }, {
                name: "土抗",
                fieldName: "soilResist",
                id: 7,
                icon: "comm2.tu",
                tip: "土系抗性"
            }, {
                name: "雷抗",
                fieldName: "rayResist",
                id: 8,
                icon: "comm2.lei",
                tip: "雷系抗性"
            }], i = 0; i < t.length; i++) {
                var a = t[i];
                if (a.id == e)
                    return a
            }
            return null
        }
        ,
        UserInfoManager.calEquipUpgradeValue = function(e, t, i) {
            var a = {}
              , o = void 0;
            i ? o = i : (o = UserInfoManager.findAllEquipTbById(e.id),
            e.itemType === n.fashion && (o = dataApi.equipFashion.findById(e.id)));
            var s = void 0
              , r = void 0;
            o.type > 0 && (s = dataApi.monster.findById(o.type),
            (r = dataApi.equipUpgradeValue.findById(o.type)) || (console.error("equipUpgradeValue 找不到角色" + o.type + "的数据"),
            r = s));
            var l = [];
            for (var c in e.attr)
                if (e.attr.hasOwnProperty(c)) {
                    var h = e.attr[c];
                    l.push([c, h])
                }
            var d = null;
            t > 0 && (d = dataApi.equipUpgrade.findById(t));
            var m, g, u, p = void 0, f = void 0, y = void 0;
            void 0 == (y = o.upgradeModulus) && (y = 1);
            var v = y;
            m = dataApi.equipUpgrade.findById(y - 1),
            y = dataApi.equipUpgrade.findById(y),
            v >= 210 ? v = 189 : v >= 206 ? v = 188 : v >= 203 ? v = 187 : v >= 200 ? v = 186 : v >= 196 ? v = 185 : v >= 193 ? v = 184 : v >= 190 ? v = 183 : v >= 186 ? v = 182 : v >= 183 && (v = 181),
            g = dataApi.equipUpgrade.findById(v - 1),
            u = dataApi.equipUpgrade.findById(v);
            for (var _ = 0; _ < l.length; _++) {
                for (var C = l[_], M = 0, S = 0, b = 0; b < o.attribute.length; b++)
                    if (o.attribute[b] == C[0]) {
                        var I = o.attributeValue[b];
                        S = I[0],
                        M = I[1];
                        break
                    }
                if (void 0 == M && (M = 1),
                s ? (p = s[C[0]],
                f = r[C[0]]) : (p = 1,
                f = 1),
                d) {
                    var T = (C[1] - S) / (M - S)
                      , k = T * (y[C[0]] - m[C[0]]) + m[C[0]]
                      , w = Math.round(k * t * f)
                      , P = T * (u[C[0]] - g[C[0]]) + g[C[0]]
                      , L = Math.round(P * t * p)
                      , B = void 0;
                    B = y <= 160 ? L : y >= 220 ? w : w > L ? w : L,
                    a[C[0]] = B
                } else
                    a[C[0]] = 0
            }
            return a
        }
        ,
        UserInfoManager.calRidePetComAttr = function(e, t, i, n, o) {
            var s = a.PET_POWER_CALC_ID
              , r = {};
            n === a.MONSTER_TYPE.pet ? (s = a.PET_POWER_CALC_ID,
            r = UserInfoManager.calAllPotentialSkillAttr(e)) : n === a.MONSTER_TYPE.ride && (s = a.RIDE_POWER_CALC_ID);
            var l = dataApi.powerAttribute.findById(s)
              , c = {}
              , h = 0
              , d = e.star
              , m = e.lv;
            for (var g in a.ATTR_CAL_PET_RIDE)
                if (a.ATTR_CAL_PET_RIDE.hasOwnProperty(g) && (t[g] || 0 === t[g])) {
                    var u = 0
                      , p = a.ATTR_CAL_PET_RIDE[g].quality
                      , f = a.ATTR_CAL_PET_RIDE[g].quality1
                      , y = a.ATTR_CAL_PET_RIDE[g].quality2
                      , v = a.ATTR_CAL_PET_RIDE[g]
                      , _ = e.newQuality || {};
                    if (v.direct)
                        u = e[g];
                    else if (1 === v.calType && p) {
                        if (1 === v.calType) {
                            var C = i ? _["" + p] : e["" + p];
                            if (!C && 0 !== C) {
                                console.error("属性计算有问题;quaKey：", p);
                                continue
                            }
                            var M = t[g + "Modulus"][d - 1];
                            u = t[g] + C * M * m
                        }
                    } else if (1 !== v.calType && f && y) {
                        var S = i ? _["" + f] : e["" + f];
                        if (!S && 0 !== S) {
                            console.error("属性计算有问题;quaKey1：", f);
                            continue
                        }
                        var b = i ? _["" + y] : e["" + y];
                        if (!b && 0 !== b) {
                            console.error("属性计算有问题;quaKey2：", y);
                            continue
                        }
                        var I = t[g + "Modulus"][d - 1];
                        u = t[g] + (S + b) * I * m
                    } else
                        u = t[g];
                    r[g] && (u += r[g].val),
                    u = Math.ceil(u),
                    u = Number.isNaN(u) ? 0 : u,
                    c[g] = {
                        name: a.LANGUAGE_CH[g],
                        val: u
                    },
                    h += (l[g] || 0) * u
                }
            return h += UserInfoManager.celEquipPower(e, n, c, o),
            {
                addPower: h = Math.ceil(h),
                result: c
            }
        }
        ,
        UserInfoManager.celEquipPower = function(e, t, i, n) {
            for (var o = ["armor", "foot", "hand", "head"], s = 0, r = 0; r < o.length; ++r) {
                var l = null;
                if (t === a.MONSTER_TYPE.pet ? l = e.equipments[o[r]] : t === a.MONSTER_TYPE.ride && (l = n[o[r]] && n[o[r]].data),
                l) {
                    var c = UserInfoManager.getPowerOfEquip(l, n)
                      , h = c.attrs;
                    for (var d in h)
                        h.hasOwnProperty(d) && i && (i[d] = i[d] || {
                            name: a.LANGUAGE_CH[d],
                            val: 0
                        },
                        i[d].val += h[d]);
                    s += c.addPower || 0
                }
            }
            return s
        }
        ,
        UserInfoManager.calAllPotentialSkillAttr = function(e) {
            var t = e.skillPotential
              , i = void 0 === t ? [] : t
              , a = {};
            if (0 === i.length)
                return a;
            for (var n = UserInfoManager.calPetPhysiqueAndMax(e), o = n.curAllPhysique, s = n.maxPhysique, r = e.dower.potential + e.dower.affixpotential, l = 0; l < r; ++l) {
                var c = i[l];
                if (c) {
                    var h = {
                        id: c.id,
                        lv: c.fightLv || c.lv
                    }
                      , d = UserInfoManager.findPotentialSkillTb(h);
                    if (d)
                        for (var m = d.attribute, g = d.attributeValue, u = 0; u < m.length; ++u) {
                            var p = m[u]
                              , f = g[u]
                              , y = f * (o / s);
                            a[p] = a[p] || {
                                base: 0,
                                add: 0,
                                val: 0
                            },
                            a[p].base += f,
                            a[p].add += y,
                            a[p].val += f + y
                        }
                    else
                        console.error("##calAllPotentialSkillAttr skill not in potential: ", c)
                }
            }
            return a
        }
        ,
        UserInfoManager.calPetPhysiqueAndMax = function(e) {
            var t = e.dower
              , i = t.physique + t.affixphysique
              , a = dataApi.pet.findById(e.id);
            a.physique;
            return {
                curAllPhysique: i,
                maxPhysique: a.physiqueLimit
            }
        }
        ,
        UserInfoManager.calPotentialSkillAttr = function(e, t) {
            for (var i = UserInfoManager.calPetPhysiqueAndMax(e), a = i.curAllPhysique, n = i.maxPhysique, o = {}, s = {
                id: t.id,
                lv: t.fightLv || t.lv
            }, r = UserInfoManager.findPotentialSkillTb(s), l = r.attribute, c = r.attributeValue, h = 0; h < l.length; ++h) {
                var d = l[h]
                  , m = c[h]
                  , g = m * (a / n);
                o[d] = o[d] || {
                    base: 0,
                    add: 0,
                    val: 0
                },
                o[d].base += m,
                o[d].add += g,
                o[d].val += m + g
            }
            return o
        }
        ,
        UserInfoManager.findPotentialSkillTb = function(e, t) {
            var i = e.id
              , a = e.lv;
            return t && 0 !== t && (a += t),
            dataApi.petPotential.findByOpts({
                potentialId: i,
                level: a
            })[0]
        }
        ,
        UserInfoManager.getPowerOfEquip = function(e, t) {
            if (e) {
                var i = e.attr
                  , o = e.affixAttr
                  , s = {}
                  , r = {};
                s = i ? JSON.parse(JSON.stringify(i)) : {},
                r = o ? JSON.parse(JSON.stringify(o)) : {};
                var l = a.PET_POWER_CALC_ID
                  , c = {};
                if (e.itemType === n.petEquip)
                    l = a.PET_POWER_CALC_ID,
                    c = UserInfoManager.calPetEquipUpgradeValue(e, e.lv, a.MONSTER_TYPE.pet);
                else if (e.itemType === n.rideEquip) {
                    l = a.RIDE_POWER_CALC_ID;
                    var h = e.lv
                      , d = e;
                    void 0 === h ? h = t[e.part].lv : d = e.data,
                    c = UserInfoManager.calPetEquipUpgradeValue(d, h, a.MONSTER_TYPE.ride)
                } else
                    e.itemType === n.equip && (l = a.HERO_POWER_CALC_ID);
                var m = dataApi.powerAttribute.findById(l)
                  , g = 0;
                for (var u in s) {
                    if (s.hasOwnProperty(u))
                        g += (m[u] || 0) * s[u]
                }
                for (var p in r)
                    if (r.hasOwnProperty(p)) {
                        var f = m[p] || 0
                          , y = r[p];
                        g += f * y,
                        s[p] = s[p] || 0,
                        s[p] += y
                    }
                for (var v in c)
                    if (c.hasOwnProperty(v)) {
                        var _ = m[v] || 0
                          , C = c[v];
                        g += _ * C,
                        s[v] = s[v] || 0,
                        s[v] += C
                    }
                return {
                    addPower: g,
                    attrs: s
                }
            }
        }
        ,
        UserInfoManager.calPetEquipUpgradeValue = function(e, t, i) {
            var a = {}
              , n = UserInfoManager.findAllEquipTbById(e.id)
              , o = [];
            for (var s in e.attr)
                if (e.attr.hasOwnProperty(s)) {
                    var r = e.attr[s];
                    o.push([s, r])
                }
            var l = null;
            t > 0 && (l = UserInfoManager.GetPetEquipUpgradeById(t, i));
            var c = void 0
              , h = n.upgradeModulus
              , d = n.upgradeModulus;
            void 0 == d && (d = 1),
            h = UserInfoManager.GetPetEquipUpgradeById(d - 1, i),
            d = UserInfoManager.GetPetEquipUpgradeById(d, i);
            for (var m = 0; m < o.length; m++) {
                for (var g = o[m], u = 0, p = 0, f = 0; f < n.attribute.length; f++)
                    if (n.attribute[f] == g[0]) {
                        var y = n.attributeValue[f];
                        p = y[0],
                        u = y[1];
                        break
                    }
                if (u || (u = 1),
                c = 1,
                l) {
                    var v = (g[1] - p) / (u - p) * (d[g[0]] - h[g[0]]) + h[g[0]];
                    a[g[0]] = Math.round(v * t * c)
                } else
                    a[g[0]] = 0
            }
            return a
        }
        ,
        UserInfoManager.GetPetEquipUpgradeById = function(e, t) {
            return t === a.MONSTER_TYPE.pet ? dataApi.petEquipUpgrade.findById(e) : t === a.MONSTER_TYPE.ride ? dataApi.rideEquipUpgrade.findById(e) : void 0
        }
        ,
        UserInfoManager.calPetFuseEquipMultiple = function(e, t, i) {
            for (var a = MUtil.clone(e), n = 0; n < t.length; ++n) {
                var o = t[n]
                  , s = UserInfoManager.calPetFuseEquip(a, o, i);
                a.lv = s.lv,
                a.exp = s.exp
            }
            return a
        }
        ,
        UserInfoManager.calPetFuseEquip = function(e, t, i) {
            var a = dataApi.gameConsts.equipUpgradeRank
              , n = -1
              , o = -1
              , s = void 0
              , r = void 0;
            e.lv > t.lv ? (s = e,
            r = t) : (s = t,
            r = e);
            for (var l = s, c = l.lv, h = l.exp, d = 1; d < a.length; ++d) {
                var m = a[d - 1]
                  , g = a[d];
                if (-1 === n && s.lv >= m && s.lv < g && (n = d - 1),
                -1 === o && r.lv >= m && r.lv < g && (o = d - 1),
                -1 !== n && -1 !== o)
                    break
            }
            var u = n - o
              , p = 0
              , f = function(e, t) {
                for (var i = 0, a = e; a < t; ++a) {
                    i += dataApi.petEquipUpgrade.findById(a + 1).exp
                }
                return i
            }
              , y = f(a[o], r.lv);
            p = r.exp + y;
            var v = a[n + 1]
              , _ = dataApi.petEquipUpgrade.findById(c + 1)
              , C = 0;
            do {
                if (++C > 1e3) {
                    console.error("死循环");
                    break
                }
                var M = Math.pow(10, u);
                if (!_ || c >= i) {
                    h += p / M,
                    p = 0,
                    console.log("等级已到上限");
                    break
                }
                if (c >= v)
                    u = ++n - o,
                    v = a[n + 1];
                else if (h + p / M >= _.exp)
                    p -= (_.exp - h) * M,
                    h = 0,
                    ++c,
                    _ = dataApi.petEquipUpgrade.findById(c + 1);
                else {
                    if (console.log("低等级下降一阶段：" + o),
                    h += p / M,
                    p = 0,
                    u = n - --o,
                    o >= 0)
                        p = f(a[o], a[o + 1])
                }
            } while (p > 0 || o >= 0);
            return {
                lv: c,
                exp: Math.round(h)
            }
        }
        ,
        UserInfoManager.findAllEquipTbById = function(e) {
            var t = dataApi.equip.findById(e);
            return t || ((t = dataApi.petEquip.findById(e)) ? t : t = dataApi.rideEquip.findById(e))
        }
        ,
        UserInfoManager.getWingAttr = function(e) {
            for (var t = e.id, i = e.lv, a = void 0 === i ? 1 : i, n = dataApi.wing.findById(t), o = dataApi.wingAttribute.findByOpts({
                buteId: n.buteId,
                wingLevel: a
            })[0], s = {}, r = 0, l = dataApi.powerAttribute.findById(1), c = o.attribute, h = void 0 === c ? [] : c, d = o.attributeValue, m = void 0 === d ? [] : d, g = 0; g < h.length; ++g)
                s[h[g]] = m[g],
                r += m[g] * l[h[g]];
            return {
                addPower: r,
                attrs: s
            }
        }
        ,
        UserInfoManager.getUserAllWingsAttrsAndPower = function(e) {
            for (var t = {}, i = 0, a = 0; a < e.length; ++a) {
                for (var n = UserInfoManager.getWingAttr({
                    id: e[a].id,
                    lv: e[a].lv
                }), o = Object.keys(n.attrs), s = 0; s < o.length; ++s) {
                    var r = o[s];
                    t[r] = t[r] || 0,
                    t[r] += n.attrs[r]
                }
                i += n.addPower
            }
            return {
                addPower: i,
                attrs: t
            }
        }
        ,
        UserInfoManager.getUserAllFeatherAttrsAndPower = function(e) {
            for (var t = {}, i = 0, a = dataApi.powerAttribute.findById(1), n = 0; n < e.length; ++n)
                if (e[n])
                    for (var o = Object.keys(e[n].attr), s = 0; s < o.length; ++s)
                        t[o[s]] = t[o[s]] || 0,
                        t[o[s]] += e[n].attr[o[s]],
                        i += e[n].attr[o[s]] * a[o[s]];
            return {
                addPower: i,
                attrs: t
            }
        }
        ,
        UserInfoManager.round = function(e) {
            for (var t in e)
                e.hasOwnProperty(t) && (e[t] = Math.round(e[t]))
        }
        ,
        UserInfoManager.getNeiDanFightPower = function(e, t) {
            var i = this.getHero(e, t)
              , a = this.getAttriByNeiDan_attr(i.neiDanList.pages[i.neiDanList.curPage])
              , n = {};
            if (this.calAttribute_neidan(n, a),
            this.round(n),
            this.isTrace)
                for (var o in n)
                    if (n.hasOwnProperty(o)) {
                        var s = n[o];
                        console.log("15--- :", o, s)
                    }
            return this.calFightPower(n)
        }
        ,
        UserInfoManager.getXLFightPower = function(e) {
            var t = {}
              , i = e.fixHeartList;
            this.calAttribute_xf(t, i);
            return this.calFightPower(t)
        }
        ,
        UserInfoManager.getXianpoFightPower = function(e) {
            for (var t = {}, i = 0; i < e.length; i++) {
                var a = e[i];
                this.calAttribute_xianpo(t, a)
            }
            return this.calFightPower(t)
        }
        ,
        UserInfoManager.getXianpoFightPowerByLv = function(e) {
            var t = {};
            this.calAttribute_xianpo(t, e);
            return this.calFightPower(t)
        }
        ,
        UserInfoManager.calAttribute_xianpo = function(e, t) {
            for (var i in t)
                if (t.hasOwnProperty(i)) {
                    for (var a = t[i], n = a.lv || 1, o = void 0, s = dataApi.xianpo.findBy("xianpoId", a.id), r = 0; r < s.length; r++) {
                        var l = s[r];
                        if (l.level == n) {
                            o = l;
                            break
                        }
                    }
                    if (o)
                        for (var c = 0; c < o.attribute.length; c++) {
                            var h = o.attribute[c];
                            0 == e.hasOwnProperty(h) && (e[h] = 0),
                            e[h] += o.attributeValue[c]
                        }
                }
        }
        ,
        UserInfoManager.calEatChickenAddScore = function(e) {
            var t = e.avgScore
              , i = e.rank
              , a = e.killNum
              , n = e.bloodPro
              , o = Object.values(dataApi.skyMelee.all());
            MUtil.sort(o, function(e, t) {
                return e.id - t.id
            });
            for (var s = void 0, r = 0; r < o.length; ++r)
                if (!o[r + 1] || !o[r + 1].luandouScore || t >= o[r].luandouScore && t < o[r + 1].luandouScore) {
                    s = o[r];
                    break
                }
            var l = 0
              , c = 0;
            if (s) {
                s["Number" + i + "Score"] && (l += s["Number" + i + "Score"]),
                s["Number" + i + "Money"] && (c += s["Number" + i + "Money"]);
                var h = dataApi.gameConsts.skyMeleeComplete
                  , d = 0
                  , m = 0;
                a > 0 && (d += parseInt(h.getScore.killNum * a),
                m += parseInt(h.getMoney.killNum * a)),
                n > 0 && (d += parseInt(h.getScore.bloodPro * n),
                m += parseInt(h.getMoney.bloodPro * n)),
                l += d = Math.min(100, d),
                c += m = Math.min(100, m)
            }
            return {
                addScore: l,
                addMoney: c
            }
        }
        ,
        UserInfoManager.calAllMatrixFightPower = function(e) {
            var t = {}
              , i = 0;
            for (var a in e) {
                var n = UserInfoManager.calMatrixFightPower(e[a], a);
                for (var o in i += n.addPower,
                n.attrs)
                    t[o] || (t[o] = 0),
                    t[o] += n.attrs[o]
            }
            return {
                addPower: i,
                attrs: t
            }
        }
        ,
        UserInfoManager.calMatrixFightPower = function(e, t) {
            var i = 999
              , a = 0
              , n = null
              , o = {}
              , s = 0
              , r = dataApi.matrix.findById(t)
              , l = dataApi.powerAttribute.findById(1)
              , c = e.hole;
            for (var h in c || (c = {}),
            c)
                if (c[h]) {
                    var d = dataApi.matrixCore.findById(c[h].id);
                    for (var m in "matrixCore" === c[h].type ? (d.quality < i && (i = d.quality),
                    a++) : c[h].type,
                    c[h].attr)
                        o[m] || (o[m] = 0),
                        o[m] += c[h].attr[m]
                }
            if (r) {
                if (n = a >= r.matrixCore.length ? i : null)
                    for (var g = dataApi.matrix.findById(t).matrixCoreSuit, u = dataApi.matrixSuit.findByOpts({
                        suit: g
                    }), p = 0; p < u.length; p++)
                        if (n == u[p].quality)
                            for (var f = u[p].attribute, y = 0; y < f.length; y++)
                                o[f[y]] || (o[f[y]] = 0),
                                o[f[y]] += u[p].attributeValue[y]
            } else
                console.error("阵法：" + t + " 表数据不存在");
            for (var v in o)
                s += o[v] * l[v];
            return {
                addPower: s,
                attrs: o
            }
        }
        ,
        UserInfoManager.calAllYanXingProperty = function(e, t) {
            for (var i = {}, a = Object.values(e), n = 0; n < a.length; n++) {
                var o = a[n]
                  , s = UserInfoManager.calYanXingProperty(o.id, o.quality, t)
                  , r = UserInfoManager.calSatelliteProperty(o.id, o.satelliteLv, t);
                for (var l in s)
                    if (s.hasOwnProperty(l)) {
                        var c = s[l];
                        0 == i.hasOwnProperty(l) && (i[l] = 0),
                        i[l] += c
                    }
                for (var h in r)
                    if (r.hasOwnProperty(h)) {
                        var d = r[h];
                        0 == i.hasOwnProperty(h) && (i[h] = 0),
                        i[h] += d
                    }
            }
            return i
        }
        ,
        UserInfoManager.calYanXingProperty = function(e, t, i) {
            var a = dataApi.starCore.findById(e).starCore[t]
              , n = {};
            if (a)
                for (var o = a[1], s = a[2], r = dataApi.expWorld.findById(i), l = 0; l < o.length; l++) {
                    var c = o[l]
                      , h = r[c] * s;
                    n[c] = Math.round(h)
                }
            return n
        }
        ,
        UserInfoManager.calSatelliteProperty = function(e, t, i) {
            var a = dataApi.starCore.findById(e)
              , n = dataApi.expWorld.findById(i)
              , o = {}
              , s = a.satelliteAttribute[0]
              , r = a.satelliteAttribute[1]
              , l = t / a.satelliteLv;
            l > 1 && (l = 1);
            for (var c = 0; c < s.length; c++) {
                var h = s[c]
                  , d = n[h] * r * l;
                o[h] = Math.round(d)
            }
            return o
        }
        ,
        UserInfoManager.calAllMeridiansightPower = function(e) {
            var t = {}
              , i = 0;
            for (var a in e.vein) {
                var n = UserInfoManager.calMeridiansFightPower(e, a);
                for (var o in i += n.addPower,
                n.attrs)
                    t[o] || (t[o] = 0),
                    t[o] += n.attrs[o]
            }
            return {
                addPower: i,
                attrs: t
            }
        }
        ,
        UserInfoManager.calMeridiansFightPower = function(e, t) {
            for (var i = e.inlayPill, a = e.vein[t], n = dataApi.powerAttribute.findById(1), o = {}, s = 0, r = null, l = 0, c = 0; c <= a.rank; c++) {
                var h = dataApi.meridians.findByOpts({
                    type: t,
                    rank: c
                })[0].openLv;
                c == a.rank && (h = a.level);
                var d = dataApi.meridiansAttribute.findByOpts({
                    type: t,
                    rank: c
                });
                r = d[0].attribute[0];
                for (var m = 0; m < d.length; m++)
                    d[m].level <= h && (l += d[m].attributeValue[0])
            }
            o[r] = l;
            var g = 0;
            for (var u in i)
                if (i[u])
                    for (var p in i[u].attr)
                        r == p && (g += i[u].attr[p]);
            for (var f in o[r] = o[r] + Math.ceil(o[r] * g),
            o)
                s += o[f] * n[f];
            return {
                addPower: s,
                attrs: o
            }
        }
        ,
        UserInfoManager.calFightPower_fixPoint = function(e, t) {
            var i = {};
            UserInfoManager.calAttribute_equipment2(i, t);
            var a = UserInfoManager.calFightPower(i)
              , n = dataApi.role.findById(e);
            if (!n)
                return -1;
            var o = n.equipMinus
              , s = n.equipSum
              , r = n.firePoint
              , l = Math.max(a - o, 0) / Math.max(s - o, 1) * r;
            return Math.round(l)
        }
        ,
        UserInfoManager.calAttribute_equipment2 = function(e, t) {
            for (var i in t)
                if (t.hasOwnProperty(i)) {
                    var a = t[i].data;
                    if (a) {
                        if ("jewelry" === UserInfoManager.findAllEquipTbById(a.id).part)
                            continue;
                        for (var n in a.attr)
                            if (a.attr.hasOwnProperty(n)) {
                                var o = a.attr[n];
                                e[n] || (e[n] = 0),
                                e[n] += o
                            }
                        var s = t[i];
                        if (s.lv > 0) {
                            var r = this.calEquipUpgradeValue(a, s.lv);
                            for (var l in r)
                                if (r.hasOwnProperty(l)) {
                                    var c = r[l];
                                    e[l] || (e[l] = 0),
                                    e[l] += c
                                }
                        }
                    }
                }
        }
        ,
        UserInfoManager.getEquipSmeltAttr = function(e) {
            for (var t = e.equipments, i = e.smeltData, n = e.part, o = a.ROLE_ATTR_KEYS, s = {}, r = 0; r < o.length; r++)
                s[o[r]] = 0;
            for (var l in i)
                if (i.hasOwnProperty(l) && (!n || n == l)) {
                    var c = i[l].lv;
                    if (0 != c) {
                        var h = dataApi.item.findById(t[l].data.id).quality
                          , d = a.SMELT_EQUIP_QUALITY_CHANGE[h];
                        if (d)
                            for (var m = 1; m <= c; m++) {
                                for (var g = dataApi.equipSmelt.findByOpts({
                                    quality: d,
                                    part: l,
                                    smeltLv: m
                                })[0], u = m == c ? i[l].qualityType : g.qualityVaule, p = 0; p < u.length; p++)
                                    for (var f = dataApi.equipSmeltGrow.findById(g.qualityType[p]), y = 0; y < o.length; y++)
                                        s[o[y]] += f[o[y]] * u[p];
                                if (g.attribute)
                                    for (var v = g.attribute[0], _ = 0; _ < v.length; _++)
                                        s[v[_]] += g.attribute[1][_]
                            }
                    }
                }
            for (var C in s) {
                var M = s[C] >= 0 ? "floor" : "ceil";
                s[C] = Math[M](s[C])
            }
            return s
        }
        ,
        cc._RF.pop()
    }
    , {}],
   