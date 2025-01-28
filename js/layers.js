addLayer("s", {
    name: "seed", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#4BDC13",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "树苗", // Name of prestige currency
    baseResource: "树种", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.6, 
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade('s',14)) mult=mult.times(5)
        if(hasUpgrade('s',15)) mult=upgradeEffect('s',15)
        if(hasUpgrade('s',16)) player[this.layer].points=player[this.layer].points.add(mult.times(0.1))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades: {
        11:{
            title:"成为护林员",
            name:"su1",
            description:"开始生产树种",
            cost:new Decimal(1),
        },
        12:{
            title:"树种太少了",
            name:"su2",
            description:"树种获取速度*10",
            cost:new Decimal(5),
        },
        13:{
            title:"树苗越多，林子越大",
            name:"su3",
            description:"基于树苗数量加成树种获取数量",
            effect() {
                return player[this.layer].points.add(1).pow(0.4);
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            cost:new Decimal(20),
        },
        14:{
            title:"高质量树种",
            name:"su4",
            description:"树苗获取*5",
            cost:new Decimal(100),
        },
        15:{
            title:"增值的T",
            name:"su5",
            description:"树苗加成本身获取",
            cost:new Decimal(150),
            effect() {
                return player[this.layer].points.add(2).pow(0.3);
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        16:{
            title:"自动化种树",
            name:"su6",
            description:"每秒获得重置可获得的树苗数量的%10",
            cost:new Decimal(400),
        },
        21:{
            title:"v0.1终局",
            name:"su???",
            cost:new Decimal(1000),
        }
    },
    layerShown(){return true}
})