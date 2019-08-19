function transformMoneyUnit(num){
    let transformed = "";
    num = num.toString();
    const numLen = num.length;
    for(let i = 1 ; i <= numLen ; i++){ 
        if(i>3 && i % 3 === 1){
            transformed = "," + transformed;
        }
        transformed = num.charAt(numLen - i) + transformed;
    }
    return transformed
}

priceTypeMapper = {
    A: "성인",
    Y: "청소년",
    B: "유아",
    S: "셋트",
    D: "장애인",
    C: "지역주민",
    E: "어얼리버드",
    V: "VIP",
    R: "R석",
    B: "B석",
    S: "S석",
    D: "평일",
};

module.exports.transformMoneyUnit = transformMoneyUnit;
module.exports.priceTypeMapper = priceTypeMapper;