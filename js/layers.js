addLayer("s", {
    name: "seed", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "苗", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        seed: new Decimal(10),
        sapling: new Decimal(0),
    }},
    color: "#4BDC13",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "树苗", // Name of prestige currency
    baseResource: "树种", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, 
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade('s',14)) mult=mult.times(5)
        if(hasUpgrade('s',15)) mult=upgradeEffect('s',15)
        return mult
    },
    passiveGeneration()
    {
        if(hasUpgrade('s',21)) return 0.5
        if(hasMilestone('w',1)) return 0.1
        return 0;
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        if(hasUpgrade('s',22)) exp = exp.add(0.5)
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    upgrades: {
        11:{
            title:"成为护林员",
            name:"su1",
            description:"开始生产树种",
            cost:new Decimal(1),
            unlocked(){return true}
        },
        12:{
            title:"树种太少了",
            name:"su2",
            description:"树种获取速度*10",
            cost:new Decimal(5),
            unlocked(){return hasUpgrade('s',11)}
        },
        13:{
            title:"树苗越多，林子越大",
            name:"su3",
            description:"基于树苗数量加成树种获取数量",
            effect() {
                return player[this.layer].points.add(1).pow(0.4);
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){return hasUpgrade('s',12)},
            cost:new Decimal(20),
        },
        14:{
            title:"高质量树种",
            name:"su4",
            description:"树苗获取*5",
            unlocked(){return hasUpgrade('s',13)},
            cost:new Decimal(100),
        },
        15:{
            title:"增值的T",
            name:"su5",
            description:"树苗加成本身获取",
            cost:new Decimal(150),
            effect() {
                return player[this.layer].points.add(2).pow(0.3)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){return hasUpgrade('s',14)}
        },
        16:{
            title:"解锁下一层级‘水’",
            name:"su7",
            cost:new Decimal(1000),
            unlocked(){return hasUpgrade('s',15)},
        },
        21:{
            title:"更好的自动化",
            name:"su8",
            description:"加强水里程碑2<br>10% -> 50%",
            cost:1e4,
            unlocked(){return hasMilestone('w',3)}
        },
        22:{
            title:"太多了！",
            name:"su9",
            description:"树苗获得数量的指数增加0.5",
            cost:1e7,
            unlocked(){return hasUpgrade('s',21)}
        }
    },
    layerShown(){return true}
})
addLayer("w",{
    name:"water",
    symbol:"水",
    color:"#00FBFF",
    startData() { return {
        unlocked(){return hasUpgrade('s',16)},
		points: new Decimal(0),
    }},
    branches:["s"],
    requires: new Decimal(1e4), // Can be a function Wthat takes requirement increases into account
    resource: "水", // Name of prestige currency
    baseResource: "树种", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, 
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    position:0,
    layerShown(){return hasUpgrade('s',16)||player.w.unlocked()},
    milestones: {
        1: {
            requirementDescription: "拥有1水",
            effectDescription: "每秒获得重置可获得的树苗数量的%10",
            done() { return player.w.points.gte(1) }
        },
        2:{
            requirementDescription: "拥有2水",
            effectDescription: "将树种获取数乘以水的数量",
            done() { return player.w.points.gte(2) }
        },
        3:{
            requirementDescription: "拥有10水",
            effectDescription: "解锁更多树苗升级",
            done() { return player.w.points.gte(10) }
        },
        4:{
            requirementDescription: "拥有1000水",
            effectDescription: "v0.2终局",
            done() { return player.w.points.gte(1000) }
        }
    }
})